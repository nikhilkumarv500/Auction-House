import axios from "axios";

const apiCall = axios.create({
  baseURL: import.meta.env.VITE_GATEWAY_API_BE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiCall;
