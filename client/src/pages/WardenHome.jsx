import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/axios";

function WardenHome() {

  const navigate = useNavigate();

  const [stats, setStats] = useState({
    pending: 0,
    progress: 0,
    resolved: 0
  });

  const [recent, setRecent] = useState([]);

  const loadComplaints = async () => {

    const res = await API.get("/warden");

    const complaints = res.data;

    const pending = complaints.filter(c => c.status === "Pending").length;
    const progress = complaints.filter(c => c.status === "In Progress").length;
    const resolved = complaints.filter(c => c.status === "Resolved").length;

    setStats({ pending, progress, resolved });

    const sorted = [...complaints]
      .sort((a,b)=> new Date(b.createdAt)-new Date(a.createdAt))
      .slice(0,5);

    setRecent(sorted);
  };

  useEffect(()=>{
    loadComplaints();
  },[]);

  return (
    <div className="space-y-8">

      <h1 className="text-2xl font-bold">Warden Dashboard</h1>

      {/* ================= STATS CARDS ================= */}

      <div className="grid grid-cols-3 gap-6">

        {/* Pending */}
        <div
          onClick={() => navigate("/warden/complaints?status=Pending")}
          className="bg-white p-6 rounded-xl shadow cursor-pointer hover:shadow-lg transition"
        >
          <p className="text-gray-500">Pending</p>
          <p className="text-3xl font-bold text-red-500">{stats.pending}</p>
          <p className="text-xs text-gray-400 mt-1">Click to view</p>
        </div>

        {/* In Progress */}
        <div
          onClick={() => navigate("/warden/complaints?status=In%20Progress")}
          className="bg-white p-6 rounded-xl shadow cursor-pointer hover:shadow-lg transition"
        >
          <p className="text-gray-500">In Progress</p>
          <p className="text-3xl font-bold text-yellow-500">{stats.progress}</p>
          <p className="text-xs text-gray-400 mt-1">Click to view</p>
        </div>

        {/* Resolved */}
        <div
          onClick={() => navigate("/warden/complaints?status=Resolved")}
          className="bg-white p-6 rounded-xl shadow cursor-pointer hover:shadow-lg transition"
        >
          <p className="text-gray-500">Resolved</p>
          <p className="text-3xl font-bold text-green-500">{stats.resolved}</p>
          <p className="text-xs text-gray-400 mt-1">Click to view</p>
        </div>

      </div>

      {/* ================= RECENT COMPLAINTS ================= */}

      <div className="bg-white p-6 rounded-xl shadow">

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Recent Complaints</h2>

          <button
            onClick={() => navigate("/warden/complaints")}
            className="text-sm text-blue-600 hover:underline"
          >
            View All
          </button>
        </div>

        {recent.length === 0 ? (
          <p className="text-gray-400">No complaints yet</p>
        ) : (
          recent.map(c => (
            <div
              key={c._id}
              className="border-b py-3 flex justify-between items-center"
            >

              <div>
                <p className="font-semibold">{c.title}</p>
                <p className="text-sm text-gray-500">
                  Block {c.block || "-"} • Room {c.room || "-"}
                </p>
              </div>

              <span
                className={`text-xs px-2 py-1 rounded ${
                  c.status === "Pending"
                    ? "bg-red-100 text-red-600"
                    : c.status === "In Progress"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {c.status}
              </span>

            </div>
          ))
        )}

      </div>

    </div>
  );
}

export default WardenHome;