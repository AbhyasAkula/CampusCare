import { useEffect, useState } from "react";
import API from "../utils/axios";

function AdminComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");

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
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Complaint Management</h1>
          <p className="mt-1 text-sm text-slate-500">View and manage all complaints raised by students.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-4 pr-10 text-sm font-medium text-slate-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all hover:bg-slate-50"
            >
              <option value="all">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-500 font-semibold">
              <tr>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Block / Room</th>
                <th className="px-6 py-4">Image</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Created Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredComplaints.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                    No complaints found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredComplaints.map((c) => (
                  <tr key={c._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {c.title}
                    </td>
                    <td className="px-6 py-4">
                      {c.student?.name || "-"}
                    </td>
                    <td className="px-6 py-4">
                      {c.block || "-"} / {c.room || "-"}
                    </td>
                    <td className="px-6 py-4">
                      {c.image ? (
                        <div className="h-10 w-10 overflow-hidden rounded-lg border border-slate-200 cursor-pointer hover:opacity-80 transition-opacity">
                          <img
                            src={`http://localhost:5000/uploads/${c.image}`}
                            alt="complaint"
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ) : (
                        <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">No image</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusColor(c.status)}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminComplaints;