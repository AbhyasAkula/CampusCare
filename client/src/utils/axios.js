import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// attach JWT token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  return config;
});

// 🔐 HANDLE 401 BUT DO NOT RELOAD THE APP
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // only remove invalid token
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
    }

    // ❗ DO NOT REDIRECT HERE
    // ProtectedRoute will handle navigation safely
    return Promise.reject(error);
  }
);

export default API;