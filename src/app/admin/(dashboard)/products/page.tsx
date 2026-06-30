import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/auth";
import { PageHeader } from "@/components/page-header";
import { DataTable } from "@/components/data-table";
import { StatusBadge } from "@/components/status-badge";

export default async function ProductsPage() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("Product")
    .select("*")
    .is("deletedAt", null)
    .order("name");

  return (
    <div>
      <PageHeader
        title="จัดการสินค้า"
        description="รายการสินค้าและสต็อกในร้าน"
      />

      <DataTable
        columns={[
          { key: "name", label: "ชื่อสินค้า" },
          { key: "category", label: "หมวดหมู่" },
          { key: "price", label: "ราคาขาย", className: "text-right" },
          { key: "cost", label: "ต้นทุน", className: "text-right" },
          { key: "stock", label: "สต็อก", className: "text-center" },
          { key: "status", label: "สถานะ" },
        ]}
        rows={
          products?.map((p) => ({
            name: (
              <div>
                <p className="font-medium">{p.name}</p>
                {p.serialNumber && (
                  <p className="text-xs text-gray-400">S/N: {p.serialNumber}</p>
                )}
              </div>
            ),
            category: p.category,
            price: formatCurrency(Number(p.price)),
            cost: formatCurrency(Number(p.cost)),
            stock: (
              <span
                className={
                  p.stock <= p.minStock
                    ? "text-red-600 font-bold"
                    : "text-gray-700"
                }
              >
                {p.stock}
              </span>
            ),
            status: <StatusBadge status={p.status} />,
          })) ?? []
        }
        emptyMessage="ยังไม่มีสินค้าในระบบ"
      />
    </div>
  );
}
