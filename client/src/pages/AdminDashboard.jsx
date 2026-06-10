import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/axios";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const navigate = useNavigate();

  const loadData = async () => {
    try { const r = await API.get("/admin/users"); setUsers(Array.isArray(r.data) ? r.data : []); } catch {}
    try { const r = await API.get("/admin/complaints"); setComplaints(Array.isArray(r.data) ? r.data : []); } catch {}
  };

  useEffect(() => { loadData(); }, []);

  const totalUsers = users.length;
  const totalComplaints = complaints.length;
  const pendingComplaints = complaints.filter((c) => c.status === "Pending").length;
  const resolvedComplaints = complaints.filter((c) => c.status === "Resolved").length;

  const recentComplaints = [...complaints]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 6);

  const getStatusCls = (status) => {
    if (status === "Pending") return "status-badge status-pending";
    if (status === "In Progress") return "status-badge status-progress";
    if (status === "Resolved") return "status-badge status-success";
    return "status-badge status-neutral";
  };

  const metrics = [
    { id: "users", label: "Total Users", value: totalUsers, note: "Registered accounts", trendCls: "text-brandText-muted", nav: "/admin/users",
      icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg> },
    { id: "complaints", label: "Total Complaints", value: totalComplaints, note: "All submitted", trendCls: "text-brandText-muted", nav: "/admin/complaints",
      icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg> },
    { id: "pending", label: "Pending", value: pendingComplaints, note: "Require action", trendCls: "text-status-warning", nav: "/admin/complaints?status=Pending",
      icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
    { id: "resolved", label: "Resolved", value: resolvedComplaints, note: "Completed", trendCls: "text-status-success", nav: "/admin/complaints?status=Resolved",
      icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-brandText">Admin Dashboard</h1>
        <p className="mt-1 text-sm font-medium text-brandText-muted">
          System-wide overview of users, complaints, and activity.
        </p>
      </header>

      {/* Metrics */}
      <section>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-brandText-muted">Overview</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((m) => (
            <button
              key={m.id}
              onClick={() => navigate(m.nav)}
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

      {/* Quick Nav */}
      <section>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-brandText-muted">Quick Actions</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { label: "User Management", desc: "View and manage all users", nav: "/admin/users",
              icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg> },
            { label: "Complaint Management", desc: "Review all submitted tickets", nav: "/admin/complaints",
              icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
            { label: "Emergency Contacts", desc: "Manage important numbers", nav: "/admin/emergency",
              icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.896-1.596-5.265-3.965-6.861-6.861l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg> },
          ].map((item) => (
            <button
              key={item.nav}
              onClick={() => navigate(item.nav)}
              className="portal-panel flex items-center gap-4 p-4 text-left transition hover:border-primary hover:shadow-md group"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-brandText-muted group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                {item.icon}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-brandText">{item.label}</p>
                <p className="mt-0.5 text-xs text-brandText-muted">{item.desc}</p>
              </div>
              <svg className="ml-auto h-4 w-4 shrink-0 text-brandBorder group-hover:text-primary transition-colors" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          ))}
        </div>
      </section>

      {/* Recent Complaints */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-brandText-muted">Recent Complaints</h2>
          <button onClick={() => navigate("/admin/complaints")} className="text-xs font-semibold text-primary hover:text-primary-hover">
            View all
          </button>
        </div>
        <div className="portal-panel overflow-hidden">
          {recentComplaints.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-sm text-brandText-muted">No complaints yet.</p>
            </div>
          ) : (
            <ul className="divide-y divide-brandBorder">
              {recentComplaints.map((c) => (
                <li key={c._id} className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-brandBorder bg-slate-50 text-sm font-bold text-brandText">
                      {c.student?.name?.charAt(0) || "U"}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-brandText">{c.title}</p>
                      <p className="mt-0.5 truncate text-xs text-brandText-muted">
                        {c.student?.name || "Unknown"} / Block {c.hostelBlock || c.block || "N/A"} / Room {c.roomNumber || c.room || "N/A"} / {new Date(c.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span className={`shrink-0 ${getStatusCls(c.status)}`}>{c.status}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}

export default AdminDashboard;
