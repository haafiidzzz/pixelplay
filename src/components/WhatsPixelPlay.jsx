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
              PixelPlay adalah platform cloud gaming revolusioner tempat kamu bisa memiliki dan memainkan ratusan game terbaik tanpa batas. Beli sekali, mainkan selamanya—langsung dari browser kamu! Lupakan proses unduhan yang memakan waktu atau kapasitas harddisk yang penuh. Di PixelPlay, semua game berjalan di server awan super cepat kami. Cukup pilih game favoritmu, selesaikan pembelian, dan klik Play untuk langsung masuk ke dalam petualangan seru secara online!
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
            <p className="info-right-title">Genre</p>
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
              <li>☁️ Instant Cloud Play: Mainkan game favoritmu instan lewat cloud streaming tanpa perlu mengunduh atau memasang file apa pun.</li>
              <li>🛒 One-Time Purchase: Cukup beli game impianmu sekali, dan game tersebut akan tersimpan di Library pribadi kamu selamanya.</li>
              <li>🏆 Achievement & Leaderboard System: Buktikan kemampuanmu dan bersainglah dengan gamer lain di seluruh dunia.</li>
              <li>🖥️ Ramah Spesifikasi: Tidak perlu device gaming mahal. Selama kamu terhubung ke internet, game seberat apa pun akan berjalan dengan lancar!</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatsPixelPlay;