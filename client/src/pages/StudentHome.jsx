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
    resolved: 0
  });

  const scrollToEmergency = () => {
    const section = document.getElementById("emergency-section");
    if (section) section.scrollIntoView({ behavior: "smooth" });
  };

  const loadInitialData = async () => {
    const profileRes = await API.get("/profile");
    setUser(profileRes.data);

    const noticeRes = await API.get("/warden/notices");
    setNotices(noticeRes.data);

    const contactRes = await API.get("/admin/contacts");
    setContacts(contactRes.data);

    const complaintRes = await API.get("/complaints/my");
    const complaints = complaintRes.data;

    const pending = complaints.filter(c => c.status === "Pending").length;
    const progress = complaints.filter(c => c.status === "In Progress").length;
    const resolved = complaints.filter(c => c.status === "Resolved").length;

    setStats({
      total: complaints.length,
      pending,
      progress,
      resolved
    });
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    const handleUpdate = (data) => {
      toast.success(`${data.title} → ${data.status}`);
      loadInitialData();
    };
    socket.on("complaintUpdated", handleUpdate);
    return () => socket.off("complaintUpdated", handleUpdate);
  }, []);

  useEffect(() => {
    const handleNotice = (notice) => {
      setNotices(prev => [notice, ...prev]);
      toast(`📢 ${notice.title}`);
    };
    socket.on("newNotice", handleNotice);
    return () => socket.off("newNotice", handleNotice);
  }, []);

  useEffect(() => {
    const handleDelete = (id) => {
      setNotices(prev => prev.filter(n => n._id !== id));
      toast.error("Announcement removed");
    };
    socket.on("deleteNotice", handleDelete);
    return () => socket.off("deleteNotice", handleDelete);
  }, []);

  if (!user) return (
    <div className="flex h-64 items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Welcome back, {user.name.split(" ")[0]} 👋
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Here's what's happening in your hostel today.
          </p>
        </div>
      </div>

      {/* QUICK ACTIONS & STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Action 1 */}
        <a href="/student/raise" className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-6 text-white shadow-soft transition-all hover:shadow-hover hover:-translate-y-1">
          <div className="relative z-10">
            <div className="mb-4 inline-flex rounded-xl bg-white/20 p-3 backdrop-blur-md">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold">Raise Ticket</h2>
            <p className="mt-1 text-indigo-100 text-sm">Report a new hostel issue</p>
          </div>
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10 blur-2xl group-hover:bg-white/20 transition-all"></div>
        </a>

        {/* Action 2 */}
        <a href="/student/complaints" className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 p-6 text-white shadow-soft transition-all hover:shadow-hover hover:-translate-y-1">
          <div className="relative z-10">
            <div className="mb-4 inline-flex rounded-xl bg-white/20 p-3 backdrop-blur-md">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold">My Complaints</h2>
            <p className="mt-1 text-blue-100 text-sm">{stats.pending} pending, {stats.resolved} resolved</p>
          </div>
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10 blur-2xl group-hover:bg-white/20 transition-all"></div>
        </a>

        {/* Action 3 */}
        <div onClick={scrollToEmergency} className="group cursor-pointer relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-500 to-orange-500 p-6 text-white shadow-soft transition-all hover:shadow-hover hover:-translate-y-1">
          <div className="relative z-10">
            <div className="mb-4 inline-flex rounded-xl bg-white/20 p-3 backdrop-blur-md">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold">Emergency Contacts</h2>
            <p className="mt-1 text-rose-100 text-sm">Quick access to help</p>
          </div>
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10 blur-2xl group-hover:bg-white/20 transition-all"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ANNOUNCEMENTS */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <svg className="h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
              Announcements
            </h2>
          </div>
          <div className="space-y-4">
            {notices.length === 0 && (
              <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center">
                <p className="text-slate-500">No new announcements</p>
              </div>
            )}
            {notices.map(n => (
              <div key={n._id} className="group rounded-xl border border-slate-100 bg-slate-50 p-4 transition-all hover:border-indigo-100 hover:bg-indigo-50/50">
                <p className="font-semibold text-slate-900">{n.title}</p>
                <p className="mt-1 text-sm text-slate-600">{n.message}</p>
              </div>
            ))}
          </div>
        </div>

        {/* EMERGENCY CONTACTS */}
        <div id="emergency-section" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <svg className="h-5 w-5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Emergency Contacts
            </h2>
          </div>
          {contacts.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center">
              <p className="text-slate-500">No contacts added yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {contacts.map(c => (
                <div key={c._id} className="flex items-center gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4 transition-all hover:border-rose-100 hover:bg-rose-50/50">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-600">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{c.title}</p>
                    <a href={`tel:${c.phone}`} className="text-sm font-medium text-rose-600 hover:text-rose-700">
                      {c.phone}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentHome;