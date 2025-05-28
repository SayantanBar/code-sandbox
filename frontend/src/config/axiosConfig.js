import axios from "axios";
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  timeout: 120000,
});

export default axiosInstance;
