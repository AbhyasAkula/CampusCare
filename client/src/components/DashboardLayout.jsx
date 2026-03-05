import { useEffect, useState } from "react";
import { Outlet, useNavigate, Link } from "react-router-dom";
import API from "../utils/axios";

function DashboardLayout() {

  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const loadProfile = async () => {
    try {
      const res = await API.get("/profile");
      setUser(res.data);
    } catch {
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
    <div className="flex min-h-screen bg-[#F5F7FB]">

      {/* SIDEBAR */}
      <div className="w-64 bg-white border-r border-[#E6E9F0] p-6 flex flex-col">

        {/* LOGO */}
        <h2 className="text-2xl font-bold text-[#5D87FF] mb-10">
          CampusCare
        </h2>

        {/* MENU */}
        <ul className="space-y-2 text-sm flex-1">

          {user.role === "student" && (
            <>
              <li>
                <Link
                  to="/student"
                  className="block px-3 py-2 rounded-lg hover:bg-[#EEF2FF] hover:text-[#5D87FF]"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  to="/student/raise"
                  className="block px-3 py-2 rounded-lg hover:bg-[#EEF2FF] hover:text-[#5D87FF]"
                >
                  Raise Complaint
                </Link>
              </li>

              <li>
                <Link
                  to="/student/complaints"
                  className="block px-3 py-2 rounded-lg hover:bg-[#EEF2FF] hover:text-[#5D87FF]"
                >
                  My Complaints
                </Link>
              </li>

              <li>
                <Link
                  to="/profile"
                  className="block px-3 py-2 rounded-lg hover:bg-[#EEF2FF] hover:text-[#5D87FF]"
                >
                  Profile
                </Link>
              </li>
            </>
          )}

          {user.role === "warden" && (
            <>
              <li>
                <Link
                  to="/warden"
                  className="block px-3 py-2 rounded-lg hover:bg-[#EEF2FF] hover:text-[#5D87FF]"
                >
                  Complaints
                </Link>
              </li>

              <li>
                <Link
                  to="/profile"
                  className="block px-3 py-2 rounded-lg hover:bg-[#EEF2FF] hover:text-[#5D87FF]"
                >
                  Profile
                </Link>
              </li>
            </>
          )}

          {user.role === "admin" && (
            <>
              <li>
                <Link
                  to="/admin"
                  className="block px-3 py-2 rounded-lg hover:bg-[#EEF2FF] hover:text-[#5D87FF]"
                >
                  Admin Dashboard
                </Link>
              </li>

              <li>
                <Link
                  to="/profile"
                  className="block px-3 py-2 rounded-lg hover:bg-[#EEF2FF] hover:text-[#5D87FF]"
                >
                  Profile
                </Link>
              </li>
            </>
          )}

        </ul>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="mt-6 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg text-sm"
        >
          Logout
        </button>

      </div>

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col">

        {/* NAVBAR */}
        <div className="h-16 bg-white border-b border-[#E6E9F0] flex items-center justify-between px-6">

          {/* SEARCH */}
          <input
            type="text"
            placeholder="Search..."
            className="bg-gray-100 px-4 py-2 rounded-lg text-sm outline-none w-64"
          />

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-5">

            {/* NOTIFICATION ICON */}
            <div className="relative cursor-pointer">

              <span className="text-xl">🔔</span>

              <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                2
              </span>

            </div>

            {/* PROFILE */}
            <img
              onClick={() => navigate("/profile")}
              src={
                user.profilePic
                  ? `http://localhost:5000/uploads/${user.profilePic}`
                  : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              alt="profile"
              className="w-9 h-9 rounded-full object-cover cursor-pointer"
            />

          </div>

        </div>

        {/* CONTENT */}
        <div className="p-8">
          <Outlet />
        </div>

      </div>

    </div>
  );
}

export default DashboardLayout;