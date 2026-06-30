import { STATUS_COLORS } from "@/lib/auth";

export function StatusBadge({ status }: { status: string }) {
  const colorClass =
    STATUS_COLORS[status] ?? "bg-gray-100 text-gray-700";

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}
    >
      {status}
    </span>
  );
}
