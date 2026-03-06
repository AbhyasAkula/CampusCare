import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import StudentHome from "./pages/StudentHome";
import RaiseTicket from "./pages/RaiseTicket";
import DashboardLayout from "./components/DashboardLayout";
import MyComplaints from "./pages/MyComplaints";
import ComplaintChat from "./pages/ComplaintChat";

/* NEW WARDEN PAGES */
import WardenHome from "./pages/WardenHome";
import WardenComplaints from "./pages/WardenComplaints";
import WardenAnnouncements from "./pages/WardenAnnouncements";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ================= STUDENT ================= */}
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

        {/* ================= WARDEN ================= */}
        <Route
          path="/warden"
          element={
            <ProtectedRoute role="warden">
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<WardenHome />} />
          <Route path="complaints" element={<WardenComplaints />} />
          <Route path="notices" element={<WardenAnnouncements />} />
        </Route>

        {/* ================= CHAT ================= */}
        <Route
          path="/complaint/:id/chat"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<ComplaintChat />} />
        </Route>

        {/* ================= ADMIN ================= */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* ================= PROFILE ================= */}
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