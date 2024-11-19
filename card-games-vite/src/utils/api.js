const baseUrl =
  process.env.NODE_ENV === "production"
    ? "https://api.mwcardgames.csproject.org"
    : "http://localhost:3001";

function checkResponse(res) {
  return res ? res.json() : Promise.reject(`Error: ${res.status}`);
}

function request(url, options) {
  return fetch(url, options).then(checkResponse);
}

function editProfileInfo({ name }, token) {
  return request(`${baseUrl}/users/me`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name,
    }),
  });
}

function deleteUser({ id }, token) {
  return request(`${baseUrl}/users/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}

function getGameHistory({ id }, token) {
  return request(`${baseUrl}/games/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}

function createGameHistory(
  { name, gamesPlayed, gamesWon, liked, description, owner },
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
      liked,
      description,
      owner,
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

function deleteGameInfo({ id }, token) {
  return request(`${baseUrl}/games/${id}`, {
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
  deleteUser,
  likeGame,
  dislikeGame,
  createGameHistory,
  getGameHistory,
  updateGamesPlayed,
  updateGamesWon,
  deleteGameInfo,
};
