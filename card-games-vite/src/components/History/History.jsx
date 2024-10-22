import HistoryGrid from "../HistoryGrid/HistoryGrid";
import "./History.css";

/*
The history section will display how many rounds have been played, number of wins, and number of losses for each game.
Currently these values will be hard-coded, but future implementation will pull data from the database.
*/

function History({ gameInfo }) {
  return (
    <div className="history">
      {gameInfo.map((game) => {
        return <HistoryGrid game={game} key={game.id} />;
      })}
    </div>
  );
}

export default History;
