import GameCards from "../GameCards/GameCards";
import "./LikedGames.css";

function LikedGames({ gameInfo, handleCardLike }) {
  return (
    <div className="liked-games-list">
      {gameInfo
        ?.filter((game) => {
          if (game.liked) {
            return game;
          }
        })
        ?.map((game) => {
          return (
            <GameCards
              key={game.id}
              game={game}
              handleCardLike={handleCardLike}
            />
          );
        })}
    </div>
  );
}

export default LikedGames;
