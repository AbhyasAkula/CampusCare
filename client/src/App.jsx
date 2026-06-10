import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";

import Register from "./pages/Register";
import Profile from "./pages/Profile";

import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./components/DashboardLayout";
import LoginRoute from "./components/LoginRoute";

/* STUDENT */
import StudentHome from "./pages/StudentHome";
import RaiseTicket from "./pages/RaiseTicket";
import MyComplaints from "./pages/MyComplaints";

/* WARDEN */
import WardenHome from "./pages/WardenHome";
import WardenComplaints from "./pages/WardenComplaints";
import WardenAnnouncements from "./pages/WardenAnnouncements";

/* CHAT */
import ComplaintChat from "./pages/ComplaintChat";

/* ADMIN */
import AdminDashboard from "./pages/AdminDashboard";

/* (WE WILL CREATE THESE NEXT) */
import AdminUsers from "./pages/AdminUsers";
import AdminComplaints from "./pages/AdminComplaints";
import AdminEmergency from "./pages/AdminEmergency";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginRoute />} />
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
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="complaints" element={<AdminComplaints />} />
          <Route path="emergency" element={<AdminEmergency />} />
        </Route>

        {/* ================= PROFILE ================= */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
