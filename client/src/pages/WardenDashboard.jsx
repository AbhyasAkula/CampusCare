import { useEffect, useState } from "react";
import API from "../utils/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function WardenDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [statusMap, setStatusMap] = useState({});
  const [notice, setNotice] = useState({ title: "", message: "" });
  const [allNotices, setAllNotices] = useState([]);

  const navigate = useNavigate();

  const loadComplaints = async () => {
    try {
      const res = await API.get("/warden");
      setComplaints(res.data);

      const updated = {};
      res.data.forEach((c) => {
        updated[c._id] = c.status;
      });
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

  const updateStatus = async (id) => {
    try {
      const selectedStatus = statusMap[id];

      await API.put(`/warden/${id}`, {
        status: selectedStatus,
      });

      toast.success("Complaint updated");
      loadComplaints();
    } catch {
      toast.error("Update failed");
    }
  };

  const postNotice = async () => {
    if (!notice.title || !notice.message)
      return toast.error("Fill title & message");

    await API.post("/warden/notice", notice);

    toast.success("Announcement sent");
    setNotice({ title: "", message: "" });
    loadNotices();
  };

  const deleteNotice = async (id) => {
    await API.delete(`/warden/notice/${id}`);
    setAllNotices((prev) => prev.filter((n) => n._id !== id));
    toast.success("Deleted");
  };

  return (
    <div className="space-y-10">

      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-semibold mb-4">Post Hostel Announcement</h2>

        <input
          type="text"
          placeholder="Notice Title"
          value={notice.title}
          onChange={(e) =>
            setNotice({ ...notice, title: e.target.value })
          }
          className="w-full border p-2 rounded mb-3"
        />

        <textarea
          placeholder="Write announcement..."
          value={notice.message}
          onChange={(e) =>
            setNotice({ ...notice, message: e.target.value })
          }
          className="w-full border p-2 rounded mb-3 h-28"
        />

        <button
          onClick={postNotice}
          className="bg-purple-600 text-white px-5 py-2 rounded"
        >
          Broadcast Notice
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Posted Announcements</h2>

        {allNotices.length === 0 ? (
          <p className="text-gray-400">No announcements yet</p>
        ) : (
          allNotices.map((n) => (
            <div
              key={n._id}
              className="border-b py-3 flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{n.title}</p>
                <p className="text-sm text-gray-600">{n.message}</p>
              </div>

              <button
                onClick={() => deleteNotice(n._id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-6">
          All Student Complaints
        </h2>

        {complaints.length === 0 ? (
          <p className="text-gray-400">No complaints</p>
        ) : (
          complaints.map((c) => (
            <div
              key={c._id}
              className="bg-white p-5 rounded-xl shadow mb-6"
            >
              <h2 className="text-xl font-semibold">{c.title}</h2>

              <p className="mb-2">{c.description}</p>

              <p className="mb-2">
                Status:
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
                className="bg-blue-500 text-white px-3 py-2 rounded mr-3"
              >
                Update Status
              </button>

              <button
                onClick={() =>
                  navigate(`/complaint/${c._id}/chat`)
                }
                className="bg-green-600 text-white px-3 py-2 rounded"
              >
                Open Chat
              </button>
            </div>
          ))
        )}
      </div>

    </div>
  );
}

export default WardenDashboard;