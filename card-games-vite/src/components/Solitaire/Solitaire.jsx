import "./Solitaire.css";
import { React, useCallback, useContext, useEffect, useState } from "react";
import { backOfCard } from "../../utils/constants";
import { useDrop } from "react-dnd";
import { useWindowSize } from "react-use";
import Confetti from "react-confetti";
import { CurrentUserContext } from "../../contexts/CurrentUserContext";
import {
  addCardsToPiles,
  drawCard,
  returnCardsFromPile,
} from "../../utils/deckOfCardsApi";
import Card from "../Card/Card";
import {
  checkCardFoundation,
  checkFoundationNumber,
  checkTablueaCardValid,
} from "../../utils/solitaire";
import SolitairePopup from "../SolitairePopup/SolitairePopup";

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
  discardPile,
  handleDiscardPileClick,
  animateCardDeal,
  setDiscardPile,
  setIsDrawPileEmpty,
  pullCardFromPile,
  closeGameSite,
  setIsLoading,
  setErrorMessage,
  errorMessage,
  handleSolitaireModalOpen,
  gameWon,
  setGameWon,
}) {
  const currentUser = useContext(CurrentUserContext);

  const [isGameDrawThree, setIsGameDrawThree] = useState(false);
  const [numberOfCards, setNumberOfCards] = useState(1);

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

  const [allCardsRevealed, setAllCardsRevealed] = useState(false);
  const [numberOfCardsHidden, setNumberOfCardsHidden] = useState(21);
  const [isStockPilesEmpty, setIsStockPilesEmpty] = useState(false);

  // const [gameWon, setGameWon] = useState(false);

  function openSolitaireModal() {
    handleSolitaireModalOpen();
  }

  function startSolitaireGame(number) {
    setGameWon(false);
    handleGameStart(1);
    setNumberOfCards(number);
  }

  function startSolitaireDrawOne() {
    startSolitaireGame(1);
    setIsGameDrawThree(false);
  }

  function startSolitaireDrawThree() {
    startSolitaireGame(3);
    setIsGameDrawThree(true);
  }

  function endSolitaireGame() {
    setAreCardsDealt(false);
    resetTabluea();
    setGameWon(false);
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
    setIsLoading(true);
    if (item.length === 3) {
      addCardsToPiles(
        localStorage.getItem("deck_id"),
        "discard",
        `${item[0].code},${item[1].code},${item[2].code},`
      )
        .then()
        .catch((err) => console.error(err))
        .finally(() => setIsLoading(false));
    } else if (item.length === 2) {
      addCardsToPiles(
        localStorage.getItem("deck_id"),
        "discard",
        `${item[0].code},${item[1].code},`
      )
        .then()
        .catch((err) => console.error(err))
        .finally(() => setIsLoading(false));
    } else {
      addCardsToPiles(localStorage.getItem("deck_id"), "discard", item[0].code)
        .then()
        .catch((err) => console.error(err))
        .finally(() => setIsLoading(false));
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
    setIsLoading(true);
    drawCard(localStorage.getItem("deck_id"), numberOfCards)
      .then((deck) => {
        if (deck.success) {
          setDiscardPile([...discardPile, ...deck.cards]);
          const drawnCards = [...deck.cards];
          discard(drawnCards);

          if (deck.remaining === 0) {
            setIsDrawPileEmpty(true);
          }
          if (window.innerWidth <= 550) {
            animateCardDeal(60, 0);
          } else if (window.innerWidth <= 795) {
            animateCardDeal(130, 0);
          } else {
            animateCardDeal(185, 0);
          }
        } else {
          if (deck.cards.length !== 0) {
            setDiscardPile([...discardPile, ...deck.cards]);
            const drawnCards = [...deck.cards];
            discard(drawnCards);
            setIsDrawPileEmpty(true);
          } else {
            returnCardsFromPile(localStorage.getItem("deck_id"), "discard")
              .then((res) => {
                setDiscardPile([]);
                setIsDrawPileEmpty(false);
              })
              .catch((err) => console.error(err));
          }
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
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
        } else {
          newArray.push(discardPile[i]);
        }
      }
      pullCardFromPile(localStorage.getItem("deck_id"), "discard", 1);
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
          if (
            card.code === newArray[newArray.length - 1].code &&
            card.isHidden === true
          ) {
            card.isHidden = false;
            setNumberOfCardsHidden(numberOfCardsHidden - 1);
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
          if (
            card.code === newArray[newArray.length - 1].code &&
            card.isHidden === true
          ) {
            card.isHidden = false;
            setNumberOfCardsHidden(numberOfCardsHidden - 1);
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
          if (
            card.code === newArray[newArray.length - 1].code &&
            card.isHidden === true
          ) {
            card.isHidden = false;
            setNumberOfCardsHidden(numberOfCardsHidden - 1);
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
          if (
            card.code === newArray[newArray.length - 1].code &&
            card.isHidden === true
          ) {
            card.isHidden = false;
            setNumberOfCardsHidden(numberOfCardsHidden - 1);
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
          if (
            card.code === newArray[newArray.length - 1].code &&
            card.isHidden === true
          ) {
            card.isHidden = false;
            setNumberOfCardsHidden(numberOfCardsHidden - 1);
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
          if (
            card.code === newArray[newArray.length - 1].code &&
            card.isHidden === true
          ) {
            card.isHidden = false;
            setNumberOfCardsHidden(numberOfCardsHidden - 1);
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
          if (
            card.code === newArray[newArray.length - 1].code &&
            card.isHidden === true
          ) {
            card.isHidden = false;
            setNumberOfCardsHidden(numberOfCardsHidden - 1);
          }
          return card;
        })
      );
    }
    if (cardToDiscard.id === "Spade") {
      for (let i = 0; i < spadeFoundation.length; i++) {
        if (cardToDiscard.card.code === spadeFoundation[i].code) {
          cardIsFound = true;
        }
        if (cardIsFound) {
          returnArray.push(spadeFoundation[i]);
        } else {
          newArray.push(spadeFoundation[i]);
        }
      }
      setSpadeFoundation(
        newArray.map((card) => {
          // if (card.code === newArray[newArray.length - 1].code) {
          //   card.isHidden = false;
          // }
          return card;
        })
      );
    }
    if (cardToDiscard.id === "Heart") {
      for (let i = 0; i < heartFoundation.length; i++) {
        if (cardToDiscard.card.code === heartFoundation[i].code) {
          cardIsFound = true;
        }
        if (cardIsFound) {
          returnArray.push(heartFoundation[i]);
        } else {
          newArray.push(heartFoundation[i]);
        }
      }
      setHeartFoundation(
        newArray.map((card) => {
          // if (card.code === newArray[newArray.length - 1].code) {
          //   card.isHidden = false;
          // }
          return card;
        })
      );
    }
    if (cardToDiscard.id === "Club") {
      for (let i = 0; i < clubFoundation.length; i++) {
        if (cardToDiscard.card.code === clubFoundation[i].code) {
          cardIsFound = true;
        }
        if (cardIsFound) {
          returnArray.push(clubFoundation[i]);
        } else {
          newArray.push(clubFoundation[i]);
        }
      }
      setClubFoundation(
        newArray.map((card) => {
          // if (card.code === newArray[newArray.length - 1].code) {
          //   card.isHidden = false;
          // }
          return card;
        })
      );
    }
    if (cardToDiscard.id === "Diamond") {
      for (let i = 0; i < diamondFoundation.length; i++) {
        if (cardToDiscard.card.code === diamondFoundation[i].code) {
          cardIsFound = true;
        }
        if (cardIsFound) {
          returnArray.push(diamondFoundation[i]);
        } else {
          newArray.push(diamondFoundation[i]);
        }
      }
      setDiamondFoundation(
        newArray.map((card) => {
          // if (card.code === newArray[newArray.length - 1].code) {
          //   card.isHidden = false;
          // }
          return card;
        })
      );
    }
    return returnArray;
  }

  function addToSpadeFoundation(item) {
    if (item.id === "Spade") {
      return;
    }
    if (!checkCardIsLast(item)) {
      setErrorMessage(
        "Card must be last in pile to be added to the foundation"
      );
      return;
    }
    if (checkCardFoundation(item.card, "Spade")) {
      if (
        spadeFoundation.length === 0 &&
        item.card.code.substring(0, 1) === "A"
      ) {
        setSpadeFoundation([...spadeFoundation, item.card]);
        findAndRemoveCardFromPile(item);
      } else if (spadeFoundation.length === 0) {
        setErrorMessage("The first card must be the Ace");
      } else if (
        checkFoundationNumber(
          item.card,
          spadeFoundation[spadeFoundation.length - 1]
        )
      ) {
        setSpadeFoundation([...spadeFoundation, item.card]);
        findAndRemoveCardFromPile(item);
      } else {
        setErrorMessage("Card cannot be added to pile");
      }
    } else {
      setErrorMessage("Card suit is not a spade.");
    }
  }

  function addToHeartFoundation(item) {
    if (item.id === "Heart") {
      return;
    }
    if (!checkCardIsLast(item)) {
      setErrorMessage(
        "Card must be last in pile to be added to the foundation"
      );
      return;
    }
    if (checkCardFoundation(item.card, "Heart")) {
      if (
        heartFoundation.length === 0 &&
        item.card.code.substring(0, 1) === "A"
      ) {
        setHeartFoundation([...heartFoundation, item.card]);
        findAndRemoveCardFromPile(item);
      } else if (heartFoundation.length === 0) {
        setErrorMessage("The first card must be the Ace");
      } else if (
        checkFoundationNumber(
          item.card,
          heartFoundation[heartFoundation.length - 1]
        )
      ) {
        setHeartFoundation([...heartFoundation, item.card]);
        findAndRemoveCardFromPile(item);
      } else {
        setErrorMessage("Card cannot be added to pile");
      }
    } else {
      setErrorMessage("Card suit is not a heart.");
    }
  }

  function addToClubFoundation(item) {
    if (item.id === "Club") {
      return;
    }
    if (!checkCardIsLast(item)) {
      setErrorMessage(
        "Card must be last in pile to be added to the foundation"
      );
      return;
    }
    if (checkCardFoundation(item.card, "Club")) {
      if (
        clubFoundation.length === 0 &&
        item.card.code.substring(0, 1) === "A"
      ) {
        setClubFoundation([...clubFoundation, item.card]);
        findAndRemoveCardFromPile(item);
      } else if (clubFoundation.length === 0) {
        setErrorMessage("The first card must be the Ace");
      } else if (
        checkFoundationNumber(
          item.card,
          clubFoundation[clubFoundation.length - 1]
        )
      ) {
        setClubFoundation([...clubFoundation, item.card]);
        findAndRemoveCardFromPile(item);
      } else {
        setErrorMessage("Card cannot be added to pile");
      }
    } else {
      setErrorMessage("Card suit is not a club.");
    }
  }

  function addToDiamondFoundation(item) {
    if (item.id === "Diamond") {
      return;
    }
    if (!checkCardIsLast(item)) {
      setErrorMessage(
        "Card must be last in pile to be added to the foundation"
      );
      return;
    }
    if (checkCardFoundation(item.card, "Diamond")) {
      if (
        diamondFoundation.length === 0 &&
        item.card.code.substring(0, 1) === "A"
      ) {
        setDiamondFoundation([...diamondFoundation, item.card]);
        findAndRemoveCardFromPile(item);
      } else if (diamondFoundation.length === 0) {
        setErrorMessage("The first card must be the Ace");
      } else if (
        checkFoundationNumber(
          item.card,
          diamondFoundation[diamondFoundation.length - 1]
        )
      ) {
        setDiamondFoundation([...diamondFoundation, item.card]);
        findAndRemoveCardFromPile(item);
      } else {
        setErrorMessage("Card cannot be added to pile");
      }
    } else {
      setErrorMessage("Card suit is not a diamond.");
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
    setIsLoading(true);
    drawCard(localStorage.getItem("deck_id"), 28)
      .then((deck) => {
        setNumberOfCardsHidden(21);
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
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));

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
      setErrorMessage("Card placement is not valid");
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
      setErrorMessage("Card placement is not valid");
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
      setErrorMessage("Card placement is not valid");
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
      setErrorMessage("Card placement is not valid");
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
      setErrorMessage("Card placement is not valid");
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
      setErrorMessage("Card placement is not valid");
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
      setErrorMessage("Card placement is not valid");
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
      if (currentUser) {
        incrementGameWin();
      }
    }
  }, [spadeFoundation, diamondFoundation, clubFoundation, heartFoundation]);

  useEffect(() => {
    console.log(gameWon, "Game won");
    if (numberOfCardsHidden <= 0 && gameActive) {
      setAllCardsRevealed(true);
      console.log(gameWon, "Game won");
    } else {
      setAllCardsRevealed(false);
    }
  }, [tabluea1, tabluea2, tabluea3, tabluea4, tabluea5, tabluea6, tabluea7]);

  useEffect(() => {
    if (isDrawPileEmpty && discardPile.length === 0) {
      setIsStockPilesEmpty(true);
    }
  }, [discardPile]);

  useEffect(() => {
    if (gameWon) {
      setTabluea1([]);
      setTabluea2([]);
      setTabluea3([]);
      setTabluea4([]);
      setTabluea5([]);
      setTabluea6([]);
      setTabluea7([]);
      setIsDrawPileEmpty(true);
      setDiscardPile([]);
    }
  }, [gameWon]);

  const { width, height } = useWindowSize();

  return (
    <div className="solitaire">
      {gameWon ? <Confetti width={width - 20} height={height + 500} /> : ""}
      <h2 className="solitaire__title">Solitaire</h2>
      <button
        onClick={() => {
          setDiscardPile([]);
        }}
      ></button>
      {!gameActive ? (
        <div className="solitaire__start">
          <button onClick={startSolitaireDrawOne} className="solitaire__btn">
            Start Game (draw 1 per card)
          </button>
          <button onClick={startSolitaireDrawThree} className="solitaire__btn">
            Start Game (draw 3 per card)
          </button>
        </div>
      ) : (
        <div className="solitaire__game">
          <button
            onClick={endSolitaireGame}
            className="solitaire__btn solitaire__btn_reset"
          >
            Reset Game
          </button>
          {areCardsDealt ? (
            <div className="solitaire__draw-discard-piles">
              <div className="solitaire__draw-pile">
                <p className="solitaire__draw-title">Draw Pile</p>
                <button
                  type="button"
                  onClick={draw}
                  className={`solitaire__card-btn ${
                    isDrawPileEmpty
                      ? "solitaire__pile_empty"
                      : "solitaire__pile"
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
              <div className="solitaire__discard-pile">
                <p className="solitaire__discard-title">Discard Pile</p>
                <button
                  type="button"
                  onClick={clickedDiscardPile}
                  className={`solitaire__card-btn ${
                    discardPile.length === 0 ? "solitaire__pile_empty" : ""
                  }`}
                >
                  {discardPile.length === 0 ? (
                    ""
                  ) : isGameDrawThree ? (
                    <div className="solitaire__discard-pile-three">
                      {discardPile.length >= 3 && (
                        <img
                          className="solitaire__card-discard solitaire__card-discard_first"
                          src={discardPile[discardPile.length - 3].image}
                          alt={discardPile[discardPile.length - 3].code}
                        />
                      )}
                      {discardPile.length >= 2 && (
                        <img
                          className="solitaire__card-discard solitaire__card-discard_second"
                          src={discardPile[discardPile.length - 2].image}
                          alt={discardPile[discardPile.length - 2].code}
                        />
                      )}
                      <div className="solitaire__card solitaire__card-discard">
                        <Card
                          card={discardPile[discardPile.length - 1]}
                          moveCardListItem={moveCardListItem}
                          canBeFlipped={false}
                          id="discard"
                        />
                      </div>
                    </div>
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
              <div className="solitaire__foundation-piles">
                <div
                  className="solitaire__pile solitaire__pile_spade"
                  ref={dropSpadeFoundation}
                >
                  {isOverSpadeFoundation}
                  {gameWon ? (
                    <img
                      src="https://deckofcardsapi.com/static/img/KS.png"
                      alt="King of Spades"
                      className="solitaire__pile solitaire__foundation_complete"
                    />
                  ) : spadeFoundation.length === 0 ? (
                    <div className="solitaire__foundation-pile_empty">
                      SPADE
                    </div>
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
                  {gameWon ? (
                    <img
                      src="https://deckofcardsapi.com/static/img/KH.png"
                      alt="King of Hearts"
                      className="solitaire__pile solitaire__foundation_complete"
                    />
                  ) : heartFoundation.length === 0 ? (
                    <div className="solitaire__foundation-pile_empty solitaire__pile_red">
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
                  {gameWon ? (
                    <img
                      src="https://deckofcardsapi.com/static/img/KC.png"
                      alt="King of Clubs"
                      className="solitaire__pile solitaire__foundation_complete"
                    />
                  ) : clubFoundation.length === 0 ? (
                    <div className="solitaire__foundation-pile_empty">CLUB</div>
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
                  {gameWon ? (
                    <img
                      src="https://deckofcardsapi.com/static/img/KD.png"
                      alt="King of Diamonds"
                      className="solitaire__pile solitaire__foundation_complete"
                    />
                  ) : diamondFoundation.length === 0 ? (
                    <div className="solitaire__foundation-pile_empty solitaire__pile_red">
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
            </div>
          ) : (
            <button onClick={setupTabluea} className="solitaire__deal-btn">
              Deal the cards!
            </button>
          )}
          {
            <p
              className={`solitaire__error ${
                errorMessage === "No Errors"
                  ? "solitaire__error_hidden"
                  : "solitaire__error_visible"
              }`}
            >
              {errorMessage}
            </p>
          }
          {/* Below functions checks if there are no hidden cards. It then checks if the game is draw one or draw three.
              If it is draw one, then the auto-complete button becomes displayed.
              If it is draw three, it checks that the draw and discard piles are empty before the button is displayed. */}
          {allCardsRevealed ? (
            isGameDrawThree ? (
              isStockPilesEmpty ? (
                <button
                  onClick={openSolitaireModal}
                  className="solitaire__popup-btn"
                >
                  Auto-complete?
                </button>
              ) : (
                ""
              )
            ) : (
              <button
                onClick={openSolitaireModal}
                className="solitaire__popup-btn"
              >
                Auto-complete?
              </button>
            )
          ) : (
            ""
          )}
          <div className="solitaire__game-area">
            <div className="solitaire__tableau" id="solitaire__tabluea">
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
