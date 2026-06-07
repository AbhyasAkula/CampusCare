import { useEffect, useState } from "react";
import API from "../utils/axios";
import toast from "react-hot-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import socket from "../utils/socket";

function WardenComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [statusMap, setStatusMap] = useState({});
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const statusFilter = searchParams.get("status");

  const loadComplaints = async () => {
    try {
      const res = await API.get("/warden");
      const sorted = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setComplaints(sorted);
      const map = {};
      sorted.forEach((c) => (map[c._id] = c.status));
      setStatusMap(map);
    } catch {
      toast.error("Failed to load complaints");
    }
  };

  useEffect(() => { loadComplaints(); }, []);

  useEffect(() => {
    socket.on("newComplaint", (complaint) => {
      toast.success(`New Complaint: ${complaint.title}`);
      setComplaints((prev) => [complaint, ...prev]);
      setStatusMap((prev) => ({ ...prev, [complaint._id]: complaint.status }));
    });
    return () => { socket.off("newComplaint"); };
  }, []);

  const updateStatus = async (id) => {
    try {
      await API.put(`/warden/${id}`, { status: statusMap[id] });
      toast.success("Status updated");
      loadComplaints();
    } catch {
      toast.error("Update failed");
    }
  };

  const filteredComplaints = statusFilter
    ? complaints.filter((c) => c.status === statusFilter)
    : complaints;

  const getStatusCls = (status) => {
    if (status === "Pending") return "status-badge status-pending";
    if (status === "In Progress") return "status-badge status-progress";
    if (status === "Resolved") return "status-badge status-success";
    return "status-badge status-neutral";
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-brandText">
            {statusFilter ? `${statusFilter} Complaints` : "All Complaints"}
          </h1>
          <p className="mt-1 text-sm font-medium text-brandText-muted">Manage and resolve student hostel issues.</p>
        </div>
        {statusFilter && (
          <button
            onClick={() => navigate("/warden/complaints")}
            className="portal-button-secondary self-start"
          >
            Clear Filter
          </button>
        )}
      </header>

      {filteredComplaints.length === 0 ? (
        <div className="portal-panel flex flex-col items-center justify-center py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
            <svg className="h-7 w-7 text-brandText-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="mt-3 text-sm font-semibold text-brandText">No complaints found</p>
          <p className="mt-1 text-xs text-brandText-muted">No complaints match your current criteria.</p>
        </div>
      ) : (
        <div className="portal-panel overflow-hidden">
          <div className="border-b border-brandBorder bg-slate-50/50 px-6 py-3">
            <p className="text-sm font-semibold text-brandText">{filteredComplaints.length} complaint{filteredComplaints.length !== 1 ? "s" : ""}</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-brandBorder text-sm text-left">
              <thead className="bg-slate-50/50">
                <tr className="text-xs font-semibold uppercase tracking-wider text-brandText-muted">
                  <th className="px-6 py-3">Complaint</th>
                  <th className="px-6 py-3">Student</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Update Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brandBorder bg-surface">
                {filteredComplaints.map((c) => (
                  <tr key={c._id} className="transition hover:bg-slate-50">
                    <td className="px-6 py-4 max-w-xs">
                      <div className="flex items-start gap-3">
                        {c.image ? (
                          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-brandBorder">
                            <img src={`http://localhost:5000/uploads/${c.image}`} alt={c.title} className="h-full w-full object-cover" />
                          </div>
                        ) : (
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-brandBorder bg-slate-50 text-brandText-muted">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-semibold text-brandText line-clamp-1">{c.title}</p>
                          <p className="mt-0.5 text-xs text-brandText-muted line-clamp-2">{c.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-brandText-muted">
                      <p className="font-semibold text-brandText">{c.student?.name || "Unknown student"}</p>
                      <p className="mt-0.5">Block {c.block || "N/A"} / Room {c.room || "N/A"}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={getStatusCls(c.status)}>{c.status}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative">
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
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => updateStatus(c._id)}
                          className="portal-button-primary text-xs px-3 py-1.5"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => navigate(`/complaint/${c._id}/chat`)}
                          className="portal-button-secondary text-xs px-3 py-1.5"
                        >
                          Chat
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default WardenComplaints;
