import { MainHeader } from "@/components/navigation/main-header";

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-stone-50">
      <MainHeader />
      <main className="mx-auto max-w-4xl px-4 py-10">
        <h1 className="text-3xl font-bold">مركز المساعدة</h1>
        <p className="mt-2 text-stone-600">
          نحن هنا لخدمتك على مدار الساعة. تواصل معنا عبر التطبيق أو مركز الاتصال على الرقم 9200-XXX.
        </p>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <article className="rounded-3xl bg-white p-6 shadow-sm shadow-stone-200">
            <h2 className="text-xl font-semibold">الأسئلة الشائعة</h2>
            <ul className="mt-3 space-y-2 text-sm text-stone-600">
              <li>• كيف يمكنني تتبع الطلب؟</li>
              <li>• ما هي خيارات الدفع المتاحة؟</li>
              <li>• كيف أستفيد من برنامج الولاء؟</li>
            </ul>
          </article>
          <article className="rounded-3xl bg-white p-6 shadow-sm shadow-stone-200">
            <h2 className="text-xl font-semibold">الدعم الفني</h2>
            <p className="mt-3 text-sm text-stone-600">
              الدعم متاح عبر المحادثة الفورية داخل التطبيق، البريد support@halwo.malo، أو الاتصال على 9200-XXX.
            </p>
          </article>
        </div>
      </main>
    </div>
  );
}
