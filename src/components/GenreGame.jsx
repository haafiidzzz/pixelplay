import { useNavigate } from 'react-router-dom';
import './GenreGame.css';

const genres = [
  { slug: 'action',    label: 'Action',    color: '#ff6b6b', icon: '⚔️' },
  { slug: 'adventure', label: 'Adventure', color: '#ffd700', icon: '🗺️' },
  { slug: 'rpg',       label: 'RPG',       color: '#a855f7', icon: '🧙' },
  { slug: 'shooter',   label: 'Shooter',   color: '#00cfff', icon: '🔫' },
  { slug: 'puzzle',    label: 'Puzzle',    color: '#00ff88', icon: '🧩' },
  { slug: 'strategy',  label: 'Strategy',  color: '#ff9f43', icon: '♟️' },
  { slug: 'horror',    label: 'Horror',    color: '#ff4757', icon: '👻' },
  { slug: 'arcade',    label: 'Arcade',    color: '#eccc68', icon: '🕹️' },
];

const GenreGame = () => {
  const navigate = useNavigate();

  return (
    <section className="genre-game">
      <h2 className="section-title">GENRE GAME</h2>

      <div className="genre-grid">
        {genres.map((genre) => (
          <div
            key={genre.slug}
            className="genre-card"
            onClick={() => navigate(`/genre/${genre.slug}`)}
            style={{ '--accent': genre.color }}
          >
            <div className="genre-icon">{genre.icon}</div>
            <div className="genre-label">{genre.label}</div>
            <div className="genre-glow" />
          </div>
        ))}
      </div>
    </section>
  );
};

export default GenreGame;