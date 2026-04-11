import { useState } from "react";
import API from "../utils/axios";

function RaiseTicket() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

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
  };

  return (
    <div className="p-8">
      <form className="bg-white p-6 rounded-xl shadow-md max-w-xl" onSubmit={handleSubmit}>
        <h2 className="text-xl font-semibold mb-4">Raise a Complaint</h2>

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
    </div>
  );
}

export default RaiseTicket;