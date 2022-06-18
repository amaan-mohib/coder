import Axios from "axios";

export let urls = {
  development: "http://localhost:8080/",
  production: "",
};

const api = Axios.create({
  baseURL: urls[process.env.NODE_ENV],
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export default api;
