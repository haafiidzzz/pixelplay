import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { shopService } from '../services/shopService';
import subwaySurf from '../assets/subway surf.gif';
import doom from '../assets/Doom.gif';
import princePersia from '../assets/princepersia.gif';
import tombRaider from '../assets/tombraider.gif';
import simcity from '../assets/simcity.gif';
import warhammer from '../assets/twwarhammer.gif';
import re4 from '../assets/re4.gif';
import batman from '../assets/batmansad.gif';
import octopath from '../assets/otrav.gif';
import chronoTrigger from '../assets/ctrigger.gif';
import onimusha from '../assets/onimusha.gif';
import harvest from '../assets/harvest.gif';
import blockBlast from '../assets/bb.gif';
import temple from '../assets/temple.gif';
import slendrina from '../assets/slendrina.gif';
import './GameShowcase.css';

const GAME_IMAGES = {
  'Subway Surfers': subwaySurf,
  'Doom': doom,
  'Prince of Persia': princePersia,
  'Tomb Raider': tombRaider,
  'Simcity': simcity,
  'Total War: Warhammer': warhammer,
  'Resident Evil 4': re4,
  'Batman: Arkham City': batman,
  'Octopath Traveler': octopath,
  'Chrono Trigger': chronoTrigger,
  'Onimusha': onimusha,
  'Harvest Moon': harvest,
  'Block Blast': blockBlast,
  'Temple Run': temple,
  'Slendrina': slendrina,
  // Mobile Legends belum ada GIF-nya, pakai placeholder
};

const getGameImageUrl = (game, fallbackSize) => {
  if (GAME_IMAGES[game?.nama]) return GAME_IMAGES[game.nama];
  if (game?.thumbnail) {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    return `${supabaseUrl}/storage/v1/object/public/game-thumbnail/${game.thumbnail}`;
  }
  return `https://placehold.co/${fallbackSize}/1a1a2e/00ff88?text=${encodeURIComponent(game?.nama || 'Game')}`;
};

const PAYMENT_METHODS = [
  { icon: '💳', name: 'Kartu Kredit' },
  { icon: '🏧', name: 'Transfer Bank' },
  { icon: '📱', name: 'GoPay' },
  { icon: '🟢', name: 'OVO' },
  { icon: '🔵', name: 'DANA' },
  { icon: '🏪', name: 'Indomaret' },
];

const GameShowcase = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [games, setGames] = useState([]);
  const [ownedIds, setOwnedIds] = useState(new Set());
  const [buyingId, setBuyingId] = useState(null);
  const [toast, setToast] = useState(null);
  const [confirmGame, setConfirmGame] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState('Kartu Kredit');

  const searchQuery = new URLSearchParams(location.search).get('search') || '';

  useEffect(() => { fetchData(); }, [user]);

  const fetchData = async () => {
    const { data: allGames } = await shopService.getAllGames();
    setGames(allGames || []);
    if (user) {
      const { data: purchases } = await shopService.getUserPurchases(user.id);
      setOwnedIds(new Set((purchases || []).map((p) => p.game_id)));
    }
  };

  const showToast = (text, type = 'success') => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleBuyClick = (game) => {
    if (!user) {
      showToast('Login dulu untuk beli game!', 'error');
      return;
    }
    setSelectedPayment('Kartu Kredit');
    setConfirmGame(game);
  };

  const handleConfirmBuy = async () => {
    if (!confirmGame) return;
    const game = confirmGame;
    setConfirmGame(null);
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

  const filteredGames = searchQuery
    ? games.filter((g) => g.nama.toLowerCase().includes(searchQuery.toLowerCase()))
    : games;

  const featured = filteredGames.slice(0, 3);
  const small = filteredGames.slice(3, 8);
  const tiny = filteredGames.slice(8, 13);

  const BuyButton = ({ game }) => {
    const owned = ownedIds.has(game.id);
    return owned ? (
      <span className="game-card-owned">✓ OWNED</span>
    ) : (
      <button
        className="game-card-buy"
        onClick={() => handleBuyClick(game)}
        disabled={buyingId === game.id}
      >
        {buyingId === game.id ? '...' : game.price === 0 ? 'GET' : `Rp ${Number(game.price).toLocaleString('id-ID')}`}
      </button>
    );
  };

  const imgSrc = (thumbnail, nama, size = '400x380') =>
    thumbnail || `https://placehold.co/${size}/1a1a2e/00ff88?text=${encodeURIComponent(nama)}`;

  return (
    <section className="game-showcase">
      {toast && <div className={`showcase-toast ${toast.type}`}>{toast.text}</div>}

      {confirmGame && (
        <div className="modal-overlay" onClick={() => setConfirmGame(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-game-img">
              <img
                src={getGameImageUrl(confirmGame, '300x160')}
                alt={confirmGame.nama}
              />
            </div>
            <h2 className="modal-title">{confirmGame.nama}</h2>
            <div className="modal-price">
              {confirmGame.price === 0 ? 'FREE' : `Rp ${Number(confirmGame.price).toLocaleString('id-ID')}`}
            </div>
            <div className="modal-payment">
              <p className="modal-payment-label">Metode Pembayaran</p>
              <div className="payment-options">
                {PAYMENT_METHODS.map(({ icon, name }) => (
                  <div
                    key={name}
                    className={`payment-option ${selectedPayment === name ? 'selected' : ''}`}
                    onClick={() => setSelectedPayment(name)}
                  >
                    <span className="payment-icon">{icon}</span>
                    <span>{name}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="modal-actions">
              <button className="modal-btn-cancel" onClick={() => setConfirmGame(null)}>Batal</button>
              <button className="modal-btn-confirm" onClick={handleConfirmBuy}>Bayar Sekarang</button>
            </div>
          </div>
        </div>
      )}

      {searchQuery && (
        <p style={{ color: '#00ff88', padding: '0 1rem', marginBottom: '1rem' }}>
          Hasil pencarian: <strong>"{searchQuery}"</strong> — {filteredGames.length} game ditemukan
        </p>
      )}

      {filteredGames.length === 0 && searchQuery ? (
        <p style={{ color: '#aaa', padding: '2rem', textAlign: 'center' }}>
          Tidak ada game yang cocok dengan "{searchQuery}"
        </p>
      ) : (
        <>
          <div className="featured-row">
            {featured.map((game) => (
              <div key={game.id} className="featured-card game-card">
                <img src={getGameImageUrl(game, '400x380')} alt={game.nama} />
                <div className="game-card-overlay">
                  <p className="game-card-name">{game.nama}</p>
                  <BuyButton game={game} />
                </div>
              </div>
            ))}
          </div>

          <div className="small-grid">
            {small.map((game) => (
              <div key={game.id} className="small-card game-card">
                <img src={getGameImageUrl(game, '200x140')} alt={game.nama} />
                <div className="game-card-overlay">
                  <p className="game-card-name">{game.nama}</p>
                  <BuyButton game={game} />
                </div>
              </div>
            ))}
          </div>

          <div className="tiny-grid">
            {tiny.map((game) => (
              <div key={game.id} className="tiny-card game-card">
                <img src={getGameImageUrl(game, '200x120')} alt={game.nama} />
                <div className="game-card-overlay">
                  <p className="game-card-name">{game.nama}</p>
                  <BuyButton game={game} />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default GameShowcase;