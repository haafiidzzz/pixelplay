import { supabase } from '../supabaseClient';

export const achievementService = {

  // ambil semua achievement
  async getAllAchievements() {

    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .order('id', { ascending: true });

    return { data, error };
  },

  // unlock achievement
  async unlockAchievement(userId, achievementId) {

    // cek apakah sudah unlock
    const { data: existing } = await supabase
      .from('user_achievements')
      .select('id')
      .eq('user_id', userId)
      .eq('achievement_id', achievementId)
      .single();

    // kalau sudah ada
    if (existing) {
      return {
        success: false,
        message: 'Achievement already unlocked',
      };
    }

    // insert achievement
    const { data, error } = await supabase
      .from('user_achievements')
      .insert([
        {
          user_id: userId,
          achievement_id: achievementId,
        },
      ]);

    if (error) {
      return {
        success: false,
        error,
      };
    }

    return {
      success: true,
      data,
    };
  },

};