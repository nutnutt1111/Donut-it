import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/page-header";

export default async function SettingsPage() {
  const supabase = await createClient();

  const { data: shopSettings } = await supabase
    .from("ShopDocumentSettings")
    .select("*")
    .eq("id", "default")
    .single();

  const { data: creditSettings } = await supabase
    .from("CreditSettings")
    .select("*")
    .eq("id", "default")
    .single();

  return (
    <div>
      <PageHeader
        title="ตั้งค่าระบบ"
        description="ข้อมูลร้านและการตั้งค่าต่างๆ"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">ข้อมูลร้าน</h2>
          {shopSettings ? (
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500">ชื่อร้าน</dt>
                <dd className="font-medium">{shopSettings.shopName}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">ที่อยู่</dt>
                <dd className="font-medium text-right max-w-[60%]">
                  {shopSettings.shopAddress || "-"}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">เบอร์โทร</dt>
                <dd className="font-medium">{shopSettings.shopPhone || "-"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">เลขผู้เสียภาษี</dt>
                <dd className="font-medium">{shopSettings.taxId || "-"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">รูปแบบพิมพ์</dt>
                <dd className="font-medium">{shopSettings.defaultPrintFormat}</dd>
              </div>
            </dl>
          ) : (
            <p className="text-gray-400 text-sm">ยังไม่ได้ตั้งค่าข้อมูลร้าน</p>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">ตั้งค่าสินเชื่อ</h2>
          {creditSettings ? (
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-gray-500 mb-1">ตัวเลือก % ดาวน์</dt>
                <dd className="font-medium">
                  {JSON.stringify(creditSettings.downPercentOptions)}
                </dd>
              </div>
              <div>
                <dt className="text-gray-500 mb-1">ตัวคูณกำไร</dt>
                <dd className="font-medium">
                  {JSON.stringify(creditSettings.profitMultipliers)}
                </dd>
              </div>
              {creditSettings.paymentChannels && (
                <div>
                  <dt className="text-gray-500 mb-1">ช่องทางชำระ</dt>
                  <dd className="font-medium">
                    {JSON.stringify(creditSettings.paymentChannels)}
                  </dd>
                </div>
              )}
            </dl>
          ) : (
            <p className="text-gray-400 text-sm">ยังไม่ได้ตั้งค่าสินเชื่อ</p>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:col-span-2">
          <h2 className="font-semibold text-gray-900 mb-2">การเชื่อมต่อ Supabase</h2>
          <p className="text-sm text-gray-500">
            โปรเจกต์: <code className="bg-gray-100 px-2 py-0.5 rounded">donutit-v3</code>
            {" · "}
            Region: <code className="bg-gray-100 px-2 py-0.5 rounded">ap-southeast-1</code>
          </p>
        </div>
      </div>
    </div>
  );
}
