import { supabase } from '../supabaseClient';

export const leaderboardService = {
  // Get leaderboard berdasarkan total achievement points
  async getTopUsers(limit = 100) {

    const { data, error } = await supabase
      .from('user_achievements')
      .select(`
        user_id,
        profiles (
          username,
          display_name,
          avatar_url
        ),
        achievements (
          poin_reward
        )
      `);

      console.log(data);
console.log(error);

    if (error) {
      return { data: null, error };
    }

    // Gabungkan poin per user
    const leaderboardMap = {};

    data.forEach((item) => {
      const profile = item.profiles;
      const points = item.achievements?.poin_reward || 0;

      if (!leaderboardMap[item.user_id]) {
        leaderboardMap[item.user_id] = {
          user_id: item.user_id,
          username: profile?.username || 'Unknown',
          display_name: profile?.display_name || '',
          avatar_url: profile?.avatar_url || '',
          total_points: 0,
        };
      }

      leaderboardMap[item.user_id].total_points += points;
    });

    // Convert object ke array
    const leaderboard = Object.values(leaderboardMap);

    // Sort descending
    leaderboard.sort((a, b) => b.total_points - a.total_points);

    // Limit hasil
    return {
      data: leaderboard.slice(0, limit),
      error: null,
    };
  },
};
