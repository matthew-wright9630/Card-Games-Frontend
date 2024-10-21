import { backOfCard } from "../../utils/constants";
import { useState } from "react";
import "./Card.css";

function Card({ card, handleDiscard }) {
  const [isCardFlipped, setIsCardFlipped] = useState([]);

  const flipCard = () => {
    if (isCardFlipped) {
      setIsCardFlipped(false);
    } else {
      setIsCardFlipped(true);
    }
  };

  const discardCard = () => {
    handleDiscard(card.code);
  };

  return (
    <div className="card">
      <div onClick={flipCard} className="card__box">
        <div
          className={`card__container ${
            isCardFlipped ? "" : "card__container_flipped"
          }`}
        >
          <img
            src={backOfCard}
            alt={`Image of back of card`}
            className="card__face card__back"
          />
          <div className="card__face card__front">
            <img src={card.image} alt={card.code} className="card__image" />
            {handleDiscard ? (
              <button
                onClick={discardCard}
                type="button"
                className="card__discard-btn"
              >
                discard
              </button>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;
