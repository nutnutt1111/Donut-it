import { createClient } from "@/lib/supabase/server";
import { formatCurrency, formatDate } from "@/lib/auth";
import { PageHeader } from "@/components/page-header";
import { DataTable } from "@/components/data-table";
import { StatusBadge } from "@/components/status-badge";

export default async function PosPage() {
  const supabase = await createClient();
  const { data: bills } = await supabase
    .from("PosBill")
    .select("*")
    .eq("isDeleted", false)
    .order("createdAt", { ascending: false })
    .limit(50);

  return (
    <div>
      <PageHeader
        title="ขายหน้าร้าน"
        description="รายการบิลขาย POS"
      />

      <DataTable
        columns={[
          { key: "billNo", label: "เลขบิล" },
          { key: "saleType", label: "ประเภท" },
          { key: "total", label: "ยอดรวม", className: "text-right" },
          { key: "discount", label: "ส่วนลด", className: "text-right" },
          { key: "payment", label: "ชำระ" },
          { key: "profit", label: "กำไร", className: "text-right" },
          { key: "date", label: "วันที่" },
          { key: "status", label: "สถานะ" },
        ]}
        rows={
          bills?.map((b) => ({
            billNo: b.billNo,
            saleType: b.saleType,
            total: formatCurrency(Number(b.total)),
            discount:
              Number(b.discount) > 0
                ? formatCurrency(Number(b.discount))
                : "-",
            payment: (
              <div className="text-xs">
                {Number(b.paidCash) > 0 && (
                  <div>เงินสด: {formatCurrency(Number(b.paidCash))}</div>
                )}
                {Number(b.paidTransfer) > 0 && (
                  <div>โอน: {formatCurrency(Number(b.paidTransfer))}</div>
                )}
              </div>
            ),
            profit: b.grossProfit
              ? formatCurrency(Number(b.grossProfit))
              : "-",
            date: formatDate(b.createdAt),
            status: <StatusBadge status={b.status} />,
          })) ?? []
        }
        emptyMessage="ยังไม่มีบิลขาย"
      />
    </div>
  );
}
