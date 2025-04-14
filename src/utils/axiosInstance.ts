import axios from "axios";

const API_KEY = import.meta.env.COINGECKO_API_KEY;

const axiosInstance = axios.create({
  baseURL: "https://api.coingecko.com/api/v3",
  headers: {
    "Content-Type": "application/json",
    ...(API_KEY && { "x-cg-pro-api-key": API_KEY }),
  },
});

export default axiosInstance;
