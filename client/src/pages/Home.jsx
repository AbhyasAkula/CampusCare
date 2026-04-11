import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">

      {/* NAVBAR */}
      <nav className="flex justify-between items-center px-8 py-4 bg-white shadow">
        <h1 className="text-2xl font-bold text-green-600">CampusCare</h1>

        <div className="space-x-4">
          <Link
            to="/login"
            className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg font-semibold"
          >
            Login
          </Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <div className="flex flex-col items-center justify-center text-center mt-20 px-6">
        <h2 className="text-5xl font-extrabold text-gray-800 mb-6">
          Smart Hostel Complaint Management
        </h2>

        <p className="text-lg text-gray-600 max-w-2xl mb-8">
          CampusCare helps students report hostel problems instantly,
          wardens manage issues efficiently, and admins monitor everything
          in one centralized platform.
        </p>

        <Link
          to="/login"
          className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-xl text-lg font-semibold shadow-lg"
        >
          Get Started
        </Link>
      </div>

      {/* FEATURES */}
      <div className="grid md:grid-cols-3 gap-8 mt-24 px-10 pb-20">

        {/* Student */}
        <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition">
          <h3 className="text-xl font-bold text-green-600 mb-3">Students</h3>
          <p className="text-gray-600">
            Submit complaints, upload images, and track real-time status of
            hostel issues like water leakage, electricity or Wi-Fi problems.
          </p>
        </div>

        {/* Warden */}
        <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition">
          <h3 className="text-xl font-bold text-blue-600 mb-3">Wardens</h3>
          <p className="text-gray-600">
            View block complaints, respond to students, and update issue
            progress to ensure hostel facilities are maintained properly.
          </p>
        </div>

        {/* Admin */}
        <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition">
          <h3 className="text-xl font-bold text-purple-600 mb-3">Admins</h3>
          <p className="text-gray-600">
            Manage hostel blocks, rooms, wardens and students while monitoring
            all complaints across the campus from a single dashboard.
          </p>
        </div>

      </div>

      {/* FOOTER */}
      <footer className="text-center py-6 bg-white border-t">
        <p className="text-gray-500">
          © {new Date().getFullYear()} CampusCare — Hostel Management System
        </p>
      </footer>
    </div>
  );
}

export default Home;