const baseUrl = "http://localhost:3001";

function checkResponse(res) {
  return res ? res.json() : Promise.reject(`Error: ${res.status}`);
}

function request(url, options) {
  return fetch(url, options).then((res) => {
    return res;
  });
}

function editProfileInfo({ name, avatar }, { token }) {
  return Promise((resolve, reject) => {
    resolve({ data: { name: name, avatar: avatar } });
  });
}

export { baseUrl, request, checkResponse, editProfileInfo };
