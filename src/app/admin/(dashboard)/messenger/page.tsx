import { createClient } from "@/lib/supabase/server";
import { formatCurrency, formatDate } from "@/lib/auth";
import { PageHeader } from "@/components/page-header";
import { DataTable } from "@/components/data-table";
import { StatusBadge } from "@/components/status-badge";

export default async function MessengerPage() {
  const supabase = await createClient();
  const { data: jobs } = await supabase
    .from("MessengerJob")
    .select("*")
    .order("scheduledAt", { ascending: false })
    .limit(50);

  return (
    <div>
      <PageHeader
        title="ค่าแมส / จัดส่ง"
        description="จัดการงานแมสและคำนวณค่าจัดส่ง"
      />

      <DataTable
        columns={[
          { key: "customer", label: "ลูกค้า" },
          { key: "distance", label: "ระยะทาง", className: "text-center" },
          { key: "fee", label: "ค่าแมส", className: "text-right" },
          { key: "profit", label: "กำไร", className: "text-right" },
          { key: "promo", label: "โปรโมชัน" },
          { key: "scheduled", label: "กำหนดส่ง" },
          { key: "status", label: "สถานะ" },
        ]}
        rows={
          jobs?.map((j) => ({
            customer: (
              <div>
                <p className="font-medium">{j.customerName}</p>
                {j.phone && (
                  <p className="text-xs text-gray-400">{j.phone}</p>
                )}
              </div>
            ),
            distance: `${Number(j.distanceKm)} กม.`,
            fee: formatCurrency(Number(j.fee)),
            profit: formatCurrency(Number(j.estimatedProfit)),
            promo: j.promoType,
            scheduled: formatDate(j.scheduledAt),
            status: <StatusBadge status={j.status} />,
          })) ?? []
        }
        emptyMessage="ยังไม่มีงานแมส"
      />
    </div>
  );
}
