import { Link } from "react-router-dom";
import { Zap, ShieldCheck, Globe, ArrowRight } from "lucide-react";

export default function Landing() {
  return (
    <div>
      <section className="max-w-5xl mx-auto px-6 py-20 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
          Get Paid in <span className="text-stellar-purple">Seconds</span>, Not Weeks
        </h1>
        <p className="mt-5 text-lg text-slate-600 max-w-2xl mx-auto">
          StellarInvoice lets freelancers send blockchain-verified invoices and get paid
          instantly on the Stellar network — no banks, no delays, no disputes.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link
            to="/register"
            className="bg-stellar-purple text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 hover:opacity-90"
          >
            Create Your First Invoice <ArrowRight size={18} />
          </Link>
          <Link
            to="/login"
            className="border border-slate-300 px-6 py-3 rounded-lg font-medium hover:bg-slate-50"
          >
            Sign In
          </Link>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-20 grid sm:grid-cols-3 gap-6">
        {[
          { icon: Zap, title: "Instant Settlement", desc: "Payments settle on Stellar in ~5 seconds, worldwide." },
          { icon: ShieldCheck, title: "Verifiable Proof", desc: "Every payment is backed by an on-chain transaction hash." },
          { icon: Globe, title: "Borderless", desc: "No banks or currency conversion headaches for cross-border work." },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="bg-white p-6 rounded-xl border border-slate-200">
            <Icon className="text-stellar-purple mb-3" size={28} />
            <h3 className="font-semibold mb-1">{title}</h3>
            <p className="text-sm text-slate-600">{desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
