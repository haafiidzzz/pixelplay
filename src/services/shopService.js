import { supabase } from '../supabaseClient';

export const shopService = {

  // Ambil semua game
  async getAllGames() {
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .order('id', { ascending: true });
    return { data, error };
  },

  // Ambil game yang sudah dibeli user (join ke games)
  async getUserPurchases(userId) {
    const { data, error } = await supabase
      .from('purchases')
      .select(`
        *,
        games (*)
      `)
      .eq('user_id', userId);
    return { data, error };
  },

  // Beli game
async purchaseGame(userId, gameId, pricePaid) {
  // Cek sudah beli belum — pakai maybeSingle() bukan single()
  const { data: existing } = await supabase
    .from('purchases')
    .select('id')
    .eq('user_id', userId)
    .eq('game_id', gameId)
    .maybeSingle();

  if (existing) {
    return { success: false, message: 'Game sudah dibeli sebelumnya.' };
  }

  const { data, error } = await supabase
    .from('purchases')
    .insert([{ user_id: userId, game_id: gameId, price_paid: pricePaid }]);

  if (error) return { success: false, error };
  return { success: true, data };
},
  // Catat play
async playGame(userId, gameId) {
  const { data: existing, error: fetchErr } = await supabase
    .from('purchases')
    .select('id, play_count')
    .eq('user_id', userId)
    .eq('game_id', gameId)
    .maybeSingle();

  if (fetchErr || !existing) {
    return { success: false, message: 'Game belum dibeli.' };
  }

  const { data, error } = await supabase
    .from('purchases')
    .update({
      play_count: (existing.play_count || 0) + 1,
      last_played: new Date().toISOString(),
    })
    .eq('user_id', userId)
    .eq('game_id', gameId);

  if (error) return { success: false, error };
  return { success: true, data };
},

};