import { Suspense } from "react";
import Link from "next/link";
import { LoginForm } from "@/components/forms/login-form";
import { PhoneLoginForm } from "@/components/forms/phone-login-form";

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center bg-gradient-to-br from-primary-100 via-white to-stone-100">
      <div className="mx-auto grid max-w-5xl grid-cols-1 items-center gap-12 px-6 py-16 lg:grid-cols-2">
        <div className="space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm text-primary-600 shadow">
            مرحباً بك مرة أخرى
          </span>
          <h1 className="text-3xl font-bold text-stone-900">سجّل دخولك إلى حلو ومالح</h1>
          <p className="text-stone-600">
            ادخل باستخدام بريدك الإلكتروني أو رقم الجوال لمتابعة الطلبات، إدارة العناوين، والاستفادة من برنامج الولاء.
          </p>
        </div>
        <div className="space-y-6 rounded-3xl bg-white p-8 shadow-xl shadow-primary-500/10">
          <Suspense fallback={<div className="py-6 text-center text-sm text-stone-400">جاري تحميل النموذج...</div>}>
            <LoginForm />
          </Suspense>
          <div className="relative text-center text-xs text-stone-400">
            <span className="absolute inset-x-0 top-1/2 h-px bg-stone-100" aria-hidden />
            <span className="relative bg-white px-4">أو</span>
          </div>
          <PhoneLoginForm />
          <div className="grid gap-2 text-sm text-stone-600">
            <Link href="/forgot-password" className="text-primary-600 hover:underline">
              نسيت كلمة المرور؟
            </Link>
            <span>
              ليس لديك حساب؟ <Link href="/register" className="text-primary-600 hover:underline">إنشاء حساب جديد</Link>
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
