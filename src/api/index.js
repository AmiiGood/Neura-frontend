import axios from "axios";

const api = axios.create({
  baseURL: "https://neura-backend-tan.vercel.app/api",
});

export default api;
