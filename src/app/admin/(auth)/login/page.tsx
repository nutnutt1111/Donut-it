import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f6ff] px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#004aad]">DONUT IT</h1>
          <p className="text-gray-500 mt-2">เข้าสู่ระบบหลังบ้าน</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
