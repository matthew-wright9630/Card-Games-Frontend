const baseUrl = process.env.NODE_ENV === "production" 
  ? "https://api.cardgamesmw.fairuse.org"
  : "http://localhost:3001";

function checkResponse(res) {
  return res ? res.json() : Promise.reject(`Error: ${res.status}`);
}

function request(url, options) {
  return fetch(url, options).then(checkResponse);
}

function editProfileInfo({ name, avatar }, token) {
  return request(`${baseUrl}/users/me`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name,
      avatar,
    }),
  });
}

function getGameHistory(token) {
  return request(`${baseUrl}/games`);
}

function createGameHistory(
  { name, gamesPlayed, gamesWon, user, liked, description },
  token
) {
  return request(`${baseUrl}/games`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name,
      gamesPlayed,
      gamesWon,
      user,
      liked,
      description,
    }),
  });
}

function updateGamesPlayed(id, token) {
  return request(`${baseUrl}/games/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}

function updateGamesWon(id, token) {
  return request(`${baseUrl}/games/${id}/won`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}

function likeGame(id, token) {
  return request(`${baseUrl}/games/${id}/likes`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}

function dislikeGame(id, token) {
  return request(`${baseUrl}/games/${id}/likes`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}

export {
  baseUrl,
  request,
  checkResponse,
  editProfileInfo,
  likeGame,
  dislikeGame,
  createGameHistory,
  getGameHistory,
  updateGamesPlayed,
  updateGamesWon,
};
