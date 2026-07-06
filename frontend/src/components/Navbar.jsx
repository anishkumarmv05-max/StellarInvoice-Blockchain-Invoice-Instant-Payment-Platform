import { Link, useNavigate } from "react-router-dom";
import { Rocket, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="border-b border-slate-200 bg-white sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg text-stellar-purple">
          <Rocket size={22} />
          StellarInvoice
        </Link>
        <div className="flex items-center gap-4 text-sm">
          {user ? (
            <>
              <Link to="/dashboard" className="hover:text-stellar-purple">Dashboard</Link>
              <Link to="/create-invoice" className="hover:text-stellar-purple hidden sm:inline">New Invoice</Link>
              <button
                onClick={() => { logout(); navigate("/"); }}
                className="flex items-center gap-1 text-slate-500 hover:text-red-500"
              >
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-stellar-purple">Login</Link>
              <Link
                to="/register"
                className="bg-stellar-purple text-white px-4 py-2 rounded-lg hover:opacity-90"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
