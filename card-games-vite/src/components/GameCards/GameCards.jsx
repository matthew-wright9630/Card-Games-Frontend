import { backOfCard } from "../../utils/constants";
import { Link } from "react-router-dom";
import "./GameCards.css";
import { useState } from "react";

function GameCards({ gameConstant, handleCardLike, isLoggedIn, isNotLiked, closeGameSite }) {
  const [cardIsFlipped, setCardIsFlipped] = useState(false);

  function handleCardClick() {
    if (cardIsFlipped) {
      setCardIsFlipped(false);
    } else {
      setCardIsFlipped(true);
    }
  }

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
        <button
          type="button"
          onClick={handleCardClick}
          className="game-card__card"
        >
          <div
            className={`game-card__container ${
              cardIsFlipped ? "game-card__container_flipped" : ""
            }`}
          >
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
        </button>
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
        <Link
          className="game-card__link"
          onClick={closeGameSite}
          to={`/${gameConstant.name.toLowerCase()}`}
        >
          Play Game
        </Link>
      </div>
    </div>
  );
}

export default GameCards;
