import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/axios";
import socket from "../utils/socket";

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

  useEffect(() => {
    loadComplaints();
  }, []);

  useEffect(() => {
    const handleUpdate = () => {
      loadComplaints();
    };
    socket.on("complaintUpdated", handleUpdate);
    return () => socket.off("complaintUpdated", handleUpdate);
  }, []);

  const getStatusClass = (status) => {
    if (status === "Pending") return "status-badge status-pending";
    if (status === "In Progress") return "status-badge status-progress";
    if (status === "Resolved") return "status-badge status-success";
    return "status-badge status-neutral";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">My Complaints</h1>
          <p className="mt-2 text-sm text-slate-500">Track the status of your reported issues.</p>
        </div>
        <button onClick={() => navigate("/student/raise")} className="portal-button-primary">
          Raise New Ticket
        </button>
      </div>

      {loading ? (
        <div className="portal-panel overflow-hidden">
          <div className="space-y-3 px-6 py-6">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="grid gap-4 rounded-xl border border-slate-200 p-4 md:grid-cols-[2.2fr_1fr_1fr_auto]">
                <div className="skeleton h-12 rounded-xl" />
                <div className="skeleton h-10 rounded-xl" />
                <div className="skeleton h-10 rounded-xl" />
                <div className="skeleton h-10 rounded-xl" />
              </div>
            ))}
          </div>
        </div>
      ) : complaints.length === 0 ? (
        <div className="portal-panel px-6 py-14 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 text-indigo-700">
            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <h2 className="mt-4 text-lg font-semibold text-slate-900">No complaints found</h2>
          <p className="mt-2 text-sm text-slate-500">You have not reported any hostel issue yet.</p>
        </div>
      ) : (
        <div className="portal-panel overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-indigo-50/70">
                <tr className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  <th className="px-6 py-4">Issue</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Submitted</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {complaints.map((complaint) => (
                  <tr key={complaint._id} className="transition hover:bg-indigo-50/70">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        {complaint.image ? (
                          <div className="h-12 w-12 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                            <img
                              src={`http://localhost:5000/uploads/${complaint.image}`}
                              alt={complaint.title}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-indigo-50 text-indigo-700">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-slate-900">{complaint.title}</p>
                          <p className="mt-1 truncate text-sm text-slate-500">{complaint.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={getStatusClass(complaint.status)}>{complaint.status}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(complaint.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => navigate(`/complaint/${complaint._id}/chat`)}
                        className="portal-button-secondary"
                      >
                        Open Chat
                      </button>
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

export default MyComplaints;
