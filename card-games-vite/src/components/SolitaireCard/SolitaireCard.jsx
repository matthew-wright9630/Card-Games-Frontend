import Card from "../Card/Card";

function SolitaireCard(card, moveCardListItem, canBeFlipped, solitaireId) {
  return (
    <div>
      <Card
        card={card}
        moveCardListItem={moveCardListItem}
        canBeFlipped={canBeFlipped}
      />
    </div>
  );
}

export default SolitaireCard;
