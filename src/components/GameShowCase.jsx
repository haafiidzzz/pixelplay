import './GameShowcase.css';

const GameShowcase = () => {
  const smallGames = Array(5).fill(null);
  const tinyGames = Array(5).fill(null);

  return (
    <section className="game-showcase">
      <div className="featured-row">
        <div className="featured-card">
          <img src="https://placehold.co/400x500" alt="Featured 1" />
        </div>
        <div className="featured-card">
          <img src="https://placehold.co/400x500" alt="Featured 2" />
        </div>
        <div className="featured-card big">
          <img src="https://placehold.co/600x500" alt="Featured 3" />
        </div>
      </div>

      <div className="small-grid">
        {smallGames.map((_, index) => (
          <div key={`small-${index}`} className="small-card">
            <img src="https://placehold.co/200x200" alt={`Game ${index + 1}`} />
          </div>
        ))}
      </div>

      <div className="tiny-grid">
        {tinyGames.map((_, index) => (
          <div key={`tiny-${index}`} className="tiny-card">
            <img src="https://placehold.co/150x150" alt={`Game ${index + 1}`} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default GameShowcase;