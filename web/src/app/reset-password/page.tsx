import { notFound } from "next/navigation";
import { ResetPasswordForm } from "@/components/forms/reset-password-form";

export default function ResetPasswordPage({ searchParams }: { searchParams: { token?: string } }) {
  const token = searchParams.token;
  if (!token) {
    notFound();
  }
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-tr from-stone-100 via-white to-primary-100">
      <div className="mx-auto w-full max-w-xl rounded-3xl bg-white p-10 shadow-xl shadow-primary-500/10">
        <h1 className="text-2xl font-semibold">تعيين كلمة مرور جديدة</h1>
        <p className="mt-2 text-sm text-stone-600">اختر كلمة مرور قوية لحماية حسابك.</p>
        <div className="mt-6">
          <ResetPasswordForm token={token} />
        </div>
      </div>
    </main>
  );
}
