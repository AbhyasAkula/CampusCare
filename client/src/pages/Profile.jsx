import { useEffect, useState } from "react";
import API from "../utils/axios";

function Profile() {
  const [user, setUser] = useState(null);
  const [file, setFile] = useState(null);

  // load profile
  const loadProfile = async () => {
    const res = await API.get("/profile");
    setUser(res.data);
  };

  useEffect(() => {
    loadProfile();
  }, []);

  // upload image
  const handleUpload = async () => {
    if (!file) return alert("Select an image");

    const formData = new FormData();
    formData.append("profilePic", file);

    await API.put("/profile/upload", formData);

    alert("Profile picture updated!");
    loadProfile();
  };

  if (!user) return <div className="p-10">Loading...</div>;

  return (
    <div className="p-8">
      <div className="bg-white p-8 rounded-xl shadow-md max-w-2xl">
        <h2 className="text-2xl font-bold mb-6">My Profile</h2>

        {/* profile image */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={
              user.profilePic
                ? `http://localhost:5000/uploads/${user.profilePic}`
                : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
            alt="profile"
            className="w-32 h-32 rounded-full object-cover border"
          />

          <input
            type="file"
            className="mt-4"
            onChange={(e) => setFile(e.target.files[0])}
          />

          <button
            onClick={handleUpload}
            className="mt-3 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Upload Photo
          </button>
        </div>

        {/* details */}
        <div className="space-y-2">
          <p><span className="font-semibold">Name:</span> {user.name}</p>
          <p><span className="font-semibold">Email:</span> {user.email}</p>
          <p><span className="font-semibold">Role:</span> {user.role}</p>
        </div>

        {/* Complaint Statistics */}
        <div className="mt-8 border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">Complaint Statistics</h3>

          <div className="grid grid-cols-3 gap-4 text-center">

            <div className="bg-blue-100 p-4 rounded-lg">
              <p className="text-3xl font-bold text-blue-700">
                {user.totalComplaints || 0}
              </p>
              <p>Total Complaints</p>
            </div>

            <div className="bg-yellow-100 p-4 rounded-lg">
              <p className="text-3xl font-bold text-yellow-700">
                {user.pendingComplaints || 0}
              </p>
              <p>Active</p>
            </div>

            <div className="bg-green-100 p-4 rounded-lg">
              <p className="text-3xl font-bold text-green-700">
                {user.resolvedComplaints || 0}
              </p>
              <p>Resolved</p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;