import "./War.css";

import { backOfCard } from "../../utils/constants";
import { useEffect, useState } from "react";
import { drawCard } from "../../utils/deckOfCardsApi";

function War({
  handleGameIncrement,
  incrementGameWon,
  gameActive,
  handleGameStart,
  getCurrentGame,
  hand,
  setHand,
  isDiscardPileEmpty,
  discardPile,
  handleDiscardPileClick, //Need to check if this is needed later
  animateCardDeal,
  pullCardFromPile, //Need to check if this is needed later
  setDicardPile,
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
  const [roundIsInPlay, setRoundIsInPlay] = useState(false);
  const [playerOnePlayedCard, setPlayerOnePlayedCard] = useState({});
  const [playerTwoPlayedCard, setPlayerTwoPlayedCard] = useState({});

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
    const playerOneArray = [];
    const playerTwoArray = [];
    drawCard(localStorage.getItem("deck_id"), 52)
      .then((deck) => {
        for (let i = 1; i <= 52; i++) {
          if (i % 2 === 0) {
            playerTwoArray.push(deck.cards[i]);
          } else {
            playerOneArray.push(deck.cards[i]);
          }
          setTimeout(function timer() {
            if (i % 2 === 0) {
              animateCardDeal(0, -230, 100);
            } else {
              animateCardDeal(0, 230, 100);
            }
          }, i * 120);
        }
        setPlayerOneDeck(playerOneArray);
        setPlayerTwoDeck(playerTwoArray);
      })
      .then(() => {
        setTimeout(function timer() {
          beginRound();
        }, 53 * 120);
      })
      .catch((err) => console.error(err));
  }

  function beginRound() {
    setRoundIsInPlay(true);
    console.log("This is a test to begin the round");
  }

  function playRound() {
    playPlayerOne();
    playPlayerTwo();
  }

  function playPlayerOne() {
    if (roundIsInPlay) {
      console.log(playerOneDeck[playerOneDeck.length - 1]);
      animateCardDeal(94, -231, 500, ".war__card__player-one");
      setTimeout(function timer() {
        const playerOneCard = playerOneDeck[playerOneDeck.length - 1];
        setPlayerOnePlayedCard(playerOneCard);
        removeCardFromDeck(1);
      }, 510);
    }
  }

  function playPlayerTwo() {
    if (roundIsInPlay) {
      console.log(playerTwoDeck[playerTwoDeck.length - 1]);
      animateCardDeal(-94, 231, 500, ".war__card__player-two");
      setTimeout(function timer() {
        const playerTwoCard = playerTwoDeck[playerTwoDeck.length - 1];
        setPlayerTwoPlayedCard(playerTwoCard);
        removeCardFromDeck(2);
      }, 510);
    }
  }

  function removeCardFromDeck(playerNumber) {
    console.log(playerNumber);
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

  function getGame() {
    return getCurrentGame({
      name: "War",
      description: `War is a two player game where each player flips the top card of their deck and the highest card wins. 
    Game ends when one player has the entire deck`,
    });
  }

  return (
    <div className="war">
      <h2 className="war__title">War</h2>

      <div className="war__game-area">
        <div className="war__pile war__player-two-pile">
          <h3 className="war__player-title">Player 2</h3>
          {areCardsDealt ? (
            <button className="war__card-btn war__player-pile">
              <img
                key={playerTwoDeck[playerTwoDeck.length - 1]?.code}
                src={backOfCard}
                className="war__card war__card__player-two"
              ></img>
            </button>
          ) : (
            ""
          )}
        </div>
        {areCardsDealt ? (
          <div className="war__pile war__play-area">
            <div className="war__play-pile war__play-area__player-two">
              {playerTwoPlayedCard ? (
                <img
                  src={playerTwoPlayedCard.image}
                  alt={playerTwoPlayedCard.code}
                  className="war__card"
                />
              ) : (
                ""
              )}
            </div>
            {roundIsInPlay ? (
              ""
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

            <div className="war__play-pile war__play-area__player-one">
              {playerOnePlayedCard ? (
                <img
                  src={playerOnePlayedCard.image}
                  alt={playerOnePlayedCard.code}
                  className="war__card"
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
          {areCardsDealt ? (
            <button
              onClick={playRound}
              className="war__card-btn war__player-pile"
            >
              <img
                key={playerTwoDeck[playerTwoDeck.length - 1]?.code}
                src={backOfCard}
                className="war__card war__card__player-one"
              ></img>
            </button>
          ) : (
            ""
          )}
          <h3 className="war__player-title">Player 1</h3>
        </div>
      </div>
    </div>
  );
}

export default War;
