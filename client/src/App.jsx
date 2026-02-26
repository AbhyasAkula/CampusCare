import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import WardenDashboard from "./pages/WardenDashboard.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import Profile from "./pages/Profile.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import StudentHome from "./pages/StudentHome";
import RaiseTicket from "./pages/RaiseTicket";
import DashboardLayout from "./components/DashboardLayout";
import MyComplaints from "./pages/MyComplaints";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* public pages */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* protected dashboards */}
            <Route
  path="/student"
  element={
    <ProtectedRoute role="student">
      <DashboardLayout />
    </ProtectedRoute>
  }
>
  <Route index element={<StudentHome />} />
  <Route path="raise" element={<RaiseTicket />} />
   <Route path="complaints" element={<MyComplaints />} />
</Route>

      <Route
  path="/warden"
  element={
    <ProtectedRoute role="warden">
      <DashboardLayout />
    </ProtectedRoute>
  }
>
  <Route index element={<WardenDashboard />} />
</Route>  

        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* profile page (any logged in user) */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;