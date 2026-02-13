import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../utils/axios";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/auth/register", form);
      alert("Registration Successful");
      navigate("/");
    } catch (err) {
      alert("Error registering");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>

        <input name="name" placeholder="Name"
          className="w-full border p-2 mb-3 rounded"
          onChange={handleChange} />

        <input name="email" placeholder="Email"
          className="w-full border p-2 mb-3 rounded"
          onChange={handleChange} />

        <input name="password" type="password" placeholder="Password"
          className="w-full border p-2 mb-3 rounded"
          onChange={handleChange} />

        <select name="role"
          className="w-full border p-2 mb-3 rounded"
          onChange={handleChange}>
          <option value="student">Student</option>
          <option value="warden">Warden</option>
          <option value="admin">Admin</option>
        </select>

        <button className="w-full bg-blue-500 text-white p-2 rounded">
          Register
        </button>

        <p className="text-center mt-3">
          Already have account? <Link to="/" className="text-blue-500">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
