import { supabase } from '../supabaseClient';

export const leaderboardService = {
  // Get top 100 users (PLACEHOLDER - tergantung pilihan score lo nanti)
  async getTopUsers(limit = 100) {
    // Sementara: ambil semua user, sort by username
    // Ganti pake 'score' kalo udah ditambah
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, display_name, avatar_url')
      .limit(limit);
    return { data, error };
  },
};