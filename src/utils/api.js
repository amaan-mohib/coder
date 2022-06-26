import Axios from "axios";

export let urls = {
  development: "http://localhost:8080/",
  production: "https://delta-coder.herokuapp.com/",
};

const api = Axios.create({
  baseURL: urls[process.env.NODE_ENV],
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export const judge0Api = Axios.create({
  baseURL: "https://judge0-ce.p.rapidapi.com/",
  headers: {
    "content-type": "application/json",
    "Content-Type": "application/json",
    "X-RapidAPI-Key": "e62c33e7dfmsh5c652d76c8fb5f9p13cb19jsn6b73aa75413c",
    "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
  },
});

export default api;
