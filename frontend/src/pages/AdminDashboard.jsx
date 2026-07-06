import { useEffect, useState } from "react";
import api from "../services/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/admin/stats")
      .then((res) => setStats(res.data))
      .catch(() => setError("Could not load admin stats"));
  }, []);

  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;
  if (!stats) return <div className="text-center py-20 text-slate-400">Loading...</div>;

  const cards = [
    { label: "Total Users", value: stats.totalUsers },
    { label: "Freelancers", value: stats.totalFreelancers },
    { label: "Clients", value: stats.totalClients },
    { label: "Total Invoices", value: stats.totalInvoices },
    { label: "Paid Invoices", value: stats.paidInvoices },
    { label: "Unpaid Invoices", value: stats.unpaidInvoices },
    { label: "Successful Payments", value: stats.totalPayments },
    { label: "Total Volume (XLM)", value: stats.totalVolumeXLM },
    { label: "Feedback Count", value: stats.feedbackCount },
    { label: "Average Rating", value: stats.averageRating || "N/A" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-bold mb-8">Admin Analytics</h1>
      <div className="grid sm:grid-cols-3 md:grid-cols-5 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="bg-white border border-slate-200 rounded-xl p-5">
            <p className="text-xs text-slate-500">{c.label}</p>
            <p className="text-2xl font-bold mt-1">{c.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
