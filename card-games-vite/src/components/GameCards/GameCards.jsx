import { backOfCard } from "../../utils/constants";
import { useState } from "react";
import { Link } from "react-router-dom";
import "./GameCards.css";

function GameCards({ game, handleCardLike, isLoggedIn }) {
  function likeCard() {
    handleCardLike(game);
  }
  return (
    <div className="game-card">
      <div className="game-card__box">
        <p className="game-card__header">{game.name}</p>
        <Link className="game-card__link" to={`/${game.name.toLowerCase()}`}>
          <div className="game-card__container">
            <img
              src={backOfCard}
              alt={`Image of ${game.name.toLowerCase()} game`}
              className="game-card__face game-card__image"
            />
            <div className="game-card__face game-card__back">
              <p className="game-card__description">{game.description}</p>
            </div>
          </div>
        </Link>
        {isLoggedIn ? (
          <button
            type="button"
            onClick={likeCard}
            className={`game-card__like-btn ${
              game.liked ? "game-card__like-btn_liked" : ""
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
