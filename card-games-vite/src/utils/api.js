const baseUrl = "https://deckofcardsapi.com";

function checkResponse(res) {
  return res ? res.json() : Promise.reject(`Error: ${res.status}`);
}

function request(url, options) {
  return fetch(url, options).then((res) => {
    return res;
  });
}

const backOfCard = "https://deckofcardsapi.com/static/img/back.png";

export { backOfCard, baseUrl };
