import "./HistoryGrid.css";

function HistoryGrid(game) {
  return (
    <div className="history__grid-row">
      <p className="history__grid-item">{game.game.name} </p>
      <div>
        <p className="history__grid-item">Played: {game.game.gamesPlayed} </p>
        <p className="history__grid-item">Won: {game.game.gamesWon} </p>
        <p className="history__grid-item">Lost: {game.game.gamesLost} </p>
      </div>
    </div>
  );
}

export default HistoryGrid;
