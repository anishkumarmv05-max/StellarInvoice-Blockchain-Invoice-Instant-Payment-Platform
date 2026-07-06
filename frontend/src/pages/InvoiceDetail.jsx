import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Download, Wallet, ExternalLink, CheckCircle2 } from "lucide-react";
import api from "../services/api";
import { connectFreighter } from "../services/wallet";
import { payInvoiceWithXLM } from "../services/stellarPayment";
import { generateInvoicePDF } from "../services/pdf";
import StatusBadge from "../components/StatusBadge";

export default function InvoiceDetail() {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [paying, setPaying] = useState(false);
  const [wallet, setWalletState] = useState(null);

  const load = () => {
    api
      .get(`/invoices/${id}`)
      .then((res) => setInvoice(res.data.invoice))
      .catch(() => setError("Invoice not found"))
      .finally(() => setLoading(false));
  };

  useEffect(load, [id]);

  const handleConnect = async () => {
    setError("");
    try {
      const { publicKey } = await connectFreighter();
      setWalletState(publicKey);
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePay = async () => {
    if (!wallet) return;
    setPaying(true);
    setError("");
    try {
      const txHash = await payInvoiceWithXLM({
        senderPublicKey: wallet,
        receiverPublicKey: invoice.freelancerWallet,
        amount: invoice.totalAmount,
        memo: invoice.invoiceNumber,
      });

      await api.post("/payments", {
        invoiceId: invoice._id,
        txHash,
        payerWallet: wallet,
      });

      load();
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Payment failed");
    } finally {
      setPaying(false);
    }
  };

  if (loading) return <div className="text-center py-20 text-slate-400">Loading invoice...</div>;
  if (!invoice) return <div className="text-center py-20 text-red-500">{error || "Invoice not found"}</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-xl font-bold">{invoice.title}</h1>
            <p className="text-slate-500 text-sm">#{invoice.invoiceNumber}</p>
          </div>
          <StatusBadge status={invoice.status} />
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm mb-6">
          <div>
            <p className="text-slate-400">Billed to</p>
            <p className="font-medium">{invoice.clientName}</p>
          </div>
          <div>
            <p className="text-slate-400">Due date</p>
            <p className="font-medium">{new Date(invoice.dueDate).toLocaleDateString()}</p>
          </div>
        </div>

        {invoice.description && (
          <p className="text-sm text-slate-600 mb-6 border-l-2 border-slate-200 pl-3">{invoice.description}</p>
        )}

        <div className="border border-slate-200 rounded-lg overflow-hidden mb-6">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 text-left">
              <tr>
                <th className="px-4 py-2">Item</th>
                <th className="px-4 py-2">Qty</th>
                <th className="px-4 py-2">Price</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, idx) => (
                <tr key={idx} className="border-t border-slate-100">
                  <td className="px-4 py-2">{item.name}</td>
                  <td className="px-4 py-2">{item.quantity}</td>
                  <td className="px-4 py-2">{item.price} XLM</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center mb-6">
          <span className="text-slate-500">Total</span>
          <span className="text-2xl font-bold">{invoice.totalAmount} XLM</span>
        </div>

        {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">{error}</div>}

        {invoice.status === "paid" ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-green-700 font-medium">
              <CheckCircle2 size={18} /> Payment confirmed
            </div>
            <a
              href={`https://stellar.expert/explorer/testnet/tx/${invoice.paymentTxHash}`}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-green-700 flex items-center gap-1 font-mono break-all"
            >
              {invoice.paymentTxHash} <ExternalLink size={14} />
            </a>
          </div>
        ) : !wallet ? (
          <button
            onClick={handleConnect}
            className="w-full bg-stellar-purple text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:opacity-90"
          >
            <Wallet size={18} /> Connect Wallet to Pay
          </button>
        ) : (
          <button
            onClick={handlePay}
            disabled={paying}
            className="w-full bg-stellar-purple text-white py-3 rounded-lg font-medium hover:opacity-90 disabled:opacity-60"
          >
            {paying ? "Processing payment..." : `Pay ${invoice.totalAmount} XLM Now`}
          </button>
        )}

        <button
          onClick={() => generateInvoicePDF(invoice)}
          className="w-full mt-3 border border-slate-300 py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-slate-50"
        >
          <Download size={16} /> Download {invoice.status === "paid" ? "Receipt" : "Invoice"} PDF
        </button>
      </div>
    </div>
  );
}
