import { useEffect, useState } from "react";
import API from "../utils/axios";

function StudentHome() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      const res = await API.get("/profile");
      setUser(res.data);
    };
    loadProfile();
  }, []);

  if (!user) return <div className="p-10">Loading...</div>;

  return (
    <div className="p-8">

      <h1 className="text-3xl font-bold mb-2">
        Welcome, {user.name} 👋
      </h1>
      <p className="text-gray-600 mb-8">
        Here is your hostel complaint overview
      </p>

      {/* Stats cards */}
      <div className="grid md:grid-cols-3 gap-6">

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-gray-500">Total Complaints</h2>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            {user.totalComplaints || 0}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-gray-500">Active Complaints</h2>
          <p className="text-3xl font-bold text-yellow-600 mt-2">
            {user.pendingComplaints || 0}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-gray-500">Resolved Complaints</h2>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {user.resolvedComplaints || 0}
          </p>
        </div>

      </div>

    </div>
  );
}

export default StudentHome;