import HistoryGrid from "../HistoryGrid/HistoryGrid";
import "./History.css";
import { CurrentUserContext } from "../../contexts/CurrentUserContext";
import { useContext } from "react";

/*
The history section will display how many rounds have been played, number of wins, and number of losses for each game.
Currently these values will be hard-coded, but future implementation will pull data from the database.
*/

function History({ gameInfo, handleDeleteGameInfo, handleDeleteClick }) {
  const currentUser = useContext(CurrentUserContext);
  return (
    <div className="history">
      {gameInfo.length !== 0 ? (
        <div className="history__test">
          {gameInfo
            ?.filter((game) => {
              const isOwn = game?.owner === currentUser._id;
              return isOwn;
            })
            ?.map((game) => {
              return (
                <HistoryGrid
                  game={game}
                  key={game._id}
                  handleDeleteGameInfo={handleDeleteGameInfo}
                  handleDeleteClick={handleDeleteClick}
                />
              );
            })}
        </div>
      ) : (
        <p className="history__empty">
          No games have been added to history yet
        </p>
      )}
    </div>
  );
}

export default History;
