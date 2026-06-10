import { useEffect, useState } from "react";
import API from "../utils/axios";
import toast from "react-hot-toast";

function WardenAnnouncements() {
  const [notice, setNotice] = useState({ title: "", message: "" });
  const [allNotices, setAllNotices] = useState([]);
  const [isPosting, setIsPosting] = useState(false);

  const loadNotices = async () => {
    try {
      const res = await API.get("/warden/notices");
      setAllNotices(res.data);
    } catch {
      toast.error("Failed to load announcements");
    }
  };

  useEffect(() => { loadNotices(); }, []);

  const postNotice = async (e) => {
    e.preventDefault();
    if (!notice.title || !notice.message) return toast.error("Please fill title & message");
    setIsPosting(true);
    try {
      await API.post("/warden/notice", notice);
      toast.success("Announcement broadcasted successfully");
      setNotice({ title: "", message: "" });
      loadNotices();
    } catch {
      toast.error("Failed to post announcement");
    } finally {
      setIsPosting(false);
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

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Page Header */}
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-brandText">Hostel Announcements</h1>
        <p className="mt-1 text-sm font-medium text-brandText-muted">
          Broadcast important information to all students.
        </p>
      </header>

      {/* Compose Card */}
      <div className="portal-panel overflow-hidden">
        <div className="border-b border-brandBorder bg-slate-50/50 px-6 py-4">
          <h2 className="text-sm font-semibold text-brandText">Create Announcement</h2>
          {/* <p className="mt-0.5 text-xs text-brandText-muted">Announcements are broadcast in real-time to all logged-in students.</p> */}
        </div>
        <div className="px-6 py-5">
          <form onSubmit={postNotice} className="space-y-4">
            <div>
              <label className="portal-label">Title *</label>
              <input
                placeholder="e.g. Scheduled Power Outage – Block A"
                value={notice.title}
                onChange={(e) => setNotice({ ...notice, title: e.target.value })}
                className="portal-input mt-1.5"
                required
              />
            </div>
            <div>
              <label className="portal-label">Message *</label>
              <textarea
                placeholder="Write the full announcement details here..."
                value={notice.message}
                onChange={(e) => setNotice({ ...notice, message: e.target.value })}
                className="portal-input mt-1.5 h-28 resize-none"
                required
              />
            </div>
            <div className="pt-1">
              <button
                type="submit"
                disabled={isPosting}
                className="portal-button-primary disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPosting ? "Broadcasting..." : "Broadcast to Students"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Notice List */}
      <div className="portal-panel overflow-hidden">
        <div className="flex items-center justify-between border-b border-brandBorder bg-slate-50/50 px-6 py-4">
          <h2 className="text-sm font-semibold text-brandText">Posted Announcements</h2>
          <span className="status-badge bg-primary/10 text-primary border-primary/20">
            {allNotices.length} total
          </span>
        </div>

        {allNotices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
              <svg className="h-6 w-6 text-brandText-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
            </div>
            <p className="mt-3 text-sm font-semibold text-brandText">No announcements yet</p>
            <p className="mt-1 text-xs text-brandText-muted">Announcements you post will appear here.</p>
          </div>
        ) : (
          <ul className="divide-y divide-brandBorder">
            {allNotices.map((n) => (
              <li key={n._id} className="flex items-start justify-between gap-4 px-6 py-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-brandText">{n.title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-brandText-muted whitespace-pre-wrap">{n.message}</p>
                  </div>
                </div>
                <button
                  onClick={() => deleteNotice(n._id)}
                  className="shrink-0 inline-flex items-center gap-1 rounded-lg border border-brandBorder px-2.5 py-1.5 text-xs font-semibold text-status-error transition-colors hover:border-status-error hover:bg-status-error/10 focus:outline-none"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default WardenAnnouncements;
