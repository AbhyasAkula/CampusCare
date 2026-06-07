import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/axios";

function WardenHome() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ pending: 0, progress: 0, resolved: 0, total: 0 });
  const [recent, setRecent] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadComplaints = async () => {
    try {
      const res = await API.get("/warden");
      const complaints = res.data;
      const pending = complaints.filter((c) => c.status === "Pending").length;
      const progress = complaints.filter((c) => c.status === "In Progress").length;
      const resolved = complaints.filter((c) => c.status === "Resolved").length;
      setStats({ pending, progress, resolved, total: complaints.length });
      setRecent([...complaints].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 6));
    } catch {
      console.log("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadComplaints(); }, []);

  const getStatusCls = (status) => {
    if (status === "Pending") return "status-badge status-pending";
    if (status === "In Progress") return "status-badge status-progress";
    if (status === "Resolved") return "status-badge status-success";
    return "status-badge status-neutral";
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-7 w-48 rounded-md" />
        <div className="grid gap-4 sm:grid-cols-4">
          {[...Array(4)].map((_, i) => <div key={i} className="portal-panel p-5 skeleton h-24" />)}
        </div>
      </div>
    );
  }

  const metrics = [
    { id: "total", label: "Total", value: stats.total, note: "All complaints", trendCls: "text-brandText-muted",
      icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg> },
    { id: "pending", label: "Pending", value: stats.pending, note: "Require action", trendCls: "text-status-warning",
      icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
    { id: "progress", label: "In Progress", value: stats.progress, note: "Being handled", trendCls: "text-primary",
      icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" /></svg> },
    { id: "resolved", label: "Resolved", value: stats.resolved, note: "Completed", trendCls: "text-status-success",
      icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-brandText">Warden Overview</h1>
        <p className="mt-1 text-sm font-medium text-brandText-muted">
          Here's what's happening in the hostel today.
        </p>
      </header>

      {/* Metrics */}
      <section>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-brandText-muted">Overview</h2>
        <div className="grid gap-4 sm:grid-cols-4">
          {metrics.map((m) => (
            <button
              key={m.id}
              onClick={() => m.id !== "total" && navigate(`/warden/complaints?status=${encodeURIComponent(m.label === "In Progress" ? "In Progress" : m.label)}`)}
              className="portal-panel p-5 text-left transition hover:border-primary hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <p className="text-sm font-semibold text-brandText">{m.label}</p>
                <span className="text-brandText-muted">{m.icon}</span>
              </div>
              <p className="mt-3 text-3xl font-bold tracking-tight text-brandText">{m.value}</p>
              <div className="mt-1 flex items-center gap-1.5">
                <span className={`text-xs font-semibold ${m.trendCls}`}>{m.value > 0 ? "Active" : "Clear"}</span>
                <span className="text-xs text-brandText-muted">• {m.note}</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Recent Complaints */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-brandText-muted">Recent Complaints</h2>
          <button onClick={() => navigate("/warden/complaints")} className="text-xs font-semibold text-primary hover:text-primary-hover">
            View all
          </button>
        </div>
        <div className="portal-panel overflow-hidden">
          {recent.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                <svg className="h-6 w-6 text-brandText-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="mt-3 text-sm font-semibold text-brandText">All caught up!</p>
              <p className="mt-1 text-xs text-brandText-muted">No active complaints require attention.</p>
            </div>
          ) : (
            <ul className="divide-y divide-brandBorder">
              {recent.map((c) => (
                <li
                  key={c._id}
                  onClick={() => navigate(`/complaint/${c._id}/chat`)}
                  className="flex cursor-pointer items-center justify-between gap-4 px-6 py-4 transition hover:bg-slate-50"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary text-xs font-bold">
                      #{c._id.slice(-4).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-brandText">{c.title}</p>
                      <p className="mt-0.5 text-xs text-brandText-muted">Block {c.block || "N/A"} / Room {c.room || "N/A"}</p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className={getStatusCls(c.status)}>{c.status}</span>
                    <svg className="h-4 w-4 text-brandText-muted" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}

export default WardenHome;
