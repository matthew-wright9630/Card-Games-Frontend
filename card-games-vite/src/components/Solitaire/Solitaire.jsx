import "./Solitaire.css";
import { React } from "react";

function Solitaire({
  handleGameIncrement,
  gameActive,
  handleGameStart,
  handleGameEnd,
  incrementGameWon,
  isLoggedIn,
  getCurrentGame,
  pullCard,
  hand,
  setHand,
  isDrawPileEmpty,
  handleDiscard,
  discardPile,
  isDiscardPileEmpty,
  isLoading,
  handleDiscardPileClick,
  animateCardDeal,
}) {
  function startSolitaireGame() {
    incrementGame();
    handleGameStart(1);
  }

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
      name: "Solitaire",
      description: `Solitaire is a single player game where cards need to be sorted
                        from Ace to King in each suit.`,
    });
  }

  return (
    <div className="solitaire">
      <h2 className="solitaire__title">Solitaire</h2>
      <p className="solitaire__description-placeholder">
        Thank you for your interest! This page is still under development.
        Please come back another time!
      </p>

      {!gameActive ? (
        <button onClick={startSolitaireGame} className="playGame">
          Start Game
        </button>
      ) : (
        <div className="solitaire__game">
          <div className="game__draw-pile">
            <p className="game__draw-title">Draw Pile</p>
            <button
              type="button"
              onClick={draw}
              className={`game__card-btn ${
                isDrawPileEmpty ? "game__pile_empty" : "game__pile"
              }`}
            >
              <img
                src={backOfCard}
                alt="Card Back"
                className="demo__animation-card"
              />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Solitaire;
