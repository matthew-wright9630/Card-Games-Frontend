import "./War.css";

function War({
  currentGame,
  handleGameIncrement,
  gameActive,
  handleGameStart,
  handleGameEnd,
  incrementGameWon,
}) {
  function incrementGame() {
    handleGameIncrement(currentGame);
  }
  function incrementGameWin() {
    incrementGameWon(currentGame);
  }
  return (
    <div className="war">
      <h2 className="war__title">War</h2>
      <p className="war__description-placeholder">
        Thank you for your interest! This page is still under development.
        Please come back another time!
      </p>
      {!gameActive ? (
        <button
          onClick={() => {
            incrementGame();
            handleGameStart();
          }}
          className="playGame"
        >
          Increment Games Played
        </button>
      ) : (
        <button
          onClick={() => {
            incrementGameWin();
            handleGameEnd();
          }}
          className="solitaire__win-game"
        >
          Increment Games Won
        </button>
      )}
    </div>
  );
}

export default War;
