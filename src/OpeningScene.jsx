
export default function OpeningScene({ onEnter }) {
  return (
    <main className="opening-scene">
      <div className="opening-content">
        <p className="opening-chapter">A FINANCIAL SURVIVAL GAME</p>

        <h1 className="opening-title">FATAL INTEREST</h1>

        <p className="opening-tagline">
          Your money. Your choices. His entertainment.
        </p>

        <div className="opening-dialogue">
          <p className="opening-speaker">THE WARNING</p>
          <p className="opening-quote">
            "Well, well. Look who decided to play."
          </p>
        </div>

        <button
          type="button"
          className="opening-enter"
          onClick={onEnter}
        >
          ENTER THE GAME
        </button>
      </div>
    </main>
  );
}

