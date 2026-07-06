import { Link, useNavigate } from "react-router-dom";
import { Rocket, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import LiveBalance from "./LiveBalance";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-10 transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg text-stellar-purple">
          <Rocket size={22} />
          StellarInvoice
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <ThemeToggle />
          {user ? (
            <>
              {user.walletAddress && <LiveBalance walletAddress={user.walletAddress} />}
              <Link to="/dashboard" className="hover:text-stellar-purple dark:text-slate-300">Dashboard</Link>
              <Link to="/create-invoice" className="hover:text-stellar-purple hidden sm:inline dark:text-slate-300">New Invoice</Link>
              <button
                onClick={() => { logout(); navigate("/"); }}
                className="flex items-center gap-1 text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400"
              >
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-stellar-purple dark:text-slate-300">Login</Link>
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
