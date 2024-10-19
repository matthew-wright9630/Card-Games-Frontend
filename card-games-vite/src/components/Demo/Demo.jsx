import { createNewDeck } from "../../utils/deckOfCardsApi";
import Card from "../Card/Card";
import "./Demo.css";

function Demo({ handleGameStart, gameActive, handleGameEnd, pullCard, hand }) {
  const startDemoGame = () => {
    handleGameStart(1);
  };

  const endDemoGame = () => {
    handleGameEnd();
  };

  const draw = () => {
    pullCard(1);
  };

  return (
    <div className="demo">
      {!gameActive ? (
        <button
          type="button"
          onClick={startDemoGame}
          className="demo__start-btn"
        >
          Start
        </button>
      ) : (
        <div>
          <button type="button" onClick={endDemoGame} className="stop-btn">
            Stop
          </button>
          <button type="button" onClick={draw} className="demo__pull-card-btn">
            Draw a card
          </button>
        </div>
      )}
      <div className="demo__cards">
        {hand?.map((card) => {
          return <Card key={card.code} card={card}></Card>;
        })}
      </div>
    </div>
  );
}

export default Demo;
