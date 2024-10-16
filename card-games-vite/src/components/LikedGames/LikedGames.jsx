import GameCards from "../GameCards/GameCards";
import "./LikedGames.css";

function LikedGames() {
  return (
    <div className="liked-games-list">
      {
        <GameCards
          title={"Solitaire"}
          description={`Solitaire is a single player game where cards need to be sorted
                    from Ace to King in each suit.`}
          cardIsLiked={true}
        />
      }
    </div>
  );
}

export default LikedGames;
