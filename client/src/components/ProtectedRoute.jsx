import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import API from "../utils/axios";

function ProtectedRoute({ children, role }) {
  const [status, setStatus] = useState("checking");
  // checking | allowed | unauthorized | forbidden

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await API.get("/profile");

        // USER IS LOGGED IN

        // case 1: page does NOT require specific role (like profile page)
        if (!role) {
          setStatus("allowed");
          return;
        }

        // case 2: page requires role
        if (res.data.role === role) {
          setStatus("allowed");
        } else {
          setStatus("forbidden");
        }
      } catch (err) {
        setStatus("unauthorized");
      }
    };

    checkUser();
  }, [role]);

  // Loading screen
  if (status === "checking") {
    return (
      <div className="flex items-center justify-center min-h-screen text-xl">
        Verifying session...
      </div>
    );
  }

  // Not logged in (token invalid / expired)
  if (status === "unauthorized") {
    return <Navigate to="/login" replace />;
  }

  // Logged in but wrong role
  if (status === "forbidden") {
    return <Navigate to="/" replace />;
  }

  // Allowed
  return children;
}

export default ProtectedRoute;