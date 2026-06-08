import { useNavigate } from 'react-router-dom';
import './GenreGame.css';
import actionIcon from '../assets/ActionG.gif';
import adventureIcon from '../assets/adventureG.gif';
import rpgIcon from '../assets/rpgG.gif';
import shooterIcon from '../assets/shooterG.gif';
import puzzleIcon from '../assets/puzzleG.gif';
import strategyIcon from '../assets/strategyG.gif';
import horrorIcon from '../assets/horrorG.gif';
import arcadeIcon from '../assets/arcadeG.gif';

const genres = [
  { slug: 'action',    label: 'Action',    color: '#ff6b6b', icon: actionIcon },
  { slug: 'adventure', label: 'Adventure', color: '#ffd700', icon: adventureIcon },
  { slug: 'rpg',       label: 'RPG',       color: '#a855f7', icon: rpgIcon },
  { slug: 'shooter',   label: 'Shooter',   color: '#00cfff', icon: shooterIcon },
  { slug: 'puzzle',    label: 'Puzzle',    color: '#000000', icon: puzzleIcon },
  { slug: 'strategy',  label: 'Strategy',  color: '#ff9f43', icon: strategyIcon },
  { slug: 'horror',    label: 'Horror',    color: '#ff4757', icon: horrorIcon },
  { slug: 'arcade',    label: 'Arcade',    color: '#eccc68', icon: arcadeIcon },
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
            style={{ '--accent': genre.color, backgroundImage: `url(${genre.icon})` }}
          >
            <div className="genre-icon" aria-hidden="true" />
            <div className="genre-label">{genre.label}</div>
            <div className="genre-glow" />
          </div>
        ))}
      </div>
    </section>
  );
};

export default GenreGame;