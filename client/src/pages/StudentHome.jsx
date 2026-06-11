import { useEffect, useState } from "react";
import API from "../utils/axios";
import socket from "../utils/socket";
import toast from "react-hot-toast";

function StudentHome() {
  const [user, setUser] = useState(null);
  const [notices, setNotices] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    progress: 0,
    resolved: 0,
  });

  const scrollToEmergency = () => {
    const section = document.getElementById("emergency-section");
    if (section) section.scrollIntoView({ behavior: "smooth" });
  };

  const loadInitialData = async () => {
    try {
      const profileRes = await API.get("/profile");
      setUser(profileRes.data);

      const noticeRes = await API.get("/warden/notices");
      setNotices(noticeRes.data);

      const contactRes = await API.get("/admin/contacts");
      setContacts(contactRes.data);

      const complaintRes = await API.get("/complaints/my");
      const complaints = complaintRes.data;

      setStats({
        total: complaints.length,
        pending: complaints.filter((c) => c.status === "Pending").length,
        progress: complaints.filter((c) => c.status === "In Progress").length,
        resolved: complaints.filter((c) => c.status === "Resolved").length,
      });
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    const handleUpdate = (data) => {
      toast.success(`${data.title} -> ${data.status}`);
      loadInitialData();
    };
    socket.on("complaintUpdated", handleUpdate);
    return () => socket.off("complaintUpdated", handleUpdate);
  }, []);

  useEffect(() => {
    const handleNotice = (notice) => {
      setNotices((prev) => [notice, ...prev]);
      toast(notice.title, { icon: "i" });
    };
    socket.on("newNotice", handleNotice);
    return () => socket.off("newNotice", handleNotice);
  }, []);

  useEffect(() => {
    const handleDelete = (id) => {
      setNotices((prev) => prev.filter((notice) => notice._id !== id));
      toast.error("Announcement removed");
    };
    socket.on("deleteNotice", handleDelete);
    return () => socket.off("deleteNotice", handleDelete);
  }, []);

  if (!user) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-1 mb-6">
          <div className="skeleton h-6 w-48 rounded-md" />
          <div className="skeleton h-4 w-72 rounded-md" />
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="portal-panel p-5">
              <div className="skeleton h-4 w-20 rounded-md" />
              <div className="mt-3 skeleton h-8 w-16 rounded-md" />
            </div>
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="portal-panel p-4 flex items-center gap-4">
              <div className="skeleton h-10 w-10 rounded-lg shrink-0" />
              <div className="flex flex-col gap-2 w-full">
                <div className="skeleton h-4 w-24 rounded-md" />
                <div className="skeleton h-3 w-32 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const overviewMetrics = [
    {
      id: "total",
      label: "Total Tickets",
      value: stats.total,
      note: "Submitted issues",
      icon: (
        <svg className="h-5 w-5 text-brandText-muted" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      ),
      trendColor: "text-brandText-muted",
    },
    {
      id: "pending",
      label: "Pending",
      value: stats.pending,
      note: "Awaiting action",
      icon: (
        <svg className="h-5 w-5 text-brandText-muted" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      trendColor: "text-status-warning",
    },
    {
      id: "progress",
      label: "In Progress",
      value: stats.progress,
      note: "Being handled",
      icon: (
        <svg className="h-5 w-5 text-brandText-muted" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
        </svg>
      ),
      trendColor: "text-primary",
    },
    {
      id: "resolved",
      label: "Resolved",
      value: stats.resolved,
      note: "Closed requests",
      icon: (
        <svg className="h-5 w-5 text-brandText-muted" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      trendColor: "text-status-success",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <header className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-brandText">
          Welcome back, {user.name.split(" ")[0]}
        </h1>
        <p className="mt-1 text-sm font-medium text-brandText-muted">
          {/* Track complaints, monitor updates, and manage hostel requests. */}
        </p>
      </header>

      {/* Section 1: Overview */}
      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-brandText-muted">
          Overview
        </h2>
        <div className="grid gap-4 md:grid-cols-4">
          {overviewMetrics.map((item) => (
            <div key={item.id} className="enterprise-card">
              <div className="flex items-start justify-between">
                <p className="text-sm font-semibold text-brandText">{item.label}</p>
                {item.icon}
              </div>
              <p className="mt-3 text-3xl font-bold tracking-tight text-brandText">
                {item.value}
              </p>
              <div className="mt-1 flex items-center gap-1.5">
                <span className={`text-xs font-semibold ${item.trendColor}`}>
                  {item.value > 0 ? "Active" : "Stable"}
                </span>
                <span className="text-xs font-medium text-brandText-muted">
                  / {item.note}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 2: Quick Actions */}
      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-brandText-muted">
          Quick Actions
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          <a
            href="/student/raise"
            className="enterprise-card group flex items-center gap-4 p-4"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-brandText truncate">Raise Ticket</p>
              <p className="mt-0.5 text-xs text-brandText-muted truncate">Report a new hostel issue</p>
            </div>
            <svg className="h-4 w-4 text-brandBorder group-hover:text-primary transition-colors" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </a>

          <a
            href="/student/complaints"
            className="enterprise-card group flex items-center gap-4 p-4"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-brandText-muted group-hover:bg-primary/10 group-hover:text-primary transition-colors">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-brandText truncate">My Complaints</p>
              <p className="mt-0.5 text-xs text-brandText-muted truncate">
                {stats.pending} pending, {stats.resolved} resolved
              </p>
            </div>
            <svg className="h-4 w-4 text-brandBorder group-hover:text-primary transition-colors" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </a>

          <button
            type="button"
            onClick={scrollToEmergency}
            className="enterprise-card group flex items-center gap-4 p-4 text-left hover:border-status-warning/50"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-status-warning/10 text-status-warning group-hover:bg-status-warning group-hover:text-white transition-colors">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-brandText truncate">Emergency Contacts</p>
              <p className="mt-0.5 text-xs text-brandText-muted truncate">Quick access to support</p>
            </div>
            <svg className="h-4 w-4 text-brandBorder group-hover:text-status-warning transition-colors" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      </section>

      {/* Section 3: Updates */}
      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-brandText-muted">
          Updates & Directories
        </h2>
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Announcements Card */}
          <div className="portal-panel flex flex-col overflow-hidden h-[340px]">
            <div className="flex items-center justify-between border-b border-brandBorder bg-[#F8FAFC] px-5 py-3">
              <div>
                <h3 className="text-sm font-semibold text-brandText">Announcements</h3>
                <p className="text-xs font-medium text-brandText-muted">Latest hostel updates</p>
              </div>
              <span className="status-badge bg-primary/10 text-primary border-primary/20">
                {notices.length} 
              </span>
            </div>

            <div className="flex-1 overflow-y-auto">
              {notices.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center p-6 text-center">
                  <div className="empty-state-icon">
                    <svg className="h-6 w-6 text-brandText-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <p className="mt-3 text-sm font-semibold text-brandText">No announcements</p>
                  <p className="mt-1 text-xs text-brandText-muted">Updates will appear here.</p>
                </div>
              ) : (
                <ul className="divide-y divide-brandBorder">
                  {notices.map((notice) => (
                    <li key={notice._id} className="p-4 hover:bg-slate-50 transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-brandText">{notice.title}</p>
                          <p className="mt-1 text-xs leading-relaxed text-brandText-muted line-clamp-2">
                            {notice.message}
                          </p>
                        </div>
                        <span className="shrink-0 text-[10px] font-medium text-brandText-muted">
                          {new Date(notice.createdAt || Date.now()).toLocaleDateString()}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Emergency Contacts Card */}
          <div id="emergency-section" className="portal-panel flex flex-col overflow-hidden h-[340px]">
            <div className="flex items-center justify-between border-b border-brandBorder bg-[#F8FAFC] px-5 py-3">
              <div>
                <h3 className="text-sm font-semibold text-brandText">Emergency Contacts</h3>
                <p className="text-xs font-medium text-brandText-muted">Important support numbers</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {contacts.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center p-6 text-center">
                  <div className="empty-state-icon">
                    <svg className="h-6 w-6 text-brandText-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <p className="mt-3 text-sm font-semibold text-brandText">No contacts</p>
                  <p className="mt-1 text-xs text-brandText-muted">Contacts will appear here.</p>
                </div>
              ) : (
                <ul className="divide-y divide-brandBorder">
                  {contacts.map((contact) => (
                    <li key={contact._id} className="p-4 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brandBorder/50 text-brandText-muted">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                            </svg>
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-brandText truncate">{contact.title}</p>
                            <p className="text-xs font-medium text-brandText-muted truncate">{contact.phone}</p>
                          </div>
                        </div>
                        <a
                          href={`tel:${contact.phone}`}
                          className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-brandBorder bg-surface px-2.5 py-1.5 text-xs font-semibold text-brandText transition hover:bg-slate-50 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        >
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.896-1.596-5.265-3.965-6.861-6.861l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                          </svg>
                          Call
                        </a>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default StudentHome;
