import GameCards from "../GameCards/GameCards";
import "./GamesList.css";

function GamesList({ gameInfo, handleCardLike }) {
  return (
    <div className="games-list">
      {gameInfo.map((game) => {
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

export default GamesList;
