import { backOfCard } from "../../utils/constants";
import { Link } from "react-router-dom";
import "./GameCards.css";

function GameCards({ title, description, cardIsLiked }) {
  const titleLowerCase = title.toLowerCase();
  return (
    <div className="game-card">
      <div className="game-card__box">
        <p className="game-card__header">{title}</p>
        <Link className="game-card__link" to={`/${titleLowerCase}`}>
          <div className="game-card__container">
            <img
              src={backOfCard}
              alt={`Image of ${titleLowerCase} game`}
              className="game-card__face game-card__image"
            />
            <div className="game-card__face game-card__back">
              <p className="game-card__description">{description}</p>
            </div>
          </div>
        </Link>
        {cardIsLiked ? (
          <button type="button" className="game-card__like-btn_liked "></button>
        ) : (
          <button type="button" className="game-card__like-btn"></button>
        )}
      </div>
    </div>
  );
}

export default GameCards;
