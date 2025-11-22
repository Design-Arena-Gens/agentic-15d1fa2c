import Link from "next/link";
import { ForgotPasswordForm } from "@/components/forms/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-stone-100 via-white to-primary-100">
      <div className="mx-auto w-full max-w-xl rounded-3xl bg-white p-10 shadow-xl shadow-primary-500/10">
        <h1 className="text-2xl font-semibold">إعادة تعيين كلمة المرور</h1>
        <p className="mt-2 text-sm text-stone-600">
          أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة تعيين كلمة المرور خلال دقائق.
        </p>
        <div className="mt-6">
          <ForgotPasswordForm />
        </div>
        <Link href="/login" className="mt-6 inline-block text-sm text-primary-600 hover:underline">
          العودة إلى تسجيل الدخول
        </Link>
      </div>
    </main>
  );
}
