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
  handleCardLike,
}) {
  return (
    <main>
      <section className="homepage">
        <p className="homepage__description">
          Select a game below! Hover to see a brief introduction
        </p>
        <div className="homepage__grid">
          {<GamesList gameInfo={gameInfo} handleCardLike={handleCardLike} />}
        </div>
        <div className="homepage__demo">
          {
            <Demo
              handleGameStart={handleGameStart}
              gameActive={gameActive}
              handleGameEnd={handleGameEnd}
              pullCard={pullCard}
              hand={hand}
            />
          }
        </div>
      </section>
    </main>
  );
}

export default Main;
