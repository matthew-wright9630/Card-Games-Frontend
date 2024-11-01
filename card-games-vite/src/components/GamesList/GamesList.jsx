import GameCards from "../GameCards/GameCards";
import { games } from "../../utils/constants";
import "./GamesList.css";

function GamesList({ gameInfo, handleCardLike, isLoggedIn }) {
  function checkIsLiked(selectedGame) {
    const test = gameInfo?.filter((game) => {
      if (game.name === selectedGame.name) {
        return game;
      }
    });
    if (test === undefined) {
      return;
    } else if (test.length !== 0) {
      return test[0].liked;
    }
  }
  return (
    <div className="games-list">
      {games.map((game) => {
        const isNotLiked = !checkIsLiked(game);
        return (
          <GameCards
            key={game.name}
            gameConstant={game}
            handleCardLike={handleCardLike}
            isLoggedIn={isLoggedIn}
            isNotLiked={isNotLiked}
          />
        );
      })}
    </div>
  );
}

export default GamesList;
