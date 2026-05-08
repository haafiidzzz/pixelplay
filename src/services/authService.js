import { supabase } from '../supabaseClient';

export const authService = {
  // Sign up dengan email & password
async signUp({ email, password, username }) {

  // buat auth user
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username },
    },
  });

  // kalau auth gagal
  if (error) {
    return { data, error };
  }

  // ambil user
  const user = data?.user;

  // insert ke profiles
  if (user) {

    const { error: profileError } = await supabase
      .from('profiles')
      .insert([
        {
          id: user.id,
          username: username,
          display_name: username,
        },
      ]);

    if (profileError) {
      console.error(profileError);
      return {
        data,
        error: profileError,
      };
    }
  }

  return { data, error: null };
},

  // Sign in dengan email & password
  async signIn({ email, password }) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  // Get current session
  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    return { session: data?.session, error };
  },

  // Get current user
  async getUser() {
    const { data, error } = await supabase.auth.getUser();
    return { user: data?.user, error };
  },

  // Listen to auth state changes
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });
  },
};