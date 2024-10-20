import { createNewDeck } from "../../utils/deckOfCardsApi";
import Card from "../Card/Card";
import Preloader from "../Preloader/Preloader";
import "./Demo.css";

function Demo({
  handleGameStart,
  gameActive,
  handleGameEnd,
  pullCard,
  hand,
  isDrawPileEmpty,
  handleDiscard,
  discardPile,
  isDiscardPileEmpty,
  isLoading,
}) {
  const handLimit = 7;
  const startDemoGame = () => {
    handleGameStart(1);
  };

  const endDemoGame = () => {
    handleGameEnd();
  };

  const draw = () => {
    if (hand.length >= handLimit) {
      console.log("Please discard before drawing");
    } else {
      pullCard(1);
    }
  };

  return (
    <div className="demo">
      {!gameActive ? (
        <div className="demo__game-start">
          <button
            type="button"
            onClick={startDemoGame}
            className="demo__btn demo__start-btn"
          >
            Start
          </button>
        </div>
      ) : (
        <div className="demo__game">
          <button
            type="button"
            onClick={endDemoGame}
            className="demo__btn demo__stop-btn"
          >
            End game
          </button>
          <div className="demo__draw-pile">
            <p className="demo__draw-title">Draw Pile</p>
            <button
              type="button"
              onClick={draw}
              className={`demo__card-btn ${
                isDrawPileEmpty ? "demo__pile_empty" : "demo__pile"
              }`}
            ></button>
          </div>
          <div className="demo__discard-pile">
            <p className="demo__discard-title">Discard Pile</p>
            <button
              type="button"
              className={`demo__card-btn ${
                isDiscardPileEmpty ? "demo__pile_empty" : ""
              }`}
            >
              Discard
              {isDiscardPileEmpty ? (
                ""
              ) : (
                <img
                  className="demo__card-img"
                  src={discardPile[0].image}
                ></img>
              )}
            </button>
          </div>
        </div>
      )}
      <div className="demo__cards">
        {hand?.map((card) => {
          return (
            <Card
              key={card.code}
              card={card}
              handleDiscard={handleDiscard}
            ></Card>
          );
        })}
      </div>
      <div className="demo__hand-size">{`Hand Size: ${hand.length}/${handLimit}`}</div>
      {isLoading ? <Preloader /> : ""}
    </div>
  );
}

export default Demo;
