import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { shopService } from '../services/shopService';
import './GenrePage.css';

const GENRE_MAP = {
  action:    { label: 'Action',    icon: '⚔️' },
  adventure: { label: 'Adventure', icon: '🗺️' },
  rpg:       { label: 'RPG',       icon: '🧙' },
  shooter:   { label: 'Shooter',   icon: '🔫' },
  puzzle:    { label: 'Puzzle',    icon: '🧩' },
  strategy:  { label: 'Strategy',  icon: '♟️' },
  horror:    { label: 'Horror',    icon: '👻' },
  arcade:    { label: 'Arcade',    icon: '🕹️' },
};

const GenrePage = () => {
  const { slug } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [ownedIds, setOwnedIds] = useState(new Set());
  const [buyingId, setBuyingId] = useState(null);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);

  const genre = GENRE_MAP[slug];

  useEffect(() => {
    fetchData();
  }, [slug, user]);

  const fetchData = async () => {
    setLoading(true);
    const { data: allGames } = await shopService.getAllGames();

    const filtered = (allGames || []).filter((g) => {
      if (!g.genre) return false;
      try {
        const genres = typeof g.genre === 'string' ? JSON.parse(g.genre) : g.genre;
        return Array.isArray(genres) && genres.includes(slug);
      } catch {
        return false;
      }
    });
    setGames(filtered);

    if (user) {
      const { data: purchases } = await shopService.getUserPurchases(user.id);
      setOwnedIds(new Set((purchases || []).map((p) => p.game_id)));
    }
    setLoading(false);
  };

  const showToast = (text, type = 'success') => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleBuy = async (game) => {
    if (!user) {
      showToast('Login dulu untuk beli game!', 'error');
      return;
    }
    setBuyingId(game.id);
    const result = await shopService.purchaseGame(user.id, game.id, game.price);
    if (result.success) {
      setOwnedIds((prev) => new Set([...prev, game.id]));
      showToast(`✅ ${game.nama} berhasil dibeli!`);
    } else {
      showToast(result.message || 'Gagal beli game.', 'error');
    }
    setBuyingId(null);
  };

  if (!genre) {
    return (
      <div className="genre-page">
        <p>Genre tidak ditemukan.</p>
        <button onClick={() => navigate('/')}>Kembali</button>
      </div>
    );
  }

  return (
    <div className="genre-page">
      {toast && <div className={`genre-toast ${toast.type}`}>{toast.text}</div>}

      <div className="genre-page-header">
        <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
        <h1 className="genre-page-title">{genre.icon} {genre.label.toUpperCase()}</h1>
        <p className="genre-page-sub">{games.length} games</p>
      </div>

      {loading ? (
        <div className="genre-state">Loading...</div>
      ) : games.length === 0 ? (
        <div className="genre-state">Belum ada game untuk genre ini.</div>
      ) : (
        <div className="genre-page-grid">
          {games.map((game) => {
            const owned = ownedIds.has(game.id);
            return (
              <div key={game.id} className="genre-game-card">
                <div className="genre-game-cover">
                  <img
                    src={game.thumbnail || `https://placehold.co/300x400/1a1a2e/00ff88?text=${encodeURIComponent(game.nama)}`}
                    alt={game.nama}
                  />
                  {owned && <div className="genre-owned-badge">✓ OWNED</div>}
                </div>
                <div className="genre-game-info">
                  <h3>{game.nama}</h3>
                  <div className="genre-game-footer">
                    <span className="genre-game-price">
                      {game.price === 0 ? 'FREE' : `Rp ${Number(game.price).toLocaleString('id-ID')}`}
                    </span>
                    {owned ? (
                      <button className="btn-owned" disabled>Dimiliki</button>
                    ) : (
                      <button
                        className="btn-buy"
                        onClick={() => handleBuy(game)}
                        disabled={buyingId === game.id}
                      >
                        {buyingId === game.id ? '...' : 'Beli'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default GenrePage;