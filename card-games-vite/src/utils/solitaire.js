function addCardToSpadeFoundation() {}

function checkCardFoundation(card, foundation) {
  if (card.code.substring(1) === foundation.substring(0, 1)) {
    return true;
  }
  return false;
}

function checkFoundationNumber(newCard, foundationCard) {
  if (newCard.code.substring(0, 1) === "0") {
    return foundationCard.code.substring(0, 1) === "9";
  } else if (newCard.code.substring(0, 1) === "J") {
    return foundationCard.code.substring(0, 1) === "0";
  } else if (newCard.code.substring(0, 1) === "Q") {
    return foundationCard.code.substring(0, 1) === "J";
  } else if (newCard.code.substring(0, 1) === "K") {
    return foundationCard.code.substring(0, 1) === "Q";
  } else if (newCard.code.substring(0, 1) === "2") {
    return foundationCard.code.substring(0, 1) === "A";
  }
  return (
    parseInt(newCard.code.substring(0, 1), 10) ===
    parseInt(foundationCard.code.substring(0, 1), 10) + 1
  );
}

function checkTablueaSuit(newCard, tablueaCard) {
  if (newCard.code.substring(1) === "H" || newCard.code.substring(1) === "D") {
    return (
      tablueaCard.code.substring(1) === "C" ||
      tablueaCard.code.substring(1) === "S"
    );
  } else {
    return (
      tablueaCard.code.substring(1) === "H" ||
      tablueaCard.code.substring(1) === "D"
    );
  }
}

function checkTablueaSequence(newCard, tablueaCard) {
  if (newCard.code.substring(0, 1) === "K") {
    return;
  } else if (newCard.code.substring(0, 1) === "Q") {
    return tablueaCard.code.substring(0, 1) === "K";
  } else if (newCard.code.substring(0, 1) === "J") {
    return tablueaCard.code.substring(0, 1) === "Q";
  } else if (newCard.code.substring(0, 1) === "0") {
    return tablueaCard.code.substring(0, 1) === "J";
  } else if (newCard.code.substring(0, 1) === "9") {
    return tablueaCard.code.substring(0, 1) === "0";
  } else {
    return (
      parseInt(newCard.code.substring(0, 1), 10) ===
      parseInt(tablueaCard.code.substring(0, 1), 10) - 1
    );
  }
}

function checkTablueaCardValid(newCard, tablueaCard) {
  return (
    checkTablueaSequence(newCard, tablueaCard) &&
    checkTablueaSuit(newCard, tablueaCard)
  );
}

export {
  addCardToSpadeFoundation,
  checkCardFoundation,
  checkFoundationNumber,
  checkTablueaCardValid,
};
