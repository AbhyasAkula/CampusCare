import { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import API from "../utils/axios";

function DashboardLayout() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const navigationItems = {
    student: [
      { to: "/student", label: "Dashboard" },
      { to: "/student/raise", label: "Raise Ticket" },
      { to: "/student/complaints", label: "My Complaints" },
    ],
    warden: [
      { to: "/warden", label: "Dashboard" },
      { to: "/warden/complaints", label: "Complaints" },
      { to: "/warden/notices", label: "Announcements" },
    ],
    admin: [
      { to: "/admin", label: "Dashboard" },
      { to: "/admin/users", label: "Users" },
      { to: "/admin/complaints", label: "Complaints" },
      { to: "/admin/emergency", label: "Emergency" },
    ],
  };

  const loadProfile = async () => {
    try {
      const res = await API.get("/profile");
      setUser(res.data);
    } catch {
      console.log("Profile load failed");
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  if (!user) {
    return (
      <div className="portal-shell flex min-h-screen items-center justify-center px-4">
        <div className="portal-panel w-full max-w-xl p-6">
          <div className="space-y-4">
            <div className="skeleton h-4 w-28 rounded-full" />
            <div className="skeleton h-12 w-full rounded-xl" />
            <div className="skeleton h-12 w-5/6 rounded-xl" />
            <div className="skeleton h-48 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  const roleTitle = user.role.charAt(0).toUpperCase() + user.role.slice(1);
  const activeNavItems = navigationItems[user.role] || [];

  return (
    <div className="portal-shell">
      <nav className="sticky top-0 z-50 border-b border-indigo-100 bg-indigo-50/90 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex min-h-[72px] items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
                <span className="text-lg font-bold">C</span>
              </div>
              <div>
                <h1 className="text-lg font-bold leading-tight text-slate-900">CampusCare</h1>
                <p className="text-xs font-medium text-slate-500">{roleTitle} Portal</p>
              </div>
            </div>

            <div className="hidden items-center gap-2 md:flex">
              {activeNavItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === `/${user.role}`}
                  className={({ isActive }) =>
                    `rounded-xl px-4 py-2 text-sm font-semibold transition ${
                      isActive
                        ? "bg-indigo-600 text-white"
                        : "text-slate-600 hover:bg-white/80 hover:text-indigo-700"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>

            <div className="hidden items-center gap-3 md:flex">
              <button className="relative rounded-xl border border-indigo-100 bg-white/80 p-2 text-slate-500 transition hover:bg-white hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                <span className="absolute right-1.5 top-1.5 flex h-2.5 w-2.5 rounded-full bg-indigo-500" />
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                </svg>
              </button>

              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setProfileDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-3 rounded-full border border-indigo-100 bg-white px-1 py-1 pr-3 transition hover:border-indigo-200"
                >
                  <img
                    src={user.profilePic ? `http://localhost:5000/uploads/${user.profilePic}` : "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                    alt="profile"
                    className="h-8 w-8 rounded-full object-cover"
                  />
                  <span className="text-sm font-medium text-slate-700">{user.name?.split(" ")[0]}</span>
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 rounded-xl border border-slate-200 bg-white py-1">
                    <div className="border-b border-slate-100 px-4 py-3">
                      <p className="text-sm text-slate-500">Signed in as</p>
                      <p className="truncate text-sm font-medium text-slate-900">{user.email || user.name}</p>
                    </div>
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        navigate("/profile");
                      }}
                      className="block w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                    >
                      Your Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-slate-50"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center md:hidden">
              <button
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                className="inline-flex items-center justify-center rounded-xl border border-indigo-100 bg-white p-2 text-slate-500 transition hover:bg-slate-50"
              >
                {!mobileMenuOpen ? (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-indigo-100 bg-indigo-50 md:hidden">
            <div className="space-y-1 px-4 py-3">
              {activeNavItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === `/${user.role}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `block rounded-xl px-4 py-3 text-sm font-semibold ${
                      isActive ? "bg-indigo-600 text-white" : "text-slate-600 hover:bg-white hover:text-indigo-700"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="page-fade">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default DashboardLayout;
