import "./HistoryGrid.css";

function HistoryGrid({ game }) {
  return (
    <div className="history__grid-row">
      <p className="history__grid-item">{game.name} </p>
      <div>
        <p className="history__grid-item">Played: {game.gamesPlayed} </p>
        <p className="history__grid-item">Won: {game.gamesWon} </p>
        <p className="history__grid-item">
          Lost: {game.gamesPlayed - game.gamesWon}{" "}
        </p>
      </div>
    </div>
  );
}

export default HistoryGrid;
