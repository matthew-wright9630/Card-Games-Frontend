import { checkResponse } from "./api";

const deckOfCardsUrl = "https://deckofcardsapi.com";

function createNewDeck(deckNumber) {
  console.log(deckNumber);
  return fetch(
    `https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=${deckNumber}`
  ).then(checkResponse);
}

function drawACard(deck_id, numberOfCards) {
  return fetch(
    `https://deckofcardsapi.com/api/deck/${deck_id}/draw/?count=${numberOfCards}`
  ).then(checkResponse);
}

function shuffleAllCards(deck_id) {
  return fetch(`https://deckofcardsapi.com/api/deck/${deck_id}/shuffle/`).then(
    checkResponse
  );
}

//This function will shuffle all cards in the Main pile. For example, in Solitaire you shuffle the main deck once all cards have been flipped.
//You don't want to shuffle the other piles.
function shuffleCardsNotInPlay(deck_id) {
  return fetch(
    `https://deckofcardsapi.com/api/deck/${deck_id}/shuffle/?remaining=true`
  ).then(checkResponse);
}

function createUnshuffledDeck() {
  return fetch(`https://deckofcardsapi.com/api/deck/new/`).then(checkResponse);
}

//Gets a partial deck for games such as Euchre. See https://deckofcardsapi.com/ for more information.
function createPartialDeck(cards) {
  return fetch(
    `https://deckofcardsapi.com/api/deck/new/shuffle/?cards=${cards}`
  ).then(checkResponse);
}

function addCardsToPiles(deck_id, pileName, cards) {
  return fetch(
    `https://deckofcardsapi.com/api/deck/${deck_id}/pile/${pileName}/add/?cards=${cards}`
  ).then(checkResponse);
}

function shufflePilesTogether(deck_id, pileName) {
  return fetch(
    `https://deckofcardsapi.com/api/deck/${deck_id}/pile/${pileName}/shuffle/`
  ).then(checkResponse);
}

function listCardsInPile(deck_id, pileName) {
  return fetch(
    `https://deckofcardsapi.com/api/deck/${deck_id}/pile/${pileName}/list/`
  ).then(checkResponse);
}

function returnAllCards(deck_id) {
  return fetch(`https://deckofcardsapi.com/api/deck/${deck_id}/return/`).then(
    checkResponse
  );
}

function returnCardsFromPile(deck_id, pileName) {
  return fetch(
    `https://deckofcardsapi.com/api/deck/${deck_id}/pile/${pileName}/return/`
  ).then(checkResponse);
}

export {
  createNewDeck,
  drawACard,
  shuffleAllCards,
  shuffleCardsNotInPlay,
  createUnshuffledDeck,
  createPartialDeck,
  addCardsToPiles,
  shufflePilesTogether,
  listCardsInPile,
  returnAllCards,
  returnCardsFromPile,
};
