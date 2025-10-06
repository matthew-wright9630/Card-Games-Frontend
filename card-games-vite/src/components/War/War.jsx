import "./War.css";

import { backOfCard } from "../../utils/constants";
import { useEffect, useRef, useState } from "react";
import { drawCard } from "../../utils/deckOfCardsApi";
import { getCardValue } from "../../utils/war";
import { useWindowSize } from "react-use";
import Confetti from "react-confetti";
// import { Client, Room } from "colyseus.js";

// const client = new Client("http://localhost:2567");

function War({
  handleGameIncrement,
  incrementGameWon,
  gameActive,
  handleGameStart,
  getCurrentGame,
  isDiscardPileEmpty,
  discardPile,
  handleDiscardPileClick,
  animateCardDeal,
  pullCardFromPile, //Need to check if this is needed later
  setDiscardPile,
  closeGameSite,
  setIsLoading,
  setErrorMessage,
  errorMessage,
  setIsDiscardPileEmpty,
  gameWon,
  setGameWon,
  areCardsDealt,
  setAreCardsDealt,
  room,
  setRoom,
  players,
  setPlayers,
}) {
  const [playerOneDeck, setPlayerOneDeck] = useState([]);
  const [playerTwoDeck, setPlayerTwoDeck] = useState([]);
  const [playerOneDiscard, setPlayerOneDiscard] = useState([]);
  const [playerTwoDiscard, setPlayerTwoDiscard] = useState([]);
  const [gameIsInPlay, setGameIsInPlay] = useState(false);
  const [roundIsInPlay, setRoundIsInPlay] = useState(false);
  const [playerOnePlayedCard, setPlayerOnePlayedCard] = useState({});
  const [playerTwoPlayedCard, setPlayerTwoPlayedCard] = useState({});
  const [cardsAreBeingDrawn, setCardsAreBeingDrawn] = useState(false);
  const [contestedCards, setContestedCards] = useState([]);
  const [isConnecting, setIsConnecting] = useState(true);
  // const roomRef = useRef(null);
  // const [players, setPlayers] = useState([]);

  function startWarGame() {
    setGameWon(false);
    handleGameStart(1); //Sets the localStorage.getItem("deck_id")
    dealCards();
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

  function toggleGameStart() {
    if (areCardsDealt) {
      setAreCardsDealt(false);
    } else {
      startWarGame();
      setAreCardsDealt(true);
    }
  }

  function dealCards() {
    setCardsAreBeingDrawn(false);
    const playerOneArray = [];
    const playerTwoArray = [];
    drawCard(localStorage.getItem("deck_id"), 52)
      .then((deck) => {
        for (let i = 1; i <= 52; i++) {
          if (i % 2 === 0) {
            playerTwoArray.push(deck.cards[i - 1]);
          } else {
            playerOneArray.push(deck.cards[i - 1]);
          }
          setTimeout(function timer() {
            if (i % 2 === 0) {
              animateCardDeal(45, -230, 100);
            } else {
              animateCardDeal(45, 230, 100);
            }
          }, i * 85);
        }
        setPlayerOneDeck(playerOneArray);
        setPlayerTwoDeck(playerTwoArray);
      })
      .then(() => {
        setTimeout(function timer() {
          setGameIsInPlay(true);
        }, 53 * 85);
      })
      .catch((err) => console.error(err));
  }

  function beginRound() {
    if (!playerOnePlayedCard && !playerTwoPlayedCard) {
      return;
    }
    setRoundIsInPlay(true);
    compareCards();
    return true;
  }

  function endRound() {
    setRoundIsInPlay(false);
  }

  function drawCards() {
    setCardsAreBeingDrawn(true);
    beginRound();
    playPlayerOne();
    playPlayerTwo();
  }

  function playPlayerOne() {
    const playerOneCard = playerOneDeck[playerOneDeck.length - 1];
    removeCardFromDeck(1);
    if (gameIsInPlay) {
      setTimeout(function timer() {
        setPlayerOnePlayedCard(playerOneCard);
        setCardsAreBeingDrawn(false);
      }, 360);
    }
  }

  function playPlayerTwo() {
    const playerTwoCard = playerTwoDeck[playerTwoDeck.length - 1];
    removeCardFromDeck(2);
    if (gameIsInPlay) {
      setTimeout(function timer() {
        setPlayerTwoPlayedCard(playerTwoCard);
        setCardsAreBeingDrawn(false);
      }, 360);
    }
  }

  function addToPlayerOneDiscard() {
    const cardOneEl = document.querySelector(".war__player-one-card");
    const cardTwoEl = document.querySelector(".war__player-two-card");
    const discardEl = document.querySelector(".war__discard__player-one");

    if (cardOneEl && cardTwoEl && discardEl) {
      flyCardToDiscard(cardOneEl, cardTwoEl, discardEl, () => {
        if (contestedCards.length !== 0) {
          setPlayerOneDiscard((prev) => [
            ...prev,
            ...contestedCards,
            playerTwoPlayedCard,
            playerOnePlayedCard,
          ]);
        } else {
          setPlayerOneDiscard((prev) => [
            ...prev,
            playerTwoPlayedCard,
            playerOnePlayedCard,
          ]);
        }
        setPlayerOnePlayedCard(null);
        setPlayerTwoPlayedCard(null);
      });
    }

    if (contestedCards.length > 0) {
      flyContestedCards(1);
    }
  }

  function addToPlayerTwoDiscard() {
    const cardOneEl = document.querySelector(".war__player-one-card");
    const cardTwoEl = document.querySelector(".war__player-two-card");
    const discardEl = document.querySelector(".war__discard__player-two");

    if (cardOneEl && cardTwoEl && discardEl) {
      flyCardToDiscard(cardTwoEl, cardOneEl, discardEl, () => {
        if (contestedCards.length !== 0) {
          setPlayerTwoDiscard((prev) => [
            ...prev,
            ...contestedCards,
            playerOnePlayedCard,
            playerTwoPlayedCard,
          ]);
        } else {
          setPlayerTwoDiscard((prev) => [
            ...prev,
            playerOnePlayedCard,
            playerTwoPlayedCard,
          ]);
        }
        setPlayerOnePlayedCard(null);
        setPlayerTwoPlayedCard(null);
      });
    }

    if (contestedCards.length > 0) {
      flyContestedCards(2);
    }
  }

  function addToContestedPiles() {
    const cardOneEl = document.querySelector(".war__player-one-card");
    const cardTwoEl = document.querySelector(".war__player-two-card");
    const contestedPileOne = document.querySelector(".war__contested-pile_one");
    const contestedPileTwo = document.querySelector(".war__contested-pile_two");

    flyToContestedPiles(
      cardOneEl,
      cardTwoEl,
      contestedPileOne,
      contestedPileTwo,
      () => {
        setContestedCards((prev) => [
          ...prev,
          playerOnePlayedCard,
          playerTwoPlayedCard,
        ]);
        setPlayerOnePlayedCard(null);
        setPlayerTwoPlayedCard(null);
      }
    );
  }

  function flyContestedCards(num) {
    const contestedDeckOne = document.querySelector(".war__contested-card_one");
    const contestedDeckTwo = document.querySelector(".war__contested-card_two");

    if (!contestedDeckOne || !contestedDeckTwo) return;

    const discardEl =
      num === 1
        ? document.querySelector(".war__discard__player-one")
        : document.querySelector(".war__discard__player-two");

    flyCardToDiscard(contestedDeckOne, contestedDeckTwo, discardEl, () => {
      setContestedCards([]);
    });
  }

  function flyCardToDiscard(cardOneEl, cardTwoEl, discardEl, onFinish) {
    const cloneOne = cardOneEl.cloneNode(true);
    cloneOne.style.position = "absolute";
    cloneOne.style.top = cardOneEl.offsetTop + "px";
    cloneOne.style.left = cardOneEl.offsetLeft + "px";
    cloneOne.style.zIndex = 4;
    cardOneEl.parentElement.appendChild(cloneOne);

    const cloneTwo = cardTwoEl.cloneNode(true);
    cloneTwo.style.position = "absolute";
    cloneTwo.style.top = cardTwoEl.offsetTop + "px";
    cloneTwo.style.left = cardTwoEl.offsetLeft + "px";
    cloneTwo.style.zIndex = 3;
    cardTwoEl.parentElement.appendChild(cloneTwo);

    const cardOneRect = cardOneEl.getBoundingClientRect();
    const cardTwoRect = cardTwoEl.getBoundingClientRect();
    const discardRect = discardEl.getBoundingClientRect();

    const dxOne = discardRect.left - cardOneRect.left;
    const dyOne = discardRect.top - cardOneRect.top;

    const dxTwo = discardRect.left - cardTwoRect.left;
    const dyTwo = discardRect.top - cardTwoRect.top;

    cloneOne
      .animate(
        [
          { transform: "translate(0,0)" },
          { transform: `translate(${dxOne}px, ${dyOne}px)` },
        ],
        { duration: 300 }
      )
      .finished.then(() => {
        cloneOne.remove();
        if (onFinish) onFinish();
      });

    cloneTwo
      .animate(
        [
          { transform: "translate(0,0)" },
          { transform: `translate(${dxTwo}px, ${dyTwo}px)` },
        ],
        { duration: 300 }
      )
      .finished.then(() => {
        cloneTwo.remove();
      });
  }

  function flyToContestedPiles(
    cardOneEl,
    cardTwoEl,
    contestOne,
    contestTwo,
    onFinish
  ) {
    const cloneOne = cardOneEl.cloneNode(true);
    cloneOne.style.position = "absolute";
    cloneOne.style.top = cardOneEl.offsetTop + "px";
    cloneOne.style.left = cardOneEl.offsetLeft + "px";
    cloneOne.style.zIndex = 4;
    cardOneEl.parentElement.appendChild(cloneOne);

    const cloneTwo = cardTwoEl.cloneNode(true);
    cloneTwo.style.position = "absolute";
    cloneTwo.style.top = cardTwoEl.offsetTop + "px";
    cloneTwo.style.left = cardTwoEl.offsetLeft + "px";
    cloneTwo.style.zIndex = 3;
    cardTwoEl.parentElement.appendChild(cloneTwo);

    const cardOneRect = cardOneEl.getBoundingClientRect();
    const cardTwoRect = cardTwoEl.getBoundingClientRect();
    const contestOneRect = contestOne.getBoundingClientRect();
    const contestTwoRect = contestTwo.getBoundingClientRect();

    const dxOne = contestOneRect.left - cardOneRect.left;
    const dyOne = contestOneRect.top - cardOneRect.top;

    const dxTwo = contestTwoRect.left - cardTwoRect.left;
    const dyTwo = cardTwoRect.top - cardTwoRect.top;

    cloneOne
      .animate(
        [
          { transform: "translate(0,0)" },
          { transform: `translate(${dxOne}px, ${dyOne}px)` },
        ],
        { duration: 300 }
      )
      .finished.then(() => {
        cloneOne.remove();
        if (onFinish) onFinish();
      });

    cloneTwo
      .animate(
        [
          { transform: "translate(0,0)" },
          { transform: `translate(${dxTwo}px, ${dyTwo}px)` },
        ],
        { duration: 300 }
      )
      .finished.then(() => {
        cloneTwo.remove();
      });
  }

  function removeCardFromDeck(playerNumber) {
    const newArray = [];
    if (playerNumber === 1) {
      for (let i = 0; i < playerOneDeck.length - 1; i++) {
        newArray.push(playerOneDeck[i]);
      }
      setPlayerOneDeck(newArray);
    } else {
      for (let i = 0; i < playerTwoDeck.length - 1; i++) {
        newArray.push(playerTwoDeck[i]);
      }
      setPlayerTwoDeck(newArray);
    }
  }

  async function compareCards() {
    const playerOneCardValue = getCardValue(playerOnePlayedCard);
    const playerTwoCardValue = getCardValue(playerTwoPlayedCard);
    if (Number(playerOneCardValue) > Number(playerTwoCardValue)) {
      addToPlayerOneDiscard();
      endRound();
    } else if (Number(playerOneCardValue) < Number(playerTwoCardValue)) {
      addToPlayerTwoDiscard();
      endRound();
    } else if (
      playerOneCardValue &&
      Number(playerOneCardValue) === Number(playerTwoCardValue)
    ) {
      addToContestedPiles();
      endRound();
    }
  }

  function checkDiscardOne() {
    setDiscardPile(playerOneDiscard);
    handleDiscardPileClick();
  }

  function checkDiscardTwo() {
    setDiscardPile(playerTwoDiscard);
    handleDiscardPileClick();
  }

  function getGame() {
    return getCurrentGame({
      name: "War",
      description: `War is a two player game where each player flips the top card of their deck and the highest card wins. 
    Game ends when one player has the entire deck`,
    });
  }

  useEffect(() => {
    if (cardsAreBeingDrawn) {
      //Animates moving the card from player 1 pile to the play area.
      const cardEl = document.querySelector(".war__card__player-one");
      const pileEl = document.querySelector(".war__play-pile__one");
      if (cardEl && pileEl) {
        const cardRect = cardEl.getBoundingClientRect();
        const pileRect = pileEl.getBoundingClientRect();
        const dx = pileRect.left - cardRect.left;
        const dy = pileRect.top - cardRect.top;

        animateCardDeal(dx, dy, 350, ".war__card__player-one");
      }
    }

    if (gameIsInPlay && playerOneDeck.length === 0) {
      const copyDeck = [...playerOneDiscard];
      setPlayerOneDeck([...copyDeck]);
      setPlayerOneDiscard([]);
    }
  }, [playerOneDeck]);

  useEffect(() => {
    if (cardsAreBeingDrawn) {
      const cardEl = document.querySelector(".war__card__player-two");
      const pileEl = document.querySelector(".war__play-pile__two");
      if (cardEl && pileEl) {
        const cardRect = cardEl.getBoundingClientRect();
        const pileRect = pileEl.getBoundingClientRect();
        const dx = pileRect.left - cardRect.left;
        const dy = pileRect.top - cardRect.top;

        animateCardDeal(dx, dy, 350, ".war__card__player-two");
      }
    }
    if (gameIsInPlay && playerTwoDeck.length === 0) {
      const copyDeck = [...playerTwoDiscard];
      setPlayerTwoDeck([...copyDeck]);
      setPlayerTwoDiscard([]);
    }
  }, [playerTwoDeck]);

  useEffect(() => {
    if (!playerOnePlayedCard || !playerTwoPlayedCard) {
      return;
    }
    if (
      Object.keys(playerOnePlayedCard).length !== 0 &&
      Object.keys(playerTwoPlayedCard).length !== 0
    ) {
      setTimeout(() => {
        compareCards();
      }, 1000);
    }
  }, [playerOnePlayedCard, playerTwoPlayedCard]);

  useEffect(() => {
    if (playerOneDeck.length === 0 && playerOneDiscard.length === 0) {
      setGameIsInPlay(false);
      setGameWon(true);
    }
    if (playerTwoDeck.length === 0 && playerTwoDiscard.length === 0) {
      setGameIsInPlay(false);
      setGameWon(true);
    }
  }, [playerOneDeck, playerTwoDeck, playerOneDiscard, playerTwoDiscard]);

  function endGame() {
    setGameIsInPlay(false);
    setPlayerOneDeck([]);
    setPlayerTwoDeck([]);
    setPlayerOneDiscard([]);
    setPlayerTwoDiscard([]);
    setContestedCards([]);
    setPlayerOnePlayedCard({});
    setPlayerTwoPlayedCard({});
    setAreCardsDealt(false);
    closeGameSite();
  }

  // useEffect(() => {
  //   const req = client.joinOrCreate("my_room", {});

  //   req.then((room) => {
  //     roomRef.current = room;

  //     setIsConnecting(false);

  //     room.onStateChange((state) => setPlayers(state.players.toJSON()));
  //   });

  //   return () => {
  //     // make sure to leave the room when the component is unmounted
  //     req.then((room) => room.leave());
  //   };
  // }, []);


  const { width, height } = useWindowSize();

  return (
    <div className="war">
      {areCardsDealt && gameWon ? (
        <Confetti width={width - 20} height={height + 150} />
      ) : (
        ""
      )}
      <h2 className="war__title">War</h2>

      <div className="war__game-area">
        <button className="end-game" onClick={endGame}>
          End Game
        </button>
        <div className="war__pile war__player-two-pile">
          <h3 className="war__paragraph">Player 2</h3>
          {areCardsDealt ? (
            <div className="war__player-area">
              <div>
                <button className="war__card-btn war__player-pile">
                  <img
                    key={playerTwoDeck[playerTwoDeck.length - 1]?.code}
                    src={backOfCard}
                    className="war__card war__card__player-two"
                  ></img>
                  <p className="war__paragraph">Draw Pile</p>
                </button>
              </div>
              <div>
                <button
                  onClick={checkDiscardTwo}
                  className="war__discard-btn war__card-btn war__player-pile"
                >
                  {playerTwoDeck.length > 0 ? (
                    <img
                      key={playerTwoDiscard[playerTwoDiscard.length - 1]?.code}
                      src={playerTwoDiscard[playerTwoDiscard.length - 1]?.image}
                      className="war__card war__discard__player-two"
                    ></img>
                  ) : (
                    ""
                  )}
                  <p className="war__paragraph">Discard Pile</p>
                </button>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
        {areCardsDealt ? (
          <div className="war__pile war__play-area">
            <div className="war__play-pile war__pile_empty war__contested-pile_two">
              {contestedCards.length !== 0 ? (
                <img
                  key={
                    contestedCards[contestedCards.length - 1]?.code ||
                    "empty-two"
                  }
                  src={contestedCards[contestedCards.length - 1]?.image}
                  alt={contestedCards[contestedCards.length - 1]?.code}
                  className="war__card war__contested-card_two"
                />
              ) : (
                ""
              )}
            </div>
            <div className="war__play-pile war__play-pile__two war__pile_empty">
              {playerTwoPlayedCard ? (
                <img
                  src={playerTwoPlayedCard.image}
                  alt={playerTwoPlayedCard.code}
                  className="war__card war__played-card war__player-two-card"
                />
              ) : (
                ""
              )}
            </div>
            {gameIsInPlay ? (
              ""
            ) : (
              <button
                onClick={toggleGameStart}
                className="war__reset war__card-btn"
              >
                <div className="war__pile__discard">
                  <div
                    className={`war__card-btn ${
                      isDiscardPileEmpty
                        ? "war__pile_empty war__discard-discard_empty"
                        : "war__pile"
                    }`}
                  ></div>
                </div>
                <div className="war__card">
                  {isDiscardPileEmpty ? (
                    <img
                      src={backOfCard}
                      alt="Card Back"
                      className="game__animation-card"
                    />
                  ) : (
                    ""
                  )}
                </div>
              </button>
            )}

            <div className="war__play-pile war__play-pile__one war__pile_empty">
              {playerOnePlayedCard ? (
                <img
                  src={playerOnePlayedCard.image}
                  alt={playerOnePlayedCard.code}
                  className="war__card war__played-card war__player-one-card"
                />
              ) : (
                ""
              )}
            </div>
            <div className="war__play-pile war__pile_empty war__contested-pile_one">
              {contestedCards.length !== 0 ? (
                <img
                  key={
                    contestedCards[contestedCards.length - 2]?.code ||
                    "empty-one"
                  }
                  src={contestedCards[contestedCards.length - 2]?.image}
                  alt={contestedCards[contestedCards.length - 2]?.code}
                  className="war__card war__contested-card_one"
                />
              ) : (
                ""
              )}
            </div>
          </div>
        ) : (
          <div className="war__start-game">
            <div className="war__pile__discard">
              <button
                type="button"
                className={`war__card-btn ${
                  isDiscardPileEmpty
                    ? "war__discard-discard_empty"
                    : "war__pile"
                }`}
              >
                {isDiscardPileEmpty ? (
                  <img src={backOfCard} alt="Card Back" className="war__card" />
                ) : (
                  ""
                )}
              </button>
            </div>
            <button onClick={toggleGameStart} className="solitaire__deal-btn">
              Deal the cards!
            </button>
          </div>
        )}
        <div className="war__pile war__player-one-pile">
          <h3 className="war__paragraph">Player 1</h3>
          {areCardsDealt ? (
            <div className="war__player-area">
              <div>
                <button
                  onClick={drawCards}
                  className="war__card-btn war__player-pile"
                >
                  <img
                    key={playerOneDeck[playerOneDeck.length - 1]?.code}
                    src={backOfCard}
                    className="war__card war__card__player-one"
                  ></img>
                  <p className="war__paragraph">Draw Pile</p>
                </button>
              </div>
              <div>
                <button
                  onClick={checkDiscardOne}
                  className="war__discard-btn war__card-btn war__player-pile"
                >
                  {playerOneDeck.length > 0 ? (
                    <img
                      key={playerOneDiscard[playerOneDiscard.length - 1]?.code}
                      src={playerOneDiscard[playerOneDiscard.length - 1]?.image}
                      className="war__card war__discard__player-one"
                    ></img>
                  ) : (
                    ""
                  )}
                  <p className="war__paragraph">Discard Pile</p>
                </button>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
}

export default War;
