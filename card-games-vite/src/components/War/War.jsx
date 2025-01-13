import "./War.css";

function War({
  handleGameIncrement,
  gameActive,
  handleGameStart,
  handleGameEnd,
  incrementGameWon,
  isLoggedIn,
  getCurrentGame,
}) {
  function incrementGame() {
    if (isLoggedIn) {
      const currentGame = getGame();
      if (typeof currentGame === "string") {
        handleGameIncrement(currentGame);
      }
    }
  }

  function incrementGameWin() {
    if (isLoggedIn) {
      const currentGame = getGame();
      if (typeof currentGame === "string") {
        incrementGameWon(currentGame);
      }
    }
  }

  function getGame() {
    return getCurrentGame({
      name: "War",
      description: `War is a two player game where each player flips the top card of their deck and the highest card wins. 
    Game ends when one player has the entire deck`,
    });
  }
  return (
    <div className="war">
      <h2 className="war__title">War</h2>
      <p className="war__description-placeholder">
        Thank you for your interest! This page is still under development.
        Please come back another time!
      </p>

      <div className="war__game-area">
        <div className="war__piles">
          <div className="war__piles__player2">Player 2</div>
          <div className="war__piles__draw">Draw Pile</div>
          <div className="war__piles__player1">Player 1</div>
        </div>
      </div>
    </div>
  );
}

export default War;
