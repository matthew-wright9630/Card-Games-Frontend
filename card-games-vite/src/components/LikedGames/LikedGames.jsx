import GameCards from "../GameCards/GameCards";
import "./LikedGames.css";
import { CurrentUserContext } from "../../contexts/CurrentUserContext";
import { useContext } from "react";

function LikedGames({ gameInfo, handleCardLike, isLoggedIn, openGameSite }) {
  const currentUser = useContext(CurrentUserContext);
  return (
    <div className="liked-games">
      <h3 className="liked-games__title">Liked Games:</h3>
      {/* <p className="liked-games__description">
        Games that have been liked (if any) are displayed below
      </p> */}
      <div className="liked-games-list">
        {gameInfo
          ?.filter((game) => {
            const isOwn = game?.owner === currentUser._id;
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
                gameInfo={gameInfo}
                gameConstant={game}
                handleCardLike={handleCardLike}
                isLoggedIn={isLoggedIn}
                openGameSite={openGameSite}
                isLiked={game.liked}
              />
            );
          })}
      </div>
    </div>
  );
}

export default LikedGames;
