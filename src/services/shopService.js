import { supabase } from '../supabaseClient';
import { achievementService } from './achievementService';

export const shopService = {

  async getAllGames() {
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .order('id', { ascending: true });
    return { data, error };
  },

  async getUserPurchases(userId) {
    const { data, error } = await supabase
      .from('purchases')
      .select(`*, games (*)`)
      .eq('user_id', userId);
    return { data, error };
  },

  async purchaseGame(userId, gameId, pricePaid) {
    const { data: existing } = await supabase
      .from('purchases')
      .select('id')
      .eq('user_id', userId)
      .eq('game_id', gameId)
      .maybeSingle();

    if (existing) return { success: false, message: 'Game sudah dibeli sebelumnya.' };

    const { data, error } = await supabase
      .from('purchases')
      .insert([{ user_id: userId, game_id: gameId, price_paid: pricePaid }]);

    if (error) return { success: false, error };

    // Auto-check achievements setelah beli
    await achievementService.checkAndUnlock(userId);

    return { success: true, data };
  },

  async playGame(userId, gameId) {
    const { data: existing, error: fetchErr } = await supabase
      .from('purchases')
      .select('id, play_count')
      .eq('user_id', userId)
      .eq('game_id', gameId)
      .maybeSingle();

    if (fetchErr || !existing) return { success: false, message: 'Game belum dibeli.' };

    const { data, error } = await supabase
      .from('purchases')
      .update({
        play_count: (existing.play_count || 0) + 1,
        last_played: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .eq('game_id', gameId);

    if (error) return { success: false, error };

    // Auto-check achievements setelah main
    await achievementService.checkAndUnlock(userId);

    return { success: true, data };
  },
};