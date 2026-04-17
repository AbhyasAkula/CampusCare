import { useEffect, useState } from "react";
import API from "../utils/axios";
import toast from "react-hot-toast";

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

  const addContact = async (e) => {
    e.preventDefault();
    if (!title || !phone) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      await API.post("/admin/contacts", { title, phone });
      toast.success("Contact added successfully");
      setTitle("");
      setPhone("");
      loadContacts();
    } catch {
      toast.error("Failed to add contact");
    }
  };

  const deleteContact = async (id) => {
    if (!window.confirm("Are you sure you want to delete this contact?")) return;

    try {
      await API.delete(`/admin/contacts/${id}`);
      toast.success("Contact deleted");
      loadContacts();
    } catch {
      toast.error("Failed to delete contact");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Emergency Contacts</h1>
          <p className="mt-1 text-sm text-slate-500">Manage important numbers for student emergencies.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Add New Contact</h2>
            <form onSubmit={addContact} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Contact Title</label>
                <input
                  type="text"
                  placeholder="e.g. Chief Warden"
                  className="block w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  placeholder="e.g. +91 9876543210"
                  className="block w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full flex justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Add Contact
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                  <tr>
                    <th className="px-6 py-4">Title</th>
                    <th className="px-6 py-4">Phone Number</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {contacts.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="px-6 py-12 text-center text-slate-500">
                        No emergency contacts found.
                      </td>
                    </tr>
                  ) : (
                    contacts.map((c) => (
                      <tr key={c._id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-600">
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                            </div>
                            <span className="font-medium text-slate-900">{c.title}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-medium text-slate-700">
                          {c.phone}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => deleteContact(c._id)}
                            className="inline-flex items-center justify-center rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-all focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminEmergency;