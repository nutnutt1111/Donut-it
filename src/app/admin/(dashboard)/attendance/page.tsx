import { createClient } from "@/lib/supabase/server";
import { formatDate, formatDateKey } from "@/lib/auth";
import { PageHeader } from "@/components/page-header";
import { DataTable } from "@/components/data-table";
import { StatusBadge } from "@/components/status-badge";
import type { Tables } from "@/lib/supabase/database.types";

export default async function AttendancePage() {
  const supabase = await createClient();

  const [{ data: records }, { data: users }] = await Promise.all([
    supabase.from("Attendance").select("*").order("dateKey", { ascending: false }).limit(50),
    supabase.from("User").select("id, name"),
  ]);

  const typedRecords = (records ?? []) as Tables<"Attendance">[];
  const userMap = new Map(
    ((users ?? []) as Tables<"User">[]).map((u) => [u.id, u.name])
  );

  return (
    <div>
      <PageHeader
        title="เช็กอินงาน"
        description="บันทึกเวลาเข้า-ออกงานของพนักงาน"
      />

      <DataTable
        columns={[
          { key: "date", label: "วันที่" },
          { key: "name", label: "พนักงาน" },
          { key: "clockIn", label: "เข้างาน" },
          { key: "clockOut", label: "ออกงาน" },
          { key: "mode", label: "โหมด" },
          { key: "status", label: "สถานะ" },
          { key: "late", label: "สาย" },
        ]}
        rows={
          typedRecords.map((r) => ({
              date: formatDateKey(r.dateKey),
              name: userMap.get(r.userId) ?? "-",
              clockIn: formatDate(r.clockIn),
              clockOut: formatDate(r.clockOut),
              mode: r.workMode === "in_store" ? "หน้าร้าน" : r.workMode,
              status: <StatusBadge status={r.status} />,
              late: r.isLate ? (
                <span className="text-red-600 text-xs">
                  {r.lateMinutes} นาที
                </span>
              ) : (
                <span className="text-green-600 text-xs">ตรงเวลา</span>
              ),
            })) 
        }
        emptyMessage="ยังไม่มีบันทึกเช็กอิน"
      />
    </div>
  );
}
