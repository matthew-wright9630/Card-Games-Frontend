import { baseUrl } from "./api";
import { request, checkResponse } from "./api";

export const register = (email, password, name, avatar) => {
  return new Promise((resolve, reject) => {
    resolve({
      data: { name: name, email: email, password: password, avatar: avatar },
    });
  });
};

export const authorize = (email, password) => {
  return new Promise((resolve, reject) => {
    resolve({ token: "A fake token" });
  });
};

export const checkToken = (token) => {
  return new Promise((resolve, reject) => {
    resolve({
      data: {
        name: "Matthew",
        email: "test@example.com",
        id: "670fea758be1c8eb82f2a272",
      },
    });
  });
};
