import { supabase } from '../supabaseClient';

export const achievementService = {
  // Get all achievements
  async getAllAchievements() {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .order('id', { ascending: true });
    return { data, error };
  },

  // Get user's unlocked achievements
  async getUserAchievements(userId) {
    const { data, error } = await supabase
      .from('user_achievements')
      .select(`
        unlocked_at,
        achievements (*)
      `)
      .eq('user_id', userId);
    return { data, error };
  },
};