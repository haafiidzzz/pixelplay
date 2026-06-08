import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient'; 
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
  const [gameCounts, setGameCounts] = useState({});

  useEffect(() => {
    const fetchGameCounts = async () => {
      const { data, error } = await supabase
        .from('genres')
        .select(`
          slug,
          game_genres ( game_id )
        `);

      if (!error && data) {
        const counts = {};
        // Memetakan jumlah game ke dalam object berdasarkan slug
        data.forEach((genre) => {
          counts[genre.slug] = genre.game_genres ? genre.game_genres.length : 0;
        });
        setGameCounts(counts);
      } else {
        console.error("Gagal mengambil jumlah game:", error);
      }
    };

    fetchGameCounts();
  }, []);

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
            
            {/* Menampilkan jumlah game dari Supabase */}
            <div className="genre-count" style={{ 
              color: '#fff', 
              fontSize: '0.85rem', 
              marginTop: '4px', 
              position: 'relative', 
              zIndex: 2,
              opacity: 0.9 
            }}>
              {gameCounts[genre.slug] !== undefined ? `${gameCounts[genre.slug]} Games` : '...'}
            </div>

            <div className="genre-glow" />
          </div>
        ))}
      </div>
    </section>
  );
};

export default GenreGame;