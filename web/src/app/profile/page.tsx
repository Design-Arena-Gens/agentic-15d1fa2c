import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { ProfileForm } from "@/components/forms/profile-form";
import { maskPhone } from "@/lib/utils";
import { MainHeader } from "@/components/navigation/main-header";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { addresses: true, twoFactorSetting: true },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <MainHeader />
      <main className="mx-auto max-w-4xl px-4 py-10">
        <h1 className="text-3xl font-bold">الملف الشخصي</h1>
        <p className="mt-2 text-stone-600">حدث بياناتك الشخصية، معلومات التواصل، وعناوين التوصيل.</p>

        <div className="mt-8 grid gap-6 md:grid-cols-[2fr_1fr]">
          <ProfileForm
            defaultValues={{
              name: user.name ?? "",
            email: user.email ?? "",
            deliveryInstructions: user.deliveryInstructions ?? "",
            image: user.image ?? "",
          }}
        />
        <aside className="space-y-4 text-sm">
          <div className="rounded-3xl bg-white p-5 shadow-sm shadow-stone-200">
            <h2 className="text-lg font-semibold">معلومات التواصل</h2>
            <div className="mt-3 space-y-2 text-stone-600">
              <p>رقم الجوال: {user.phone ? maskPhone(user.phone) : "غير متوفر"}</p>
              <p>
                التحقق الثنائي:
                <span className="px-2 text-primary-600">
                  {user.twoFactorSetting?.enabled ? "مفعل" : "غير مفعل"}
                </span>
              </p>
            </div>
          </div>
          <div className="rounded-3xl bg-white p-5 shadow-sm shadow-stone-200">
            <h2 className="text-lg font-semibold">عناوين التوصيل</h2>
            <div className="mt-3 space-y-3">
              {user.addresses.map((address) => (
                <div key={address.id} className="rounded-2xl bg-stone-100 p-3">
                  <h3 className="font-medium">{address.label}</h3>
                  <p className="text-xs text-stone-600">{address.street}</p>
                  <p className="text-xs text-stone-500">
                    {address.city} - {address.region}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
      </main>
    </div>
  );
}
