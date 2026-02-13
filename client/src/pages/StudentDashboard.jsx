import { useEffect, useState } from "react";
import API from "../utils/axios";

function StudentDashboard() {
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

  return (
    <div className="p-8 bg-gray-100 min-h-screen">

      <h1 className="text-3xl font-bold mb-6">Student Dashboard</h1>

       <button
       onClick={async () => {
       await loadComplaints();
         }}
        className="mb-4 bg-gray-800 text-white px-3 py-1 rounded"
         >
         Refresh Complaints
         </button>

   

      {/* Complaint Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md mb-8 w-full max-w-lg"
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

        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          Submit Complaint
        </button>
      </form>

      {/* My Complaints */}
      <h2 className="text-2xl font-semibold mb-4">My Complaints</h2>

      {complaints.map((c) => (
        <div key={c._id} className="bg-white p-4 rounded shadow mb-4">
          <h3 className="text-lg font-bold">{c.title}</h3>
          <p>{c.description}</p>
          <p className="mt-2">
            Status:
            <span className="font-semibold ml-2 text-blue-600">
              {c.status}
            </span>
          </p>

          {c.image && (
            <img
              src={`http://localhost:5000/uploads/${c.image}`}
              alt="complaint"
              className="mt-3 w-48 rounded"
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default StudentDashboard;
