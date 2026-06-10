import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import API from "../utils/axios";
import Login from "../pages/Login";

const dashboardRoutes = {
  student: "/student",
  warden: "/warden",
  admin: "/admin",
};

function LoginRoute() {
  const [destination, setDestination] = useState(
    localStorage.getItem("token") ? null : "/login"
  );

  useEffect(() => {
    if (destination) return;

    const checkSession = async () => {
      try {
        const res = await API.get("/profile");
        setDestination(dashboardRoutes[res.data.role] || "/login");
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        setDestination("/login");
      }
    };

    checkSession();
  }, [destination]);

  if (!destination) {
    return (
      <div className="flex min-h-screen items-center justify-center text-xl">
        Verifying session...
      </div>
    );
  }

  if (destination !== "/login") {
    return <Navigate to={destination} replace />;
  }

  return <Login />;
}

export default LoginRoute;
