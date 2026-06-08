import { supabase } from '../supabaseClient';

export const leaderboardService = {
  async getTopUsers(limit = 100) {
    const { data, error } = await supabase
      .from('users')
      .select('id, username, display_name, avatar_url, total_points, level_name')
      .order('total_points', { ascending: false })
      .limit(limit);

    if (error) return { data: null, error };

    // Mapping supaya field user_id tetap ada (Leaderboard.jsx pakai player.user_id)
    const leaderboard = (data || []).map((u) => ({
      user_id: u.id,
      username: u.username,
      display_name: u.display_name,
      avatar_url: u.avatar_url,
      total_points: u.total_points || 0,
      level_name: u.level_name,
    }));

    return { data: leaderboard, error: null };
  },
};