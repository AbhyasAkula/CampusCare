import { useEffect, useState } from "react";
import API from "../utils/axios";
import toast from "react-hot-toast";

function Profile() {
  const [user, setUser] = useState(null);
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // load profile
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

  // upload image
  const handleUpload = async () => {
    if (!file) return toast.error("Select an image first");
    setIsUploading(true);

    const formData = new FormData();
    formData.append("profilePic", file);

    try {
      await API.put("/profile/upload", formData);
      toast.success("Profile picture updated!");
      setFile(null);
      loadProfile();
    } catch {
      toast.error("Failed to update profile picture");
    } finally {
      setIsUploading(false);
    }
  };

  if (!user) return (
    <div className="flex h-64 items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600"></div>
    </div>
  );

  return (
    <div className="mx-auto max-w-3xl animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">My Profile</h1>
        <p className="mt-1 text-sm text-slate-500">Manage your personal information and preferences.</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Cover Photo Area */}
        <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-500 sm:h-40"></div>
        
        <div className="px-6 pb-8 sm:px-10">
          <div className="relative -mt-16 sm:-mt-20 flex flex-col sm:flex-row sm:items-end sm:space-x-5">
            <div className="relative group">
              <img
                src={
                  user.profilePic
                    ? `http://localhost:5000/uploads/${user.profilePic}`
                    : "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.name) + "&background=random"
                }
                alt="Profile"
                className="h-32 w-32 rounded-full ring-4 ring-white object-cover bg-white sm:h-40 sm:w-40"
              />
            </div>
            <div className="mt-4 sm:mt-0 sm:pb-4 flex-1">
              <h2 className="text-2xl font-bold text-slate-900">{user.name}</h2>
              <p className="text-sm font-medium text-slate-500 capitalize">{user.role}</p>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1 space-y-6">
              <div>
                <h3 className="text-sm font-medium text-slate-900 mb-3 border-b border-slate-100 pb-2">Profile Photo</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-center w-full">
                    <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg className="w-8 h-8 mb-3 text-slate-400" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="text-xs text-slate-500 font-medium">Click to upload</p>
                      </div>
                      <input id="dropzone-file" type="file" className="hidden" onChange={(e) => setFile(e.target.files[0])} accept="image/*" />
                    </label>
                  </div>
                  {file && <p className="text-xs text-indigo-600 font-medium truncate">{file.name}</p>}
                  <button
                    onClick={handleUpload}
                    disabled={!file || isUploading}
                    className="w-full flex justify-center rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUploading ? "Uploading..." : "Save Photo"}
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-slate-900 mb-3 border-b border-slate-100 pb-2">Contact Info</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 text-sm text-slate-600">
                    <svg className="h-5 w-5 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="truncate">{user.email}</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-slate-600">
                    <svg className="h-5 w-5 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span>{user.block ? `Block ${user.block}` : "No Block"} • {user.room ? `Room ${user.room}` : "No Room"}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Activity Overview</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-center transition-all hover:border-indigo-200 hover:bg-white hover:shadow-sm">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 mb-3">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <p className="text-2xl font-bold text-slate-900">{user.totalComplaints || 0}</p>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mt-1">Total Tickets</p>
                </div>
                
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-center transition-all hover:border-amber-200 hover:bg-white hover:shadow-sm">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-600 mb-3">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-2xl font-bold text-slate-900">{user.pendingComplaints || 0}</p>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mt-1">Active</p>
                </div>

                <div className="col-span-2 sm:col-span-1 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-center transition-all hover:border-emerald-200 hover:bg-white hover:shadow-sm">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-3">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-2xl font-bold text-slate-900">{user.resolvedComplaints || 0}</p>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mt-1">Resolved</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;