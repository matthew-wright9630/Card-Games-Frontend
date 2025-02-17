import "./War.css";

import { backOfCard } from "../../utils/constants";

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

  function testGameStart() {
    if (areCardsDealt) {
      setAreCardsDealt(false);
    } else {
      setAreCardsDealt(true);
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
      <p className="war__description-placeholder">
        Thank you for your interest! This page is still under development.
        Please come back another time!
      </p>

      <div className="war__game-area">
        <div className="war__pile war__player-two-pile">
          <h3 className="war__player-title">Player 2</h3>
        </div>
        {areCardsDealt ? (
          <div className="war__pile war__play-area">
            <button onClick={testGameStart} className="test">
              Test - Reset Game
            </button>
            <div className="war__play-pile war__play-area__player-one"></div>
            <div className="war__play-pile war__play-area__player-two"></div>
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
                  <img
                    src={backOfCard}
                    alt="Card Back"
                    className="game__animation-card"
                  />
                ) : (
                  ""
                )}
              </button>
            </div>
            <button onClick={testGameStart} className="solitaire__deal-btn">
              Deal the cards!
            </button>
          </div>
        )}

        {/* <div className="war__piles__discard">discard Pile</div> */}
        {/* <div className="war__piles__discard">
            <p className="war__piles__discard-title">discard Pile</p>
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
                <img
                  src={backOfCard}
                  alt="Card Back"
                  className="game__animation-card"
                />
              ) : (
                ""
              )}
            </button>
          </div> */}
        <div className="war__pile war__player-one-pile">
          <h3 className="war__player-title">Player 1</h3>
        </div>
      </div>
    </div>
  );
}

export default War;
