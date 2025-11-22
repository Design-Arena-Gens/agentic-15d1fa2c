import { MainHeader } from "@/components/navigation/main-header";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-stone-50">
      <MainHeader />
      <main className="mx-auto max-w-4xl px-4 py-10">
        <h1 className="text-3xl font-bold">الشروط والأحكام</h1>
        <div className="mt-6 space-y-4 text-sm leading-7 text-stone-600">
          <p>باستخدامك تطبيق حلو ومالح فإنك توافق على جميع الشروط التالية.</p>
          <p>- الطلبات لا يمكن تعديلها بعد تأكيدها إلا عبر خدمة العملاء.</p>
          <p>- يتم تحصيل الرسوم وفق الأسعار المعلنة وقت تأكيد الطلب.</p>
          <p>- سياسة الاسترجاع تخضع للوائح الهيئة العامة للغذاء والدواء.</p>
        </div>
      </main>
    </div>
  );
}
