"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Package,
  Clock,
  CreditCard,
  Bike,
  ShoppingCart,
  UserCircle,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import type { AppUser } from "@/lib/auth";

const NAV_ITEMS = [
  { href: "/admin", label: "ภาพรวม", icon: LayoutDashboard },
  { href: "/admin/pos", label: "ขายหน้าร้าน", icon: ShoppingCart },
  { href: "/admin/products", label: "สินค้า", icon: Package },
  { href: "/admin/customers", label: "ลูกค้า", icon: UserCircle },
  { href: "/admin/credit", label: "สินเชื่อ", icon: CreditCard },
  { href: "/admin/messenger", label: "ค่าแมส", icon: Bike },
  { href: "/admin/attendance", label: "เช็กอิน", icon: Clock },
  { href: "/admin/users", label: "พนักงาน", icon: Users },
  { href: "/admin/settings", label: "ตั้งค่า", icon: Settings },
];

export function AdminSidebar({ user }: { user: AppUser }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  const nav = (
    <>
      <div className="px-4 py-6 border-b border-white/10">
        <h1 className="text-xl font-bold text-white">DONUT IT</h1>
        <p className="text-xs text-blue-200 mt-1">ระบบหลังบ้าน</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                active
                  ? "bg-white/20 text-white font-medium"
                  : "text-blue-100 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t border-white/10">
        <div className="text-sm text-blue-100 mb-2 truncate">{user.name}</div>
        <div className="text-xs text-blue-300 mb-3 truncate">{user.email}</div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-blue-200 hover:text-white transition-colors w-full"
        >
          <LogOut size={16} />
          ออกจากระบบ
        </button>
      </div>
    </>
  );

  return (
    <>
      <button
        className="lg:hidden fixed top-4 left-4 z-50 bg-[#004aad] text-white p-2 rounded-lg shadow-lg"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-[#004aad] flex flex-col transform transition-transform lg:transform-none ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {nav}
      </aside>
    </>
  );
}
