import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { User, getCurrentUser, signIn, signUp, signOut, signInWithOtp, verifyOtp, signInWithGoogle } from '../services/supabase/auth';
import { useAppDispatch, useAppSelector } from './hooks';
import { setAuth, clearAuth, setInitialLoading } from './slices/authSlice';
import { useEffect } from 'react';

export const useAuth = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const { isAuthenticated, isInitialLoading } = useAppSelector((state) => state.auth);

  // Server State: Get current user
  const {
    data: userData,
    isLoading: isQueryLoading,
    refetch,
  } = useQuery({
    queryKey: ['auth', 'user'],
    queryFn: getCurrentUser,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  // Sync React Query user with Redux auth state
  useEffect(() => {
    // Only auto-login if user is confirmed
    if (userData?.user?.email_confirmed_at) {
      dispatch(setAuth({ 
        token: 'session-token', 
        role: (userData.user as any).role || 'customer' 
      }));
    } else if (!isQueryLoading) {
      dispatch(setInitialLoading(false));
    }
  }, [userData, isQueryLoading, dispatch]);

  const signInMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const data = await signIn(email, password);
      if (data.error) throw data.error;
      return data;
    },
    onSuccess: (data) => {
      if (data.user) {
        queryClient.setQueryData(['auth', 'user'], data);
        dispatch(setAuth({ 
          token: 'session-token', 
          role: (data.user as any).user_metadata?.role || 'customer' 
        }));
      }
    },
  });

  const signUpMutation = useMutation({
    mutationFn: async ({ email, password, name }: { email: string; password: string; name: string }) => {
      const data = await signUp(email, password, name);
      if (data.error) throw data.error;
      return data;
    },
    onSuccess: (data) => {
      if (data.user) {
        queryClient.setQueryData(['auth', 'user'], data);
      }
    },
  });

  const signOutMutation = useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      queryClient.setQueryData(['auth', 'user'], null);
      queryClient.clear();
      dispatch(clearAuth());
    },
  });

  const sendOtpMutation = useMutation({
    mutationFn: async (email: string) => {
      const data = await signInWithOtp(email);
      if (data.error) throw data.error;
      return data;
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: async ({ email, token, type }: { email: string; token: string; type?: 'email' | 'signup' }) => {
      const data = await verifyOtp(email, token, type);
      if (data.error) throw data.error;
      return data;
    },
    onSuccess: (data) => {
      if (data.user) {
        queryClient.setQueryData(['auth', 'user'], data);
        dispatch(setAuth({ 
          token: 'session-token', 
          role: (data.user as any).user_metadata?.role || 'customer' 
        }));
      }
    },
  });

  const signInWithGoogleMutation = useMutation({
    mutationFn: async () => {
      const data = await signInWithGoogle();
      if (data.error) throw data.error;
      return data;
    },
    onSuccess: (data) => {
      if (data.user) {
        queryClient.setQueryData(['auth', 'user'], data);
        dispatch(setAuth({ 
          token: 'session-token', 
          role: (data.user as any).user_metadata?.role || 'customer' 
        }));
      }
    },
  });

  return {
    user: userData?.user || null,
    isAuthenticated,
    isInitialized: !isInitialLoading && !isQueryLoading,
    loading: signInMutation.isPending || signUpMutation.isPending || signOutMutation.isPending || sendOtpMutation.isPending || verifyOtpMutation.isPending || signInWithGoogleMutation.isPending,
    signIn: signInMutation.mutateAsync,
    signUp: signUpMutation.mutateAsync,
    logout: signOutMutation.mutateAsync,
    sendOtp: sendOtpMutation.mutateAsync,
    verifyOtp: verifyOtpMutation.mutateAsync,
    signInWithGoogle: signInWithGoogleMutation.mutateAsync,
    refetch,
  };
};




