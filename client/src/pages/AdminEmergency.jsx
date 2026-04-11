import { useEffect, useState } from "react";
import API from "../utils/axios";

function AdminEmergency() {
  const [contacts, setContacts] = useState([]);
  const [title, setTitle] = useState("");
  const [phone, setPhone] = useState("");

  const loadContacts = async () => {
    try {
      const res = await API.get("/admin/contacts");
      setContacts(Array.isArray(res.data) ? res.data : []);
    } catch {
      console.log("Failed to load contacts");
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  const addContact = async () => {
    if (!title || !phone) {
      alert("Please fill all fields");
      return;
    }

    try {
      await API.post("/admin/contacts", { title, phone });

      setTitle("");
      setPhone("");

      loadContacts();
    } catch {
      alert("Failed to add contact");
    }
  };

  const deleteContact = async (id) => {
    if (!window.confirm("Delete this contact?")) return;

    try {
      await API.delete(`/admin/contacts/${id}`);
      loadContacts();
    } catch {
      alert("Delete failed");
    }
  };

  return (
    <div className="space-y-6">

      {/* PAGE TITLE */}
      <div>
        <h1 className="text-3xl font-bold text-[#2A3547]">
          Emergency Contacts
        </h1>
        <p className="text-gray-500">
          Manage hostel emergency phone numbers
        </p>
      </div>

      {/* ADD CONTACT */}
      <div className="bg-white p-6 rounded-xl shadow space-y-4">

        <h2 className="text-lg font-semibold">
          Add Emergency Contact
        </h2>

        <div className="flex flex-col md:flex-row gap-4">

          <input
            type="text"
            placeholder="Title (Warden, Security, Electrician...)"
            className="border p-2 rounded-lg w-full"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            type="text"
            placeholder="Phone Number"
            className="border p-2 rounded-lg w-full"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <button
            onClick={addContact}
            className="bg-[#5D87FF] hover:bg-[#4c6edb] text-white px-5 py-2 rounded-lg"
          >
            Add
          </button>

        </div>

      </div>

      {/* CONTACT TABLE */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">

        <table className="w-full text-sm">

          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Title</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>

          <tbody>

            {contacts.map((c) => (
              <tr key={c._id} className="border-t">

                <td className="p-3 font-medium">
                  {c.title}
                </td>

                <td className="p-3">
                  {c.phone}
                </td>

                <td className="p-3">

                  <button
                    onClick={() => deleteContact(c._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>

                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default AdminEmergency;