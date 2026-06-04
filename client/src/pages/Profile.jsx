import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/axios";
import toast from "react-hot-toast";

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const loadProfile = async () => {
    try {
      const res = await API.get("/profile");
      setUser(res.data);
    } catch {
      toast.error("Failed to load profile");
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleUpload = async () => {
    if (!file) return toast.error("Select an image first");
    setIsUploading(true);

    const formData = new FormData();
    formData.append("profilePic", file);

    try {
      await API.put("/profile/upload", formData);
      toast.success("Profile picture updated");
      setFile(null);
      loadProfile();
    } catch {
      toast.error("Failed to update profile picture");
    } finally {
      setIsUploading(false);
    }
  };

  if (!user) {
    return (
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex items-center gap-3">
          <div className="skeleton h-10 w-10 rounded-xl" />
          <div className="space-y-2">
            <div className="skeleton h-5 w-32 rounded-full" />
            <div className="skeleton h-4 w-48 rounded-full" />
          </div>
        </div>
        <div className="portal-panel p-6">
          <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
            <div className="skeleton h-72 rounded-xl" />
            <div className="space-y-4">
              <div className="skeleton h-32 rounded-xl" />
              <div className="skeleton h-32 rounded-xl" />
              <div className="skeleton h-32 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const homeRoute =
    user.role === "admin" ? "/admin" : user.role === "warden" ? "/warden" : "/student";

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <button onClick={() => navigate(homeRoute)} className="portal-button-secondary">
            Back
          </button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">My Profile</h1>
            <p className="mt-2 text-sm text-slate-500">Manage your account details and profile photo.</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <aside className="portal-panel overflow-hidden">
          <div className="border-b border-indigo-100 bg-indigo-50 px-6 py-5">
            <div className="flex flex-col items-center text-center">
              <img
                src={
                  user.profilePic
                    ? `http://localhost:5000/uploads/${user.profilePic}`
                    : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=EEF2FF&color=3730A3`
                }
                alt="Profile"
                className="h-24 w-24 rounded-full border-4 border-white object-cover"
              />
              <h2 className="mt-4 text-xl font-semibold text-slate-900">{user.name}</h2>
              <p className="mt-1 text-sm capitalize text-slate-500">{user.role}</p>
            </div>
          </div>

          <div className="space-y-5 px-6 py-5">
            <div>
              <label htmlFor="profile-upload" className="portal-label">
                Update Profile Photo
              </label>
              <label
                htmlFor="profile-upload"
                className="mt-2 flex cursor-pointer items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center transition hover:border-indigo-400 hover:bg-indigo-50"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900">Choose image</p>
                  <p className="mt-1 text-xs text-slate-500">Upload a clear profile photo.</p>
                </div>
                <input
                  id="profile-upload"
                  type="file"
                  className="sr-only"
                  onChange={(e) => setFile(e.target.files[0])}
                  accept="image/*"
                />
              </label>
              {file && <p className="mt-2 truncate text-sm text-slate-600">{file.name}</p>}
            </div>

            <button
              onClick={handleUpload}
              disabled={!file || isUploading}
              className="portal-button-primary w-full disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isUploading ? "Uploading..." : "Save Photo"}
            </button>
          </div>
        </aside>

        <div className="space-y-6">
          <section className="portal-panel overflow-hidden">
            <div className="portal-section-head">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Personal Information</h2>
                <p className="text-sm text-slate-500">Your registered hostel account details</p>
              </div>
            </div>
            <div className="grid gap-4 px-6 py-4 sm:grid-cols-2">
              <div className="portal-panel-soft px-4 py-4">
                <p className="text-xs font-semibold text-slate-500">Email</p>
                <p className="mt-2 text-sm font-medium text-slate-900">{user.email || "Not available"}</p>
              </div>
              <div className="portal-panel-soft px-4 py-4">
                <p className="text-xs font-semibold text-slate-500">Role</p>
                <p className="mt-2 text-sm font-medium capitalize text-slate-900">{user.role}</p>
              </div>
              <div className="portal-panel-soft px-4 py-4">
                <p className="text-xs font-semibold text-slate-500">Hostel Block</p>
                <p className="mt-2 text-sm font-medium text-slate-900">
                  {user.block ? `Block ${user.block}` : "Not assigned"}
                </p>
              </div>
              <div className="portal-panel-soft px-4 py-4">
                <p className="text-xs font-semibold text-slate-500">Room Number</p>
                <p className="mt-2 text-sm font-medium text-slate-900">
                  {user.room ? `Room ${user.room}` : "Not assigned"}
                </p>
              </div>
            </div>
          </section>

          <section className="portal-panel overflow-hidden">
            <div className="portal-section-head">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Complaint Overview</h2>
                <p className="text-sm text-slate-500">Quick summary of your complaint activity</p>
              </div>
            </div>
            <div className="grid gap-4 px-6 py-4 sm:grid-cols-3">
              {[
                { label: "Total Tickets", value: user.totalComplaints || 0 },
                { label: "Pending Tickets", value: user.pendingComplaints || 0 },
                { label: "Resolved Tickets", value: user.resolvedComplaints || 0 },
              ].map((item) => (
                <div key={item.label} className="portal-panel-soft px-4 py-4">
                  <p className="text-xs font-semibold text-slate-500">{item.label}</p>
                  <p className="mt-3 text-3xl font-bold text-slate-900">{item.value}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Profile;
