import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/auth";
import { StatCard } from "@/components/stat-card";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import {
  Package,
  Users,
  ShoppingCart,
  CreditCard,
  Bike,
  Clock,
} from "lucide-react";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const today = new Date().toISOString().slice(0, 10);

  const [
    { count: productCount },
    { count: userCount },
    { count: billCount },
    { count: creditCount },
    { count: messengerCount },
    { count: attendanceToday },
    { data: recentBills },
    { data: lowStock },
    { data: pendingCredit },
  ] = await Promise.all([
    supabase.from("Product").select("*", { count: "exact", head: true }),
    supabase.from("User").select("*", { count: "exact", head: true }),
    supabase.from("PosBill").select("*", { count: "exact", head: true }).eq("isDeleted", false),
    supabase.from("CreditCase").select("*", { count: "exact", head: true }),
    supabase.from("MessengerJob").select("*", { count: "exact", head: true }),
    supabase.from("Attendance").select("*", { count: "exact", head: true }).eq("dateKey", today),
    supabase
      .from("PosBill")
      .select("billNo, total, saleType, status, createdAt")
      .eq("isDeleted", false)
      .order("createdAt", { ascending: false })
      .limit(5),
    supabase
      .from("Product")
      .select("name, stock, minStock")
      .eq("status", "active")
      .limit(20),
    supabase
      .from("CreditCase")
      .select("caseNo, customerNameSnapshot, salePrice, status")
      .eq("status", "pending")
      .limit(5),
  ]);

  return (
    <div>
      <PageHeader
        title="ภาพรวมระบบ"
        description="สรุปข้อมูลร้าน Donut IT"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        <StatCard title="สินค้า" value={productCount ?? 0} icon={Package} color="blue" />
        <StatCard title="พนักงาน" value={userCount ?? 0} icon={Users} color="purple" />
        <StatCard title="บิลขาย" value={billCount ?? 0} icon={ShoppingCart} color="green" />
        <StatCard title="สินเชื่อ" value={creditCount ?? 0} icon={CreditCard} color="yellow" />
        <StatCard title="งานแมส" value={messengerCount ?? 0} icon={Bike} color="blue" />
        <StatCard
          title="เช็กอินวันนี้"
          value={attendanceToday ?? 0}
          icon={Clock}
          color="green"
          subtitle={today}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-900 mb-4">บิลขายล่าสุด</h2>
          {recentBills && recentBills.length > 0 ? (
            <div className="space-y-3">
              {recentBills.map((bill) => (
                <div
                  key={bill.billNo}
                  className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                >
                  <div>
                    <p className="font-medium text-sm">{bill.billNo}</p>
                    <p className="text-xs text-gray-400">{bill.saleType}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm">
                      {formatCurrency(Number(bill.total))}
                    </p>
                    <StatusBadge status={bill.status} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm text-center py-8">ยังไม่มีบิลขาย</p>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-900 mb-4">สินเชื่อรอดำเนินการ</h2>
          {pendingCredit && pendingCredit.length > 0 ? (
            <div className="space-y-3">
              {pendingCredit.map((c) => (
                <div
                  key={c.caseNo}
                  className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                >
                  <div>
                    <p className="font-medium text-sm">{c.caseNo}</p>
                    <p className="text-xs text-gray-400">
                      {c.customerNameSnapshot}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm">
                      {formatCurrency(Number(c.salePrice))}
                    </p>
                    <StatusBadge status={c.status} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm text-center py-8">
              ไม่มีเคสรอดำเนินการ
            </p>
          )}
        </div>

        {lowStock && lowStock.filter((p) => p.stock <= p.minStock).length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 lg:col-span-2">
            <h2 className="font-semibold text-red-600 mb-4">
              ⚠️ สินค้าใกล้หมด
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {lowStock.filter((p) => p.stock <= p.minStock).map((p) => (
                <div
                  key={p.name}
                  className="flex items-center justify-between bg-red-50 rounded-lg px-4 py-3"
                >
                  <span className="text-sm font-medium">{p.name}</span>
                  <span className="text-sm text-red-600 font-bold">
                    {p.stock}/{p.minStock}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
