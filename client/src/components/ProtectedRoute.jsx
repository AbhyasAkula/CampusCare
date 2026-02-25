import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import API from "../utils/axios";

function ProtectedRoute({ children, role }) {
  const [allowed, setAllowed] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await API.get("/profile");

        // check real role from backend
        if (res.data.role === role) {
          setAllowed(true);
        } else {
          setAllowed(false);
        }
      } catch (err) {
        setAllowed(false);
      }
    };

    checkUser();
  }, [role]);

  if (allowed === null) {
    return (
      <div className="flex items-center justify-center min-h-screen text-xl">
        Checking authentication...
      </div>
    );
  }

  if (!allowed) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;