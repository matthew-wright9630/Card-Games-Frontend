function addCardToSpadeFoundation() {}

function checkCardIsValid(card) {}

function checkCardFoundation(card, foundation) {
  if (card.code.substring(1) === foundation.substring(0, 1)) {
    return true;
  }
  return false;
}

function checkFoundationNumber(newCard, foundationCard) {
  if (
    parseInt(newCard.card.substring(0, 1), 10) ===
    parseInt(foundationCard.card.substring(0, 1), 10) + 1
  ) {
    return true;
  }
  return false;
}

export { addCardToSpadeFoundation, checkCardFoundation, checkFoundationNumber };
