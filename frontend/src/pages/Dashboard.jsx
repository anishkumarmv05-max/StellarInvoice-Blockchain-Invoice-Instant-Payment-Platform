import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Wallet, Plus, ExternalLink, Download } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { connectFreighter } from "../services/wallet";
import api from "../services/api";
import StatusBadge from "../components/StatusBadge";

export default function Dashboard() {
  const { user, setWallet } = useAuth();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/invoices")
      .then((res) => setInvoices(res.data.invoices))
      .catch(() => setError("Could not load invoices"))
      .finally(() => setLoading(false));
  }, []);

  const handleConnectWallet = async () => {
    setConnecting(true);
    setError("");
    try {
      const { publicKey } = await connectFreighter();
      await api.patch("/users/wallet", { walletAddress: publicKey });
      setWallet(publicKey);
    } catch (err) {
      setError(err.message);
    } finally {
      setConnecting(false);
    }
  };

  const totalPaid = invoices.filter((i) => i.status === "paid").length;
  const totalPending = invoices.filter((i) => i.status !== "paid").length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">
            {user?.role === "freelancer" ? "Freelancer" : "Client"} Dashboard
          </h1>
          <p className="text-slate-500 text-sm">Welcome back, {user?.name}</p>
        </div>
        {user?.role === "freelancer" && (
          <Link
            to="/create-invoice"
            className="flex items-center gap-2 bg-stellar-purple text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 w-fit"
          >
            <Plus size={16} /> New Invoice
          </Link>
        )}
      </div>

      {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">{error}</div>}

      {!user?.walletAddress ? (
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-5 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Wallet className="text-stellar-purple" />
            <div>
              <p className="font-medium">Connect your Stellar wallet</p>
              <p className="text-sm text-slate-500">
                {user?.role === "client"
                  ? "⚠️ Clients must connect their wallet to see invoices sent to them."
                  : "Required to create and manage invoices."}
              </p>
            </div>
          </div>
          <button
            onClick={handleConnectWallet}
            disabled={connecting}
            className="bg-stellar-purple text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-60"
          >
            {connecting ? "Connecting..." : "Connect Freighter"}
          </button>
        </div>
      ) : (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-8 flex items-center gap-3 text-sm">
          <Wallet size={18} className="text-green-600" />
          <span className="font-mono text-green-700">
            {user.walletAddress.slice(0, 8)}...{user.walletAddress.slice(-6)}
          </span>
          <span className="text-green-600">connected</span>
        </div>
      )}

      <div className="grid sm:grid-cols-5 gap-4 mb-8">
        {[
          { label: "Total Invoices", value: invoices.length },
          { label: "Paid", value: totalPaid },
          { label: "Pending", value: totalPending },
          { label: "Total Revenue", value: `${invoices.filter((i) => i.status === "paid").reduce((acc, curr) => acc + Number(curr.totalAmount), 0)} XLM` },
          { label: "Unpaid Value", value: `${invoices.filter((i) => i.status !== "paid").reduce((acc, curr) => acc + Number(curr.totalAmount), 0)} XLM` },
        ].map((s) => (
          <div key={s.label} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <p className="text-sm text-slate-500 dark:text-slate-400">{s.label}</p>
            <p className="text-3xl font-bold mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500 text-left">
            <tr>
              <th className="px-4 py-3">Invoice</th>
              <th className="px-4 py-3">Client</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-400">Loading...</td></tr>
            ) : invoices.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-400">No invoices yet.</td></tr>
            ) : (
              invoices.map((inv) => (
                <tr key={inv._id} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-medium">{inv.invoiceNumber}</td>
                  <td className="px-4 py-3">{inv.clientName}</td>
                  <td className="px-4 py-3">{inv.totalAmount} {inv.currency}</td>
                  <td className="px-4 py-3"><StatusBadge status={inv.status} /></td>
                  <td className="px-4 py-3">
                    <Link to={`/invoice/${inv._id}`} className="text-stellar-purple flex items-center gap-1 text-sm">
                      View <ExternalLink size={14} />
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}