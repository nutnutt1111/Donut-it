# Donut IT — Admin Dashboard

ระบบหลังบ้านสำหรับจัดการร้าน Donut IT เชื่อมต่อกับ Supabase (`donutit-v3`)

## ฟีเจอร์

- **ภาพรวม** — สรุป KPI ร้าน (สินค้า, พนักงาน, บิล, สินเชื่อ, แมส, เช็กอิน)
- **ขายหน้าร้าน** — ดูบิล POS
- **สินค้า** — จัดการสต็อกและราคา
- **ลูกค้า** — รายชื่อลูกค้า
- **สินเชื่อ** — เคสผ่อนชำระ
- **ค่าแมส** — งานจัดส่ง
- **เช็กอิน** — บันทึกเวลาเข้า-ออกงาน
- **พนักงาน** — จัดการผู้ใช้และบทบาท
- **ตั้งค่า** — ข้อมูลร้านและสินเชื่อ

## เริ่มต้นใช้งาน

```bash
cp .env.local.example .env.local
npm install
npm run dev
```

เปิด [http://localhost:3000/admin](http://localhost:3000/admin)

## Supabase

- Project: `donutit-v3` (ap-southeast-1)
- Auth: Email/Password
- บทบาท: `owner`, `admin`, `staff` (ตาราง `User`)

## โครงสร้าง

```
src/
  app/
    admin/
      (auth)/login/     # หน้า login
      (dashboard)/      # หน้า dashboard ทั้งหมด
    auth/callback/      # Supabase auth callback
  components/           # UI components
  lib/
    supabase/           # Supabase client
    auth.ts             # Auth helpers
public/
  pwa/                  # PWA เวอร์ชันเดิม
```
