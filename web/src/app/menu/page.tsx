import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import { Suspense } from "react";
import { MainHeader } from "@/components/navigation/main-header";

export const dynamic = "force-dynamic";

async function MenuContent({ categorySlug }: { categorySlug?: string | null }) {
  const categories = await prisma.menuCategory.findMany({
    orderBy: { order: "asc" },
    include: {
      items: {
        where: {
          isAvailable: true,
        },
        orderBy: { name: "asc" },
        include: {
          options: {
            include: {
              values: true,
            },
          },
        },
      },
    },
  });

  const active = categorySlug ?? categories[0]?.slug;

  return (
    <div className="grid gap-8 md:grid-cols-[220px_1fr]">
      <aside className="h-fit rounded-3xl bg-white p-4 shadow-sm shadow-stone-200">
        <nav className="flex flex-col gap-2 text-sm font-medium">
          {categories.map((category) => (
            <a
              key={category.id}
              href={`?category=${category.slug}`}
              className={`rounded-2xl px-4 py-3 transition ${
                active === category.slug
                  ? "bg-primary-500/10 text-primary-700"
                  : "text-stone-600 hover:bg-stone-100"
              }`}
            >
              {category.name}
            </a>
          ))}
        </nav>
      </aside>
      <div className="space-y-10">
        {categories
          .filter((category) => !active || category.slug === active)
          .map((category) => (
            <section key={category.id} className="space-y-5">
              <header className="flex flex-col gap-1">
                <h2 className="text-2xl font-semibold">{category.name}</h2>
                <p className="text-sm text-stone-500">{category.description}</p>
              </header>
              <div className="grid gap-4 lg:grid-cols-2">
                {category.items.map((item) => (
                  <article key={item.id} className="flex gap-4 rounded-3xl bg-white p-4 shadow-sm shadow-stone-200">
                    <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-3xl">
                      {item.imageUrl ? (
                        <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center rounded-3xl bg-stone-100 text-stone-400">
                          قريباً
                        </div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">{item.name}</h3>
                        <span className="text-primary-600">{formatCurrency(item.price.toNumber())}</span>
                      </div>
                      <p className="text-sm text-stone-600 line-clamp-2">{item.description}</p>
                      {item.options.length > 0 && (
                        <div className="flex flex-wrap gap-2 text-xs text-stone-500">
                          {item.options.map((option) => (
                            <span key={option.id} className="rounded-full bg-stone-100 px-3 py-1">
                              {option.label}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
      </div>
    </div>
  );
}

export default function MenuPage({ searchParams }: { searchParams: { category?: string } }) {
  return (
    <div className="min-h-screen bg-stone-50">
      <MainHeader />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-3xl font-bold">قائمة حلو ومالح</h1>
        <p className="mt-2 text-stone-600">اختر من تشكيلتنا المتنوعة من الوجبات، الحلويات، المشروبات والقهوة المختصة.</p>
        <div className="mt-8">
          <Suspense fallback={<div className="p-6 text-center">جاري تحميل القائمة...</div>}>
            <MenuContent categorySlug={searchParams.category} />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
