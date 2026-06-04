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
    resolved: 0,
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

    setStats({
      total: complaints.length,
      pending: complaints.filter((c) => c.status === "Pending").length,
      progress: complaints.filter((c) => c.status === "In Progress").length,
      resolved: complaints.filter((c) => c.status === "Resolved").length,
    });
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    const handleUpdate = (data) => {
      toast.success(`${data.title} -> ${data.status}`);
      loadInitialData();
    };
    socket.on("complaintUpdated", handleUpdate);
    return () => socket.off("complaintUpdated", handleUpdate);
  }, []);

  useEffect(() => {
    const handleNotice = (notice) => {
      setNotices((prev) => [notice, ...prev]);
      toast(notice.title, { icon: "i" });
    };
    socket.on("newNotice", handleNotice);
    return () => socket.off("newNotice", handleNotice);
  }, []);

  useEffect(() => {
    const handleDelete = (id) => {
      setNotices((prev) => prev.filter((notice) => notice._id !== id));
      toast.error("Announcement removed");
    };
    socket.on("deleteNotice", handleDelete);
    return () => socket.off("deleteNotice", handleDelete);
  }, []);

  if (!user) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="portal-panel-soft p-6">
              <div className="skeleton h-4 w-24 rounded-full" />
              <div className="mt-4 skeleton h-8 w-20 rounded-full" />
            </div>
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="portal-panel p-6">
              <div className="skeleton h-5 w-28 rounded-full" />
              <div className="mt-4 skeleton h-10 w-full rounded-xl" />
            </div>
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {[...Array(2)].map((_, index) => (
            <div key={index} className="portal-panel p-6">
              <div className="skeleton h-5 w-36 rounded-full" />
              <div className="mt-4 space-y-3">
                {[...Array(3)].map((__, row) => (
                  <div key={row} className="skeleton h-20 rounded-xl" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Total Tickets", value: stats.total, note: "Submitted issues" },
          { label: "Pending", value: stats.pending, note: "Awaiting action" },
          { label: "In Progress", value: stats.progress, note: "Being handled" },
          { label: "Resolved", value: stats.resolved, note: "Closed requests" },
        ].map((item) => (
          <div key={item.label} className="portal-panel-soft px-6 py-5">
            <p className="text-sm font-semibold text-indigo-700">{item.label}</p>
            <p className="mt-3 text-3xl font-bold text-slate-900">{item.value}</p>
            <p className="mt-1 text-sm text-slate-500">{item.note}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <a href="/student/raise" className="portal-panel-soft flex items-center justify-between gap-4 px-6 py-4 transition hover:border-indigo-200 hover:bg-indigo-100/70">
          <div>
            <p className="text-sm font-semibold text-slate-900">Raise Ticket</p>
            <p className="mt-1 text-sm text-slate-500">Report a new hostel issue</p>
          </div>
          <div className="rounded-xl bg-indigo-600 p-3 text-white">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </div>
        </a>

        <a href="/student/complaints" className="portal-panel flex items-center justify-between gap-4 px-6 py-4 transition hover:bg-indigo-50">
          <div>
            <p className="text-sm font-semibold text-slate-900">My Complaints</p>
            <p className="mt-1 text-sm text-slate-500">
              {stats.pending} pending, {stats.resolved} resolved
            </p>
          </div>
          <div className="rounded-xl bg-indigo-50 p-3 text-indigo-700">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
        </a>

        <button
          type="button"
          onClick={scrollToEmergency}
          className="portal-panel flex items-center justify-between gap-4 px-6 py-4 text-left transition hover:bg-indigo-50"
        >
          <div>
            <p className="text-sm font-semibold text-slate-900">Emergency Contacts</p>
            <p className="mt-1 text-sm text-slate-500">Quick access to support numbers</p>
          </div>
          <div className="rounded-xl bg-indigo-50 p-3 text-indigo-700">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
        </button>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="portal-panel overflow-hidden">
          <div className="portal-section-head">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Announcements</h2>
              <p className="text-sm text-slate-500">Latest hostel updates</p>
            </div>
          </div>

          <div className="px-6 py-4">
            {notices.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
                <p className="text-sm font-semibold text-slate-900">No announcements yet</p>
                <p className="mt-1 text-sm text-slate-500">Updates from the hostel office will appear here.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {notices.map((notice) => (
                  <article key={notice._id} className="rounded-xl border border-slate-200 bg-white px-4 py-4 transition hover:bg-indigo-50">
                    <p className="text-sm font-semibold text-slate-900">{notice.title}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-500">{notice.message}</p>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        <section id="emergency-section" className="portal-panel overflow-hidden">
          <div className="portal-section-head">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Emergency Contacts</h2>
              <p className="text-sm text-slate-500">Important support numbers</p>
            </div>
          </div>

          <div className="px-6 py-4">
            {contacts.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
                <p className="text-sm font-semibold text-slate-900">No contacts available</p>
                <p className="mt-1 text-sm text-slate-500">Emergency contacts will appear here once added.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {contacts.map((contact) => (
                  <a
                    key={contact._id}
                    href={`tel:${contact.phone}`}
                    className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-indigo-50/60 px-4 py-4 transition hover:bg-indigo-100/70"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{contact.title}</p>
                      <p className="mt-1 text-sm text-slate-500">{contact.phone}</p>
                    </div>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-indigo-700">
                      Call
                    </span>
                  </a>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default StudentHome;
