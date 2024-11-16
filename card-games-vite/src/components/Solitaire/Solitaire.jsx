import "./Solitaire.css";
import { React, useCallback, useContext, useEffect, useState } from "react";
import { backOfCard } from "../../utils/constants";
import { useDrop } from "react-dnd";
import Confetti from "react-confetti";
import { CurrentUserContext } from "../../contexts/CurrentUserContext";
import {
  addCardsToPiles,
  drawCard,
  drawFromPile,
  listCardsInPile,
  returnCardsFromPile,
  shufflePilesTogether,
} from "../../utils/deckOfCardsApi";
import Card from "../Card/Card";
import {
  checkCardFoundation,
  checkFoundationNumber,
  checkTablueaCardValid,
} from "../../utils/solitaire";

function Solitaire({
  handleGameIncrement,
  gameActive,
  handleGameStart,
  incrementGameWon,
  isLoggedIn,
  getCurrentGame,
  hand,
  setHand,
  isDrawPileEmpty,
  addToDiscard,
  discardPile,
  handleDiscardPileClick,
  animateCardDeal,
  addCard,
  setDiscardPile,
  setIsDrawPileEmpty,
  pullCardFromPile,
  closeGameSite,
}) {
  const currentUser = useContext(CurrentUserContext);

  const [spadeFoundation, setSpadeFoundation] = useState([]);
  const [heartFoundation, setHeartFoundation] = useState([]);
  const [clubFoundation, setClubFoundation] = useState([]);
  const [diamondFoundation, setDiamondFoundation] = useState([]);

  const [tabluea1, setTabluea1] = useState([]);
  const [tabluea2, setTabluea2] = useState([]);
  const [tabluea3, setTabluea3] = useState([]);
  const [tabluea4, setTabluea4] = useState([]);
  const [tabluea5, setTabluea5] = useState([]);
  const [tabluea6, setTabluea6] = useState([]);
  const [tabluea7, setTabluea7] = useState([]);

  const [areCardsDealt, setAreCardsDealt] = useState(false);

  const [gameWon, setGameWon] = useState(false);

  function startSolitaireGame() {
    setGameWon(false);
    handleGameStart(1);
  }

  function endSolitaireGame() {
    setAreCardsDealt(false);
    resetTabluea();
    closeGameSite();
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
    handleDiscardPileClick();
  }

  function discard(item) {
    addToDiscard(item);
    setDiscardPile([...discardPile, item]);
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
      if (deck.success) {
        discard(deck.cards[0]);
        if (deck.remaining === 0) {
          setIsDrawPileEmpty(true);
        }
        animateCardDeal(200, 0);
      } else {
        returnCardsFromPile(localStorage.getItem("deck_id"), "discard")
          .then((deck) => {
            setDiscardPile([]);
            setIsDrawPileEmpty(false);
          })
          .catch((err) => console.error(err));
      }
    });
  }

  function checkCardIsLast(item) {
    if (item.id === "discard") {
      return item.card === discardPile[discardPile.length - 1];
    }
    if (item.id === "Tabluea1") {
      return item.card === tabluea1[tabluea1.length - 1];
    }
    if (item.id === "Tabluea2") {
      return item.card === tabluea2[tabluea2.length - 1];
    }
    if (item.id === "Tabluea3") {
      return item.card.code === tabluea3[tabluea3.length - 1].code;
    }
    if (item.id === "Tabluea4") {
      return item.card === tabluea4[tabluea4.length - 1];
    }
    if (item.id === "Tabluea5") {
      return item.card === tabluea5[tabluea5.length - 1];
    }
    if (item.id === "Tabluea6") {
      return item.card === tabluea6[tabluea6.length - 1];
    }
    if (item.id === "Tabluea7") {
      return item.card === tabluea7[tabluea7.length - 1];
    }
  }

  function findAndRemoveCardFromPile(cardToDiscard) {
    const newArray = [];
    const returnArray = [];
    let cardIsFound = false;
    if (cardToDiscard.id === "discard") {
      for (let i = 0; i < discardPile.length; i++) {
        if (cardToDiscard.card.code === discardPile[i].code) {
          cardIsFound = true;
        }
        if (cardIsFound) {
          returnArray.push(discardPile[i]);
          pullCardFromPile(localStorage.getItem("deck_id"), "discard", 1);
        } else {
          newArray.push(discardPile[i]);
        }
      }
      setDiscardPile(
        newArray.map((card) => {
          if (card.code === newArray[newArray.length - 1].code) {
            card.isHidden = false;
          }
          return card;
        })
      );
    }
    if (cardToDiscard.id === "Tabluea1") {
      for (let i = 0; i < tabluea1.length; i++) {
        if (cardToDiscard.card.code === tabluea1[i].code) {
          cardIsFound = true;
        }
        if (cardIsFound) {
          returnArray.push(tabluea1[i]);
        } else {
          newArray.push(tabluea1[i]);
        }
      }
      setTabluea1(
        newArray.map((card) => {
          if (card.code === newArray[newArray.length - 1].code) {
            card.isHidden = false;
          }
          return card;
        })
      );
    }
    if (cardToDiscard.id === "Tabluea2") {
      for (let i = 0; i < tabluea2.length; i++) {
        if (cardToDiscard.card.code === tabluea2[i].code) {
          cardIsFound = true;
        }
        if (cardIsFound) {
          returnArray.push(tabluea2[i]);
        } else {
          newArray.push(tabluea2[i]);
        }
      }
      setTabluea2(
        newArray.map((card) => {
          if (card.code === newArray[newArray.length - 1].code) {
            card.isHidden = false;
          }
          return card;
        })
      );
    }
    if (cardToDiscard.id === "Tabluea3") {
      for (let i = 0; i < tabluea3.length; i++) {
        if (cardToDiscard.card.code === tabluea3[i].code) {
          cardIsFound = true;
        }
        if (cardIsFound) {
          returnArray.push(tabluea3[i]);
        } else {
          newArray.push(tabluea3[i]);
        }
      }
      setTabluea3(
        newArray.map((card) => {
          if (card.code === newArray[newArray.length - 1].code) {
            card.isHidden = false;
          }
          return card;
        })
      );
    }
    if (cardToDiscard.id === "Tabluea4") {
      for (let i = 0; i < tabluea4.length; i++) {
        if (cardToDiscard.card.code === tabluea4[i].code) {
          cardIsFound = true;
        }
        if (cardIsFound) {
          returnArray.push(tabluea4[i]);
        } else {
          newArray.push(tabluea4[i]);
        }
      }
      setTabluea4(
        newArray.map((card) => {
          if (card.code === newArray[newArray.length - 1].code) {
            card.isHidden = false;
          }
          return card;
        })
      );
    }
    if (cardToDiscard.id === "Tabluea5") {
      for (let i = 0; i < tabluea5.length; i++) {
        if (cardToDiscard.card.code === tabluea5[i].code) {
          cardIsFound = true;
        }
        if (cardIsFound) {
          returnArray.push(tabluea5[i]);
        } else {
          newArray.push(tabluea5[i]);
        }
      }
      setTabluea5(
        newArray.map((card) => {
          if (card.code === newArray[newArray.length - 1].code) {
            card.isHidden = false;
          }
          return card;
        })
      );
    }
    if (cardToDiscard.id === "Tabluea6") {
      for (let i = 0; i < tabluea6.length; i++) {
        if (cardToDiscard.card.code === tabluea6[i].code) {
          cardIsFound = true;
        }
        if (cardIsFound) {
          returnArray.push(tabluea6[i]);
        } else {
          newArray.push(tabluea6[i]);
        }
      }
      setTabluea6(
        newArray.map((card) => {
          if (card.code === newArray[newArray.length - 1].code) {
            card.isHidden = false;
          }
          return card;
        })
      );
    }
    if (cardToDiscard.id === "Tabluea7") {
      for (let i = 0; i < tabluea7.length; i++) {
        if (cardToDiscard.card.code === tabluea7[i].code) {
          cardIsFound = true;
        }
        if (cardIsFound) {
          returnArray.push(tabluea7[i]);
        } else {
          newArray.push(tabluea7[i]);
        }
      }
      setTabluea7(
        newArray.map((card) => {
          if (card.code === newArray[newArray.length - 1].code) {
            card.isHidden = false;
          }
          return card;
        })
      );
    }
    return returnArray;
  }

  function addToPile(pileName, card) {
    addCard(localStorage.getItem("deck_id"), pileName, card);
  }

  function addToSpadeFoundation(item) {
    if (item.id === "Spade") {
      return;
    }
    if (!checkCardIsLast(item)) {
      throw new Error("Card must be last to be added to foundation");
    }
    if (checkCardFoundation(item.card, "Spade")) {
      if (
        spadeFoundation.length === 0 &&
        item.card.code.substring(0, 1) === "A"
      ) {
        addToPile("Spade", item.card);
        setSpadeFoundation([...spadeFoundation, item.card]);
        findAndRemoveCardFromPile(item);
      } else if (spadeFoundation.length === 0) {
        throw new Error("The first card must be the Ace");
      } else if (
        checkFoundationNumber(
          item.card,
          spadeFoundation[spadeFoundation.length - 1]
        )
      ) {
        setSpadeFoundation([...spadeFoundation, item.card]);
        findAndRemoveCardFromPile(item);
      } else {
        throw new Error("Card cannot be added to pile");
      }
    } else {
      throw new Error("Card suit is not a spade.");
    }
  }

  function addToHeartFoundation(item) {
    if (item.id === "Heart") {
      return;
    }
    if (!checkCardIsLast(item)) {
      throw new Error("Card must be last to be added to foundation");
    }
    if (checkCardFoundation(item.card, "Heart")) {
      if (
        heartFoundation.length === 0 &&
        item.card.code.substring(0, 1) === "A"
      ) {
        addToPile("Heart", item.card);
        setHeartFoundation([...heartFoundation, item.card]);
        findAndRemoveCardFromPile(item);
      } else if (heartFoundation.length === 0) {
        throw new Error("The first card must be the Ace");
      } else if (
        checkFoundationNumber(
          item.card,
          heartFoundation[heartFoundation.length - 1]
        )
      ) {
        setHeartFoundation([...heartFoundation, item.card]);
        findAndRemoveCardFromPile(item);
      } else {
        throw new Error("Card cannot be added to pile");
      }
    } else {
      throw new Error("Card suit is not a heart.");
    }
  }

  function addToClubFoundation(item) {
    if (item.id === "Club") {
      return;
    }
    if (!checkCardIsLast(item)) {
      throw new Error("Card must be last to be added to foundation");
    }
    if (checkCardFoundation(item.card, "Club")) {
      if (
        clubFoundation.length === 0 &&
        item.card.code.substring(0, 1) === "A"
      ) {
        addToPile("Club", item.card);
        setClubFoundation([...clubFoundation, item.card]);
        findAndRemoveCardFromPile(item);
      } else if (clubFoundation.length === 0) {
        throw new Error("The first card must be the Ace");
      } else if (
        checkFoundationNumber(
          item.card,
          clubFoundation[clubFoundation.length - 1]
        )
      ) {
        setClubFoundation([...clubFoundation, item.card]);
        findAndRemoveCardFromPile(item);
      } else {
        throw new Error("Card cannot be added to pile");
      }
    } else {
      throw new Error("Card suit is not a club.");
    }
  }

  function addToDiamondFoundation(item) {
    if (item.id === "Diamond") {
      return;
    }
    if (!checkCardIsLast(item)) {
      throw new Error("Card must be last to be added to foundation");
    }
    findAndRemoveCardFromPile(item);
    if (checkCardFoundation(item.card, "Diamond")) {
      if (
        diamondFoundation.length === 0 &&
        item.card.code.substring(0, 1) === "A"
      ) {
        addToPile("Diamond", item.card);
        setDiamondFoundation([...diamondFoundation, item.card]);
        findAndRemoveCardFromPile(item);
      } else if (diamondFoundation.length === 0) {
        throw new Error("The first card must be the Ace");
      } else if (
        checkFoundationNumber(
          item.card,
          diamondFoundation[diamondFoundation.length - 1]
        )
      ) {
        setDiamondFoundation([...diamondFoundation, item.card]);
        findAndRemoveCardFromPile(item);
      } else {
        throw new Error("Card cannot be added to pile");
      }
    } else {
      throw new Error("Card suit is not a diamond.");
    }
  }

  const [{ isOverSpadeFoundation }, dropSpadeFoundation] = useDrop({
    accept: "card",
    drop: (item) => addToSpadeFoundation(item),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const [{ isOverHeartFoundation }, dropHeartFoundation] = useDrop({
    accept: "card",
    drop: (item) => addToHeartFoundation(item),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const [{ isOverClubFoundation }, dropClubFoundation] = useDrop({
    accept: "card",
    drop: (item) => addToClubFoundation(item),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const [{ isOverDiamondFoundation }, dropDiamondFoundation] = useDrop({
    accept: "card",
    drop: (item) => addToDiamondFoundation(item),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  function setupTabluea() {
    drawCard(localStorage.getItem("deck_id"), 28)
      .then((deck) => {
        for (let i = 0; i < 28; i++) {
          if (
            i === 0 ||
            i === 2 ||
            i === 5 ||
            i === 9 ||
            i === 14 ||
            i === 20 ||
            i === 27
          ) {
            deck.cards[i].isHidden = false;
          } else {
            deck.cards[i].isHidden = true;
          }
        }
        setTabluea1([...tabluea1, deck.cards[0]]);
        setTabluea2([...tabluea2, deck.cards[1], deck.cards[2]]);
        setTabluea3([...tabluea3, deck.cards[3], deck.cards[4], deck.cards[5]]);
        setTabluea4([
          ...tabluea4,
          deck.cards[6],
          deck.cards[7],
          deck.cards[8],
          deck.cards[9],
        ]);
        setTabluea5([
          ...tabluea5,
          deck.cards[10],
          deck.cards[11],
          deck.cards[12],
          deck.cards[13],
          deck.cards[14],
        ]);
        setTabluea6([
          ...tabluea6,
          deck.cards[15],
          deck.cards[16],
          deck.cards[17],
          deck.cards[18],
          deck.cards[19],
          deck.cards[20],
        ]);
        setTabluea7([
          ...tabluea7,
          deck.cards[21],
          deck.cards[22],
          deck.cards[23],
          deck.cards[24],
          deck.cards[25],
          deck.cards[26],
          deck.cards[27],
        ]);

        incrementGame();
      })
      .catch((err) => console.error(err));
    setAreCardsDealt(true);
  }

  function addToTabluea1(item) {
    if (item.id === "Tabluea1") {
      return;
    }

    if (tabluea1.length === 0 && item.card.code.substring(0, 1) === "K") {
      setTabluea1([...tabluea1, ...findAndRemoveCardFromPile(item)]);
    } else if (
      checkTablueaCardValid(item.card, tabluea1[tabluea1.length - 1])
    ) {
      setTabluea1([...tabluea1, ...findAndRemoveCardFromPile(item)]);
    } else {
      throw new Error("Card is not valid");
    }
  }

  const [{ isOverT1 }, dropRefT1] = useDrop({
    accept: "card",
    drop: (item) => addToTabluea1(item),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  function addToTabluea2(item) {
    if (item.id === "Tabluea2") {
      return;
    }
    if (tabluea2.length === 0 && item.card.code.substring(0, 1) === "K") {
      setTabluea2([...tabluea2, ...findAndRemoveCardFromPile(item)]);
    } else if (
      checkTablueaCardValid(item.card, tabluea2[tabluea2.length - 1])
    ) {
      setTabluea2([...tabluea2, ...findAndRemoveCardFromPile(item)]);
    } else {
      throw new Error("Card is not valid");
    }
  }

  const [{ isOverT2 }, dropRefT2] = useDrop({
    accept: "card",
    drop: (item) => addToTabluea2(item),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  function addToTabluea3(item) {
    if (item.id === "Tabluea3") {
      return;
    }
    if (tabluea3.length === 0 && item.card.code.substring(0, 1) === "K") {
      setTabluea3([...tabluea3, ...findAndRemoveCardFromPile(item)]);
    } else if (
      checkTablueaCardValid(item.card, tabluea3[tabluea3.length - 1])
    ) {
      setTabluea3([...tabluea3, ...findAndRemoveCardFromPile(item)]);
    } else {
      throw new Error("Card is not valid");
    }
  }

  const [{ isOverT3 }, dropRefT3] = useDrop({
    accept: "card",
    drop: (item) => addToTabluea3(item),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  function addToTabluea4(item) {
    if (item.id === "Tabluea4") {
      return;
    }
    if (tabluea4.length === 0 && item.card.code.substring(0, 1) === "K") {
      setTabluea4([...tabluea4, ...findAndRemoveCardFromPile(item)]);
    } else if (
      checkTablueaCardValid(item.card, tabluea4[tabluea4.length - 1])
    ) {
      setTabluea4([...tabluea4, ...findAndRemoveCardFromPile(item)]);
    } else {
      throw new Error("Card is not valid");
    }
  }

  const [{ isOverT4 }, dropRefT4] = useDrop({
    accept: "card",
    drop: (item) => addToTabluea4(item),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  function addToTabluea5(item) {
    if (item.id === "Tabluea5") {
      return;
    }
    if (tabluea5.length === 0 && item.card.code.substring(0, 1) === "K") {
      setTabluea5([...tabluea5, ...findAndRemoveCardFromPile(item)]);
    } else if (
      checkTablueaCardValid(item.card, tabluea5[tabluea5.length - 1])
    ) {
      setTabluea5([...tabluea5, ...findAndRemoveCardFromPile(item)]);
    } else {
      throw new Error("Card is not valid");
    }
  }

  const [{ isOverT5 }, dropRefT5] = useDrop({
    accept: "card",
    drop: (item) => addToTabluea5(item),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  function addToTabluea6(item) {
    if (item.id === "Tabluea6") {
      return;
    }
    if (tabluea6.length === 0 && item.card.code.substring(0, 1) === "K") {
      setTabluea6([...tabluea6, ...findAndRemoveCardFromPile(item)]);
    } else if (
      checkTablueaCardValid(item.card, tabluea6[tabluea6.length - 1])
    ) {
      setTabluea6([...tabluea6, ...findAndRemoveCardFromPile(item)]);
    } else {
      throw new Error("Card is not valid");
    }
  }

  const [{ isOverT6 }, dropRefT6] = useDrop({
    accept: "card",
    drop: (item) => addToTabluea6(item),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  function addToTabluea7(item) {
    if (item.id === "Tabluea7") {
      return;
    }
    if (tabluea7.length === 0 && item.card.code.substring(0, 1) === "K") {
      setTabluea7([...tabluea7, ...findAndRemoveCardFromPile(item)]);
    } else if (
      checkTablueaCardValid(item.card, tabluea7[tabluea7.length - 1])
    ) {
      setTabluea7([...tabluea7, ...findAndRemoveCardFromPile(item)]);
    } else {
      throw new Error("Card is not valid");
    }
  }

  const [{ isOverT7 }, dropRefT7] = useDrop({
    accept: "card",
    drop: (item) => addToTabluea7(item),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  function resetTabluea() {
    setTabluea1([]);
    setTabluea2([]);
    setTabluea3([]);
    setTabluea4([]);
    setTabluea5([]);
    setTabluea6([]);
    setTabluea7([]);
    setSpadeFoundation([]);
    setHeartFoundation([]);
    setClubFoundation([]);
    setDiamondFoundation([]);
  }

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

  useEffect(() => {
    if (
      spadeFoundation.length === 13 &&
      diamondFoundation.length === 13 &&
      heartFoundation.length === 13 &&
      clubFoundation.length === 13
    ) {
      setGameWon(true);
    }
  }, [spadeFoundation, diamondFoundation, clubFoundation, heartFoundation]);

  return (
    <div className="solitaire">
      {gameWon ? <Confetti /> : ""}
      <h2 className="solitaire__title">Solitaire</h2>
      {/* <p className="solitaire__description-placeholder">
        Thank you for your interest! This page is still under development.
        Please come back another time!
      </p> */}

      {!gameActive ? (
        <button onClick={startSolitaireGame} className="game__btn">
          Start Game
        </button>
      ) : (
        <div className="solitaire__game">
          {areCardsDealt ? (
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
                  {isDrawPileEmpty ? (
                    ""
                  ) : (
                    <img
                      src={backOfCard}
                      alt="Card Back"
                      className="game__animation-card"
                    />
                  )}
                </button>
              </div>
              <div className="game__discard-pile">
                <p className="game__discard-title">Discard Pile</p>
                <button
                  type="button"
                  onClick={clickedDiscardPile}
                  className={`game__card-btn ${
                    discardPile.length === 0 ? "game__pile_empty" : ""
                  }`}
                >
                  {discardPile.length === 0 ? (
                    ""
                  ) : (
                    <Card
                      card={discardPile[discardPile.length - 1]}
                      moveCardListItem={moveCardListItem}
                      canBeFlipped={false}
                      id="discard"
                    />
                  )}
                </button>
              </div>
              <button
                className="game__btn"
                type="button"
                onClick={() => endSolitaireGame(false)}
              >
                End Game
              </button>
            </div>
          ) : (
            <button onClick={setupTabluea} className="solitaire__deal-btn">
              Deal the cards!
            </button>
          )}
          <div className="solitaire__game-area">
            <div className="solitaire__foundation-piles">
              <div className="solitaire__pile" ref={dropSpadeFoundation}>
                {isOverSpadeFoundation}
                {spadeFoundation.length === 0 ? (
                  <div className="solitaire__pile_empty">SPADE</div>
                ) : (
                  <Card
                    card={spadeFoundation[spadeFoundation.length - 1]}
                    moveCardListItem={moveCardListItem}
                    canBeFlipped={false}
                    id="Spade"
                  />
                )}
              </div>
              <div className="solitaire__pile" ref={dropHeartFoundation}>
                {isOverHeartFoundation}
                {heartFoundation.length === 0 ? (
                  <div className="solitaire__pile_empty solitaire__pile_red">
                    HEART
                  </div>
                ) : (
                  <Card
                    card={heartFoundation[heartFoundation.length - 1]}
                    moveCardListItem={moveCardListItem}
                    canBeFlipped={false}
                    id="Heart"
                  />
                )}
              </div>
              <div className="solitaire__pile" ref={dropClubFoundation}>
                {isOverClubFoundation}
                {clubFoundation.length === 0 ? (
                  <div className="solitaire__pile_empty">CLUB</div>
                ) : (
                  <Card
                    card={clubFoundation[clubFoundation.length - 1]}
                    moveCardListItem={moveCardListItem}
                    canBeFlipped={false}
                    id="Club"
                  />
                )}
              </div>
              <div className="solitaire__pile" ref={dropDiamondFoundation}>
                {isOverDiamondFoundation}
                {diamondFoundation.length === 0 ? (
                  <div className="solitaire__pile_empty solitaire__pile_red">
                    DIAMOND
                  </div>
                ) : (
                  <Card
                    card={diamondFoundation[diamondFoundation.length - 1]}
                    moveCardListItem={moveCardListItem}
                    canBeFlipped={false}
                    id="Diamond"
                  />
                )}
              </div>
            </div>
            <div className="solitaire__tableau">
              <div className="solitaire__tabluea-pile" ref={dropRefT1}>
                {isOverT1}
                {tabluea1.length === 0 ? (
                  <div className="solitaire__pile_empty"></div>
                ) : (
                  <div className="solitaire__stack">
                    {tabluea1.map((card) => {
                      if (card.isHidden) {
                        return (
                          <img
                            key={card}
                            src={backOfCard}
                            className="solitaire__card"
                          ></img>
                        );
                      } else {
                        return (
                          <div className="solitaire__card">
                            <Card
                              card={card}
                              moveCardListItem={moveCardListItem}
                              canBeFlipped={false}
                              id="Tabluea1"
                              key={card}
                              // isHidden={card.isHidden}
                            />
                          </div>
                        );
                      }
                    })}
                  </div>
                )}
              </div>
              <div className="solitaire__tabluea-pile" ref={dropRefT2}>
                {isOverT2}
                {tabluea2.length === 0 ? (
                  <div className="solitaire__pile_empty"></div>
                ) : (
                  <div className="solitaire__stack">
                    {tabluea2.map((card) => {
                      if (card.isHidden) {
                        return (
                          <img
                            src={backOfCard}
                            className="solitaire__card"
                          ></img>
                        );
                      } else {
                        return (
                          <div className="solitaire__card">
                            <Card
                              card={card}
                              moveCardListItem={moveCardListItem}
                              canBeFlipped={false}
                              id="Tabluea2"
                              key={card.code}
                              // isHidden={card.isHidden}
                            />
                          </div>
                        );
                      }
                    })}
                  </div>
                )}
              </div>
              <div className="solitaire__tabluea-pile" ref={dropRefT3}>
                {isOverT3}
                {tabluea3.length === 0 ? (
                  <div className="solitaire__pile_empty"></div>
                ) : (
                  <div className="solitaire__stack">
                    {tabluea3.map((card) => {
                      if (card.isHidden) {
                        return (
                          <img
                            src={backOfCard}
                            className="solitaire__card"
                          ></img>
                        );
                      } else {
                        return (
                          <div className="solitaire__card">
                            <Card
                              card={card}
                              moveCardListItem={moveCardListItem}
                              canBeFlipped={false}
                              id="Tabluea3"
                              key={card.code}
                              // isHidden={card.isHidden}
                            />
                          </div>
                        );
                      }
                    })}
                  </div>
                )}
              </div>
              <div className="solitaire__tabluea-pile" ref={dropRefT4}>
                {isOverT4}
                {tabluea4.length === 0 ? (
                  <div className="solitaire__pile_empty"></div>
                ) : (
                  <div className="solitaire__stack">
                    {tabluea4.map((card) => {
                      if (card.isHidden) {
                        return (
                          <img
                            src={backOfCard}
                            className="solitaire__card"
                          ></img>
                        );
                      } else {
                        return (
                          <div className="solitaire__card">
                            <Card
                              card={card}
                              moveCardListItem={moveCardListItem}
                              canBeFlipped={false}
                              id="Tabluea4"
                              key={card.code}
                              // isHidden={card.isHidden}
                            />
                          </div>
                        );
                      }
                    })}
                  </div>
                )}
              </div>
              <div className="solitaire__tabluea-pile" ref={dropRefT5}>
                {isOverT5}
                {tabluea5.length === 0 ? (
                  <div className="solitaire__pile_empty"></div>
                ) : (
                  <div className="solitaire__stack">
                    {tabluea5.map((card) => {
                      if (card.isHidden) {
                        return (
                          <img
                            src={backOfCard}
                            className="solitaire__card"
                          ></img>
                        );
                      } else {
                        return (
                          <div className="solitaire__card">
                            <Card
                              card={card}
                              moveCardListItem={moveCardListItem}
                              canBeFlipped={false}
                              id="Tabluea5"
                              key={card.code}
                              // isHidden={card.isHidden}
                            />
                          </div>
                        );
                      }
                    })}
                  </div>
                )}
              </div>
              <div className="solitaire__tabluea-pile" ref={dropRefT6}>
                {isOverT6}
                {tabluea6.length === 0 ? (
                  <div className="solitaire__pile_empty"></div>
                ) : (
                  <div className="solitaire__stack">
                    {tabluea6.map((card) => {
                      if (card.isHidden) {
                        return (
                          <img
                            src={backOfCard}
                            className="solitaire__card"
                          ></img>
                        );
                      } else {
                        return (
                          <div className="solitaire__card">
                            <Card
                              card={card}
                              moveCardListItem={moveCardListItem}
                              canBeFlipped={false}
                              id="Tabluea6"
                              key={card.code}
                              // isHidden={card.isHidden}
                            />
                          </div>
                        );
                      }
                    })}
                  </div>
                )}
              </div>
              <div className="solitaire__tabluea-pile" ref={dropRefT7}>
                {isOverT7}
                {tabluea7.length === 0 ? (
                  <div className="solitaire__pile_empty"></div>
                ) : (
                  <div className="solitaire__stack">
                    {tabluea7.map((card) => {
                      if (card.isHidden) {
                        return (
                          <img
                            src={backOfCard}
                            className="solitaire__card"
                          ></img>
                        );
                      } else {
                        return (
                          <div className="solitaire__card">
                            <Card
                              card={card}
                              moveCardListItem={moveCardListItem}
                              canBeFlipped={false}
                              id="Tabluea7"
                              key={card.code}
                              // isHidden={card.isHidden}
                            />
                          </div>
                        );
                      }
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Solitaire;
