import { useEffect, useState } from "react";
import API from "../utils/axios";
import toast from "react-hot-toast";

function WardenDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [statusMap, setStatusMap] = useState({});
  const [notice, setNotice] = useState({ title: "", message: "" });
  const [allNotices, setAllNotices] = useState([]);

  // ---------------- LOAD DATA ----------------
  const loadComplaints = async () => {
    try {
      const res = await API.get("/warden");
      setComplaints(res.data);

      const updated = {};
      res.data.forEach((c) => (updated[c._id] = c.status));
      setStatusMap(updated);
    } catch {
      toast.error("Failed to load complaints");
    }
  };

  const loadNotices = async () => {
    try {
      const res = await API.get("/warden/notices");
      setAllNotices(res.data);
    } catch {
      toast.error("Failed to load announcements");
    }
  };

  useEffect(() => {
    loadComplaints();
    loadNotices();
  }, []);

  // ---------------- UPDATE COMPLAINT ----------------
  const updateStatus = async (id, reply = "") => {
    const selectedStatus = statusMap[id];

    await API.put(`/warden/${id}`, {
      status: selectedStatus,
      reply,
    });

    toast.success("Complaint updated");
    loadComplaints();
  };

  // ---------------- POST NOTICE ----------------
  const postNotice = async () => {
    if (!notice.title || !notice.message)
      return toast.error("Fill title & message");

    await API.post("/warden/notice", notice);

    toast.success("Announcement sent to all students 🚀");
    setNotice({ title: "", message: "" });
    loadNotices();
  };

  // ---------------- DELETE NOTICE ----------------
  const deleteNotice = async (id) => {
    await API.delete(`/warden/notice/${id}`);
    toast.success("Announcement deleted");
    setAllNotices((prev) => prev.filter((n) => n._id !== id));
  };

  // ================= UI =================
  return (
    <div className="space-y-10">

      {/* Announcement panel */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-semibold mb-4">📢 Post Hostel Announcement</h2>

        <input
          type="text"
          placeholder="Notice Title"
          value={notice.title}
          onChange={(e) => setNotice({ ...notice, title: e.target.value })}
          className="w-full border p-2 rounded mb-3"
        />

        <textarea
          placeholder="Write announcement..."
          value={notice.message}
          onChange={(e) => setNotice({ ...notice, message: e.target.value })}
          className="w-full border p-2 rounded mb-3 h-28"
        />

        <button
          onClick={postNotice}
          className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded"
        >
          Broadcast Notice
        </button>
      </div>

      {/* Posted notices */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Posted Announcements</h2>

        {allNotices.length === 0 ? (
          <p className="text-gray-400">No announcements yet</p>
        ) : (
          allNotices.map((n) => (
            <div key={n._id} className="border-b py-3 flex justify-between items-center">
              <div>
                <p className="font-semibold">{n.title}</p>
                <p className="text-sm text-gray-600">{n.message}</p>
              </div>

              <button
                onClick={() => deleteNotice(n._id)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>

      {/* ================= COMPLAINTS SECTION RESTORED ================= */}
      <div>
        <h2 className="text-2xl font-semibold mb-6">All Student Complaints</h2>

        {complaints.length === 0 ? (
          <p className="text-gray-400">No complaints available</p>
        ) : (
          complaints.map((c) => (
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
          ))
        )}
      </div>

    </div>
  );
}

export default WardenDashboard;