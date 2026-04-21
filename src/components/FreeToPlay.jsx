import './FreeToPlay.css';

const FreeToPlay = () => {
  return (
    <section className="free-to-play">
      <h2 className="section-title">FREE TO PLAY</h2>

      <div className="bento-grid">
        <div className="bento-item item-left">
          <img src="https://placehold.co/600x400" alt="Game 1" />
        </div>

        <div className="bento-center">
          <div className="bento-item item-top-left">
            <img src="https://placehold.co/300x200" alt="Game 2" />
          </div>
          <div className="bento-item item-top-right">
            <img src="https://placehold.co/300x200" alt="Game 3" />
          </div>
          <div className="bento-item item-bottom">
            <img src="https://placehold.co/600x200" alt="Game 4" />
          </div>
        </div>

        <div className="bento-item item-right">
          <img src="https://placehold.co/600x400" alt="Game 5" />
        </div>
      </div>
    </section>
  );
};

export default FreeToPlay;