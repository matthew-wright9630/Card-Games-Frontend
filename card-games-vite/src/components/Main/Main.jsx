import GamesList from "../GamesList/GamesList";
import Demo from "../Demo/Demo";
import "./Main.css";
import Preloader from "../Preloader/Preloader";

function Main({
  gameInfo,
  handleGameStart,
  gameActive,
  handleGameEnd,
  pullCard,
  hand,
  handleCardLike,
  isDrawPileEmpty,
  handleDiscard,
  discardPile,
  isDiscardPileEmpty,
  isLoading,
  handleDiscardPileClick,
  isLoggedIn,
  handleGameIncrement,
  openGameSite
}) {
  return (
    <main>
      <section className="homepage">
        <p className="homepage__description">
          Select a game below! Hover to see a brief introduction
        </p>
        <div className="homepage__grid">
          {
            <GamesList
              gameInfo={gameInfo}
              handleCardLike={handleCardLike}
              isLoggedIn={isLoggedIn}
              handleGameIncrement={handleGameIncrement}
              openGameSite={openGameSite}
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
              isDrawPileEmpty={isDrawPileEmpty}
              handleDiscard={handleDiscard}
              discardPile={discardPile}
              isDiscardPileEmpty={isDiscardPileEmpty}
              isLoading={isLoading}
              handleDiscardPileClick={handleDiscardPileClick}
              handleGameIncrement={handleGameIncrement}
            />
          }
        </div>
      </section>
    </main>
  );
}

export default Main;
