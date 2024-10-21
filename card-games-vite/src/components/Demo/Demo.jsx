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
  handleDiscardPileClick,
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
    <div>
      <h2 className="demo__title">Demo</h2>
      <p className="demo__description">
        Below is a demo for card interaction. The cards are generated from
        deckofcardsapi.com.
      </p>
      <p className="demo__description">
        The hand limit for the demo is 7 cards. Once the hand limit is reached,
        you must discard to draw more cards.
      </p>
      <p className="demo__description">
        To hide cards, click on them to flip them to display the back.
      </p>
      <p className="demo__description">
        To view what cards have been discarded, click the Discard Pile
      </p>
      <p className="demo__description">
        Once all cards have been drawn, click the draw pile again to reshuffle
        all cards in the hand and discard pile.
      </p>
      <div className="demo">
        {!gameActive ? (
          <div className="demo__game-start">
            <button
              type="button"
              onClick={startDemoGame}
              className="demo__btn demo__start-btn"
            >
              Start Game
            </button>
          </div>
        ) : (
          <div className="demo__game">
            <button
              type="button"
              onClick={endDemoGame}
              className="demo__btn demo__stop-btn"
            >
              End Game
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
                onClick={handleDiscardPileClick}
                className={`demo__card-btn ${
                  isDiscardPileEmpty ? "demo__pile_empty" : ""
                }`}
              >
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
    </div>
  );
}

export default Demo;
