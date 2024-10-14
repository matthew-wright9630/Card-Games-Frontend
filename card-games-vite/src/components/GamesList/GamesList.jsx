import GameCards from "../GameCards/GameCards";
import "./GamesList.css";

function GamesList() {
  return (
    <div className="games-list">
      <GameCards
        title={"Solitaire"}
        description={`Solitaire is a single player game where cards need to be sorted
                from Ace to King in each suit.`}
        cardIsLiked={true}
      />
      <GameCards
        title={"War"}
        description={`War is a two player card game where one card is flipped by each
                player, and the higher number wins.`}
        cardIsLiked={false}
      />
    </div>
  );
}

export default GamesList;
