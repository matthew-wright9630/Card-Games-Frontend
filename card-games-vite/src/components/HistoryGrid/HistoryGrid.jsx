import "./HistoryGrid.css";

function HistoryGrid({ game, handleDeleteGameInfo, handleDeleteClick }) {
  function deleteRow() {
    handleDeleteGameInfo(game._id);
  }
  function deleteIsClicked() {
    handleDeleteClick(game, handleDeleteGameInfo);
  }
  return (
    <div className="history__grid-row">
      <p className="history__grid-item">{game.name} </p>
      <div>
        <p className="history__grid-item">Played: {game.gamesPlayed} </p>
        <p className="history__grid-item">Won: {game.gamesWon} </p>
        <p className="history__grid-item">
          Lost: {game.gamesPlayed - game.gamesWon}
          {""}
        </p>
      </div>
      <button
        type="button"
        onClick={deleteIsClicked}
        className="history__delete-btn history__grid-item"
      >
        Delete Row History
      </button>
    </div>
  );
}

export default HistoryGrid;
