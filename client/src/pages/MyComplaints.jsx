import { useEffect, useState } from "react";
import API from "../utils/axios";

function MyComplaints() {
  const [complaints, setComplaints] = useState([]);

  const loadComplaints = async () => {
    const res = await API.get("/complaints/my");
    setComplaints(res.data);
  };

  useEffect(() => {
    loadComplaints();
  }, []);

  const statusColor = (status) => {
    if (status === "Pending") return "bg-yellow-100 text-yellow-700";
    if (status === "In Progress") return "bg-blue-100 text-blue-700";
    if (status === "Resolved") return "bg-green-100 text-green-700";
    return "bg-gray-100 text-gray-700";
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">My Complaints</h2>

      <div className="grid md:grid-cols-2 gap-6">
        {complaints.map((c) => (
          <div key={c._id} className="bg-white p-5 rounded-xl shadow">
            <h3 className="text-lg font-bold">{c.title}</h3>
            <p className="text-gray-600 mt-2">{c.description}</p>

            <div className="mt-3">
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColor(c.status)}`}>
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
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyComplaints;