import "./War.css";

import { backOfCard } from "../../utils/constants";
import { useEffect, useState } from "react";
import { drawCard } from "../../utils/deckOfCardsApi";
import { getCardValue } from "../../utils/war";

function War({
  handleGameIncrement,
  incrementGameWon,
  gameActive,
  handleGameStart,
  getCurrentGame,
  isDiscardPileEmpty,
  discardPile,
  handleDiscardPileClick, //Need to check if this is needed later
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
}) {
  const [playerOneDeck, setPlayerOneDeck] = useState([]);
  const [playerTwoDeck, setPlayerTwoDeck] = useState([]);
  const [playerOneDiscard, setPlayerOneDiscard] = useState([]);
  const [playerTwoDiscard, setPlayerTwoDiscard] = useState([]);
  const [discardDeck, setDiscardDeck] = useState([]);
  const [gameIsInPlay, setGameIsInPlay] = useState(false);
  const [roundIsInPlay, setRoundIsInPlay] = useState(false);
  const [playerOnePlayedCard, setPlayerOnePlayedCard] = useState({});
  const [playerTwoPlayedCard, setPlayerTwoPlayedCard] = useState({});
  const [cardsAreBeingDrawn, setCardsAreBeingDrawn] = useState(false);

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
      }, 510);
    }
  }

  function playPlayerTwo() {
    const playerTwoCard = playerTwoDeck[playerTwoDeck.length - 1];
    removeCardFromDeck(2);
    if (gameIsInPlay) {
      setTimeout(function timer() {
        setPlayerTwoPlayedCard(playerTwoCard);
        setCardsAreBeingDrawn(false);
      }, 510);
    }
  }

  function addToPlayerOneDiscard() {
    const cardOneEl = document.querySelector(".war__player-one-card");
    const cardTwoEl = document.querySelector(".war__player-two-card");
    const discardEl = document.querySelector(".war__discard__player-one");

    if (cardOneEl && cardTwoEl && discardEl) {
      flyCardToDiscard(cardOneEl, cardTwoEl, discardEl, () => {
        setPlayerOneDiscard((prev) => [
          ...prev,
          playerTwoPlayedCard,
          playerOnePlayedCard,
        ]);
        setPlayerOnePlayedCard(null);
        setPlayerTwoPlayedCard(null);
      });
    }
  }

  function addToPlayerTwoDiscard() {
    const cardOneEl = document.querySelector(".war__player-one-card");
    const cardTwoEl = document.querySelector(".war__player-two-card");
    const discardEl = document.querySelector(".war__discard__player-two");

    console.log(cardOneEl, cardTwoEl);

    if (cardOneEl && cardTwoEl && discardEl) {
      flyCardToDiscard(cardTwoEl, cardOneEl, discardEl, () => {
        setPlayerTwoDiscard((prev) => [
          ...prev,
          playerOnePlayedCard,
          playerTwoPlayedCard,
        ]);
        setPlayerOnePlayedCard(null);
        setPlayerTwoPlayedCard(null);
      });
    }
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
        { duration: 500 }
      )
      .finished.then(() => {
        cloneOne.remove();
        if (onFinish) onFinish();
      });

    cloneTwo.animate(
      [
        { transform: "translate(0,0)" },
        { transform: `translate(${dxTwo}px, ${dyTwo}px)` },
      ],
      { duration: 500 }
    );
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
    console.log(
      playerOneCardValue,
      playerTwoCardValue,
      playerOneCardValue < playerTwoCardValue
    );
    if (Number(playerOneCardValue) > Number(playerTwoCardValue)) {
      addToPlayerOneDiscard();
      endRound();
    } else if (Number(playerOneCardValue) < Number(playerTwoCardValue)) {
      addToPlayerTwoDiscard();
      endRound();
    } else {
      endRound();
      setDiscardDeck([
        ...discardDeck,
        playerOnePlayedCard,
        playerTwoPlayedCard,
      ]);
      setPlayerOnePlayedCard(false);
      setPlayerTwoPlayedCard(false);
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
    console.log("test");
    console.log(playerOnePlayedCard);
    if (cardsAreBeingDrawn) {
      const cardEl = document.querySelector(".war__card__player-one");
      const pileEl = document.querySelector(".war__play-pile__one");
      if (cardEl && pileEl) {
        const cardRect = cardEl.getBoundingClientRect();
        const pileRect = pileEl.getBoundingClientRect();
        const dx = pileRect.left - cardRect.left;
        const dy = pileRect.top - cardRect.top;

        animateCardDeal(dx, dy, 500, ".war__card__player-one");
      }
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

        animateCardDeal(dx, dy, 500, ".war__card__player-two");
      }
    }
  }, [playerTwoDeck]);

  // useEffect(() => {
  //   if (playerOnePlayedCard && playerTwoPlayedCard) {
  //     compareCards();
  // .then((returnValue) => {
  //   if (returnValue === 1) {
  //     addToPlayerOneDiscard();
  //   } else if (returnValue === 2) {
  //     addToPlayerTwoDiscard();
  //   }
  // });
  // .then(() => {
  //   setPlayerOnePlayedCard(false);
  //   setPlayerTwoPlayedCard(false);
  // });
  // }
  // }, [roundIsInPlay]);

  function test() {
    setPlayerOneDeck([]);
    setPlayerTwoDeck([]);
  }
  return (
    <div className="war">
      <h2 className="war__title">War</h2>

      <div className="war__game-area">
        <div className="war__pile war__player-two-pile">
          <h3 className="war__paragraph">Player 2</h3>
          <button onClick={test}>Test</button>
          {areCardsDealt ? (
            <div className="war__player-area">
              <div>
                <button className="war__card-btn war__player-pile">
                  {/* {playerTwoDeck.length > 0 ? ( */}
                  <img
                    key={playerTwoDeck[playerTwoDeck.length - 1]?.code}
                    src={backOfCard}
                    className="war__card war__card__player-two"
                  ></img>
                  {/* ) : (
                    ""
                  )} */}
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
            <div className="war__play-pile war__play-pile__two">
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
              <button onClick={beginRound} className="war__ready-btn">
                Ready
              </button>
            ) : (
              <button
                onClick={toggleGameStart}
                className="war__reset war__card-btn"
              >
                <div className="war__pile__discard">
                  <div
                    // onClick={discard}
                    className={`war__card-btn ${
                      isDiscardPileEmpty
                        ? "war__pile_empty war__discard-discard_empty"
                        : "war__pile"
                    }`}
                  >
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
                </div>
              </button>
            )}

            <div className="war__play-pile war__play-pile__one">
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
          </div>
        ) : (
          <div className="war__start-game">
            <div className="war__pile__discard">
              <button
                type="button"
                // onClick={discard}
                className={`war__card-btn ${
                  isDiscardPileEmpty
                    ? "war__pile_empty war__discard-discard_empty"
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
                  {/* {playerOneDeck.length > 0 ? ( */}
                  <img
                    key={playerOneDeck[playerOneDeck.length - 1]?.code}
                    src={backOfCard}
                    className="war__card war__card__player-one"
                  ></img>
                  {/* ) : (
                    ""
                  )} */}
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
