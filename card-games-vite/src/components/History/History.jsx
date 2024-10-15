import "./History.css";

/*
The history section will display how many rounds have been played, number of wins, and number of losses for each game.
Currently these values will be hard-coded, but future implementation will pull data from the database.
*/

function History(gameInfo) {
  console.log("History", gameInfo.gameInfo.gameInfo);
  return (
    <div className="history">
      <div className="history__grid">
        {gameInfo.gameInfo.gameInfo.map((game) => {
          return (
            <div className="history__grid-row">
              <p className="history__grid-item">{game.name} </p>
              <p className="history__grid-item">Played: {game.gamesPlayed} </p>
              <p className="history__grid-item">Won: {game.gamesWon} </p>
              <p className="history__grid-item">Lost: {game.gamesLost} </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default History;
