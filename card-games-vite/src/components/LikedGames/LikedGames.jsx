import GameCards from "../GameCards/GameCards";
import "./LikedGames.css";
import { CurrentUserContext } from "../../contexts/CurrentUserContext";
import { useContext } from "react";

function LikedGames({ gameInfo, handleCardLike, isLoggedIn }) {
  const currentUser = useContext(CurrentUserContext);
  return (
    <div className="liked-games-list">
      {gameInfo.data
        ?.filter((game) => {
          const isOwn = game?.user[0] == currentUser._id;
          return isOwn;
        })
        ?.filter((game) => {
          if (game.liked) {
            return game;
          }
        })
        ?.map((game) => {
          return (
            <GameCards
              key={game._id}
              game={game}
              handleCardLike={handleCardLike}
              isLoggedIn={isLoggedIn}
            />
          );
        })}
    </div>
  );
}

export default LikedGames;
