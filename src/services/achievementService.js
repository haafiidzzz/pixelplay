import { supabase } from '../supabaseClient';

export const achievementService = {

  async getAllAchievements() {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .order('id', { ascending: true });
    return { data, error };
  },

  async getUserAchievements(userId) {
    const { data, error } = await supabase
      .from('user_achievements')
      .select(`id, achievements (id, nama, deskripsi, poin_reward, icon_url)`)
      .eq('user_id', userId);
    return { data, error };
  },

  // Unlock 1 achievement + tambah poin ke users
  async unlockAchievement(userId, achievementId) {
    const { data: existing } = await supabase
      .from('user_achievements')
      .select('id')
      .eq('user_id', userId)
      .eq('achievement_id', achievementId)
      .maybeSingle();

    if (existing) return { success: false, message: 'Already unlocked' };

    const { error: insertErr } = await supabase
      .from('user_achievements')
      .insert([{ user_id: userId, achievement_id: achievementId }]);

    if (insertErr) return { success: false, error: insertErr };

    // Ambil poin reward achievement ini
    const { data: ach } = await supabase
      .from('achievements')
      .select('poin_reward')
      .eq('id', achievementId)
      .maybeSingle();

    if (ach?.poin_reward) {
      // Tambah poin ke total_points user
      const { data: userData } = await supabase
        .from('users')
        .select('total_points')
        .eq('id', userId)
        .maybeSingle();

      await supabase
        .from('users')
        .update({ total_points: (userData?.total_points || 0) + ach.poin_reward })
        .eq('id', userId);
    }

    return { success: true };
  },

  // Auto-unlock achievements berdasarkan kondisi
  async checkAndUnlock(userId) {
    const newlyUnlocked = [];

    // Ambil data yang dibutuhkan
    const [{ data: purchases }, { data: userAchs }] = await Promise.all([
      supabase.from('purchases').select('game_id, play_count').eq('user_id', userId),
      supabase.from('user_achievements').select('achievement_id').eq('user_id', userId),
    ]);

    const ownedGameIds = new Set((purchases || []).map(p => p.game_id));
    const unlockedIds = new Set((userAchs || []).map(u => u.achievement_id));
    const totalGames = ownedGameIds.size;
    const totalPlays = (purchases || []).reduce((sum, p) => sum + (p.play_count || 0), 0);

    // Map: achievement_id → kondisi unlock
    const conditions = [
      // Global — berdasarkan jumlah game dibeli
      { id: 71, check: () => true },                        // Welcome!
      { id: 72, check: () => totalGames >= 3 },             // Game Collector
      { id: 73, check: () => totalGames >= 10 },            // Big Spender
      { id: 74, check: () => totalGames >= 13 },            // Library Full

      // Per game — unlock saat game pertama kali dibeli/dimainkan
      { id: 1,  check: () => ownedGameIds.has(1) },         // First Play
      { id: 39, check: () => ownedGameIds.has(1) },         // Bounce Beginner
      { id: 43, check: () => ownedGameIds.has(2) },         // First Blood
      { id: 47, check: () => ownedGameIds.has(3) },         // Into The Wild
      { id: 5,  check: () => ownedGameIds.has(3) },         // Jungle Explorer
      { id: 51, check: () => ownedGameIds.has(4) },         // Dungeon Crawler
      { id: 55, check: () => ownedGameIds.has(5) },         // First Sprint
      { id: 59, check: () => ownedGameIds.has(6) },         // First Watch
      { id: 63, check: () => ownedGameIds.has(7) },         // Puzzle Newbie
      { id: 67, check: () => ownedGameIds.has(8) },         // Padawan
    ];

    for (const { id, check } of conditions) {
      if (!unlockedIds.has(id) && check()) {
        const result = await this.unlockAchievement(userId, id);
        if (result.success) newlyUnlocked.push(id);
      }
    }

    return { newlyUnlocked };
  },
};