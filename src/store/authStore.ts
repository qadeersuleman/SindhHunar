import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { User, getCurrentUser, signIn, signUp, signOut } from '../services/supabase/auth';

export const useAuth = () => {
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['auth', 'user'],
    queryFn: getCurrentUser,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
  });

  const signInMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => 
      signIn(email, password),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'user'] });
    },
  });

  const signUpMutation = useMutation({
    mutationFn: ({ email, password, name }: { email: string; password: string; name: string }) => 
      signUp(email, password, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'user'] });
    },
  });

  const signOutMutation = useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'user'] });
    },
  });

  const logout = () => {
    signOutMutation.mutate();
  };

  return {
    user: user?.user || null,
    token: null,
    isAuthenticated: !!user?.user,
    loading,
    error,
    signIn: signInMutation.mutate,
    signUp: signUpMutation.mutate,
    logout,
    refetch,
  };
};
