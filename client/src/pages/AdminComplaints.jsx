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

  /* ================= FILTER ================= */

  const filteredComplaints = complaints.filter((c) => {
    if (statusFilter === "all") return true;
    return c.status === statusFilter;
  });

  return (
    <div className="space-y-6">

      {/* PAGE TITLE */}
      <div>
        <h1 className="text-3xl font-bold text-[#2A3547]">
          Complaint Management
        </h1>
        <p className="text-gray-500">
          View all complaints raised by students
        </p>
      </div>

      {/* FILTER */}
      <div className="flex gap-4">

        <select
          className="border p-2 rounded-lg"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Complaints</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
        </select>

      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">

        <table className="w-full text-sm">

          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Title</th>
              <th className="p-3">Student</th>
              <th className="p-3">Block</th>
              <th className="p-3">Room</th>
              <th className="p-3">Image</th>
              <th className="p-3">Status</th>
              <th className="p-3">Created</th>
            </tr>
          </thead>

          <tbody>

            {filteredComplaints.map((c) => (
              <tr key={c._id} className="border-t">

                <td className="p-3 font-medium">
                  {c.title}
                </td>

                <td className="p-3">
                  {c.student?.name || "-"}
                </td>

                <td className="p-3">
                  {c.block || "-"}
                </td>

                <td className="p-3">
                  {c.room || "-"}
                </td>

                {/* IMAGE */}
                <td className="p-3">

                  {c.image ? (
                    <img
                      src={`http://localhost:5000/uploads/${c.image}`}
                      alt="complaint"
                      className="w-12 h-12 object-cover rounded"
                    />
                  ) : (
                    <span className="text-gray-400">None</span>
                  )}

                </td>

                {/* STATUS */}
                <td className="p-3">

                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      c.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : c.status === "In Progress"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {c.status}
                  </span>

                </td>

                {/* CREATED */}
                <td className="p-3 text-gray-500">

                  {new Date(c.createdAt).toLocaleDateString()}

                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default AdminComplaints;