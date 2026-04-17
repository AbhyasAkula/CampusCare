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

  const totalUsers = users.length;
  const totalComplaints = complaints.length;
  const pendingComplaints = complaints.filter(c => c.status === "Pending").length;
  const resolvedComplaints = complaints.filter(c => c.status === "Resolved").length;

  const recentComplaints = [...complaints]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const statusColor = (status) => {
    if (status === "Pending")
      return "bg-amber-100 text-amber-700 border-amber-200";
    if (status === "In Progress")
      return "bg-blue-100 text-blue-700 border-blue-200";
    if (status === "Resolved")
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    return "bg-slate-100 text-slate-700 border-slate-200";
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">Overview of hostel system activity</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          onClick={() => navigate("/admin/users")}
          className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-slate-200 cursor-pointer transition-all hover:shadow-md hover:border-indigo-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Total Users</p>
              <h2 className="mt-2 text-3xl font-bold text-slate-900">{totalUsers}</h2>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div
          onClick={() => navigate("/admin/complaints")}
          className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-slate-200 cursor-pointer transition-all hover:shadow-md hover:border-blue-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Total Complaints</p>
              <h2 className="mt-2 text-3xl font-bold text-slate-900">{totalComplaints}</h2>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
        </div>

        <div
          onClick={() => navigate("/admin/complaints?status=Pending")}
          className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-slate-200 cursor-pointer transition-all hover:shadow-md hover:border-amber-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Pending Complaints</p>
              <h2 className="mt-2 text-3xl font-bold text-slate-900">{pendingComplaints}</h2>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600 transition-colors group-hover:bg-amber-500 group-hover:text-white">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div
          onClick={() => navigate("/admin/complaints?status=Resolved")}
          className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-slate-200 cursor-pointer transition-all hover:shadow-md hover:border-emerald-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Resolved</p>
              <h2 className="mt-2 text-3xl font-bold text-slate-900">{resolvedComplaints}</h2>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition-colors group-hover:bg-emerald-500 group-hover:text-white">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-slate-200 bg-slate-50/50 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Recent Complaints</h2>
          <button onClick={() => navigate('/admin/complaints')} className="text-sm font-medium text-indigo-600 hover:text-indigo-700">View all &rarr;</button>
        </div>
        
        {recentComplaints.length === 0 ? (
          <div className="p-8 text-center text-slate-500">No complaints yet</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentComplaints.map((c) => (
              <div key={c._id} className="flex items-center justify-between p-6 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm flex-shrink-0">
                    {c.student?.name?.charAt(0) || "U"}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{c.title}</p>
                    <p className="text-sm text-slate-500">
                      {c.student?.name || "Unknown"} &bull; {c.block} {c.room} &bull; {new Date(c.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span className={`inline-flex flex-shrink-0 items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusColor(c.status)}`}>
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