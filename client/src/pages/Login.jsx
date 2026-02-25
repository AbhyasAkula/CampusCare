import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../utils/axios";

function Login() {
  const navigate = useNavigate();

  const [data, setData] = useState({
    email: "",
    password: "",
  });

  // 🔹 AUTO REDIRECT IF ALREADY LOGGED IN
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token && role) {
      if (role === "student") navigate("/student");
      if (role === "warden") navigate("/warden");
      if (role === "admin") navigate("/admin");
    }
  }, []);

  const handleChange = (e) =>
    setData({ ...data, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", data);

      localStorage.setItem("token", res.data.token);
      

      // role based redirect
      if (res.data.role === "student") navigate("/student");
      if (res.data.role === "warden") navigate("/warden");
      if (res.data.role === "admin") navigate("/admin");

    } catch (err) {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">CampusCare Login</h2>

        <input
          name="email"
          placeholder="Email"
          className="w-full border p-2 mb-3 rounded"
          onChange={handleChange}
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full border p-2 mb-3 rounded"
          onChange={handleChange}
          required
        />

        <button className="w-full bg-green-500 hover:bg-green-600 text-white p-2 rounded mb-2 font-semibold">
          Login
        </button>

        <p className="text-center">
          New user?{" "}
          <Link to="/register" className="text-blue-500 font-semibold">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;