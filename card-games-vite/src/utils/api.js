const baseUrl = "http://localhost:3001";

function checkResponse(res) {
  return res ? res.json() : Promise.reject(`Error: ${res.status}`);
}

function request(url, options) {
  return fetch(url, options).then(checkResponse);
}

function editProfileInfo({ name, avatar }, { token }) {
  return new Promise((resolve, reject) => {
    resolve({
      name: "Updated Name",
      avatar:
        "https://images.unsplash.com/photo-1669120180498-652eb656193c?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    });
  });
}

function likeGame(id, token) {
  return new Promise((resolve, reject) => {
    resolve({
      liked: true,
    });
  });
}

function dislikeGame(id, token) {
  return new Promise((resolve, reject) => {
    resolve({
      liked: false,
    });
  });
}

export {
  baseUrl,
  request,
  checkResponse,
  editProfileInfo,
  likeGame,
  dislikeGame,
};
