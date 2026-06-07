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

  useEffect(() => { loadProfile(); }, []);

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
        <div className="skeleton h-7 w-40 rounded-md" />
        <div className="portal-panel p-6">
          <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
            <div className="skeleton h-64 rounded-xl" />
            <div className="space-y-4">
              <div className="skeleton h-28 rounded-xl" />
              <div className="skeleton h-28 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const homeRoute = user.role === "admin" ? "/admin" : user.role === "warden" ? "/warden" : "/student";

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Page Header */}
      <header className="flex items-center gap-3">
        <button onClick={() => navigate(homeRoute)} className="portal-button-secondary">
          Back
        </button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-brandText">Account Settings</h1>
          <p className="mt-0.5 text-sm text-brandText-muted">Manage your profile and account details.</p>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        {/* Sidebar: Avatar and upload */}
        <aside className="portal-panel overflow-hidden">
          <div className="border-b border-brandBorder bg-slate-50/50 px-6 py-6 text-center">
            <img
              src={
                user.profilePic
                  ? `http://localhost:5000/uploads/${user.profilePic}`
                  : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=EEF2FF&color=2563EB`
              }
              alt="Profile"
              className="mx-auto h-24 w-24 rounded-full border-4 border-surface shadow-sm object-cover"
            />
            <h2 className="mt-4 text-base font-bold text-brandText">{user.name}</h2>
            <span className="mt-1 inline-flex items-center rounded-full border border-brandBorder bg-surface px-2.5 py-0.5 text-xs font-semibold capitalize text-brandText-muted">
              {user.role}
            </span>
          </div>

          <div className="space-y-4 px-6 py-5">
            <div>
              <label className="portal-label">Update Profile Photo</label>
              <label
                htmlFor="profile-upload"
                className="mt-2 flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-brandBorder bg-[#F8FAFC] px-4 py-4 text-center transition hover:border-primary hover:bg-white"
              >
                <svg className="h-4 w-4 text-brandText-muted" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
                <span className="text-sm font-semibold text-brandText">
                  {file ? file.name : "Choose image"}
                </span>
                <input id="profile-upload" type="file" className="sr-only" onChange={(e) => setFile(e.target.files[0])} accept="image/*" />
              </label>
            </div>
            <button
              onClick={handleUpload}
              disabled={!file || isUploading}
              className="portal-button-primary w-full disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isUploading ? "Saving..." : "Save Photo"}
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="space-y-5">
          {/* Personal Information */}
          <section className="portal-panel overflow-hidden">
            <div className="portal-section-head">
              <div>
                <h2 className="text-sm font-semibold text-brandText">Personal Information</h2>
                <p className="mt-0.5 text-xs text-brandText-muted">Your registered hostel account details</p>
              </div>
            </div>
            <div className="grid gap-px bg-brandBorder sm:grid-cols-2">
              {[
                { label: "Full Name", value: user.name },
                { label: "Email Address", value: user.email || "Not available" },
                { label: "Role", value: user.role },
                { label: "Hostel Block", value: user.block ? `Block ${user.block}` : "Not assigned" },
                { label: "Room Number", value: user.room ? `Room ${user.room}` : "Not assigned" },
              ].map((item) => (
                <div key={item.label} className="bg-surface px-5 py-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-brandText-muted">{item.label}</p>
                  <p className="mt-1.5 text-sm font-semibold text-brandText capitalize">{item.value}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Complaint Overview */}
          <section className="portal-panel overflow-hidden">
            <div className="portal-section-head">
              <div>
                <h2 className="text-sm font-semibold text-brandText">Complaint Overview</h2>
                <p className="mt-0.5 text-xs text-brandText-muted">Summary of your complaint activity</p>
              </div>
            </div>
            <div className="grid grid-cols-3 divide-x divide-brandBorder">
              {[
                { label: "Total", value: user.totalComplaints || 0 },
                { label: "Pending", value: user.pendingComplaints || 0 },
                { label: "Resolved", value: user.resolvedComplaints || 0 },
              ].map((item) => (
                <div key={item.label} className="px-6 py-5 text-center">
                  <p className="text-3xl font-bold tracking-tight text-brandText">{item.value}</p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-brandText-muted">{item.label}</p>
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
