import GamesList from "../GamesList/GamesList";
import Demo from "../Demo/Demo";
import "./Main.css";

function Main({
  gameInfo,
  handleGameStart,
  gameActive,
  handleGameEnd,
  pullCard,
  hand,
  setHand,
  handleCardLike,
  isDrawPileEmpty,
  handleDiscard,
  discardPile,
  isDiscardPileEmpty,
  isLoading,
  handleDiscardPileClick,
  isLoggedIn,
  animateCardDeal,
  closeGameSite
}) {
  return (
    <main>
      <section className="homepage">
        <h1 className="homepage__title">
          The Wright Collection of Card Games
        </h1>
        <p className="homepage__description">
          Select a game below! Click on a card to see a brief introduction.
        </p>
        <div className="homepage__grid">
          {
            <GamesList
              gameInfo={gameInfo}
              handleCardLike={handleCardLike}
              isLoggedIn={isLoggedIn}
              closeGameSite={closeGameSite}
            />
          }
        </div>
        <div className="homepage__demo">
          {
            <Demo
              handleGameStart={handleGameStart}
              gameActive={gameActive}
              handleGameEnd={handleGameEnd}
              pullCard={pullCard}
              hand={hand}
              setHand={setHand}
              isDrawPileEmpty={isDrawPileEmpty}
              handleDiscard={handleDiscard}
              discardPile={discardPile}
              isDiscardPileEmpty={isDiscardPileEmpty}
              isLoading={isLoading}
              handleDiscardPileClick={handleDiscardPileClick}
              animateCardDeal={animateCardDeal}
            />
          }
        </div>
        {/* <div className="homepage__reset-deck">
        </div> */}
      </section>
    </main>
  );
}

export default Main;
