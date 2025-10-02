function getCardValue(card) {
  if (card.value === "KING") {
    return 13;
  } else if (card.value === "QUEEN") {
    return 12;
  } else if (card.value === "JACK") {
    return 11;
  } else if (card.value === 0) {
    return 10;
  } else if (card.value === "ACE") {
    return 14;
  } else {
    return card.value;
  }
}

export { getCardValue };
