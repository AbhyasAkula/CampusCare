import { useEffect, useState } from "react";
import API from "../utils/axios";

function WardenDashboard() {
  const [complaints, setComplaints] = useState([]);

  // load complaints
  const loadComplaints = async () => {
    const res = await API.get("/warden");
    setComplaints(res.data);
  };

  useEffect(() => {
    loadComplaints();
  }, []);

  // update status
  const updateStatus = async (id, status, reply) => {
    await API.put(`/warden/${id}`, { status, reply });
    loadComplaints();
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Warden Dashboard</h1>

      {complaints.map((c) => (
        <div key={c._id} className="bg-white p-5 rounded shadow mb-6">
          <h2 className="text-xl font-semibold">{c.title}</h2>
          <p className="mb-2">{c.description}</p>

          <p className="mb-2">
            Current Status:
            <span className="ml-2 font-bold text-blue-600">
              {c.status}
            </span>
          </p>

          {c.image && (
            <img
              src={`http://localhost:5000/uploads/${c.image}`}
              alt="complaint"
              className="w-52 mb-3 rounded"
            />
          )}

          {/* Status change */}
          <select
            className="border p-2 rounded mr-3"
            onChange={(e) =>
              updateStatus(c._id, e.target.value, c.reply || "")
            }
          >
            <option value="">Change Status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>

          {/* Reply */}
          <button
            onClick={() => {
              const reply = prompt("Enter reply for student:");
              if (reply) updateStatus(c._id, c.status, reply);
            }}
            className="bg-green-500 text-white px-3 py-2 rounded"
          >
            Reply to Student
          </button>

          {c.reply && (
            <p className="mt-3 text-green-700 font-semibold">
              Warden Reply: {c.reply}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

export default WardenDashboard;
