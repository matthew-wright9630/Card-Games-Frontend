import "./Solitaire.css";
import { React } from "react";

function Solitaire({
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
    <div className="solitaire">
      <h2 className="solitaire__title">Solitaire</h2>
      <p className="solitaire__description-placeholder">
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

export default Solitaire;
