import { useEffect, useState } from "react";
import API from "../utils/axios";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [complaints, setComplaints] = useState([]);

  const loadData = async () => {
    const userRes = await API.get("/admin/users");
    const compRes = await API.get("/admin/complaints");

    setUsers(userRes.data);
    setComplaints(compRes.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const blockUser = async (id) => {
    await API.put(`/admin/block/${id}`);
    alert("User blocked");
    loadData();
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">

      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* USERS */}
      <h2 className="text-2xl font-semibold mb-4">All Users</h2>

      {users.map((u) => (
        <div key={u._id} className="bg-white p-4 rounded shadow mb-3 flex justify-between">
          <div>
            <p className="font-semibold">{u.name}</p>
            <p>{u.email}</p>
            <p className="text-sm text-gray-500">Role: {u.role}</p>
          </div>

          {u.role === "student" && !u.isBlocked && (
            <button
              onClick={() => blockUser(u._id)}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Block
            </button>
          )}

          {u.isBlocked && (
            <span className="text-red-600 font-bold">Blocked</span>
          )}
        </div>
      ))}

      {/* COMPLAINTS */}
      <h2 className="text-2xl font-semibold mt-10 mb-4">All Complaints</h2>

      {complaints.map((c) => (
        <div key={c._id} className="bg-white p-4 rounded shadow mb-4">
          <p className="font-bold">{c.title}</p>
          <p>{c.description}</p>

          <p className="mt-2 text-sm text-gray-600">
            Student: {c.student?.name} ({c.student?.email})
          </p>

          <p className="mt-1">
            Status: <span className="font-semibold">{c.status}</span>
          </p>

          {c.reply && (
            <p className="text-green-600 mt-2">
              Reply: {c.reply}
            </p>
          )}
        </div>
      ))}

    </div>
  );
}

export default AdminDashboard;
