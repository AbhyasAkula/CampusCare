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
  const [isLoading, setIsLoading] = useState(true);

  const loadComplaints = async () => {
    try {
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
    } catch (err) {
      console.log("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(()=>{
    loadComplaints();
  },[]);

  const statusColor = (status) => {
    if (status === "Pending")
      return "bg-amber-100 text-amber-700 border-amber-200";
    if (status === "In Progress")
      return "bg-blue-100 text-blue-700 border-blue-200";
    if (status === "Resolved")
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    return "bg-slate-100 text-slate-700 border-slate-200";
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Warden Overview</h1>
          <p className="mt-1 text-sm text-slate-500">Here's what's happening in the hostel today.</p>
        </div>
      </div>

      {/* ================= STATS CARDS ================= */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {/* Pending */}
        <div
          onClick={() => navigate("/warden/complaints?status=Pending")}
          className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md cursor-pointer"
        >
          <div className="absolute right-0 top-0 -mr-8 -mt-8 h-32 w-32 rounded-full bg-amber-500/10 transition-transform group-hover:scale-110"></div>
          <div className="relative">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Pending</p>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <p className="text-4xl font-bold tracking-tight text-slate-900">{stats.pending}</p>
              <p className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">Require Action</p>
            </div>
          </div>
        </div>

        {/* In Progress */}
        <div
          onClick={() => navigate("/warden/complaints?status=In%20Progress")}
          className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md cursor-pointer"
        >
          <div className="absolute right-0 top-0 -mr-8 -mt-8 h-32 w-32 rounded-full bg-blue-500/10 transition-transform group-hover:scale-110"></div>
          <div className="relative">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">In Progress</p>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <p className="text-4xl font-bold tracking-tight text-slate-900">{stats.progress}</p>
              <p className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Being fixed</p>
            </div>
          </div>
        </div>

        {/* Resolved */}
        <div
          onClick={() => navigate("/warden/complaints?status=Resolved")}
          className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md cursor-pointer"
        >
          <div className="absolute right-0 top-0 -mr-8 -mt-8 h-32 w-32 rounded-full bg-emerald-500/10 transition-transform group-hover:scale-110"></div>
          <div className="relative">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Resolved</p>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <p className="text-4xl font-bold tracking-tight text-slate-900">{stats.resolved}</p>
              <p className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Completed</p>
            </div>
          </div>
        </div>
      </div>

      {/* ================= RECENT COMPLAINTS ================= */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-slate-200 bg-slate-50/50 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Recent Complaints</h2>
          <button
            onClick={() => navigate("/warden/complaints")}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            View All →
          </button>
        </div>

        <div className="p-0">
          {recent.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-sm font-medium text-slate-900">No active complaints</p>
              <p className="text-sm text-slate-500 mt-1">Everything is running smoothly.</p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {recent.map(c => (
                <li
                  key={c._id}
                  onClick={() => navigate(`/complaint/${c._id}/chat`)}
                  className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-4">
                    <div className="hidden sm:flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 font-semibold text-sm">
                      #{c._id.slice(-4).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">{c.title}</p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 font-medium">
                        <span className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-md">
                          <svg className="h-3 w-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          Block {c.block || "-"}
                        </span>
                        <span className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-md">
                          <svg className="h-3 w-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                          </svg>
                          Room {c.room || "-"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] uppercase font-bold tracking-wider ${statusColor(c.status)}`}>
                      {c.status}
                    </span>
                    <svg className="h-5 w-5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity -ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default WardenHome;