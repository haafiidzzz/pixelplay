import './WhatsPixelPlay.css';

const WhatsPixelPlay = () => {
  return (
    <section className="whats-pixelplay">
      <h2 className="section-title">WHAT IS PIXELPLAY ?</h2>

      <div className="info-box">
        <div className="info-content">
          <div className="info-left">
            <p className="info-tagline">Your Ultimate<br />Gaming Universe</p>
            <p className="info-desc">
              PixelPlay adalah platform gaming all-in-one tempat kamu bisa menemukan, membeli, dan memainkan ratusan game dari berbagai genre. Dari aksi penuh adrenalin hingga puzzle yang mengasah otak — semua ada di sini.
            </p>
            <div className="info-stats">
              <div className="stat-item">
                <span className="stat-number">100+</span>
                <span className="stat-label">Games</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">8</span>
                <span className="stat-label">Genre</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">∞</span>
                <span className="stat-label">Fun</span>
              </div>
            </div>
          </div>

          <div className="info-right">
            <p className="info-right-title">Genre yang Tersedia</p>
            <div className="genre-tags">
              {[
                { icon: '⚔️', label: 'Action' },
                { icon: '🗺️', label: 'Adventure' },
                { icon: '🧙', label: 'RPG' },
                { icon: '🔫', label: 'Shooter' },
                { icon: '🧩', label: 'Puzzle' },
                { icon: '♟️', label: 'Strategy' },
                { icon: '👻', label: 'Horror' },
                { icon: '🕹️', label: 'Arcade' },
              ].map((g) => (
                <div key={g.label} className="genre-tag">
                  <span>{g.icon}</span> {g.label}
                </div>
              ))}
            </div>

            <p className="info-right-title" style={{ marginTop: '1.5rem' }}>Fitur Unggulan</p>
            <ul className="feature-list">
              <li>🏆 Achievement & Leaderboard system</li>
              <li>🛒 Beli game langsung dari Home</li>
              <li>📚 Library game pribadi</li>
              <li>🎮 Ratusan game dari berbagai genre</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatsPixelPlay;