import { useState } from "react";
import api from "../services/api";

export default function Feedback() {
  const [form, setForm] = useState({ name: "", email: "", rating: 5, message: "" });
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/feedback", form);
      setDone(true);
    } catch (err) {
      setError(err.response?.data?.message || "Could not submit feedback");
    }
  };

  if (done) {
    return (
      <div className="max-w-md mx-auto px-6 py-20 text-center">
        <h1 className="text-2xl font-bold mb-2">Thank you! 🎉</h1>
        <p className="text-slate-500">Your feedback helps us improve StellarInvoice.</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <h1 className="text-2xl font-bold mb-6">Share your feedback</h1>
      {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full border border-slate-300 rounded-lg px-4 py-2.5"
          placeholder="Your name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="email"
          className="w-full border border-slate-300 rounded-lg px-4 py-2.5"
          placeholder="Your email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <div>
          <label className="text-sm text-slate-600">Rating</label>
          <div className="flex gap-2 mt-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                type="button"
                key={n}
                onClick={() => setForm({ ...form, rating: n })}
                className={`w-10 h-10 rounded-lg border font-medium ${
                  form.rating === n ? "bg-stellar-purple text-white border-stellar-purple" : "border-slate-300"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
        <textarea
          className="w-full border border-slate-300 rounded-lg px-4 py-2.5"
          placeholder="What did you think?"
          rows={4}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          required
        />
        <button className="w-full bg-stellar-purple text-white py-2.5 rounded-lg font-medium hover:opacity-90">
          Submit Feedback
        </button>
      </form>
    </div>
  );
}
