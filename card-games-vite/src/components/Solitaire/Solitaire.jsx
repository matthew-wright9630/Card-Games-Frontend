import "./Solitaire.css";
import { React, useCallback, useContext, useState } from "react";
import { backOfCard } from "../../utils/constants";
import { useDrop } from "react-dnd";
import { CurrentUserContext } from "../../contexts/CurrentUserContext";
import { drawCard, drawFromPile } from "../../utils/deckOfCardsApi";
import Card from "../Card/Card";

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
  addToDiscard,
  discardPile,
  isDiscardPileEmpty,
  isLoading,
  handleDiscardPileClick,
  animateCardDeal,
  addCardToPile,
  pullCardFromPile,
  pullCardFromDiscard,
}) {
  const currentUser = useContext(CurrentUserContext);

  const [isSpadePileEmpty, setIsSpadePileEmpty] = useState(true);
  const [isHeartPileEmpty, setIsHeartPileEmpty] = useState(true);
  const [isClubPileEmpty, setIsClubPileEmpty] = useState(true);
  const [isDiamondPileEmpty, setIsDiamondPileEmpty] = useState(true);

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

  function clickedDiscardPile() {
    console.log(discardPile);
    handleDiscardPileClick();
  }

  function discard(item) {
    addToDiscard(item);
  }

  function addToSpadeFoundation(item) {
    console.log(item);
    pullCardFromDiscard(localStorage.getItem("deck_id"));
    // addCardToPile(localStorage.getItem("deck_id"), "Spade Foundation", item);
  }

  function getGame() {
    return getCurrentGame({
      name: "Solitaire",
      description: `Solitaire is a single player game where cards need to be sorted
                        from Ace to King in each suit.`,
    });
  }

  function draw() {
    drawCard(localStorage.getItem("deck_id"), 1).then((deck) => {
      discard(deck.cards[0]);
    });
    animateCardDeal(200, 0);
  }

  const [{ isOver }, dropRef] = useDrop({
    accept: "card",
    drop: (item) => discard(item),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const [{ isOverSpadeFoundation }, drop] = useDrop({
    accept: "card",
    drop: (item) => addToSpadeFoundation(item),
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
          <div className="solitaire__draw-discard-piles">
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
                  className="game__animation-card"
                />
              </button>
            </div>
            <div className="game__discard-pile" ref={dropRef}>
              {isOver}
              <p className="game__discard-title">Discard Pile</p>
              <button
                type="button"
                onClick={clickedDiscardPile}
                className={`game__card-btn ${
                  isDiscardPileEmpty ? "game__pile_empty" : ""
                }`}
              >
                {isDiscardPileEmpty ? (
                  ""
                ) : (
                  // <Card
                  //   card={discardPile[discardPile.length - 1]}
                  //   moveCardListItem={moveCardListItem}
                  // />
                  <img
                    className="game__card-img"
                    src={discardPile[discardPile.length - 1].image}
                  ></img>
                )}
              </button>
            </div>
          </div>
          <div className="solitaire__foundation-piles">
            <div className="solitaire__foundation__spade" ref={drop}>
              {isOverSpadeFoundation}
              {isSpadePileEmpty ? (
                <div className="solitaire__pile_empty"></div>
              ) : (
                <img
                  className="game__card-img"
                  src={discardPile[discardPile.length - 1].image}
                ></img>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Solitaire;
