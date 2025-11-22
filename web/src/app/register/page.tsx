import Link from "next/link";
import { RegisterForm } from "@/components/forms/register-form";

export default function RegisterPage() {
  return (
    <main className="relative flex min-h-screen items-center bg-gradient-to-br from-primary-100 via-white to-stone-100">
      <div className="mx-auto grid max-w-5xl grid-cols-1 items-center gap-12 px-6 py-16 lg:grid-cols-2">
        <div className="space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm text-primary-600 shadow">
            انضم إلى عائلة حلو ومالح
          </span>
          <h1 className="text-3xl font-bold text-stone-900">أنشئ حسابك وابدأ التجربة</h1>
          <p className="text-stone-600">
            سجل للاستمتاع بعروض حصرية، متابعة الطلب في الوقت الفعلي، وإضافة عناوين متعددة مع تجربة دفع آمنة وسريعة.
          </p>
        </div>
        <div className="space-y-6 rounded-3xl bg-white p-8 shadow-xl shadow-primary-500/10">
          <RegisterForm />
          <p className="text-center text-sm text-stone-600">
            لديك حساب بالفعل؟ <Link href="/login" className="text-primary-600 hover:underline">سجل الدخول</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
