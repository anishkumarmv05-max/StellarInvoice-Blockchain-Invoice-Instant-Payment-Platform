import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "freelancer" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <h1 className="text-2xl font-bold mb-6">Create your account</h1>
      {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full border border-slate-300 rounded-lg px-4 py-2.5"
          placeholder="Full name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          type="email"
          className="w-full border border-slate-300 rounded-lg px-4 py-2.5"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          type="password"
          className="w-full border border-slate-300 rounded-lg px-4 py-2.5"
          placeholder="Password (min 6 chars)"
          minLength={6}
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <div className="flex gap-3">
          {["freelancer", "client"].map((r) => (
            <button
              type="button"
              key={r}
              onClick={() => setForm({ ...form, role: r })}
              className={`flex-1 py-2.5 rounded-lg border capitalize text-sm font-medium ${
                form.role === r ? "border-stellar-purple bg-purple-50 text-stellar-purple" : "border-slate-300"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
        <button
          disabled={loading}
          className="w-full bg-stellar-purple text-white py-2.5 rounded-lg font-medium hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>
      <p className="text-sm text-slate-500 mt-4">
        Already have an account? <Link to="/login" className="text-stellar-purple">Log in</Link>
      </p>
    </div>
  );
}
