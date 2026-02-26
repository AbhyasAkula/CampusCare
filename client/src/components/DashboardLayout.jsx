import { useEffect, useState } from "react";
import { Outlet, useNavigate, Link } from "react-router-dom";
import API from "../utils/axios";

function DashboardLayout() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // load logged in user
  const loadProfile = async () => {
    try {
      const res = await API.get("/profile");
      setUser(res.data);
    } catch (err) {
      console.log("Profile load failed");
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

  {/* STUDENT MENU */}
  {user.role === "student" && (
    <>
      <li>
        <Link to="/student" className="text-gray-700 font-semibold hover:text-green-600">
          Home
        </Link>
      </li>

      <li>
        <Link to="/student/raise" className="text-gray-600 hover:text-green-600">
          Raise a Ticket
        </Link>
      </li>

      <li>
        <Link to="/student/complaints" className="text-gray-600 hover:text-green-600">
          My Complaints
        </Link>
      </li>

      <li>
        <Link to="/profile" className="text-gray-600 hover:text-green-600">
          My Profile
        </Link>
      </li>
    </>
  )}

  {/* WARDEN MENU */}
  {user.role === "warden" && (
    <>
      <li>
        <Link to="/warden" className="text-gray-700 font-semibold hover:text-green-600">
          All Complaints
        </Link>
      </li>

      <li>
        <Link to="/profile" className="text-gray-600 hover:text-green-600">
          My Profile
        </Link>
      </li>
    </>
  )}

  {/* ADMIN MENU (future ready) */}
  {user.role === "admin" && (
    <>
      <li>
        <Link to="/admin" className="text-gray-700 font-semibold hover:text-green-600">
          Admin Dashboard
        </Link>
      </li>

      <li>
        <Link to="/profile" className="text-gray-600 hover:text-green-600">
          My Profile
        </Link>
      </li>
    </>
  )}

</ul>

        <button
          onClick={handleLogout}
          className="mt-10 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg"
        >
          Logout
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-8">

        {/* TOP BAR */}
        <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-xl shadow">

          <div>
            <h1 className="text-2xl font-bold">
  {user.role === "student" && "Student Panel"}
  {user.role === "warden" && "Warden Panel"}
  {user.role === "admin" && "Admin Panel"}
</h1>
            <p className="text-gray-600">Welcome, {user.name}</p>
          </div>

          {/* PROFILE AVATAR */}
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

        {/* DYNAMIC PAGE CONTENT */}
        <Outlet />

      </div>
    </div>
  );
}

export default DashboardLayout;