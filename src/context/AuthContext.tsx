import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { User } from '../services/supabase/auth';
import { signIn, signUp, signOut, getCurrentUser } from '../services/supabase/auth';
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
  switch (action.type) {
    case 'AUTH_INITIALIZED':
      return { ...state, isInitialized: true, user: action.payload };
    case 'LOGIN_START':
      return { ...state, loading: true, error: null };
    case 'LOGIN_SUCCESS':
      return { ...state, user: action.payload, loading: false, error: null };
    case 'LOGIN_FAILURE':
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
    const initializeAuth = async () => {
      try {
        const [{ user: currentUser }] = await Promise.all([
          getCurrentUser(),
          new Promise(resolve => setTimeout(() => resolve(undefined), 3500)) // minimum 3.5 seconds delay for splash screen
        ]);
        
        dispatch({ type: 'AUTH_INITIALIZED', payload: currentUser });
      } catch (error) {
        dispatch({ type: 'AUTH_INITIALIZED', payload: null });
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const { user: authUser, error } = await signIn(email, password);
      if (error) {
        dispatch({ type: 'LOGIN_FAILURE', payload: error.message });
      } else if (authUser) {
        dispatch({ type: 'LOGIN_SUCCESS', payload: authUser });
      }
    } catch (error) {
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
