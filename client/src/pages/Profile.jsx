import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/axios";
import { getUploadUrl } from "../utils/apiUrl";
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
      <div className="portal-shell px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-6">
          <div className="space-y-3">
            <div className="skeleton h-4 w-32 rounded-md" />
            <div className="skeleton h-8 w-56 rounded-md" />
            <div className="skeleton h-4 w-80 max-w-full rounded-md" />
          </div>
          <div className="grid gap-5 md:grid-cols-[280px_minmax(0,1fr)]">
            <div className="portal-panel p-6">
              <div className="skeleton mx-auto h-20 w-20 rounded-full" />
              <div className="skeleton mx-auto mt-4 h-5 w-36 rounded-md" />
              <div className="skeleton mx-auto mt-2 h-4 w-48 rounded-md" />
              <div className="skeleton mt-6 h-10 w-full rounded-lg" />
            </div>
            <div className="portal-panel p-6">
              <div className="skeleton h-5 w-44 rounded-md" />
              <div className="mt-6 space-y-5">
                <div className="skeleton h-14 w-full rounded-lg" />
                <div className="skeleton h-14 w-full rounded-lg" />
                <div className="skeleton h-14 w-full rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const homeRoute = user.role === "admin" ? "/admin" : user.role === "warden" ? "/warden" : "/student";

  return (
    <div className="portal-shell px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <header className="mb-6">
          <button
            type="button"
            onClick={() => navigate(homeRoute)}
            className="group mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-brandText-muted transition hover:text-brandText focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          >
            <svg className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            Back to Dashboard
          </button>
          <h1 className="text-2xl font-bold tracking-tight text-brandText sm:text-3xl">Account Settings</h1>
          <p className="mt-1 text-sm text-brandText-muted">Manage your profile and account preferences.</p>
        </header>

        <div className="grid items-start gap-5 md:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="portal-panel p-6">
            <div className="text-center">
              <img
                src={
                  user.profilePic
                    ? getUploadUrl(user.profilePic)
                    : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=EEF2FF&color=2563EB`
                }
                alt={`${user.name} profile`}
                className="mx-auto h-20 w-20 rounded-full border border-brandBorder object-cover shadow-sm"
              />
              <h2 className="mt-3 text-base font-bold text-brandText">{user.name}</h2>
              <p className="mt-1 truncate text-sm text-brandText-muted">{user.email || "Email not available"}</p>
              <span className="status-badge status-neutral mt-3 capitalize">{user.role}</span>
            </div>

            <div className="mt-6 border-t border-brandBorder pt-5">
              <label
                htmlFor="profile-upload"
                className="portal-button-secondary w-full cursor-pointer"
              >
                <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7H3.75A2.25 2.25 0 0 0 1.5 9.25v9A2.25 2.25 0 0 0 3.75 20.5h16.5a2.25 2.25 0 0 0 2.25-2.25v-9A2.25 2.25 0 0 0 20.25 7h-1.436a2.31 2.31 0 0 1-1.64-.825l-.65-.75A2.31 2.31 0 0 0 14.883 4.6H9.117a2.31 2.31 0 0 0-1.64.825l-.65.75Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 13.75a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
                </svg>
                Change profile image
                <input
                  id="profile-upload"
                  type="file"
                  className="sr-only"
                  onChange={(e) => setFile(e.target.files[0])}
                  accept="image/*"
                />
              </label>

              {file ? (
                <div className="mt-3">
                  <p className="truncate text-xs text-brandText-muted" title={file.name}>
                    Selected: {file.name}
                  </p>
                  <button
                    type="button"
                    onClick={handleUpload}
                    disabled={isUploading}
                    className="portal-button-primary mt-3 w-full disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isUploading ? "Saving..." : "Save new image"}
                  </button>
                </div>
              ) : (
                <p className="mt-3 text-center text-xs leading-5 text-brandText-muted">
                  {/* JPG, PNG, or other supported image formats. */}
                </p>
              )}
            </div>
          </aside>

          <section className="portal-panel overflow-hidden">
            <div className="border-b border-brandBorder px-6 py-5">
              <h2 className="text-base font-bold text-brandText">Account Information</h2>
              <p className="mt-1 text-sm text-brandText-muted">Your primary account and identity details.</p>
            </div>

            <dl className="divide-y divide-brandBorder">
              {[
                { label: "Full Name", value: user.name },
                { label: "Email", value: user.email || "Not available" },
                { label: "Role", value: user.role, capitalize: true },
              ].map((item) => (
                <div key={item.label} className="px-6 py-5 sm:grid sm:grid-cols-[140px_minmax(0,1fr)] sm:items-center sm:gap-6">
                  <dt className="text-sm font-medium text-brandText-muted">{item.label}</dt>
                  <dd className={`mt-1 text-sm font-semibold text-brandText sm:mt-0 ${item.capitalize ? "capitalize" : ""}`}>
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="border-t border-brandBorder bg-slate-50/60 px-6 py-4">
              <p className="text-xs leading-5 text-brandText-muted">
                Account information is managed by your organization. Contact an administrator if these details need to be updated.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Profile;
