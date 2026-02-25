import { useEffect, useState } from "react";
import API from "../utils/axios";
import { useNavigate } from "react-router-dom";

function StudentDashboard() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [complaints, setComplaints] = useState([]);

  // fetch my complaints
  const loadComplaints = async () => {
    const res = await API.get("/complaints/my");
    setComplaints(res.data);
  };

  useEffect(() => {
    loadComplaints();
  }, []);

  // submit complaint
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (image) formData.append("image", image);

    await API.post("/complaints", formData);

    alert("Complaint submitted!");
    setTitle("");
    setDescription("");
    setImage(null);

    loadComplaints(); // refresh list
  };

  // logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const statusColor = (status) => {
    if (status === "pending") return "bg-yellow-100 text-yellow-700";
    if (status === "progress") return "bg-blue-100 text-blue-700";
    if (status === "resolved") return "bg-green-100 text-green-700";
    return "bg-gray-100 text-gray-700";
  };

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* SIDEBAR */}
      <div className="w-64 bg-white shadow-lg p-5">
        <h2 className="text-2xl font-bold text-green-600 mb-8">CampusCare</h2>

        <ul className="space-y-4">
          <li className="font-semibold text-gray-700">Dashboard</li>
          <li className="text-gray-500">My Complaints</li>
          <li>
              <a href="/profile" className="text-gray-600 hover:text-green-600 font-medium">
               My Profile
              </a>
          </li>
        </ul>

        <button
          onClick={handleLogout}
          className="mt-10 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg"
        >
          Logout
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-8">

        {/* NAVBAR */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Student Dashboard</h1>

          <button
            onClick={async () => {
              await loadComplaints();
            }}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg"
          >
            Refresh Complaints
          </button>
        </div>

        {/* Complaint Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-xl shadow-md mb-10 max-w-xl"
        >
          <h2 className="text-xl font-semibold mb-4">Add Complaint</h2>

          <input
            type="text"
            placeholder="Complaint Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border p-2 mb-3 rounded"
            required
          />

          <textarea
            placeholder="Describe your issue"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border p-2 mb-3 rounded"
            required
          />

          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            className="mb-3"
          />

          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">
            Submit Complaint
          </button>
        </form>

        {/* My Complaints */}
        <h2 className="text-2xl font-semibold mb-4">My Complaints</h2>

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
    </div>
  );
}

export default StudentDashboard;