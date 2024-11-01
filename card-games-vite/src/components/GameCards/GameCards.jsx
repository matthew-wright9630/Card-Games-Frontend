import { backOfCard } from "../../utils/constants";
import { Link } from "react-router-dom";
import "./GameCards.css";

function GameCards({ gameConstant, handleCardLike, isLoggedIn, isNotLiked }) {
  function toggleCardLike() {
    handleCardLike({
      name: gameConstant.name,
      description: gameConstant.description,
    });
  }

  return (
    <div className="game-card">
      <div className="game-card__box">
        <p className="game-card__header">{gameConstant.name}</p>
        <Link
          className="game-card__link"
          to={`/${gameConstant.name.toLowerCase()}`}
        >
          <div className="game-card__container">
            <img
              src={backOfCard}
              alt={`Image of ${gameConstant.name.toLowerCase()} game`}
              className="game-card__face game-card__image"
            />
            <div className="game-card__face game-card__back">
              <p className="game-card__description">
                {gameConstant.description}
              </p>
            </div>
          </div>
        </Link>
        {isLoggedIn ? (
          <button
            type="button"
            onClick={toggleCardLike}
            className={`game-card__like-btn ${
              isNotLiked ? "" : "game-card__like-btn_liked"
            }`}
          ></button>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default GameCards;
