import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { shopService } from '../services/shopService';
import { achievementService } from '../services/achievementService';
import './Library.css';

const Library = () => {
  const { user } = useAuth();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [playingId, setPlayingId] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    if (user) fetchLibrary();
    else setLoading(false);
  }, [user]);

  const fetchLibrary = async () => {
    setLoading(true);
    const { data } = await shopService.getUserPurchases(user.id);
    setPurchases(data || []);
    setLoading(false);
  };

  const showNotif = (text, type = 'success') => {
    setNotification({ text, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const handlePlay = async (purchase) => {
    setPlayingId(purchase.game_id);

    const result = await shopService.playGame(user.id, purchase.game_id);
    if (!result.success) {
      showNotif('Gagal mencatat sesi bermain.', 'error');
      setPlayingId(null);
      return;
    }

    // Update lokal
    const updated = purchases.map((p) =>
      p.game_id === purchase.game_id
        ? { ...p, play_count: (p.play_count || 0) + 1, last_played: new Date().toISOString() }
        : p
    );
    setPurchases(updated);

    // Unlock achievement "First Play" (id=1) milik game ini jika play_count baru = 1
    const newPlayCount = (purchase.play_count || 0) + 1;
    if (newPlayCount === 1) {
      // achievement id 1 = First Play, game_id 1 — sesuaikan jika game berbeda
      // cari achievement "First Play" untuk game ini
      const achResult = await achievementService.unlockAchievement(user.id, 1);
      if (achResult.success) {
        showNotif('🏆 Achievement unlocked: First Play!', 'achievement');
        setPlayingId(null);
        return;
      }
    }

    if (newPlayCount === 10) {
      const achResult = await achievementService.unlockAchievement(user.id, 3);
      if (achResult.success) {
        showNotif('🏆 Achievement unlocked: Addicted Gamer!', 'achievement');
        setPlayingId(null);
        return;
      }
    }

    showNotif(`🎮 ${purchase.games?.nama} selesai dimainkan!`);
    setPlayingId(null);
  };

  if (!user) {
    return (
      <div className="library-page">
        <div className="library-empty">
          <p className="empty-icon">🔐</p>
          <p>Login dulu untuk melihat library kamu.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="library-page">
      <div className="library-header">
        <h1 className="library-title">🎮 MY LIBRARY</h1>
      </div>

      {notification && (
        <div className={`library-toast ${notification.type}`}>{notification.text}</div>
      )}

      {loading ? (
        <div className="library-state">Loading library...</div>
      ) : purchases.length === 0 ? (
        <div className="library-empty">
          <p className="empty-icon">📭</p>
          <p>Belum punya game. Beli dulu di <a href="/shop">Store</a>!</p>
        </div>
      ) : (
        <div className="library-grid">
          {purchases.map((p) => (
            <div key={p.game_id} className="library-card">
              <div className="library-card-cover">
                <img
                 src={
   p.games?.thumbnail 
    ? `https://kvbutztvwzsbhqnerssa.supabase.co/storage/v1/object/public/game-thumbnail/${p.games.thumbnail}`
    : `https://placehold.co/300x400/1a1a2e/00ff88?text=${encodeURIComponent(p.games?.nama || 'Game')}`
}
alt={p.games?.nama || 'Game Thumbnail'}
                />
              </div>
              <div className="library-card-info">
                <h3 className="library-card-title">{p.games?.nama}</h3>
                <div className="library-card-stats">
                  <span>▶ {p.play_count || 0}x dimainkan</span>
                  {p.last_played && (
                    <span>Terakhir: {new Date(p.last_played).toLocaleDateString('id-ID')}</span>
                  )}
                </div>
                <button
                  className="btn-play"
                  onClick={() => handlePlay(p)}
                  disabled={playingId === p.game_id}
                >
                  {playingId === p.game_id ? '⏳ Memainkan...' : '▶ PLAY'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Library;