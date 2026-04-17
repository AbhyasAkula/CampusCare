import { useEffect, useState } from "react";
import API from "../utils/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function WardenDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [statusMap, setStatusMap] = useState({});
  const [notice, setNotice] = useState({ title: "", message: "" });
  const [allNotices, setAllNotices] = useState([]);

  const navigate = useNavigate();

  const loadComplaints = async () => {
    try {
      const res = await API.get("/warden");
      setComplaints(res.data);

      const updated = {};
      res.data.forEach((c) => {
        updated[c._id] = c.status;
      });
      setStatusMap(updated);
    } catch {
      toast.error("Failed to load complaints");
    }
  };

  const loadNotices = async () => {
    try {
      const res = await API.get("/warden/notices");
      setAllNotices(res.data);
    } catch {
      toast.error("Failed to load announcements");
    }
  };

  useEffect(() => {
    loadComplaints();
    loadNotices();
  }, []);

  const updateStatus = async (id) => {
    try {
      const selectedStatus = statusMap[id];
      await API.put(`/warden/${id}`, {
        status: selectedStatus,
      });
      toast.success("Complaint updated successfully");
      loadComplaints();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const postNotice = async (e) => {
    e.preventDefault();
    if (!notice.title || !notice.message)
      return toast.error("Please fill all fields");

    try {
      await API.post("/warden/notice", notice);
      toast.success("Announcement broadcasted");
      setNotice({ title: "", message: "" });
      loadNotices();
    } catch {
      toast.error("Failed to broadcast announcement");
    }
  };

  const deleteNotice = async (id) => {
    if (!window.confirm("Are you sure you want to delete this announcement?")) return;
    try {
      await API.delete(`/warden/notice/${id}`);
      setAllNotices((prev) => prev.filter((n) => n._id !== id));
      toast.success("Announcement deleted");
    } catch {
      toast.error("Failed to delete announcement");
    }
  };

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
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Warden Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">Manage hostel complaints and announcements.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Announcements */}
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <svg className="h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
              Broadcast Notice
            </h2>
            <form onSubmit={postNotice} className="space-y-4">
              <input
                type="text"
                placeholder="Notice Title"
                value={notice.title}
                onChange={(e) => setNotice({ ...notice, title: e.target.value })}
                className="block w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
              />
              <textarea
                placeholder="Write announcement details..."
                value={notice.message}
                onChange={(e) => setNotice({ ...notice, message: e.target.value })}
                rows={4}
                className="block w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 resize-none"
              />
              <button
                type="submit"
                className="w-full flex justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Publish Announcement
              </button>
            </form>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Recent Announcements</h2>
            <div className="space-y-3">
              {allNotices.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
                  No announcements posted yet
                </div>
              ) : (
                allNotices.map((n) => (
                  <div key={n._id} className="group flex justify-between gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4 transition-all hover:border-indigo-100 hover:bg-indigo-50/50">
                    <div>
                      <p className="font-medium text-slate-900">{n.title}</p>
                      <p className="mt-1 text-xs text-slate-600 line-clamp-2">{n.message}</p>
                    </div>
                    <button
                      onClick={() => deleteNotice(n._id)}
                      className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Complaints */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-slate-200 bg-slate-50/50 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Student Complaints</h2>
            </div>
            
            <div className="p-6">
              {complaints.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 py-12 text-center">
                  <p className="text-sm font-medium text-slate-900">All caught up!</p>
                  <p className="text-sm text-slate-500">No active complaints require your attention.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {complaints.map((c) => (
                    <div key={c._id} className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md">
                      <div className="flex items-start justify-between p-5 gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-bold text-slate-900">{c.title}</h3>
                            <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider ${statusColor(c.status)}`}>
                              {c.status}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600 mb-4">{c.description}</p>
                          
                          {c.image && (
                            <div className="mb-4 overflow-hidden rounded-lg border border-slate-200 w-fit cursor-pointer hover:opacity-90">
                              <img src={`http://localhost:5000/uploads/${c.image}`} alt="complaint" className="h-24 w-32 object-cover" />
                            </div>
                          )}
                          
                          <div className="flex flex-wrap items-center gap-3">
                            <div className="relative">
                              <select
                                className="appearance-none rounded-lg border border-slate-300 bg-slate-50 py-1.5 pl-3 pr-8 text-xs font-medium text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                value={statusMap[c._id] || c.status}
                                onChange={(e) => setStatusMap((prev) => ({ ...prev, [c._id]: e.target.value }))}
                              >
                                <option value="Pending">Pending</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Resolved">Resolved</option>
                              </select>
                              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-slate-500">
                                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                              </div>
                            </div>
                            <button
                              onClick={() => updateStatus(c._id)}
                              className="rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 transition-colors"
                            >
                              Update Status
                            </button>
                            <button
                              onClick={() => navigate(`/complaint/${c._id}/chat`)}
                              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                            >
                              View Chat
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WardenDashboard;