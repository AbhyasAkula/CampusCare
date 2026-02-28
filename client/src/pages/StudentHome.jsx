import { useEffect, useState } from "react";
import API from "../utils/axios";
import socket from "../utils/socket";

function StudentHome() {
  const [user, setUser] = useState(null);
   const [notices, setNotices] = useState([]); 

  useEffect(() => {
  const loadInitialData = async () => {
    const profileRes = await API.get("/profile");
    setUser(profileRes.data);

    // ⭐ load previous announcements
    const noticeRes = await API.get("/warden/notices");
    setNotices(noticeRes.data);
  };

  loadInitialData();
}, []);

  // ⭐ correct realtime listener
  useEffect(() => {
    const handleUpdate = (data) => {
      alert(`📢 "${data.title}" status changed to: ${data.status}`);
    };

    socket.on("complaintUpdated", handleUpdate);

    return () => {
      socket.off("complaintUpdated", handleUpdate);
    };
  }, []);

  // 🔔 LISTEN FOR WARDEN ANNOUNCEMENTS
useEffect(() => {
  const handleNotice = (notice) => {
    setNotices((prev) => [notice, ...prev]);
  };

  socket.on("newNotice", handleNotice);

  return () => {
    socket.off("newNotice", handleNotice);
  };
}, []);

  if (!user) return <div className="p-10">Loading...</div>;

 return (
  <div className="p-8 space-y-8">

    {/* Welcome */}
    <div>
      <h1 className="text-3xl font-bold">
        Welcome, {user.name} 👋
      </h1>
      <p className="text-gray-600">
        IIIT Sri City Hostel Dashboard
      </p>
    </div>

    {/* Quick Actions */}
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

      <a href="/student/raise" className="bg-blue-500 text-white p-6 rounded-xl shadow hover:scale-105 transition">
        <h2 className="text-xl font-semibold">Raise Complaint</h2>
        <p className="text-sm opacity-90">Report a hostel issue</p>
      </a>

      <a href="/student/complaints" className="bg-indigo-500 text-white p-6 rounded-xl shadow hover:scale-105 transition">
        <h2 className="text-xl font-semibold">Track Complaints</h2>
        <p className="text-sm opacity-90">View your tickets</p>
      </a>

      <div className="bg-red-500 text-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold">Emergency Help</h2>
        <p className="text-sm">Call hostel security immediately</p>
        <p className="mt-2 font-bold">📞 100 / Campus Security</p>
      </div>

      <div className="bg-green-500 text-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold">Mess Notice</h2>
        <p className="text-sm">Special dinner on Friday 🍽️</p>
      </div>

    </div>

    {/* Hostel Notices */}
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-4">📢 Hostel Announcements</h2>

      <ul className="space-y-3 text-gray-700">
  {notices.length === 0 ? (
    <li className="text-gray-400">No announcements yet</li>
  ) : (
    notices.map((n, i) => (
      <li key={i} className="border-b pb-2">
        <p className="font-semibold">📢 {n.title}</p>
        <p className="text-sm">{n.message}</p>
      </li>
    ))
  )}
</ul>

    </div>

    {/* Emergency Contacts */}
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-4">🚨 Emergency Contacts</h2>

      <div className="grid md:grid-cols-2 gap-4 text-gray-700">
        <p><strong>Warden:</strong> +91 9XXXXXXXXX</p>
        <p><strong>Security:</strong> +91 9XXXXXXXXX</p>
        <p><strong>Electrician:</strong> +91 9XXXXXXXXX</p>
        <p><strong>Plumber:</strong> +91 9XXXXXXXXX</p>
      </div>
    </div>

  </div>
);
}

export default StudentHome;