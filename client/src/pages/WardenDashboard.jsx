import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../utils/axios";

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
      await API.put(`/warden/${id}`, { status: statusMap[id] });
      toast.success("Complaint updated successfully");
      loadComplaints();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const postNotice = async (e) => {
    e.preventDefault();
    if (!notice.title || !notice.message) {
      return toast.error("Please fill all fields");
    }

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

  const getStatusCls = (status) => {
    if (status === "Pending") return "status-badge status-pending";
    if (status === "In Progress") return "status-badge status-progress";
    if (status === "Resolved") return "status-badge status-success";
    return "status-badge status-neutral";
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-brandText">Warden Dashboard</h1>
          <p className="mt-1 text-sm font-medium text-brandText-muted">
            Manage hostel complaints and broadcast announcements.
          </p>
        </div>
        <button onClick={() => navigate("/warden/complaints")} className="portal-button-secondary self-start">
          View All Complaints
        </button>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[360px_1fr]">
        <aside className="space-y-6">
          <section className="portal-panel overflow-hidden">
            <div className="border-b border-brandBorder bg-[#F8FAFC] px-6 py-4">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-brandText">
                <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 0 1-3.417.592l-2.147-6.15M18 13a3 3 0 1 0 0-6M5.436 13.683A4.001 4.001 0 0 1 7 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 0 1-1.564-.317Z" />
                </svg>
                Broadcast Notice
              </h2>
              <p className="mt-0.5 text-xs text-brandText-muted">Notify students in real time.</p>
            </div>
            <div className="px-6 py-5">
              <form onSubmit={postNotice} className="space-y-4">
                <div>
                  <label className="portal-label">Title</label>
                  <input
                    type="text"
                    placeholder="Notice Title"
                    value={notice.title}
                    onChange={(e) => setNotice({ ...notice, title: e.target.value })}
                    className="portal-input mt-1.5"
                  />
                </div>
                <div>
                  <label className="portal-label">Message</label>
                  <textarea
                    placeholder="Write announcement details..."
                    value={notice.message}
                    onChange={(e) => setNotice({ ...notice, message: e.target.value })}
                    rows={4}
                    className="portal-input mt-1.5 resize-none"
                  />
                </div>
                <button type="submit" className="portal-button-primary w-full">
                  Publish Announcement
                </button>
              </form>
            </div>
          </section>

          <section className="portal-panel overflow-hidden">
            <div className="flex items-center justify-between border-b border-brandBorder bg-[#F8FAFC] px-6 py-4">
              <h2 className="text-sm font-semibold text-brandText">Recent Announcements</h2>
              <span className="status-badge status-neutral">{allNotices.length} total</span>
            </div>
            <div className="max-h-[420px] overflow-y-auto">
              {allNotices.length === 0 ? (
                <div className="px-6 py-10 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#F1F5F9] text-brandText-muted">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11 5.882V19.24a1.76 1.76 0 0 1-3.417.592l-2.147-6.15M18 13a3 3 0 1 0 0-6M5.436 13.683A4.001 4.001 0 0 1 7 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 0 1-1.564-.317Z" />
                    </svg>
                  </div>
                  <p className="mt-3 text-sm font-semibold text-brandText">No announcements yet</p>
                  <p className="mt-1 text-xs text-brandText-muted">Published notices will appear here.</p>
                </div>
              ) : (
                <ul className="divide-y divide-brandBorder">
                  {allNotices.map((n) => (
                    <li key={n._id} className="flex items-start justify-between gap-4 px-6 py-4 transition hover:bg-[#F8FAFC]">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-brandText">{n.title}</p>
                        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-brandText-muted">{n.message}</p>
                      </div>
                      <button
                        onClick={() => deleteNotice(n._id)}
                        className="shrink-0 rounded-lg border border-status-error/30 bg-surface px-2.5 py-1.5 text-xs font-semibold text-status-error transition hover:bg-status-error/10"
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        </aside>

        <section className="portal-panel overflow-hidden">
          <div className="flex items-center justify-between border-b border-brandBorder bg-[#F8FAFC] px-6 py-4">
            <div>
              <h2 className="text-sm font-semibold text-brandText">Student Complaints</h2>
              <p className="mt-0.5 text-xs text-brandText-muted">
                Update status or open a conversation with the student.
              </p>
            </div>
            <span className="status-badge status-neutral">{complaints.length} total</span>
          </div>

          {complaints.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F1F5F9] text-brandText-muted">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </div>
              <p className="mt-3 text-sm font-semibold text-brandText">All caught up</p>
              <p className="mt-1 text-xs text-brandText-muted">No active complaints require attention.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-brandBorder text-left text-sm">
                <thead className="bg-[#F8FAFC]">
                  <tr>
                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-brandText-muted">Complaint</th>
                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-brandText-muted">Status</th>
                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-brandText-muted">Set Status</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-brandText-muted">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brandBorder bg-surface">
                  {complaints.map((c) => (
                    <tr key={c._id} className="transition hover:bg-[#F8FAFC]">
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-3">
                          {c.image ? (
                            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-brandBorder bg-[#F8FAFC]">
                              <img src={`http://localhost:5000/uploads/${c.image}`} alt="complaint" className="h-full w-full object-cover" />
                            </div>
                          ) : (
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-brandBorder bg-[#F8FAFC] text-brandText-muted">
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 0 1 2.828 0L16 16m-2-2 1.586-1.586a2 2 0 0 1 2.828 0L20 14m-6-6h.01M6 20h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2Z" />
                              </svg>
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-brandText">{c.title}</p>
                            <p className="mt-0.5 line-clamp-2 max-w-lg text-xs text-brandText-muted">{c.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={getStatusCls(c.status)}>{c.status}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="relative w-40">
                          <select
                            className="portal-input appearance-none py-1.5 pl-3 pr-8 text-xs"
                            value={statusMap[c._id] || c.status}
                            onChange={(e) => setStatusMap((prev) => ({ ...prev, [c._id]: e.target.value }))}
                          >
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Resolved">Resolved</option>
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-brandText-muted">
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => updateStatus(c._id)} className="portal-button-primary px-3 py-1.5 text-xs">
                            Update
                          </button>
                          <button onClick={() => navigate(`/complaint/${c._id}/chat`)} className="portal-button-secondary px-3 py-1.5 text-xs">
                            Chat
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default WardenDashboard;
