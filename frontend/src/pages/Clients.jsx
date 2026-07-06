import { useEffect, useState } from "react";
import { Users, Mail } from "lucide-react";
import api from "../services/api";

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/invoices")
      .then((res) => {
        const invoices = res.data.invoices;
        const clientMap = {};
        
        invoices.forEach((inv) => {
          if (!clientMap[inv.clientEmail]) {
            clientMap[inv.clientEmail] = {
              name: inv.clientName,
              email: inv.clientEmail,
              totalBilled: 0,
              invoiceCount: 0,
            };
          }
          clientMap[inv.clientEmail].totalBilled += inv.totalAmount;
          clientMap[inv.clientEmail].invoiceCount += 1;
        });
        
        setClients(Object.values(clientMap).sort((a, b) => b.totalBilled - a.totalBilled));
      })
      .catch(() => setError("Could not load clients"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center gap-3 mb-8">
        <Users className="text-stellar-purple" size={28} />
        <h1 className="text-2xl font-bold">Client Directory</h1>
      </div>

      {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">{error}</div>}

      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 text-left">
            <tr>
              <th className="px-4 py-3">Client Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Invoices</th>
              <th className="px-4 py-3">Total Billed</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-slate-400">Loading clients...</td></tr>
            ) : clients.length === 0 ? (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-slate-400">No clients found yet.</td></tr>
            ) : (
              clients.map((client) => (
                <tr key={client.email} className="border-t border-slate-100 dark:border-slate-700">
                  <td className="px-4 py-3 font-medium">{client.name}</td>
                  <td className="px-4 py-3 flex items-center gap-2">
                    <Mail size={14} className="text-slate-400" />
                    {client.email}
                  </td>
                  <td className="px-4 py-3">{client.invoiceCount}</td>
                  <td className="px-4 py-3 font-mono">{client.totalBilled.toFixed(2)} XLM</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
