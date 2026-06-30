import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/auth";
import { PageHeader } from "@/components/page-header";
import { DataTable } from "@/components/data-table";
import { StatusBadge } from "@/components/status-badge";

export default async function CreditPage() {
  const supabase = await createClient();
  const { data: cases } = await supabase
    .from("CreditCase")
    .select("*")
    .order("createdAt", { ascending: false })
    .limit(50);

  return (
    <div>
      <PageHeader
        title="สินเชื่อ / ผ่อนชำระ"
        description="จัดการเคสสินเชื่อและงวดผ่อน"
      />

      <DataTable
        columns={[
          { key: "caseNo", label: "เลขเคส" },
          { key: "customer", label: "ลูกค้า" },
          { key: "device", label: "เครื่อง" },
          { key: "salePrice", label: "ราคาขาย", className: "text-right" },
          { key: "down", label: "ดาวน์", className: "text-right" },
          { key: "monthly", label: "งวด/เดือน", className: "text-right" },
          { key: "term", label: "ระยะ", className: "text-center" },
          { key: "status", label: "สถานะ" },
        ]}
        rows={
          cases?.map((c) => ({
            caseNo: c.caseNo,
            customer: (
              <div>
                <p className="font-medium">{c.customerNameSnapshot}</p>
                {c.customerPhoneSnapshot && (
                  <p className="text-xs text-gray-400">
                    {c.customerPhoneSnapshot}
                  </p>
                )}
              </div>
            ),
            device: [c.deviceBrand, c.deviceModel].filter(Boolean).join(" ") || "-",
            salePrice: formatCurrency(Number(c.salePrice)),
            down: `${Number(c.downPercent)}% (${formatCurrency(Number(c.downAmount))})`,
            monthly: formatCurrency(Number(c.monthlyPayment)),
            term: `${c.termMonths} ด.`,
            status: <StatusBadge status={c.status} />,
          })) ?? []
        }
        emptyMessage="ยังไม่มีเคสสินเชื่อ"
      />
    </div>
  );
}
