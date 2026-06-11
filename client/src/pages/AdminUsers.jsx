import { useEffect, useState } from "react";
import API from "../utils/axios";
import toast from "react-hot-toast";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const loadUsers = async () => {
    try {
      const res = await API.get("/admin/users");
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch {
      console.log("Failed to load users");
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const blockUser = async (id) => {
    if (!window.confirm("Are you sure you want to block this user?")) return;

    try {
      await API.put(`/admin/block/${id}`);
      toast.success("User blocked successfully");
      loadUsers();
    } catch {
      toast.error("Failed to block user");
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());

    const matchRole =
      roleFilter === "all" || u.role === roleFilter;

    return matchSearch && matchRole;
  });

  const roleCounts = {
    all: users.length,
    student: users.filter((u) => u.role === "student").length,
    warden: users.filter((u) => u.role === "warden").length,
    admin: users.filter((u) => u.role === "admin").length,
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-brandText">User Management</h1>
          <p className="mt-1 text-sm font-medium text-brandText-muted">
            Manage hostel students, wardens, and administrators.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 rounded-xl border border-brandBorder bg-surface p-1 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:flex">
          {[
            { key: "all", label: "All" },
            { key: "student", label: "Students" },
            { key: "warden", label: "Wardens" },
            { key: "admin", label: "Admins" },
          ].map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setRoleFilter(item.key)}
              className={`rounded-lg border px-3 py-2 text-left text-xs font-semibold transition ${
                roleFilter === item.key
                  ? "border-primary bg-[#EFF6FF] text-primary shadow-sm"
                  : "border-transparent bg-transparent text-brandText-muted hover:bg-[#F8FAFC] hover:text-brandText"
              }`}
            >
              {item.label}
              <span className="ml-2 text-brandText">{roleCounts[item.key]}</span>
            </button>
          ))}
        </div>
      </header>

      <section className="portal-panel p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <svg className="h-4 w-4 text-brandText-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search users by name or email..."
            className="portal-input pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          </div>

          <div className="relative w-full sm:w-48">
          <select
            className="portal-input appearance-none pr-10"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all">All Roles</option>
            <option value="student">Students</option>
            <option value="warden">Wardens</option>
            <option value="admin">Admins</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-brandText-muted">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          </div>
        </div>
      </section>

      <section className="portal-panel overflow-hidden">
        <div className="flex items-center justify-between border-b border-brandBorder bg-[#F8FAFC] px-6 py-3">
          <p className="text-sm font-semibold text-brandText">
            {filteredUsers.length} user{filteredUsers.length !== 1 ? "s" : ""}
          </p>
          <p className="text-xs font-medium text-brandText-muted">Filtered from {users.length} accounts</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-brandBorder text-left text-sm">
            <thead className="bg-[#F8FAFC]">
              <tr>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-brandText-muted">User</th>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-brandText-muted">Role</th>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-brandText-muted">Location</th>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-brandText-muted">Status</th>
                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-brandText-muted">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brandBorder bg-surface">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-14">
                    <div className="mx-auto max-w-sm text-center">
                      <div className="empty-state-icon">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15.75 15.75 21 21m-3.75-9a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z" />
                        </svg>
                      </div>
                      <p className="mt-3 text-sm font-semibold text-brandText">No users found</p>
                      <p className="mt-1 text-xs text-brandText-muted">Adjust search or role filters to broaden the list.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u._id} className="transition hover:bg-[#F8FAFC]">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-brandBorder bg-primary/10 text-sm font-bold text-primary">
                          {u.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-brandText">{u.name}</p>
                          <p className="truncate text-xs text-brandText-muted">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="status-badge status-neutral capitalize">
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-brandText-muted">
                      {u.block && u.room ? `Block ${u.block}, Room ${u.room}` : "Not assigned"}
                    </td>
                    <td className="px-6 py-4">
                      {u.isBlocked ? (
                        <span className="status-badge status-error">
                          <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-status-error" />
                          Blocked
                        </span>
                      ) : (
                        <span className="status-badge status-success">
                          <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-status-success" />
                          Active
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {u.role === "student" && !u.isBlocked ? (
                        <button
                          onClick={() => blockUser(u._id)}
                          className="inline-flex items-center justify-center rounded-lg border border-status-error/30 bg-surface px-3 py-1.5 text-xs font-semibold text-status-error transition hover:bg-status-error/10 focus:outline-none focus:ring-2 focus:ring-status-error/20"
                        >
                          Block
                        </button>
                      ) : (
                        <span className="text-brandText-muted">Not available</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default AdminUsers;
