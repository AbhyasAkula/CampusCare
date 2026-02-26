import { useEffect, useState } from "react";
import API from "../utils/axios";

function WardenDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [statusMap, setStatusMap] = useState({});

  // load complaints
  const loadComplaints = async () => {
    const res = await API.get("/warden");
    setComplaints(res.data);

    setStatusMap((prev) => {
      const updated = { ...prev };
      res.data.forEach((c) => {
        if (!updated[c._id]) {
          updated[c._id] = c.status;
        }
      });
      return updated;
    });
  };

  useEffect(() => {
    loadComplaints();
  }, []);

  // update status
  const updateStatus = async (id, reply = "") => {
    const selectedStatus = statusMap[id];

    await API.put(`/warden/${id}`, {
      status: selectedStatus,
      reply: reply,
    });

    setComplaints((prev) =>
      prev.map((c) =>
        c._id === id
          ? { ...c, status: selectedStatus, reply: reply || c.reply }
          : c
      )
    );
  };

  return (
    <div>

      <h2 className="text-2xl font-semibold mb-6">All Student Complaints</h2>

      {complaints.map((c) => (
        <div key={c._id} className="bg-white p-5 rounded-xl shadow mb-6">
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

          <select
            className="border p-2 rounded mr-3"
            value={statusMap[c._id] || c.status}
            onChange={(e) =>
              setStatusMap((prev) => ({
                ...prev,
                [c._id]: e.target.value,
              }))
            }
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>

          <button
            onClick={() => updateStatus(c._id)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded mr-3"
          >
            Update Status
          </button>

          <button
            onClick={() => {
              const reply = prompt("Enter reply for student:");
              if (reply) updateStatus(c._id, reply);
            }}
            className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded"
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