import axios from "axios";

const API_URL = "http://localhost:8080";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const setupInterceptors = (getToken) => {
  api.interceptors.request.use(async (config) => {

    // 🔑 request JWT template
    const token = await getToken({ template: "journalhub" });

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });
};

export default api;