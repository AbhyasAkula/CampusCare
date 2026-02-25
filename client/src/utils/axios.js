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


// 🔐 AUTO LOGOUT IF TOKEN EXPIRED
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // token expired or invalid
      localStorage.removeItem("token");
      localStorage.removeItem("role");

      // redirect to login
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default API;