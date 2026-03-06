import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import WardenDashboard from "./pages/WardenDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import StudentHome from "./pages/StudentHome";
import RaiseTicket from "./pages/RaiseTicket";
import DashboardLayout from "./components/DashboardLayout";
import MyComplaints from "./pages/MyComplaints";
import ComplaintChat from "./pages/ComplaintChat";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

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
          path="/complaint/:id/chat"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<ComplaintChat />} />
        </Route>

        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

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