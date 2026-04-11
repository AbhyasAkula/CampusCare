import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/axios";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [complaints, setComplaints] = useState([]);

  const navigate = useNavigate();

  const loadData = async () => {
    try {
      const usersRes = await API.get("/admin/users");
      setUsers(Array.isArray(usersRes.data) ? usersRes.data : []);
    } catch {}

    try {
      const compRes = await API.get("/admin/complaints");
      setComplaints(Array.isArray(compRes.data) ? compRes.data : []);
    } catch {}
  };

  useEffect(() => {
    loadData();
  }, []);

  /* ================= STATISTICS ================= */

  const totalUsers = users.length;

  const totalComplaints = complaints.length;

  const pendingComplaints = complaints.filter(
    (c) => c.status === "Pending"
  ).length;

  const resolvedComplaints = complaints.filter(
    (c) => c.status === "Resolved"
  ).length;

  const recentComplaints = [...complaints]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <div className="space-y-8">

      {/* TITLE */}
      <div>
        <h1 className="text-3xl font-bold text-[#2A3547]">
          Admin Dashboard
        </h1>
        <p className="text-gray-500">
          Overview of hostel system activity
        </p>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* TOTAL USERS */}
        <div
          onClick={() => navigate("/admin/users")}
          className="bg-white p-6 rounded-xl shadow cursor-pointer hover:shadow-lg transition"
        >
          <p className="text-gray-500 text-sm">Total Users</p>
          <h2 className="text-3xl font-bold text-[#5D87FF] mt-2">
            {totalUsers}
          </h2>
        </div>

        {/* TOTAL COMPLAINTS */}
        <div
          onClick={() => navigate("/admin/complaints")}
          className="bg-white p-6 rounded-xl shadow cursor-pointer hover:shadow-lg transition"
        >
          <p className="text-gray-500 text-sm">Total Complaints</p>
          <h2 className="text-3xl font-bold text-[#5D87FF] mt-2">
            {totalComplaints}
          </h2>
        </div>

        {/* PENDING */}
        <div
          onClick={() => navigate("/admin/complaints?status=Pending")}
          className="bg-white p-6 rounded-xl shadow cursor-pointer hover:shadow-lg transition"
        >
          <p className="text-gray-500 text-sm">Pending Complaints</p>
          <h2 className="text-3xl font-bold text-yellow-500 mt-2">
            {pendingComplaints}
          </h2>
        </div>

        {/* RESOLVED */}
        <div
          onClick={() => navigate("/admin/complaints?status=Resolved")}
          className="bg-white p-6 rounded-xl shadow cursor-pointer hover:shadow-lg transition"
        >
          <p className="text-gray-500 text-sm">Resolved Complaints</p>
          <h2 className="text-3xl font-bold text-green-600 mt-2">
            {resolvedComplaints}
          </h2>
        </div>

      </div>

      {/* RECENT COMPLAINTS */}
      <div className="bg-white p-6 rounded-xl shadow">

        <h2 className="text-xl font-semibold mb-4">
          Recent Complaints
        </h2>

        {recentComplaints.length === 0 ? (
          <p className="text-gray-500">No complaints yet</p>
        ) : (
          <div className="space-y-4">

            {recentComplaints.map((c) => (
              <div
                key={c._id}
                className="border-b pb-3 flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">{c.title}</p>

                  <p className="text-sm text-gray-500">
                    {c.student?.name} • {c.block} {c.room}
                  </p>
                </div>

                <span
                  className={`px-3 py-1 text-xs rounded-full ${
                    c.status === "Pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : c.status === "In Progress"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {c.status}
                </span>

              </div>
            ))}

          </div>
        )}

      </div>

    </div>
  );
}

export default AdminDashboard;