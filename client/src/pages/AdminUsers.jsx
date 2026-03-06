import { useEffect, useState } from "react";
import API from "../utils/axios";

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
    if (!window.confirm("Block this user?")) return;

    try {
      await API.put(`/admin/block/${id}`);
      loadUsers();
    } catch {
      alert("Failed to block user");
    }
  };

  /* ================= FILTER USERS ================= */

  const filteredUsers = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());

    const matchRole =
      roleFilter === "all" || u.role === roleFilter;

    return matchSearch && matchRole;
  });

  return (
    <div className="space-y-6">

      {/* PAGE TITLE */}
      <div>
        <h1 className="text-3xl font-bold text-[#2A3547]">
          User Management
        </h1>
        <p className="text-gray-500">
          Manage hostel users
        </p>
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-col md:flex-row gap-4">

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search by name or email..."
          className="border p-2 rounded-lg w-full md:w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* ROLE FILTER */}
        <select
          className="border p-2 rounded-lg w-full md:w-48"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="all">All Roles</option>
          <option value="student">Student</option>
          <option value="warden">Warden</option>
          <option value="admin">Admin</option>
        </select>

      </div>

      {/* USERS TABLE */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">

        <table className="w-full text-sm">

          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Block</th>
              <th className="p-3">Room</th>
              <th className="p-3">Status</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>

          <tbody>

            {filteredUsers.map((u) => (
              <tr key={u._id} className="border-t">

                <td className="p-3 font-medium">
                  {u.name}
                </td>

                <td className="p-3">
                  {u.email}
                </td>

                <td className="p-3 capitalize">
                  {u.role}
                </td>

                <td className="p-3">
                  {u.block || "-"}
                </td>

                <td className="p-3">
                  {u.room || "-"}
                </td>

                <td className="p-3">
                  {u.isBlocked ? (
                    <span className="text-red-600 font-semibold">
                      Blocked
                    </span>
                  ) : (
                    <span className="text-green-600 font-semibold">
                      Active
                    </span>
                  )}
                </td>

                <td className="p-3">

                  {u.role === "student" && !u.isBlocked && (
                    <button
                      onClick={() => blockUser(u._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Block
                    </button>
                  )}

                  {u.isBlocked && (
                    <span className="text-gray-400">
                      —
                    </span>
                  )}

                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default AdminUsers;