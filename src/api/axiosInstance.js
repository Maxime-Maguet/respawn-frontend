import axios from "axios";
import { store } from "../redux/store";

const respawnAPI = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

respawnAPI.interceptors.request.use((config) => {
  const token = store.getState().user.value.token;
  console.log(token);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
export default respawnAPI;
