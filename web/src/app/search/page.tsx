import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import { MainHeader } from "@/components/navigation/main-header";

export const dynamic = "force-dynamic";

export default async function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const query = searchParams.q ?? "";
  const results = query
    ? await prisma.menuItem.findMany({
        where: {
          isAvailable: true,
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
            { tags: { has: query.toLowerCase() } },
          ],
        },
        include: { category: true },
      })
    : [];

  return (
    <div className="min-h-screen bg-stone-50">
      <MainHeader />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-2xl font-semibold">البحث عن: {query}</h1>
      {results.length === 0 ? (
        <p className="mt-6 text-stone-500">لم يتم العثور على نتائج تطابق بحثك.</p>
      ) : (
        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          {results.map((item) => (
            <article key={item.id} className="flex gap-4 rounded-3xl bg-white p-4 shadow-sm shadow-stone-200">
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-3xl">
                {item.imageUrl ? (
                  <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center bg-stone-100 text-stone-400">صورة</div>
                )}
              </div>
              <div className="flex flex-1 flex-col gap-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <span className="text-sm text-primary-600">{formatCurrency(item.price.toNumber())}</span>
                </div>
                <p className="text-sm text-stone-600 line-clamp-2">{item.description}</p>
                <span className="text-xs text-stone-500">التصنيف: {item.category.name}</span>
              </div>
            </article>
          ))}
        </div>
      )}
      </main>
    </div>
  );
}
