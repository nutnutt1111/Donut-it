import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-[#004aad] text-white px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">DONUT IT</h1>
        <Link
          href="/admin"
          className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm transition-colors"
        >
          เข้าสู่ระบบหลังบ้าน
        </Link>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
        <h2 className="text-4xl font-bold text-[#004aad] mb-4">
          ยินดีต้อนรับสู่ Donut IT
        </h2>
        <p className="text-lg text-gray-600 mb-8 max-w-md">
          ระบบช่วยคำนวณและจัดการงานร้านคุณได้ง่ายขึ้น
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl w-full mb-12">
          {[
            { icon: "💰", title: "คำนวณงวดผ่อน", desc: "เครื่องมือคำนวณสินเชื่อ" },
            { icon: "🛵", title: "ค่าแมส", desc: "คำนวณค่าจัดส่ง" },
            { icon: "⏰", title: "เช็กอินงาน", desc: "บันทึกเวลาเข้า-ออกงาน" },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="text-3xl mb-2">{item.icon}</div>
              <h3 className="font-semibold text-[#004aad]">{item.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-4">
          <Link
            href="/pwa/index.html"
            className="bg-[#007bff] text-white px-6 py-3 rounded-lg hover:bg-[#0056b3] transition-colors"
          >
            เปิดแอป PWA
          </Link>
          <Link
            href="/admin"
            className="border-2 border-[#004aad] text-[#004aad] px-6 py-3 rounded-lg hover:bg-[#004aad] hover:text-white transition-colors"
          >
            Dashboard หลังบ้าน
          </Link>
        </div>
      </main>
    </div>
  );
}
