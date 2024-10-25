import HistoryGrid from "../HistoryGrid/HistoryGrid";
import "./History.css";
import { CurrentUserContext } from "../../contexts/CurrentUserContext";
import { useContext } from "react";

/*
The history section will display how many rounds have been played, number of wins, and number of losses for each game.
Currently these values will be hard-coded, but future implementation will pull data from the database.
*/

function History({ gameInfo }) {
  const currentUser = useContext(CurrentUserContext);
  return (
    <div className="history">
      {gameInfo.data
        ?.filter((game) => {
          const isOwn = game?.user[0] == currentUser._id;
          return isOwn;
        })
        ?.map((game) => {
          return <HistoryGrid game={game} key={game._id} />;
        })}
    </div>
  );
}

export default History;
