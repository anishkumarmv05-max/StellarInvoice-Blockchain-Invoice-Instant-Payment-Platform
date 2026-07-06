const STYLES = {
  paid: "bg-green-100 text-green-700",
  sent: "bg-blue-100 text-blue-700",
  draft: "bg-slate-100 text-slate-600",
  overdue: "bg-red-100 text-red-700",
  cancelled: "bg-slate-200 text-slate-500 line-through",
};

export default function StatusBadge({ status }) {
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${STYLES[status] || STYLES.draft}`}>
      {status}
    </span>
  );
}
