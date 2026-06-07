import { Link } from "react-router-dom";

function Home() {
  const rows = [
    { title: "Water leakage near washroom", owner: "Block A, Room 204", status: "In Progress", cls: "status-progress" },
    { title: "Wi-Fi outage on second floor", owner: "Block C, Room 118", status: "Pending", cls: "status-pending" },
    { title: "Faulty corridor lighting", owner: "Block B, Floor 3", status: "Resolved", cls: "status-success" },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-brandText">
      <nav className="border-b border-brandBorder bg-surface">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-sm font-bold text-white">
              C
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-brandText">CampusCare</h1>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-brandText-muted">Hostel Operations</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/register" className="portal-button-secondary hidden sm:inline-flex">
              Create Account
            </Link>
            <Link to="/login" className="portal-button-primary">
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      <main>
        <section className="mx-auto grid min-h-[calc(100vh-64px)] max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-8">
          <div className="max-w-2xl">
            <span className="status-badge border-primary/20 bg-primary/10 text-primary">
              Centralized hostel complaint management
            </span>
            <h2 className="mt-5 text-4xl font-bold tracking-tight text-brandText sm:text-5xl">
              Campus operations, tracked with clarity.
            </h2>
            <p className="mt-5 text-base leading-7 text-brandText-muted">
              CampusCare gives students, wardens, and administrators one professional workspace for reporting issues,
              tracking resolution, posting announcements, and maintaining emergency contacts.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link to="/login" className="portal-button-primary">
                Open Workspace
              </Link>
              <Link to="/register" className="portal-button-secondary">
                Register Student Account
              </Link>
            </div>
          </div>

          <div className="portal-panel overflow-hidden">
            <div className="flex items-center justify-between border-b border-brandBorder bg-[#F8FAFC] px-5 py-4">
              <div>
                <p className="text-sm font-semibold text-brandText">Operations Overview</p>
                <p className="mt-0.5 text-xs text-brandText-muted">Live complaint queue snapshot</p>
              </div>
              <span className="status-badge status-progress">Live</span>
            </div>

            <div className="grid gap-px bg-brandBorder sm:grid-cols-3">
              {[
                { label: "Open Tickets", value: "42", note: "Across blocks" },
                { label: "In Progress", value: "18", note: "Assigned to wardens" },
                { label: "Resolved", value: "126", note: "This term" },
              ].map((item) => (
                <div key={item.label} className="bg-surface px-5 py-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-brandText-muted">{item.label}</p>
                  <p className="mt-2 text-3xl font-bold tracking-tight text-brandText">{item.value}</p>
                  <p className="mt-1 text-xs text-brandText-muted">{item.note}</p>
                </div>
              ))}
            </div>

            <div className="p-5">
              <div className="overflow-hidden rounded-lg border border-brandBorder">
                <table className="min-w-full divide-y divide-brandBorder text-left text-sm">
                  <thead className="bg-[#F8FAFC]">
                    <tr>
                      <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-brandText-muted">Issue</th>
                      <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-brandText-muted">Location</th>
                      <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-brandText-muted">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brandBorder bg-surface">
                    {rows.map((row) => (
                      <tr key={row.title}>
                        <td className="px-4 py-3 font-semibold text-brandText">{row.title}</td>
                        <td className="px-4 py-3 text-brandText-muted">{row.owner}</td>
                        <td className="px-4 py-3">
                          <span className={`status-badge ${row.cls}`}>{row.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {["Students submit", "Wardens resolve", "Admins monitor"].map((item) => (
                  <div key={item} className="rounded-lg border border-brandBorder bg-[#F8FAFC] px-4 py-3">
                    <p className="text-sm font-semibold text-brandText">{item}</p>
                    <p className="mt-1 text-xs text-brandText-muted">Role-specific workflows</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-brandBorder bg-surface px-4 py-5 text-center text-xs font-medium text-brandText-muted">
        CampusCare {new Date().getFullYear()} - Hostel Management System
      </footer>
    </div>
  );
}

export default Home;
