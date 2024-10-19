import { backOfCard } from "../../utils/constants";
import { useState } from "react";
import "./Card.css";

function Card({ card }) {
  const [isCardFlipped, setIsCardFlipped] = useState([]);

  const flipCard = () => {
    if (isCardFlipped) {
      setIsCardFlipped(false);
    } else {
      setIsCardFlipped(true);
    }
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
            className="card__face card__image"
          />
          <div className="card__face card__back">
            <img src={card.image} alt={card.code} className="card__image" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;
