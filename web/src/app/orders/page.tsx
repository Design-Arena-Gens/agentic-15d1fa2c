import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { formatCurrency, minutesToHours } from "@/lib/utils";
import { MainHeader } from "@/components/navigation/main-header";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: {
      items: { include: { menuItem: true } },
      timelineEvents: true,
      address: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-stone-50">
      <MainHeader />
      <main className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="text-3xl font-bold">طلباتي</h1>
        <p className="mt-2 text-stone-600">تابع حالة طلباتك السابقة وأعد الطلب بنقرة واحدة.</p>
        <div className="mt-8 space-y-6">
          {orders.map((order) => (
            <article key={order.id} className="rounded-3xl bg-white p-6 shadow-sm shadow-stone-200">
              <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-stone-600">
                <div>
                  <span className="font-semibold text-primary-600">رقم الطلب {order.id.slice(-6)}</span>
                  <span className="px-3">•</span>
                  <span>{order.createdAt.toLocaleString("ar-SA")}</span>
                </div>
                <div className="flex gap-2">
                  <span className="rounded-full bg-primary-100 px-3 py-1 text-primary-600">{order.status}</span>
                  <span className="rounded-full bg-stone-100 px-3 py-1">{minutesToHours(order.etaMinutes ?? 35)}</span>
                </div>
              </div>
              <div className="mt-4 grid gap-3 text-sm text-stone-600">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">{item.menuItem.name}</span>
                      <span className="px-2 text-stone-400">x{item.quantity}</span>
                    </div>
                    <span>{formatCurrency(item.unitPrice.toNumber() * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-4 text-sm">
                <div className="text-stone-500">
                  التوصيل إلى: {order.address.label} - {order.address.street}
                </div>
                <div className="text-lg font-semibold text-primary-600">
                  الإجمالي: {formatCurrency(order.total.toNumber())}
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
