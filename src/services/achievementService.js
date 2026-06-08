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

    const { data: existing } = await supabase
      .from('user_achievements')
      .select('id')
      .eq('user_id', userId)
      .eq('achievement_id', achievementId)
      .single();

    if (existing) {
      return {
        success: false,
        message: 'Achievement already unlocked',
      };
    }

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

  // ← TAMBAHAN DI SINI
  async getUserAchievements(userId) {
    const { data, error } = await supabase
      .from('user_achievements')
      .select(`
        id,
        achievements (id, nama, deskripsi, poin_reward, icon_url)
      `)
      .eq('user_id', userId);

    return { data, error };
  },

}; // ← kurung penutup paling akhir