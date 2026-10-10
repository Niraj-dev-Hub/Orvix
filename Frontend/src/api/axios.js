import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://orvix-s014.onrender.com/api",
  withCredentials: true
});

export default api;