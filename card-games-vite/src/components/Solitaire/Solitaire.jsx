import "./Solitaire.css";
import { React, useCallback, useContext, useState } from "react";
import { backOfCard } from "../../utils/constants";
import { useDrop } from "react-dnd";
import { CurrentUserContext } from "../../contexts/CurrentUserContext";
import {
  addCardsToPiles,
  drawCard,
  drawFromPile,
  listCardsInPile,
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
  addCard,
  pullCardFromPile,
  pullCardFromDiscard,
  setDiscardPile,
  updateDiscardPile,
}) {
  const currentUser = useContext(CurrentUserContext);

  const [isSpadePileEmpty, setIsSpadePileEmpty] = useState(true);
  const [isHeartPileEmpty, setIsHeartPileEmpty] = useState(true);
  const [isClubPileEmpty, setIsClubPileEmpty] = useState(true);
  const [isDiamondPileEmpty, setIsDiamondPileEmpty] = useState(true);

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

  function startSolitaireGame() {
    handleGameStart(1);
    incrementGame();
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
    if (item.id === "tabluea3") {
      return item.card === tabluea3[tabluea3.length - 1];
    }
    if (item.id === "tabluea4") {
      return item.card === tabluea4[tabluea4.length - 1];
    }
    if (item.id === "tabluea5") {
      return item.card === tabluea5[tabluea5.length - 1];
    }
    if (item.id === "tabluea6") {
      return item.card === tabluea6[tabluea6.length - 1];
    }
    if (item.id === "tabluea7") {
      return item.card === tabluea7[tabluea7.length - 1];
    }
  }

  function findAndRemoveCardFromPile(cardToDiscard) {
    const newArray = [];
    const returnArray = [];
    let cardIsFound = false;
    if (cardToDiscard.id === "discard") {
      discardPile.map((card) => {
        if (card.code !== cardToDiscard.card.code) {
          newArray.push(card);
        }
      });
      setDiscardPile(newArray);
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
      setTabluea1(newArray);
      return returnArray;
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
      setTabluea2(newArray);
      return returnArray;
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
      setTabluea3(newArray);
      return returnArray;
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
      setTabluea4(newArray);
      return returnArray;
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
      setTabluea5(newArray);
      return returnArray;
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
      setTabluea6(newArray);
      return returnArray;
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
      setTabluea7(newArray);
      return returnArray;
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
        setIsSpadePileEmpty(false);
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
        setIsHeartPileEmpty(false);
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
        setIsClubPileEmpty(false);
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
        setIsDiamondPileEmpty(false);
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
      })
      .catch((err) => console.error(err));
  }

  function addToTabluea1(item) {
    if (item.id === "Tabluea1") {
      return;
    }

    if (tabluea1.length === 0 && item.card.code.substring(0, 1) === "K") {
      setTabluea1([...tabluea1, item.card]);
      findAndRemoveCardFromPile(item);
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
      setTabluea2([...tabluea2, item.card]);
      findAndRemoveCardFromPile(item);
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
      setTabluea3([...tabluea3, item.card]);
      findAndRemoveCardFromPile(item);
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
      setTabluea4([...tabluea4, item.card]);
      findAndRemoveCardFromPile(item);
    } else if (
      checkTablueaCardValid(item.card, tabluea4[tabluea2.length - 1])
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
      setTabluea5([...tabluea5, item.card]);
      findAndRemoveCardFromPile(item);
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
      setTabluea6([...tabluea6, item.card]);
      findAndRemoveCardFromPile(item);
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
      setTabluea7([...tabluea7, item.card]);
      findAndRemoveCardFromPile(item);
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

  function test() {
    console.log(tabluea2);
    console.log(spadeFoundation);
  }

  function setupTest() {
    setupTabluea();
  }

  return (
    <div className="solitaire">
      <button onClick={test}>Test</button>
      <button onClick={setupTest}>Setup Tabluea</button>
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
            <div className="game__discard-pile">
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
                  <Card
                    card={discardPile[discardPile.length - 1]}
                    moveCardListItem={moveCardListItem}
                    canBeFlipped={false}
                    id="discard"
                  />
                )}
              </button>
            </div>
          </div>
          <div className="solitaire__game-area">
            <div className="solitaire__foundation-piles">
              <div className="solitaire__pile" ref={dropSpadeFoundation}>
                {isOverSpadeFoundation}
                {isSpadePileEmpty ? (
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
                {isHeartPileEmpty ? (
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
                {isClubPileEmpty ? (
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
                {isDiamondPileEmpty ? (
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
                  <div className="solitaire__pile_empty">Test</div>
                ) : (
                  <div className="solitaire__stack">
                    {tabluea1.map((card) => {
                      return (
                        <div className="solitaire__card">
                          <Card
                            card={card}
                            moveCardListItem={moveCardListItem}
                            canBeFlipped={false}
                            id="Tabluea1"
                            key={card.code}
                          />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              <div className="solitaire__tabluea-pile" ref={dropRefT2}>
                {isOverT2}
                {tabluea2.length === 0 ? (
                  <div className="solitaire__pile_empty">Test</div>
                ) : (
                  <div className="solitaire__stack">
                    {tabluea2.map((card) => {
                      return (
                        <div className="solitaire__card">
                          <Card
                            card={card}
                            moveCardListItem={moveCardListItem}
                            canBeFlipped={false}
                            id="Tabluea2"
                            key={card.code}
                          />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              <div className="solitaire__tabluea-pile" ref={dropRefT3}>
                {isOverT3}
                {tabluea3.length === 0 ? (
                  <div className="solitaire__pile_empty">Test</div>
                ) : (
                  <div className="solitaire__stack">
                    {tabluea3.map((card) => {
                      return (
                        <div className="solitaire__card">
                          <Card
                            card={card}
                            moveCardListItem={moveCardListItem}
                            canBeFlipped={false}
                            id="Tabluea3"
                            key={card.code}
                          />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              <div className="solitaire__tabluea-pile" ref={dropRefT4}>
                {isOverT4}
                {tabluea4.length === 0 ? (
                  <div className="solitaire__pile_empty">Test</div>
                ) : (
                  <div className="solitaire__stack">
                    {tabluea4.map((card) => {
                      return (
                        <div className="solitaire__card">
                          <Card
                            card={card}
                            moveCardListItem={moveCardListItem}
                            canBeFlipped={false}
                            id="Tabluea4"
                            key={card.code}
                          />
                        </div>
                      );
                    })}{" "}
                  </div>
                )}
              </div>
              <div className="solitaire__tabluea-pile" ref={dropRefT5}>
                {isOverT5}
                {tabluea5.length === 0 ? (
                  <div className="solitaire__pile_empty">Test</div>
                ) : (
                  <div className="solitaire__stack">
                    {tabluea5.map((card) => {
                      return (
                        <div className="solitaire__card">
                          <Card
                            card={card}
                            moveCardListItem={moveCardListItem}
                            canBeFlipped={false}
                            id="Tabluea5"
                            key={card.code}
                          />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              <div className="solitaire__tabluea-pile" ref={dropRefT6}>
                {isOverT6}
                {tabluea6.length === 0 ? (
                  <div className="solitaire__pile_empty">Test</div>
                ) : (
                  <div className="solitaire__stack">
                    {tabluea6.map((card) => {
                      return (
                        <div className="solitaire__card">
                          <Card
                            card={card}
                            moveCardListItem={moveCardListItem}
                            canBeFlipped={false}
                            id="Tabluea6"
                            key={card.code}
                          />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              <div className="solitaire__tabluea-pile" ref={dropRefT7}>
                {isOverT7}
                {tabluea7.length === 0 ? (
                  <div className="solitaire__pile_empty">Test</div>
                ) : (
                  <div className="solitaire__stack">
                    {tabluea7.map((card) => {
                      return (
                        <div className="solitaire__card">
                          <Card
                            card={card}
                            moveCardListItem={moveCardListItem}
                            canBeFlipped={false}
                            id="Tabluea7"
                            key={card.code}
                          />
                        </div>
                      );
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
