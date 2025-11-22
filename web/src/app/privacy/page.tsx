import { MainHeader } from "@/components/navigation/main-header";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-stone-50">
      <MainHeader />
      <main className="mx-auto max-w-4xl px-4 py-10">
        <h1 className="text-3xl font-bold">سياسة الخصوصية</h1>
        <div className="mt-6 space-y-4 text-sm leading-7 text-stone-600">
          <p>نلتزم بحماية بياناتك الشخصية واستخدامها فقط لتحسين تجربة الاستخدام.</p>
          <p>يتم تشفير كلمات المرور وتخزين بيانات الدفع عبر مزودين معتمدين.</p>
          <p>يمكنك طلب حذف حسابك وبياناتك من صفحة الملف الشخصي في أي وقت.</p>
        </div>
      </main>
    </div>
  );
}
