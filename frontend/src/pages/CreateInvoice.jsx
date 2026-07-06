import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2 } from "lucide-react";
import api from "../services/api";

const emptyItem = () => ({ name: "", quantity: 1, price: 0 });

export default function CreateInvoice() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    clientName: "",
    clientEmail: "",
    title: "",
    description: "",
    dueDate: "",
  });
  const [items, setItems] = useState([emptyItem()]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const total = items.reduce((sum, i) => sum + (Number(i.quantity) || 0) * (Number(i.price) || 0), 0);

  const updateItem = (idx, field, value) => {
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, [field]: value } : it)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/invoices", { ...form, items });
      navigate(`/invoice/${res.data.invoice._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create invoice");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-bold mb-6">Create Invoice</h1>
      {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <input
            className="border border-slate-300 rounded-lg px-4 py-2.5"
            placeholder="Client name"
            value={form.clientName}
            onChange={(e) => setForm({ ...form, clientName: e.target.value })}
            required
          />
          <input
            type="email"
            className="border border-slate-300 rounded-lg px-4 py-2.5"
            placeholder="Client email"
            value={form.clientEmail}
            onChange={(e) => setForm({ ...form, clientEmail: e.target.value })}
            required
          />
        </div>

        <input
          className="w-full border border-slate-300 rounded-lg px-4 py-2.5"
          placeholder="Invoice title (e.g. Website Redesign - June)"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />

        <textarea
          className="w-full border border-slate-300 rounded-lg px-4 py-2.5"
          placeholder="Description of work"
          rows={3}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <div>
          <label className="text-sm font-medium text-slate-600">Due date</label>
          <input
            type="date"
            className="w-full border border-slate-300 rounded-lg px-4 py-2.5 mt-1"
            value={form.dueDate}
            onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
            required
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-slate-600">Line items</label>
            <button
              type="button"
              onClick={() => setItems([...items, emptyItem()])}
              className="text-sm text-stellar-purple flex items-center gap-1"
            >
              <Plus size={14} /> Add item
            </button>
          </div>
          <div className="space-y-2">
            {items.map((item, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <input
                  className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm"
                  placeholder="Item name"
                  value={item.name}
                  onChange={(e) => updateItem(idx, "name", e.target.value)}
                  required
                />
                <input
                  type="number"
                  min={1}
                  className="w-20 border border-slate-300 rounded-lg px-3 py-2 text-sm"
                  value={item.quantity}
                  onChange={(e) => updateItem(idx, "quantity", e.target.value)}
                  required
                />
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  className="w-28 border border-slate-300 rounded-lg px-3 py-2 text-sm"
                  placeholder="Price (XLM)"
                  value={item.price}
                  onChange={(e) => updateItem(idx, "price", e.target.value)}
                  required
                />
                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setItems(items.filter((_, i) => i !== idx))}
                    className="text-slate-400 hover:text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-50 rounded-lg p-4 flex justify-between items-center">
          <span className="text-slate-600">Total</span>
          <span className="text-xl font-bold">{total.toFixed(2)} XLM</span>
        </div>

        <button
          disabled={loading}
          className="w-full bg-stellar-purple text-white py-3 rounded-lg font-medium hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Creating..." : "Create & Send Invoice"}
        </button>
      </form>
    </div>
  );
}
