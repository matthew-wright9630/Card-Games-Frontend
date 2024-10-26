import GameCards from "../GameCards/GameCards";
import { games } from "../../utils/constants";
import "./GamesList.css";
import { CurrentUserContext } from "../../contexts/CurrentUserContext";
import { useContext } from "react";

function GamesList({ gameInfo, handleCardLike, isLoggedIn, openGameSite }) {
  const currentUser = useContext(CurrentUserContext);

  return (
    <div className="games-list">
      {!isLoggedIn
        ? games.map((game) => {
            return (
              <GameCards
                key={game.name}
                game={game}
                handleCardLike={handleCardLike}
                isLoggedIn={isLoggedIn}
              />
            );
          })
        : gameInfo
            ?.filter((game) => {
              const isOwn = game?.user[0] == currentUser._id;
              return isOwn;
            })
            .map((game) => {
              return (
                <GameCards
                  key={game._id}
                  game={game}
                  handleCardLike={handleCardLike}
                  isLoggedIn={isLoggedIn}
                  openGameSite={openGameSite}
                />
              );
            })}
    </div>
  );
}

export default GamesList;
