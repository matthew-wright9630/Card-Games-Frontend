import { backOfCard } from "../../utils/constants";
import { useRef, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import "./Card.css";

function Card({ card, moveCardListItem, index }) {
  const [isCardFlipped, setIsCardFlipped] = useState([]);

  const flipCard = () => {
    if (isCardFlipped) {
      setIsCardFlipped(false);
    } else {
      setIsCardFlipped(true);
    }
  };

  const [{ isDragging }, dragRef] = useDrag({
    type: "card",
    item: { id: card?.code, card: card, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [spec, dropRef] = useDrop({
    accept: "card",
    hover: (item, monitor) => {
      const dragIndex = item.index;
      const hoverIndex = index;
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleX =
        (hoverBoundingRect.left - hoverBoundingRect.right) / 2;
      const hoverActualX =
        monitor.getClientOffset().x - hoverBoundingRect.right;

      if (dragIndex < hoverIndex && hoverActualX < hoverMiddleX) return;
      if (dragIndex > hoverIndex && hoverActualX > hoverMiddleX) return;

      moveCardListItem(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const ref = useRef(null);
  const dragDropRef = dragRef(dropRef(ref));

  return (
    <div
      className={`card ${isDragging ? "card_is-dragging" : ""}`}
      id={`id_${card?.code}`}
      ref={dragDropRef}
    >
      {isDragging}
      <div onClick={flipCard} className="card__box">
        <div
          className={`card__container ${
            isCardFlipped ? "" : "card__container_flipped"
          }`}
        >
          <img
            src={backOfCard}
            alt={`Image of back of card`}
            className={`card__face card__back ${
              isDragging ? "card__container_is-dragging" : ""
            }`}
          />
          <div className="card__face card__front">
            <img src={card?.image} alt={card?.code} className="card__image" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;
