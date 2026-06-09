import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { shopService } from '../services/shopService';
import './Shop.css';

const Shop = () => {
  const { user } = useAuth();
  const [games, setGames] = useState([]);
  const [ownedIds, setOwnedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [buyingId, setBuyingId] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    const { data: allGames } = await shopService.getAllGames();
    setGames(allGames || []);

    if (user) {
      const { data: purchases } = await shopService.getUserPurchases(user.id);
      const ids = new Set((purchases || []).map((p) => p.game_id));
      setOwnedIds(ids);
    }
    setLoading(false);
  };

  const handleBuy = async (game) => {
    if (!user) {
      setMessage({ type: 'error', text: 'Login dulu untuk beli game!' });
      return;
    }

    setBuyingId(game.id);

    // LOGIKA PEMBELIAN BARU:
    if (game.price === 0) {
      // 1. Jika harga 0 (Gratis), langsung masukkan ke database sebagai berhasil
      const result = await shopService.purchaseGame(user.id, game.id, 0);
      
      if (result.success) {
        setOwnedIds((prev) => new Set([...prev, game.id]));
        setMessage({ type: 'success', text: `✅ ${game.nama} berhasil ditambahkan ke Library!` });
      } else {
        setMessage({ type: 'error', text: 'Gagal mengklaim game gratis.' });
      }
    } else {
      // 2. Jika harga > 0 (Berbayar), tolak pembelian
      // Kita beri sedikit delay agar seolah-olah sistem memproses
      setTimeout(() => {
        setMessage({ 
          type: 'error', 
          text: `❌ Gagal membeli ${game.nama}. Sistem pembayaran belum tersedia.` 
        });
        setBuyingId(null);
      }, 1000); 
      
      // Bersihkan toast setelah beberapa detik dan langsung return agar tidak lanjut ke bawah
      setTimeout(() => setMessage(null), 4000);
      return; 
    }

    setBuyingId(null);
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="shop-page">
      <div className="shop-header">
        <h1 className="shop-title">🛒 GAME STORE</h1>
        <p className="shop-subtitle">Beli game favoritmu dan mulai bermain</p>
      </div>

      {message && (
        <div className={`shop-toast ${message.type}`}>{message.text}</div>
      )}

      {loading ? (
        <div className="shop-state">Loading games...</div>
      ) : (
        <div className="shop-grid">
          {games.map((game) => {
            const owned = ownedIds.has(game.id);
            return (
              <div key={game.id} className={`shop-card ${owned ? 'owned' : ''}`}>
                <div className="shop-card-cover">
                  <img
                    src={`https://placehold.co/300x400/1a1a2e/00ff88?text=${encodeURIComponent(game.nama)}`}
                    alt={game.nama}
                  />
                  {owned && <div className="owned-badge">✓ OWNED</div>}
                </div>
                <div className="shop-card-info">
                  <h3 className="shop-card-title">{game.nama}</h3>
                  <div className="shop-card-footer">
                    <span className="shop-card-price">
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
                        {buyingId === game.id ? 'Proses...' : (game.price === 0 ? 'Klaim' : 'Beli')}
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

export default Shop;