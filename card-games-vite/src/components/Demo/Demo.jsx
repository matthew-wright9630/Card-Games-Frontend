import { createNewDeck } from "../../utils/deckOfCardsApi";
import "./Demo.css";

function Demo({ handleGameStart, gameActive, handleGameEnd }) {
  const test = () => {
    createNewDeck();
  };
  return (
    <div className="demo">
      {!gameActive ? (
        <button
          type="button"
          onClick={handleGameStart}
          className="demo__start-btn"
        >
          Start
        </button>
      ) : (
        <button type="button" onClick={handleGameEnd} className="stop-btn">Stop</button>
      )}
    </div>
  );
}

export default Demo;
