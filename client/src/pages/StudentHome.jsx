import { useEffect, useState } from "react";
import API from "../utils/axios";
import socket from "../utils/socket";
import toast from "react-hot-toast";

function StudentHome() {
  const [user, setUser] = useState(null);
  const [notices, setNotices] = useState([]);
  const [contacts, setContacts] = useState([]);

  // ⭐ SCROLL FUNCTION
  const scrollToEmergency = () => {
    const section = document.getElementById("emergency-section");
    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // Load profile + notices + emergency contacts
  useEffect(() => {
    const loadInitialData = async () => {
      const profileRes = await API.get("/profile");
      setUser(profileRes.data);

      const noticeRes = await API.get("/warden/notices");
      setNotices(noticeRes.data);

      // fetch emergency contacts
      const contactRes = await API.get("/admin/contacts");
      setContacts(contactRes.data);
    };

    loadInitialData();
  }, []);

  // Complaint status realtime
  useEffect(() => {
    const handleUpdate = (data) => {
      toast.success(`${data.title} → ${data.status}`);
    };

    socket.on("complaintUpdated", handleUpdate);

    return () => {
      socket.off("complaintUpdated", handleUpdate);
    };
  }, []);

  // New notice realtime
  useEffect(() => {
    const handleNotice = (notice) => {
      setNotices((prev) => [notice, ...prev]);
      toast(`📢 New Announcement: ${notice.title}`, { icon: "📣" });
    };

    socket.on("newNotice", handleNotice);

    return () => {
      socket.off("newNotice", handleNotice);
    };
  }, []);

  // Notice delete realtime
  useEffect(() => {
    const handleDelete = (id) => {
      setNotices((prev) => prev.filter((n) => n._id !== id));
      toast.error("Announcement removed");
    };

    socket.on("deleteNotice", handleDelete);

    return () => {
      socket.off("deleteNotice", handleDelete);
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
        <p className="text-gray-600">IIIT Sri City Hostel Dashboard</p>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

        <a
          href="/student/raise"
          className="bg-blue-500 text-white p-6 rounded-xl shadow hover:scale-105 transition"
        >
          <h2 className="text-xl font-semibold">Raise Complaint</h2>
          <p className="text-sm opacity-90">Report a hostel issue</p>
        </a>

        <a
          href="/student/complaints"
          className="bg-indigo-500 text-white p-6 rounded-xl shadow hover:scale-105 transition"
        >
          <h2 className="text-xl font-semibold">Track Complaints</h2>
          <p className="text-sm opacity-90">View your tickets</p>
        </a>

        {/* ⭐ CLICKABLE EMERGENCY CARD */}
        <div
          onClick={scrollToEmergency}
          className="bg-red-500 text-white p-6 rounded-xl shadow cursor-pointer hover:scale-105 transition"
        >
          <h2 className="text-xl font-semibold">Emergency Help</h2>
          <p className="text-sm">Use numbers below immediately</p>
          <p className="mt-2 font-bold">⚠️ Available 24/7</p>
        </div>

      </div>

      {/* Notices */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">📢 Hostel Announcements</h2>

        <ul className="space-y-3 text-gray-700">
          {notices.length === 0 ? (
            <li className="text-gray-400">No announcements yet</li>
          ) : (
            notices.map((n) => (
              <li key={n._id} className="border-b pb-2">
                <p className="font-semibold">📢 {n.title}</p>
                <p className="text-sm">{n.message}</p>
              </li>
            ))
          )}
        </ul>
      </div>

      {/* ⭐ EMERGENCY CONTACTS SECTION (TARGET) */}
      <div
        id="emergency-section"
        className="bg-white p-6 rounded-xl shadow scroll-mt-24"
      >
        <h2 className="text-xl font-semibold mb-4">🚨 Emergency Contacts</h2>

        {contacts.length === 0 ? (
          <p className="text-gray-400">No contacts added by admin yet</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4 text-gray-700">
            {contacts.map((c) => (
              <div key={c._id} className="border p-3 rounded-lg">
                <p className="font-semibold">{c.title}</p>

                {/* clickable phone number (mobile dial support) */}
                <a
                  href={`tel:${c.phone}`}
                  className="text-blue-600 font-bold hover:underline"
                >
                  {c.phone}
                </a>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

export default StudentHome;