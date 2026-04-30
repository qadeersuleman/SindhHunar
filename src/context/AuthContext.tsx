import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { User } from '../services/supabase/auth';
import { signIn, signUp, signOut, getCurrentUser } from '../services/supabase/auth';
import { supabase } from '../services/supabase/client';
import { queryClient } from '../../App';

interface AuthState {
  user: User | null;
  loading: boolean;
  isInitialized: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

type AuthAction =
  | { type: 'AUTH_INITIALIZED'; payload: User | null }
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' };

const initialState: AuthState = {
  user: null,
  loading: false,
  isInitialized: false,
  error: null,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  console.log('[AuthReducer] Action:', action.type);
  switch (action.type) {
    case 'AUTH_INITIALIZED':
      return { ...state, isInitialized: true, user: action.payload };
    case 'LOGIN_START':
      return { ...state, loading: true, error: null };
    case 'LOGIN_SUCCESS':
      console.log('[AuthReducer] Login Success:', action.payload?.email);
      return { ...state, user: action.payload, loading: false, error: null };
    case 'LOGIN_FAILURE':
      console.log('[AuthReducer] Login Failure:', action.payload);
      return { ...state, user: null, loading: false, error: action.payload };
    case 'LOGOUT':
      return { ...state, user: null, loading: false, error: null };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    // 1. Check initial session
    const initializeAuth = async () => {
      try {
        console.log('[AuthContext] Initializing session...');
        const { user: currentUser } = await getCurrentUser();
        dispatch({ type: 'AUTH_INITIALIZED', payload: currentUser });
      } catch (error) {
        console.error('[AuthContext] Init error:', error);
        dispatch({ type: 'AUTH_INITIALIZED', payload: null });
      }
    };

    initializeAuth();

    // 2. Listen for auth state changes (Login, Logout, Session updates)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('[AuthContext] Auth State Changed Event:', _event);
      if (session?.user) {
        dispatch({ type: 'LOGIN_SUCCESS', payload: session.user as User });
      } else {
        dispatch({ type: 'LOGOUT' });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    console.log('[AuthContext] Login attempt:', email);
    dispatch({ type: 'LOGIN_START' });
    try {
      const { user: authUser, error } = await signIn(email, password);
      console.log('[AuthContext] SignIn response:', { authUser: !!authUser, error });
      
      if (error) {
        dispatch({ type: 'LOGIN_FAILURE', payload: error.message });
      } else if (authUser) {
        dispatch({ type: 'LOGIN_SUCCESS', payload: authUser });
      }
    } catch (error) {
      console.error('[AuthContext] Login error:', error);
      dispatch({ 
        type: 'LOGIN_FAILURE', 
        payload: error instanceof Error ? error.message : 'Login failed' 
      });
    }
  };

  const register = async (email: string, password: string, name: string) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const { user: authUser, error } = await signUp(email, password, name);
      if (error) {
        dispatch({ type: 'LOGIN_FAILURE', payload: error.message });
      } else if (authUser) {
        dispatch({ type: 'LOGIN_SUCCESS', payload: authUser });
      }
    } catch (error) {
      dispatch({ 
        type: 'LOGIN_FAILURE', 
        payload: error instanceof Error ? error.message : 'Registration failed' 
      });
    }
  };

  const logout = async () => {
    try {
      await signOut();
      dispatch({ type: 'LOGOUT' });
      // Clear all React Query cached data so no stale data leaks to next user
      queryClient.clear();
    } catch (error) {
      console.error('Logout error:', error);
      dispatch({ type: 'LOGOUT' });
      queryClient.clear();
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
