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
    <div className="space-y-6">
      <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-brandText">Emergency Contacts</h1>
          {/* <p className="mt-1 text-sm font-medium text-brandText-muted">
            Maintain phone numbers students can access during urgent situations.
          </p> */}
        </div>
        <span className="status-badge status-neutral self-start">
          {contacts.length} contact{contacts.length !== 1 ? "s" : ""}
        </span>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[360px_1fr]">
        <aside className="portal-panel overflow-hidden">
          <div className="border-b border-brandBorder bg-[#F8FAFC] px-6 py-4">
            <h2 className="text-sm font-semibold text-brandText">Add New Contact</h2>
            <p className="mt-0.5 text-xs text-brandText-muted">Use clear role names and verified phone numbers.</p>
          </div>
          <div className="px-6 py-5">
            <form onSubmit={addContact} className="space-y-4">
              <div>
                <label className="portal-label">Contact Title</label>
                <input
                  type="text"
                  // placeholder="e.g. Chief Warden"
                  className="portal-input mt-1.5"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="portal-label">Phone Number</label>
                <input
                  type="text"
                  // placeholder="e.g. +91 9876543210"
                  className="portal-input mt-1.5"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="portal-button-primary w-full"
              >
                Add Contact
              </button>
            </form>
          </div>
        </aside>

        <section className="portal-panel overflow-hidden">
          <div className="flex items-center justify-between border-b border-brandBorder bg-[#F8FAFC] px-6 py-3">
            <div>
              <h2 className="text-sm font-semibold text-brandText">Published Contacts</h2>
              <p className="mt-0.5 text-xs text-brandText-muted">Visible on the student dashboard.</p>
            </div>
          </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-brandBorder text-left text-sm">
                <thead className="bg-[#F8FAFC]">
                  <tr>
                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-brandText-muted">Title</th>
                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-brandText-muted">Phone Number</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-brandText-muted">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brandBorder bg-surface">
                  {contacts.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="px-6 py-14">
                        <div className="mx-auto max-w-sm text-center">
                          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#F1F5F9] text-brandText-muted">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25A2.25 2.25 0 0 0 21.75 19.5v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106a1.125 1.125 0 0 0-1.173.417l-.97 1.293a12.937 12.937 0 0 1-6.861-6.861l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102A1.125 1.125 0 0 0 5.872 2.25H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                            </svg>
                          </div>
                          <p className="mt-3 text-sm font-semibold text-brandText">No contacts yet</p>
                          <p className="mt-1 text-xs text-brandText-muted">Add a contact to publish it for students.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    contacts.map((c) => (
                      <tr key={c._id} className="transition hover:bg-[#F8FAFC]">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-brandBorder bg-status-error/10 text-status-error">
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                            </div>
                            <span className="font-semibold text-brandText">{c.title}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-medium text-brandText-muted">
                          {c.phone}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => deleteContact(c._id)}
                            className="inline-flex items-center justify-center rounded-lg border border-status-error/30 bg-surface px-3 py-1.5 text-xs font-semibold text-status-error transition hover:bg-status-error/10 focus:outline-none focus:ring-2 focus:ring-status-error/20"
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
        </section>
      </div>
    </div>
  );
}

export default AdminEmergency;
