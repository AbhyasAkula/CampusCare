import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/axios";
import socket from "../utils/socket";

function MyComplaints() {

  const [complaints, setComplaints] = useState([]);
  const navigate = useNavigate();

  const loadComplaints = async () => {
    try {
      const res = await API.get("/complaints/my");
      setComplaints(res.data);
    } catch (err) {
      console.error("Failed to load complaints");
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

  const statusColor = (status) => {

    if (status === "Pending")
      return "bg-[#FFAE1F]/20 text-[#FFAE1F]";

    if (status === "In Progress")
      return "bg-[#49BEFF]/20 text-[#49BEFF]";

    if (status === "Resolved")
      return "bg-[#13DEB9]/20 text-[#13DEB9]";

    return "bg-gray-100 text-gray-700";

  };

  return (

    <div>

      <h2 className="text-xl font-semibold mb-6">
        My Complaints
      </h2>

      <div className="grid md:grid-cols-2 gap-6">

        {complaints.map((c) => (

          <div
            key={c._id}
            className="bg-white border border-gray-200 rounded-xl p-5"
          >

            <h3 className="font-semibold">
              {c.title}
            </h3>

            <p className="text-gray-600 text-sm mt-2">
              {c.description}
            </p>

            <div className="mt-3">

              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor(c.status)}`}
              >
                {c.status}
              </span>

            </div>

            {c.image && (

              <img
                src={`http://localhost:5000/uploads/${c.image}`}
                alt="complaint"
                className="mt-4 w-60 rounded-lg border"
              />

            )}

            {/* OPEN CHAT BUTTON */}

            <button
              onClick={() => navigate(`/complaint/${c._id}/chat`)}
              className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              Open Chat
            </button>

          </div>

        ))}

      </div>

    </div>
  );
}

export default MyComplaints;