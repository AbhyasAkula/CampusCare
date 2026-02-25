import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/axios";

function DashboardLayout({ children, role }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const loadProfile = async () => {
    try {
      const res = await API.get("/profile");
      setUser(res.data);
    } catch {
      navigate("/login");
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen text-xl font-semibold">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* SIDEBAR */}
      <div className="w-64 bg-white shadow-lg p-5">
        <h2 className="text-2xl font-bold text-green-600 mb-8">CampusCare</h2>

        <ul className="space-y-4">
          <li className="font-semibold text-gray-700">Dashboard</li>

          {role === "student" && (
            <>
              <li className="text-gray-500">My Complaints</li>
            </>
          )}

          {role === "warden" && (
            <>
              <li className="text-gray-500">Block Complaints</li>
            </>
          )}

          {role === "admin" && (
            <>
              <li className="text-gray-500">Manage Users</li>
              <li className="text-gray-500">All Complaints</li>
            </>
          )}

          <li>
            <a href="/profile" className="text-gray-600 hover:text-green-600 font-medium">
              My Profile
            </a>
          </li>
        </ul>

        <button
          onClick={handleLogout}
          className="mt-10 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg"
        >
          Logout
        </button>
      </div>

      {/* MAIN AREA */}
      <div className="flex-1 p-8">

        {/* NAVBAR */}
        <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-xl shadow">
          <div>
            <h1 className="text-2xl font-bold capitalize">{role} Dashboard</h1>
            <p className="text-gray-600">Welcome, {user.name}</p>
          </div>

          <img
            onClick={() => navigate("/profile")}
            src={
              user.profilePic
                ? `http://localhost:5000/uploads/${user.profilePic}`
                : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
            alt="profile"
            className="w-10 h-10 rounded-full object-cover cursor-pointer border-2 border-green-500"
          />
        </div>

        {/* PAGE CONTENT */}
        {children}

      </div>
    </div>
  );
}

export default DashboardLayout;