import "./Solitaire.css";
import { React, useCallback, useContext, useState } from "react";
import { backOfCard } from "../../utils/constants";
import { useDrop } from "react-dnd";
import { CurrentUserContext } from "../../contexts/CurrentUserContext";
import {
  drawCard,
  drawFromPile,
  listCardsInPile,
} from "../../utils/deckOfCardsApi";
import Card from "../Card/Card";
import {
  checkCardFoundation,
  checkFoundationNumber,
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
    incrementGame();
    setupTabluea();
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
    handleDiscardPileClick();
  }

  function discard(item) {
    addToDiscard(item);
  }

  function findAndRemoveCardFromPile(cardToDiscard) {
    console.log(cardToDiscard);
    pullCardFromPile(localStorage.getItem("deck_id"), cardToDiscard.id);
    if (cardToDiscard.id === "discard") {
      updateDiscardPile(localStorage.getItem("deck_id"));
    } else if (cardToDiscard.id === "Tabluea1") {
      listCardsInPile(deck, "Tabluea1").then((res) => {
        setTabluea1(
          res.piles.Tabluea1.cards?.map((card) => {
            return card;
          })
        );
      });
    } else if (cardToDiscard.id === "Tabluea2") {
      listCardsInPile(deck, "Tabluea2").then((res) => {
        setTabluea2(
          res.piles.Tabluea2.cards?.map((card) => {
            return card;
          })
        );
      });
    } else if (cardToDiscard.id === "Tabluea3") {
      listCardsInPile(deck, "Tabluea3").then((res) => {
        setTabluea3(
          res.piles.Tabluea3.cards?.map((card) => {
            return card;
          })
        );
      });
    } else if (cardToDiscard.id === "Tabluea4") {
      listCardsInPile(deck, "Tabluea4").then((res) => {
        setTabluea4(
          res.piles.Tabluea4.cards?.map((card) => {
            return card;
          })
        );
      });
    } else if (cardToDiscard.id === "Tabluea5") {
      listCardsInPile(deck, "Tabluea5").then((res) => {
        setTabluea5(
          res.piles.Tabluea5.cards?.map((card) => {
            return card;
          })
        );
      });
    } else if (cardToDiscard.id === "Tabluea6") {
      listCardsInPile(deck, "Tabluea6").then((res) => {
        setTabluea6(
          res.piles.Tabluea6.cards?.map((card) => {
            return card;
          })
        );
      });
    } else if (cardToDiscard.id === "Tabluea7") {
      listCardsInPile(deck, "Tabluea7").then((res) => {
        setTabluea7(
          res.piles.Tabluea7.cards?.map((card) => {
            return card;
          })
        );
      });
    }
  }

  function addToPile(pileName, card) {
    addCard(localStorage.getItem("deck_id"), pileName, card);
  }

  function addToSpadeFoundation(item) {
    console.log(item);
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
        console.log(deck.cards[0]);
        addToTabluea1(deck.cards[0]);
        for (let i = 1; i < 3; i++) {
          addToTabluea2(deck.cards[i]);
        }
      })
      // .then((deck) => {
      //   console.log(deck);
      //   setTabluea1(
      //     deck.cards?.map((card) => {
      //       console.log(card);
      //       return card;
      //     })
      //   );
      // })
      // .then(
      //   drawCard(localStorage.getItem("deck_id"), 2).then((deck) => {
      //     setTabluea2(
      //       deck.cards?.map((card) => {
      //         console.log(card);
      //         return card;
      //       })
      //     );
      //   })
      // )
      // .then(
      //   drawCard(localStorage.getItem("deck_id"), 3).then((deck) => {
      //     setTabluea3(
      //       deck.cards?.map((card) => {
      //         return card;
      //       })
      //     );
      //   })
      // )
      // .then(
      //   drawCard(localStorage.getItem("deck_id"), 4).then((deck) => {
      //     setTabluea4(
      //       deck.cards?.map((card) => {
      //         return card;
      //       })
      //     );
      //   })
      // )
      // .then(
      //   drawCard(localStorage.getItem("deck_id"), 5).then((deck) => {
      //     setTabluea5(
      //       deck.cards?.map((card) => {
      //         return card;
      //       })
      //     );
      //   })
      // )
      // .then(
      //   drawCard(localStorage.getItem("deck_id"), 6).then((deck) => {
      //     setTabluea6(
      //       deck.cards?.map((card) => {
      //         return card;
      //       })
      //     );
      //   })
      // )
      // .then(
      //   drawCard(localStorage.getItem("deck_id"), 7).then((deck) => {
      //     setTabluea7(
      //       deck.cards?.map((card) => {
      //         return card;
      //       })
      //     );
      //   })
      // )
      // .then(
      //   listCardsInPile(localStorage.getItem("deck_id", "discard")).then(
      //     (res) => {
      //       console.log(res);
      //     }
      //   )
      // )
      .catch((err) => console.error(err));
  }

  function addToTabluea1(item) {
    console.log(item);
    addToPile("Tabluea1", item);
    setTabluea1([...tabluea1, item]);
  }

  const [{ isOverT1 }, dropRefT1] = useDrop({
    accept: "card",
    drop: (item) => addToTabluea1(item),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  function addToTabluea2(item) {
    console.log(item);
    addToPile("Tabluea2", item);
    setTabluea2([...tabluea2, item]);
  }

  const [{ isOverT2 }, dropRefT2] = useDrop({
    accept: "card",
    drop: (item) => addToTabluea2(item),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  function addToTabluea3(item) {
    console.log(item);
  }

  const [{ isOverT3 }, dropRefT3] = useDrop({
    accept: "card",
    drop: (item) => addToTabluea3(item),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  function addToTabluea4(item) {
    console.log(item);
  }

  const [{ isOverT4 }, dropRefT4] = useDrop({
    accept: "card",
    drop: (item) => addToTabluea4(item),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  function addToTabluea5(item) {
    console.log(item);
  }

  const [{ isOverT5 }, dropRefT5] = useDrop({
    accept: "card",
    drop: (item) => addToTabluea5(item),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  function addToTabluea6(item) {
    console.log(item);
  }

  const [{ isOverT6 }, dropRefT6] = useDrop({
    accept: "card",
    drop: (item) => addToTabluea6(item),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  function addToTabluea7(item) {
    console.log(item);
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
  }

  return (
    <div className="solitaire">
      <button onClick={test}>Test</button>
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
              <div className="solitaire__pile" ref={dropRefT1}>
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
              <div className="solitaire__pile" ref={dropRefT2}>
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
              <div className="solitaire__pile" ref={dropRefT3}>
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
              <div className="solitaire__pile" ref={dropRefT4}>
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
              <div className="solitaire__pile" ref={dropRefT5}>
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
              <div className="solitaire__pile" ref={dropRefT6}>
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
              <div className="solitaire__pile" ref={dropRefT7}>
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
