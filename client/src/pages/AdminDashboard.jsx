import { useEffect, useState } from "react";
import API from "../utils/axios";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [newContact, setNewContact] = useState({
    title: "",
    phone: "",
  });

  const loadData = async () => {
    try {
      const usersRes = await API.get("/admin/users");
      setUsers(Array.isArray(usersRes.data) ? usersRes.data : []);
    } catch {}

    try {
      const compRes = await API.get("/admin/complaints");
      setComplaints(Array.isArray(compRes.data) ? compRes.data : []);
    } catch {}

    try {
      const contactRes = await API.get("/admin/contacts");
      setContacts(Array.isArray(contactRes.data) ? contactRes.data : []);
    } catch {}
  };

  useEffect(() => {
    loadData();
  }, []);

  const blockUser = async (id) => {
    await API.put(`/admin/block/${id}`);
    loadData();
  };

  const addContact = async () => {
    if (!newContact.title || !newContact.phone) {
      alert("Fill all fields");
      return;
    }

    await API.post("/admin/contacts", newContact);
    setNewContact({ title: "", phone: "" });
    loadData();
  };

  const deleteContact = async (id) => {
    if (!window.confirm("Delete this contact?")) return;
    await API.delete(`/admin/contacts/${id}`);
    loadData();
  };

  return (
    <div className="space-y-10">

      {/* EMERGENCY CONTACTS */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-semibold mb-4">🚨 Emergency Contacts</h2>

        <div className="flex gap-3 mb-4">
          <input
            placeholder="Title"
            value={newContact.title}
            onChange={(e) =>
              setNewContact({ ...newContact, title: e.target.value })
            }
            className="border p-2 rounded w-1/2"
          />
          <input
            placeholder="Phone"
            value={newContact.phone}
            onChange={(e) =>
              setNewContact({ ...newContact, phone: e.target.value })
            }
            className="border p-2 rounded w-1/2"
          />
        </div>

        <button
          onClick={addContact}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Add Contact
        </button>

        <div className="mt-5 space-y-3">
          {contacts.map((c) => (
            <div
              key={c._id}
              className="flex justify-between items-center border-b pb-2"
            >
              <p>
                <strong>{c.title}</strong> — {c.phone}
              </p>
              <button
                onClick={() => deleteContact(c._id)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* USERS */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">All Users</h2>

        {users.map((u) => (
          <div
            key={u._id}
            className="bg-white p-4 rounded-xl shadow mb-3 flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{u.name}</p>
              <p>{u.email}</p>
              <p className="text-sm text-gray-500">Role: {u.role}</p>
            </div>

            {u.role === "student" && !u.isBlocked && (
              <button
                onClick={() => blockUser(u._id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Block
              </button>
            )}

            {u.isBlocked && (
              <span className="text-red-600 font-bold">Blocked</span>
            )}
          </div>
        ))}
      </div>

      {/* COMPLAINTS */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">All Complaints</h2>

        {complaints.map((c) => (
          <div key={c._id} className="bg-white p-4 rounded-xl shadow mb-4">
            <p className="font-bold">{c.title}</p>
            <p>{c.description}</p>

            <p className="text-sm text-gray-600 mt-2">
              Student: {c.student?.name} ({c.student?.email})
            </p>

            <p className="mt-1">
              Status: <strong>{c.status}</strong>
            </p>

            {c.reply && (
              <p className="text-green-600 mt-2">
                Reply: {c.reply}
              </p>
            )}
          </div>
        ))}
      </div>

    </div>
  );
}

export default AdminDashboard;