import { createClient } from "@/lib/supabase/server";
import { formatCurrency, formatDate } from "@/lib/auth";
import { PageHeader } from "@/components/page-header";
import { DataTable } from "@/components/data-table";
import { StatusBadge } from "@/components/status-badge";

export default async function CustomersPage() {
  const supabase = await createClient();
  const { data: customers } = await supabase
    .from("Customer")
    .select("*")
    .order("name");

  return (
    <div>
      <PageHeader
        title="ลูกค้า"
        description="รายชื่อลูกค้าในระบบ"
      />

      <DataTable
        columns={[
          { key: "name", label: "ชื่อ" },
          { key: "type", label: "ประเภท" },
          { key: "phone", label: "เบอร์โทร" },
          { key: "idCard", label: "บัตรประชาชน" },
          { key: "creditLimit", label: "วงเงิน", className: "text-right" },
          { key: "created", label: "สร้างเมื่อ" },
        ]}
        rows={
          customers?.map((c) => ({
            name: c.name,
            type: c.type === "person" ? "บุคคล" : c.type,
            phone: c.phone ?? "-",
            idCard: c.idCard ?? "-",
            creditLimit: c.creditLimit
              ? formatCurrency(Number(c.creditLimit))
              : "-",
            created: formatDate(c.createdAt),
          })) ?? []
        }
        emptyMessage="ยังไม่มีลูกค้าในระบบ"
      />
    </div>
  );
}
