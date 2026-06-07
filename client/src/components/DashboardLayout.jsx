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
      <nav className="sticky top-0 z-50 border-b border-brandBorder bg-surface">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white shadow-sm">
                  <span className="text-sm font-bold">C</span>
                </div>
                <div>
                  <h1 className="text-base font-bold leading-tight text-brandText tracking-tight">CampusCare</h1>
                  <p className="text-[11px] font-medium text-brandText-muted uppercase tracking-wider">{roleTitle}</p>
                </div>
              </div>

              <div className="hidden h-16 items-center gap-1 md:flex ml-4">
                {activeNavItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === `/${user.role}`}
                    className={({ isActive }) =>
                      `relative inline-flex items-center h-full px-3 text-sm font-medium transition-colors ${
                        isActive
                          ? "text-primary"
                          : "text-brandText-muted hover:text-brandText"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {item.label}
                        {isActive && (
                          <span className="absolute bottom-0 left-0 w-full h-[2px] bg-primary rounded-t-sm" />
                        )}
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>

            <div className="hidden items-center gap-4 md:flex">
              <button className="relative p-2 text-brandText-muted transition hover:text-brandText focus:outline-none">
                <span className="absolute right-2 top-2 flex h-2 w-2 rounded-full bg-status-error" />
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                </svg>
              </button>

              <div className="h-6 w-px bg-brandBorder" />

              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setProfileDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-2 rounded-full p-1 pr-2 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <img
                    src={user.profilePic ? `http://localhost:5000/uploads/${user.profilePic}` : "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                    alt="profile"
                    className="h-8 w-8 rounded-full border border-brandBorder object-cover shadow-sm"
                  />
                  <span className="text-sm font-medium text-brandText">{user.name?.split(" ")[0]}</span>
                  <svg className="h-4 w-4 text-brandText-muted" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl border border-brandBorder bg-surface py-1 shadow-lg shadow-slate-200/50">
                    <div className="border-b border-brandBorder px-4 py-3">
                      <p className="text-xs font-medium text-brandText-muted">Signed in as</p>
                      <p className="truncate text-sm font-semibold text-brandText mt-0.5">{user.email || user.name}</p>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          navigate("/profile");
                        }}
                        className="block w-full px-4 py-2 text-left text-sm text-brandText hover:bg-slate-50 transition-colors"
                      >
                        Account Settings
                      </button>
                    </div>
                    <div className="border-t border-brandBorder py-1">
                      <button
                        onClick={handleLogout}
                        className="block w-full px-4 py-2 text-left text-sm font-medium text-status-error transition-colors hover:bg-status-error/10"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center md:hidden">
              <button
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                className="inline-flex items-center justify-center rounded-lg p-2 text-brandText-muted transition hover:bg-slate-50 hover:text-brandText focus:outline-none"
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
          <div className="border-t border-brandBorder bg-surface md:hidden">
            <div className="space-y-1 px-4 py-3">
              {activeNavItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === `/${user.role}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `block rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                      isActive ? "bg-slate-50 text-primary" : "text-brandText-muted hover:bg-slate-50 hover:text-brandText"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
            <div className="border-t border-brandBorder px-4 py-4">
              <div className="flex items-center gap-3">
                <img
                  src={user.profilePic ? `http://localhost:5000/uploads/${user.profilePic}` : "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                  alt="profile"
                  className="h-10 w-10 rounded-full border border-brandBorder object-cover"
                />
                <div>
                  <p className="text-sm font-medium text-brandText">{user.name}</p>
                  <p className="text-xs text-brandText-muted">{user.email}</p>
                </div>
              </div>
              <div className="mt-4 flex flex-col gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate("/profile");
                  }}
                  className="rounded-lg border border-brandBorder px-4 py-2 text-sm font-medium text-brandText hover:bg-slate-50 transition-colors"
                >
                  Account Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="rounded-lg bg-status-error/10 px-4 py-2 text-sm font-medium text-status-error transition-colors hover:bg-status-error/20"
                >
                  Sign out
                </button>
              </div>
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
