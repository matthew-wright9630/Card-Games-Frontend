import GamesList from "../GamesList/GamesList";
import Demo from "../Demo/Demo";
import "./Main.css";

function Main({ handleGameStart, gameActive, handleGameEnd }) {
  return (
    <main>
      <section className="homepage">
        <p className="homepage__description">
          Select a game below! Hover to see a brief introduction
        </p>
        <div className="homepage__grid">{<GamesList />}</div>
        <div className="homepage__demo">
          {
            <Demo
              handleGameStart={handleGameStart}
              gameActive={gameActive}
              handleGameEnd={handleGameEnd}
            />
          }
        </div>
      </section>
    </main>
  );
}

export default Main;
