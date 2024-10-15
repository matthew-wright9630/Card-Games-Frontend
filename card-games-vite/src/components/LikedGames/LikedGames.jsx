import GameCards from "../GameCards/GameCards";

function LikedGames() {
  return (
    <div className="games-list">
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
