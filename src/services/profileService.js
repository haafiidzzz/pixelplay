import { supabase } from '../supabaseClient';

export const profileService = {
  async getProfileById(userId) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    return { data, error };
  },

  async updateProfile(userId, updates) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .maybeSingle();
    return { data, error };
  },

  async createProfile(userId, profileData) {
    const { data, error } = await supabase
      .from('users')
      .insert([{ id: userId, ...profileData }])
      .select()
      .maybeSingle();
    return { data, error };
  },
};