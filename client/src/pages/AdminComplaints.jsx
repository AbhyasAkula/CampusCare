import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import API from "../utils/axios";

function AdminComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const statusFilter = searchParams.get("status") || "all";

  const loadComplaints = async () => {
    try {
      const res = await API.get("/admin/complaints");
      const sorted = (Array.isArray(res.data) ? res.data : []).sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setComplaints(sorted);
    } catch {
      console.log("Failed to load complaints");
    }
  };

  useEffect(() => {
    loadComplaints();
  }, []);

  const filteredComplaints = complaints.filter((c) => {
    if (statusFilter === "all") return true;
    return c.status === statusFilter;
  });

  const setStatusFilter = (value) => {
    if (value === "all") {
      setSearchParams({});
      return;
    }
    setSearchParams({ status: value });
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
          <h1 className="text-2xl font-bold tracking-tight text-brandText">Complaint Management</h1>
          <p className="mt-1 text-sm font-medium text-brandText-muted">
            Review all complaints raised across hostel blocks.
          </p>
        </div>
        
        <div className="relative w-full sm:w-56">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="portal-input appearance-none pr-10"
          >
            <option value="all">All Status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-brandText-muted">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-4">
        {[
          { label: "All", value: complaints.length, filter: "all", cls: "text-brandText-muted" },
          { label: "Pending", value: complaints.filter((c) => c.status === "Pending").length, filter: "Pending", cls: "text-status-warning" },
          { label: "In Progress", value: complaints.filter((c) => c.status === "In Progress").length, filter: "In Progress", cls: "text-primary" },
          { label: "Resolved", value: complaints.filter((c) => c.status === "Resolved").length, filter: "Resolved", cls: "text-status-success" },
        ].map((metric) => (
          <button
            key={metric.filter}
            type="button"
            onClick={() => setStatusFilter(metric.filter)}
            className={`enterprise-card p-4 ${
              statusFilter === metric.filter ? "border-primary bg-[#EFF6FF]" : ""
            }`}
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-brandText-muted">{metric.label}</p>
            <p className="mt-2 text-2xl font-bold tracking-tight text-brandText">{metric.value}</p>
            <p className={`mt-1 text-xs font-semibold ${metric.cls}`}>
              {metric.filter === "all" ? "Total submitted" : "Current queue"}
            </p>
          </button>
        ))}
      </section>

      <section className="portal-panel overflow-hidden">
        <div className="flex items-center justify-between border-b border-brandBorder bg-[#F8FAFC] px-6 py-3">
          <p className="text-sm font-semibold text-brandText">
            {filteredComplaints.length} complaint{filteredComplaints.length !== 1 ? "s" : ""}
          </p>
          <p className="text-xs font-medium text-brandText-muted">
            {statusFilter === "all" ? "All statuses" : statusFilter}
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-brandBorder text-left text-sm">
            <thead className="bg-[#F8FAFC]">
              <tr>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-brandText-muted">Complaint</th>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-brandText-muted">Student</th>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-brandText-muted">Location</th>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-brandText-muted">Evidence</th>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-brandText-muted">Status</th>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-brandText-muted">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brandBorder bg-surface">
              {filteredComplaints.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-14">
                    <div className="mx-auto max-w-sm text-center">
                      <div className="empty-state-icon">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                      </div>
                      <p className="mt-3 text-sm font-semibold text-brandText">No complaints found</p>
                      <p className="mt-1 text-xs text-brandText-muted">No records match the selected status.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredComplaints.map((c) => (
                  <tr key={c._id} className="transition hover:bg-[#F8FAFC]">
                    <td className="px-6 py-4">
                      <p className="max-w-xs truncate font-semibold text-brandText">{c.title}</p>
                      <p className="mt-0.5 max-w-xs truncate text-xs text-brandText-muted">
                        {c.description || "No description provided"}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-sm text-brandText-muted">
                      <p className="font-semibold text-brandText">{c.student?.name || "Unknown student"}</p>
                      <p className="mt-0.5 text-xs">{c.student?.email || "No email available"}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-brandText-muted">
                      Block {c.hostelBlock || c.block || "N/A"}, Room {c.roomNumber || c.room || "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      {c.image ? (
                        <div className="h-10 w-10 overflow-hidden rounded-lg border border-brandBorder bg-[#F8FAFC]">
                          <img
                            src={`http://localhost:5000/uploads/${c.image}`}
                            alt="complaint"
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ) : (
                        <span className="status-badge status-neutral">No image</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={getStatusCls(c.status)}>{c.status}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-brandText-muted">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default AdminComplaints;
