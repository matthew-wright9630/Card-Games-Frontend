import GamesList from "../GamesList/GamesList";
import "./Main.css";

function Main() {
  return (
    <main>
      <section className="homepage">
        <p className="homepage__description">
          Select a game below! Hover to see a brief introduction
        </p>
        <div className="homepage__grid">{<GamesList />}</div>
      </section>
    </main>
  );
}

export default Main;
