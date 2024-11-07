import { createNewDeck } from "../../utils/deckOfCardsApi";
import Card from "../Card/Card";
import Preloader from "../Preloader/Preloader";
import { CurrentUserContext } from "../../contexts/CurrentUserContext";
import "./Demo.css";
import { useContext, useCallback, useState } from "react";
import { useDrop } from "react-dnd";
import { backOfCard } from "../../utils/constants";

function Demo({
  handleGameStart,
  gameActive,
  handleGameEnd,
  pullCard,
  hand,
  setHand,
  isDrawPileEmpty,
  handleDiscard,
  discardPile,
  isDiscardPileEmpty,
  isLoading,
  handleDiscardPileClick,
}) {
  const currentUser = useContext(CurrentUserContext);
  const handLimit = 7;
  const startDemoGame = () => {
    handleGameStart(1);
  };

  const endDemoGame = () => {
    handleGameEnd();
  };

  function draw() {
    if (hand.length >= handLimit) {
      console.log("Please discard before drawing");
    } else {
      if (currentUser.name !== undefined) {
        pullCard(localStorage.getItem("deck_id"), currentUser.name, 1);
      } else {
        pullCard(localStorage.getItem("deck_id"), "Guest", 1);
      }
    }
  }

  function clickedDiscardPile() {
    console.log(discardPile);
    handleDiscardPileClick();
  }

  function discard(item) {
    handleDiscard(item.card);
  }

  const [{ isOver }, dropRef] = useDrop({
    accept: "card",
    drop: (item) => discard(item),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const moveCardListItem = useCallback(
    (dragIndex, hoverIndex) => {
      const dragItem = hand[dragIndex];
      const hoverItem = hand[hoverIndex];
      setHand((cards) => {
        const updatedCards = [...cards];
        updatedCards[dragIndex] = hoverItem;
        updatedCards[hoverIndex] = dragItem;
        return updatedCards;
      });
    },
    [hand]
  );

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
              >
                <img
                  src={backOfCard}
                  alt="Card Back"
                  className="demo__animation-card"
                />
              </button>
            </div>
            <div className="demo__discard-pile" ref={dropRef}>
              {isOver}
              <p className="demo__discard-title">Discard Pile</p>
              <button
                type="button"
                onClick={clickedDiscardPile}
                className={`demo__card-btn ${
                  isDiscardPileEmpty ? "demo__pile_empty" : ""
                }`}
              >
                {isDiscardPileEmpty ? (
                  ""
                ) : (
                  <img
                    className="demo__card-img"
                    src={discardPile[discardPile.length - 1].image}
                  ></img>
                )}
              </button>
            </div>
          </div>
        )}
        {gameActive ? (
          <div>
            <div className="demo__cards">
              {hand?.map((card) => {
                return (
                  <Card
                    key={card.code}
                    index={hand.indexOf(card)}
                    card={card}
                    moveCardListItem={moveCardListItem}
                    draggable
                  ></Card>
                );
              })}
            </div>
            <div className="demo__hand-size">{`Hand Size: ${hand.length}/${handLimit}`}</div>
            {isLoading ? <Preloader /> : ""}
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default Demo;
