import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/axios";
import socket from "../utils/socket";

const STATUS_CONFIG = {
  "Pending":     { cls: "status-badge status-pending",  label: "Pending" },
  "In Progress": { cls: "status-badge status-progress",  label: "In Progress" },
  "Resolved":    { cls: "status-badge status-success",   label: "Resolved" },
};

function MyComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadComplaints = async () => {
    try {
      setLoading(true);
      const res = await API.get("/complaints/my");
      setComplaints(res.data);
    } catch (err) {
      console.error("Failed to load complaints", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadComplaints(); }, []);

  useEffect(() => {
    const handleUpdate = () => loadComplaints();
    socket.on("complaintUpdated", handleUpdate);
    return () => socket.off("complaintUpdated", handleUpdate);
  }, []);

  useEffect(() => {
    const handleMessageActivity = ({ complaintId, senderRole, unreadCount, studentUnreadCount }) => {
      if (senderRole !== "warden") return;
      const nextUnreadCount = Number(studentUnreadCount ?? unreadCount ?? 0);
      setComplaints((prev) =>
        prev.map((complaint) =>
          complaint._id === complaintId
            ? { ...complaint, studentUnreadCount: nextUnreadCount }
            : complaint
        )
      );
    };
    const handleRead = ({ complaintId, role }) => {
      if (role !== "student") return;
      setComplaints((prev) =>
        prev.map((complaint) =>
          complaint._id === complaintId
            ? { ...complaint, studentUnreadCount: 0 }
            : complaint
        )
      );
    };

    socket.on("complaintMessageActivity", handleMessageActivity);
    socket.on("complaintRead", handleRead);
    return () => {
      socket.off("complaintMessageActivity", handleMessageActivity);
      socket.off("complaintRead", handleRead);
    };
  }, []);

  const getStatusCls = (status) =>
    STATUS_CONFIG[status]?.cls || "status-badge status-neutral";

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-brandText">My Complaints</h1>
          <p className="mt-1 text-sm font-medium text-brandText-muted">
            Track the status of your reported hostel issues.
          </p>
        </div>
        <button onClick={() => navigate("/student/raise")} className="portal-button-primary self-start">
          + Raise New Ticket
        </button>
      </header>

      {loading ? (
        <div className="portal-panel overflow-hidden">
          <div className="divide-y divide-brandBorder">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-6 py-4">
                <div className="skeleton h-10 w-10 rounded-lg shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="skeleton h-4 w-48 rounded-md" />
                  <div className="skeleton h-3 w-72 rounded-md" />
                </div>
                <div className="skeleton h-6 w-20 rounded-full" />
                <div className="skeleton h-8 w-24 rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      ) : complaints.length === 0 ? (
        <div className="portal-panel flex flex-col items-center justify-center py-16 text-center">
          <div className="empty-state-icon h-14 w-14">
            <svg className="h-7 w-7 text-brandText-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <h2 className="mt-4 text-base font-semibold text-brandText">No complaints yet</h2>
          <p className="mt-1.5 text-sm text-brandText-muted">You have not reported any hostel issue yet.</p>
          <button onClick={() => navigate("/student/raise")} className="portal-button-primary mt-6">
            Raise Your First Ticket
          </button>
        </div>
      ) : (
        <div className="portal-panel overflow-hidden">
          <div className="flex items-center justify-between border-b border-brandBorder bg-[#F8FAFC] px-6 py-3">
            <p className="text-sm font-semibold text-brandText">{complaints.length} complaint{complaints.length !== 1 ? "s" : ""}</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-brandBorder text-left text-sm">
              <thead className="bg-[#F8FAFC]">
                <tr className="text-xs font-semibold uppercase tracking-wider text-brandText-muted">
                  <th className="px-6 py-3">Issue</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brandBorder bg-surface">
                {complaints.map((complaint) => {
                  const studentUnreadCount = Number(complaint.studentUnreadCount || 0);

                  return (
                  <tr key={complaint._id} className="transition hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {complaint.image ? (
                          <div className="h-10 w-10 overflow-hidden rounded-lg border border-brandBorder bg-slate-50 shrink-0">
                            <img
                              src={`http://localhost:5000/uploads/${complaint.image}`}
                              alt={complaint.title}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-brandBorder bg-slate-50 text-brandText-muted shrink-0">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-brandText">{complaint.title}</p>
                          <p className="mt-0.5 truncate text-xs text-brandText-muted max-w-xs">{complaint.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={getStatusCls(complaint.status)}>{complaint.status}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-brandText-muted">
                      {new Date(complaint.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => navigate(`/complaint/${complaint._id}/chat`)}
                        className={
                          studentUnreadCount > 0
                            ? "inline-flex items-center justify-center rounded-lg border border-primary/25 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary/15"
                            : "portal-button-secondary text-xs px-3 py-1.5"
                        }
                      >
                        {studentUnreadCount > 0
                          ? `${studentUnreadCount} New`
                          : "Chat"}
                      </button>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyComplaints;
