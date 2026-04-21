import './GenreGame.css';

const GenreGame = () => {
  const genres = Array(8).fill(null);

  return (
    <section className="genre-game">
      <h2 className="section-title">GENRE GAME</h2>

      <div className="genre-grid">
        {genres.map((_, index) => (
          <div key={index} className="genre-card">
            <img src="https://placehold.co/300x300" alt={`Genre ${index + 1}`} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default GenreGame;