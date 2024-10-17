import { baseUrl } from "./api";
import { request, checkResponse } from "./api";

export const register = (email, password, name, avatar) => {
  return new Promise((resolve, reject) => {
    resolve({
      name: "Matthew",
      email: "test@example.com",
      id: "670fea758be1c8eb82f2a272",
      avatar:
        "https://plus.unsplash.com/premium_photo-1670020267371-c87e0128ec47?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
      name: "Matthew",
      email: "test@example.com",
      id: "670fea758be1c8eb82f2a272",
      avatar:
        "https://plus.unsplash.com/premium_photo-1670020267371-c87e0128ec47?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    });
  });
};
