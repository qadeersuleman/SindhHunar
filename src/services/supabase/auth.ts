import { supabase } from './client';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';
import type { Tables } from './client';

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  phone?: string;
  role?: 'customer' | 'artisan' | 'admin';
}

export type Profile = Tables['profiles']['Row'];

export interface AuthResponse {
  user: User | null;
  error: Error | null;
}

export const signUp = async (email: string, password: string, name: string): Promise<AuthResponse> => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (error) throw error;

    return { user: data.user as User, error: null };
  } catch (error) {
    return { user: null, error: error as Error };
  }
};

export const signIn = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    return { user: data.user as User, error: null };
  } catch (error) {
    return { user: null, error: error as Error };
  }
};

export const signOut = async (): Promise<{ error: Error | null }> => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error) {
    return { error: error as Error };
  }
};

export const getCurrentUser = async (): Promise<AuthResponse> => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return { user: user as User, error: null };
  } catch (error) {
    return { user: null, error: error as Error };
  }
};

export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
    callback(session?.user as User || null);
  });
};

// Profile Management Functions
export const getProfile = async (userId: string): Promise<{ profile: Profile | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return { profile: data, error: null };
  } catch (error) {
    return { profile: null, error: error as Error };
  }
};

export const updateProfile = async (userId: string, updates: Partial<Profile>): Promise<{ profile: Profile | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return { profile: data, error: null };
  } catch (error) {
    return { profile: null, error: error as Error };
  }
};

export const uploadAvatar = async (userId: string, fileUri: string): Promise<{ url: string | null; error: Error | null }> => {
  try {
    const fileName = `avatars/${userId}/${Date.now()}`;
    
    // For React Native, we need to fetch the file first
    const response = await fetch(fileUri);
    const blob = await response.blob();
    
    const { data, error } = await supabase.storage
      .from('avatars')
      .upload(fileName, blob, {
        contentType: 'image/jpeg',
        upsert: true,
      });
    
    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName);
    
    return { url: publicUrl, error: null };
  } catch (error) {
    return { url: null, error: error as Error };
  }
};
