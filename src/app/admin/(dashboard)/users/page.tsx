import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/page-header";
import { DataTable } from "@/components/data-table";
import { StatusBadge } from "@/components/status-badge";
import { ROLE_LABELS } from "@/lib/auth";

export default async function UsersPage() {
  const supabase = await createClient();
  const { data: users } = await supabase
    .from("User")
    .select("*")
    .order("name");

  const { data: employees } = await supabase
    .from("Employee")
    .select("userId, employeeCode, position, employmentStatus, phone");

  const employeeMap = new Map(
    employees?.map((e) => [e.userId, e]) ?? []
  );

  return (
    <div>
      <PageHeader
        title="จัดการพนักงาน"
        description="รายชื่อผู้ใช้งานและพนักงานในระบบ"
      />

      <DataTable
        columns={[
          { key: "name", label: "ชื่อ" },
          { key: "email", label: "อีเมล" },
          { key: "role", label: "บทบาท" },
          { key: "code", label: "รหัสพนักงาน" },
          { key: "position", label: "ตำแหน่ง" },
          { key: "status", label: "สถานะ" },
        ]}
        rows={
          users?.map((u) => {
            const emp = employeeMap.get(u.id);
            return {
              name: u.name,
              email: u.email ?? "-",
              role: ROLE_LABELS[u.role] ?? u.role,
              code: emp?.employeeCode ?? "-",
              position: emp?.position ?? "-",
              status: emp ? (
                <StatusBadge status={emp.employmentStatus} />
              ) : (
                "-"
              ),
            };
          }) ?? []
        }
        emptyMessage="ยังไม่มีพนักงานในระบบ"
      />
    </div>
  );
}
