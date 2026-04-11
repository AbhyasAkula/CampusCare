import { useEffect, useState } from "react";
import API from "../utils/axios";
import socket from "../utils/socket";
import toast from "react-hot-toast";

function StudentHome() {

  const [user, setUser] = useState(null);
  const [notices, setNotices] = useState([]);
  const [contacts, setContacts] = useState([]);

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    progress: 0,
    resolved: 0
  });

  const scrollToEmergency = () => {
    const section = document.getElementById("emergency-section");
    if (section) section.scrollIntoView({ behavior: "smooth" });
  };

  const loadInitialData = async () => {

    const profileRes = await API.get("/profile");
    setUser(profileRes.data);

    const noticeRes = await API.get("/warden/notices");
    setNotices(noticeRes.data);

    const contactRes = await API.get("/admin/contacts");
    setContacts(contactRes.data);

    const complaintRes = await API.get("/complaints/my");
    const complaints = complaintRes.data;

    const pending = complaints.filter(c => c.status === "Pending").length;
    const progress = complaints.filter(c => c.status === "In Progress").length;
    const resolved = complaints.filter(c => c.status === "Resolved").length;

    setStats({
      total: complaints.length,
      pending,
      progress,
      resolved
    });

  };

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {

    const handleUpdate = (data) => {
      toast.success(`${data.title} → ${data.status}`);
      loadInitialData();
    };

    socket.on("complaintUpdated", handleUpdate);

    return () => socket.off("complaintUpdated", handleUpdate);

  }, []);

  useEffect(() => {

    const handleNotice = (notice) => {
      setNotices(prev => [notice, ...prev]);
      toast(`📢 ${notice.title}`);
    };

    socket.on("newNotice", handleNotice);

    return () => socket.off("newNotice", handleNotice);

  }, []);

  useEffect(() => {

    const handleDelete = (id) => {
      setNotices(prev => prev.filter(n => n._id !== id));
      toast.error("Announcement removed");
    };

    socket.on("deleteNotice", handleDelete);

    return () => socket.off("deleteNotice", handleDelete);

  }, []);

  if (!user) return <div className="p-10">Loading...</div>;

  return (

    <div className="space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold">
          Welcome, {user.name} 👋
        </h1>
        <p className="text-[#7C8FAC] text-sm">
          IIIT Sri City Hostel Dashboard
        </p>
      </div>

     
      {/* QUICK ACTIONS */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

        <a
          href="/student/raise"
          className="bg-[#5D87FF] text-white p-6 rounded-xl hover:bg-[#4570EA]"
        >
          <h2 className="text-lg font-semibold">Raise Complaint</h2>
          <p className="text-sm opacity-90">
            Report hostel issues instantly
          </p>
        </a>

        <a
          href="/student/complaints"
          className="bg-[#49BEFF] text-white p-6 rounded-xl"
        >
          <h2 className="text-lg font-semibold">Track Complaints</h2>
          <p className="text-sm opacity-90">
            Monitor complaint progress
          </p>
        </a>

        <div
          onClick={scrollToEmergency}
          className="bg-[#FA896B] text-white p-6 rounded-xl cursor-pointer"
        >
          <h2 className="text-lg font-semibold">Emergency Help</h2>
          <p className="text-sm">
            Important hostel contacts
          </p>
        </div>

      </div>

      {/* ANNOUNCEMENTS */}
      <div className="bg-white border border-[#E6E9F0] rounded-xl p-6">

        <h2 className="text-lg font-semibold mb-4">
          📢 Hostel Announcements
        </h2>

        <ul className="space-y-3">

          {notices.length === 0 && (
            <li className="text-gray-400">
              No announcements yet
            </li>
          )}

          {notices.map(n => (

            <li key={n._id} className="border-b pb-2">

              <p className="font-medium">
                📢 {n.title}
              </p>

              <p className="text-sm text-gray-600">
                {n.message}
              </p>

            </li>

          ))}

        </ul>

      </div>

      {/* EMERGENCY CONTACTS */}
      <div
        id="emergency-section"
        className="bg-white border border-[#E6E9F0] rounded-xl p-6"
      >

        <h2 className="text-lg font-semibold mb-4">
          🚨 Emergency Contacts
        </h2>

        {contacts.length === 0 ? (

          <p className="text-gray-400">
            No contacts added by admin yet
          </p>

        ) : (

          <div className="grid md:grid-cols-2 gap-4">

            {contacts.map(c => (

              <div
                key={c._id}
                className="border border-[#E6E9F0] rounded-lg p-4"
              >

                <p className="font-semibold">
                  {c.title}
                </p>

                <a
                  href={`tel:${c.phone}`}
                  className="text-[#5D87FF] font-semibold text-sm"
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