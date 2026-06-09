import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import './Landing.css';
import doom from '../assets/Doom.gif';
import slendrina from '../assets/slendrina.gif';
import TombRaider from '../assets/tombraider.gif';
import simcity from '../assets/simcity.gif';

const featureCards = [
  {
    icon: '🎮',
    title: 'Massive Library',
    description: 'Discover new titles from every genre and difficulty level.',
    highlight: 'Explore a library curated for every kind of gamer.',
  },
  {
    icon: '🏆',
    title: 'Global Leaderboards',
    description: 'Climb the ranks and earn exclusive status badges.',
    highlight: 'Compete with players around the world in real time.',
  },
  {
    icon: '🎯',
    title: 'Epic Achievements',
    description: 'Unlock rewards, badges, and secret challenges.',
    highlight: 'Show off your progress with achievements that matter.',
  },
  {
    icon: '👥',
    title: 'Live Community',
    description: 'Join tournaments, chat, and team up instantly.',
    highlight: 'Stay connected with fellow gamers in every match.',
  },
];

const genres = [
  {
    icon: doom,
    name: 'Doom',
    players: '100k active',
    description: 'Hadapi gerombolan iblis dalam aksi tembak-menembak yang brutal dan penuh adrenalin.',
  },
  {
    icon: simcity,
    name: 'SimCity',
    players: '9K active',
    description: 'Bangun, kelola, dan kembangkan kota impianmu menjadi pusat peradaban modern.',
  },
  {
    icon: TombRaider,
    name: 'Tomb Raider',
    players: '1.2k active',
    description: 'Jelajahi reruntuhan kuno, pecahkan teka-teki, dan ungkap misteri bersama Lara Croft.',
  },
  {
    icon: slendrina,
    name: 'Slendrina',
    players: '15k active',
    description: 'Rasakan ketegangan horor saat melarikan diri dari teror Slendrina yang mengintai.',
  },
];

const Landing = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [highlightText, setHighlightText] = useState(featureCards[0].highlight);
  const [activeGenre, setActiveGenre] = useState(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!loading && user) {
      navigate('/home');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <div className="landing loading-state">Loading...</div>;
  }

  const handleHeroMove = (event) => {
    const card = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - card.left - card.width / 2;
    const y = event.clientY - card.top - card.height / 2;
    setTilt({
      x: (y / card.height) * 14,
      y: (x / card.width) * 18,
    });
  };

  const handleHeroLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const scrollToFeatures = () => {
    document.getElementById('landing-features')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="landing">
      <div className="landing-topbar">
        <div className="nav-brand">
          <span>PIXEL</span>
          <span className="brand-accent">PLAY</span>
        </div>
        <div className="nav-links">
          <button onClick={scrollToFeatures}>Features</button>
          <button onClick={() => navigate('/signin')}>Sign In</button>
          <button className="nav-primary" onClick={() => navigate('/signup')}>
            Sign Up
          </button>
        </div>
      </div>

      <main className="landing-container">
        <section className="landing-hero">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="badge-dot" /> Saatnya Membawa Keseruan Bermain ke Tingkat Selanjutnya.
            </div>
            <h1 className="hero-title">
              Build, Play, <span>Compete</span>
            </h1>
            <p className="hero-subtitle">
              PixelPlay menggabungkan game, komunitas, dan prestasi dalam satu platform modern.
            </p>
            <p className="hero-highlight">{highlightText}</p>

            <div className="hero-actions">
              <button className="btn-primary btn-lg" onClick={scrollToFeatures}>
                Explor Fitur
              </button>
              <button className="btn-ghost btn-lg" onClick={() => navigate('/signup')}>
                Gabung Sekarang
              </button>
            </div>

            <div className="hero-stats">
              <div className="stat">
                <span className="stat-num">1000+</span>
                <span className="stat-label">Active Players</span>
              </div>
              <div className="stat-divider" />
              <div className="stat">
                <span className="stat-num">50+</span>
                <span className="stat-label">Games Ready</span>
              </div>
              <div className="stat-divider" />
              <div className="stat">
                <span className="stat-num">20+</span>
                <span className="stat-label">Daily Events</span>
              </div>
            </div>
          </div>

          <div
            className="hero-visual"
            onMouseMove={handleHeroMove}
            onMouseLeave={handleHeroLeave}
            style={{ transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
          >
            <div className="hero-glow hero-glow-1" />
            <div className="hero-glow hero-glow-2" />
            <div className="hero-card-stack">
              <div className="game-card gc-back">
                 <img src={simcity} alt="simcity" className="gc-image" />
                <div className="gc-content">
                  <div className="gc-genre">TRENDING</div>
                  <div className="gc-title">SimCity</div>
                </div>
              </div>
              <div className="game-card gc-mid">
                 <img src={doom} alt="Doom" className="gc-image" />
                <div className="gc-content">
                  <div className="gc-genre">SPEED</div>
                  <div className="gc-title">Doom</div>
                </div>
              </div>
              <div className="game-card gc-front">
                <img src={slendrina} alt="" className="gc-image" />
                <div className="gc-info">
                  <div className="gc-genre">FEATURED</div>
                  <div className="gc-title">Slendrina</div>
                  <div className="gc-meta">
                    <span className="gc-stars">⭐⭐⭐⭐☆</span>
                    <span>Updated daily</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="landing-features" className="landing-features">
          <div className="section-header">
            <div>
              <p className="section-label">Feature Showcase</p>
              <h2 className="section-title">Semua yang kamu butuhkan untuk jadi juara</h2>
            </div>
            <p className="section-description">
              Pilih fitur, gulir ke bawah, dan lihat bagaimana PixelPlay menghadirkan pengalaman bermain
              yang lebih hidup untuk setiap pemain.
            </p>
          </div>

          <div className="features-grid">
            {featureCards.map((feature, index) => (
              <button
                key={feature.title}
                className="feature-card"
                onMouseEnter={() => setHighlightText(feature.highlight)}
                onMouseLeave={() => setHighlightText(featureCards[0].highlight)}
                onFocus={() => setHighlightText(feature.highlight)}
                onBlur={() => setHighlightText(featureCards[0].highlight)}
              >
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </button>
            ))}
          </div>
        </section>

        <section className="landing-genres">
          <div className="section-header section-header-inline">
            <div>
              <p className="section-label">Top Game Picks</p>
              <h2 className="section-title">Temukan game yang cocok untuk mood-mu</h2>
            </div>
          </div>

          <div className="genre-grid">
            <div className="genre-list">
              {genres.map((item, index) => (
                <button
                  type="button"
                  key={item.name}
                  className={`genre-card ${activeGenre === index ? 'active' : ''}`}
                  onMouseEnter={() => setActiveGenre(index)}
                  onFocus={() => setActiveGenre(index)}
                >
                  <img
                    src={item.icon}
                    alt={item.name}
                    className="genre-icon"
/                 >
                  <div>
                    <p className="genre-title">{item.name}</p>
                    <p className="genre-meta">{item.players}</p>
                  </div>
                </button>
              ))}
            </div>

            <div className="genre-detail-card">
              <div className="genre-highlight">
                <img
                      src={genres[activeGenre].icon}
                      alt={genres[activeGenre].name}
                      className="genre-highlight-icon"
                />
                <h3>{genres[activeGenre].name}</h3>
              </div>
              <p>{genres[activeGenre].description}</p>
              <div className="genre-detail-meta">
                <span>{genres[activeGenre].players}</span>
                <span></span>
              </div>
            </div>
          </div>
        </section>

        <section className="landing-auth">
          <div className="auth-card signin-card">
            <h2>Sudah punya akun?</h2>
            <p>Masuk sekarang dan lanjutkan petualanganmu di PixelPlay.</p>
            <button className="auth-button signin-btn" onClick={() => navigate('/signin')}>
              SIGN IN
            </button>
          </div>

          <div className="auth-divider">OR</div>

          <div className="auth-card signup-card">
            <h2>Baru di sini?</h2>
            <p>Buat akun gratis dan mulai kumpulkan prestasi pertama kamu.</p>
            <button className="auth-button signup-btn" onClick={() => navigate('/signup')}>
              SIGN UP
            </button>
          </div>
        </section>

        <section className="landing-footer">
          <p>© 2026 PixelPlay. All rights reserved.</p>
        </section>
      </main>
    </div>
  );
};

export default Landing;
