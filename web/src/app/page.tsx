import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { MainHeader } from "@/components/navigation/main-header";
import { formatCurrency } from "@/lib/utils";
import { BadgePercent, Flame, Heart, Star, Timer } from "lucide-react";

export const dynamic = "force-dynamic";

async function getHomeData() {
  const [categories, offers, mostOrdered, recommended] = await Promise.all([
    prisma.menuCategory.findMany({
      orderBy: { order: "asc" },
      include: {
        items: {
          where: { isAvailable: true },
          orderBy: { name: "asc" },
        },
      },
    }),
    prisma.offer.findMany({
      where: {
        isActive: true,
        startsAt: { lte: new Date() },
        endsAt: { gte: new Date() },
      },
      orderBy: { startsAt: "asc" },
    }),
    prisma.orderItem.findMany({
      include: { menuItem: true },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
    prisma.recommendation.findMany({
      include: { menuItem: true },
      orderBy: { weight: "desc" },
      take: 6,
    }),
  ]);

  const mostOrderedUnique = Array.from(
    new Map(
      mostOrdered.map((item) => [
        item.menuItemId,
        {
          id: item.menuItem.id,
          name: item.menuItem.name,
          description: item.menuItem.description,
          price: item.menuItem.price.toNumber(),
          imageUrl: item.menuItem.imageUrl,
          spicyLevel: item.menuItem.spicyLevel,
        },
      ])
    ).values()
  );

  return { categories, offers, mostOrdered: mostOrderedUnique, recommended };
}

export default async function HomePage() {
  const { categories, offers, mostOrdered, recommended } = await getHomeData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-stone-100 to-stone-50">
      <MainHeader />
      <main className="mx-auto flex max-w-6xl flex-col gap-12 px-4 py-10">
        <section className="grid gap-8 rounded-3xl bg-white p-8 shadow-sm shadow-stone-200 md:grid-cols-[1.3fr_1fr]">
          <div className="flex flex-col gap-5">
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-primary-100 px-4 py-1 text-sm text-primary-600">
              <Flame className="h-4 w-4" />
              عروض الإطلاق الحصرية
            </span>
            <h1 className="text-4xl font-bold text-stone-900">
              أشهى النكهات الشرقية والعالمية من <span className="text-primary-600">حلو ومالح</span>
            </h1>
            <p className="text-base leading-7 text-stone-600">
              اطلب الآن واستمتع بتجربة طعام استثنائية مع أشهى الحلويات والمقبلات، مشروباتك المفضلة، والسندويتشات الفاخرة. توصيل سريع خلال 25 دقيقة في معظم الأحياء.
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-stone-700">
              <div className="flex items-center gap-2 rounded-full bg-stone-100 px-4 py-2">
                <Timer className="h-4 w-4 text-primary-500" />
                توصيل خلال 25-35 دقيقة
              </div>
              <div className="flex items-center gap-2 rounded-full bg-stone-100 px-4 py-2">
                <Star className="h-4 w-4 text-primary-500" />
                تقييم +4.8 من 10 آلاف عميل
              </div>
              <div className="flex items-center gap-2 rounded-full bg-stone-100 px-4 py-2">
                <Heart className="h-4 w-4 text-primary-500" />
                برنامج ولاء Sweet Rewards
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/menu"
                className="rounded-full bg-primary-500 px-6 py-3 text-white shadow-lg shadow-primary-500/30 transition hover:bg-primary-600"
              >
                تصفح القائمة
              </Link>
              <Link
                href="/offers"
                className="rounded-full border border-primary-200 px-6 py-3 text-primary-600 transition hover:border-primary-400"
              >
                العروض الحالية
              </Link>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-400 via-primary-500 to-accent-500 px-6 py-8">
            <div className="absolute inset-0 opacity-20" aria-hidden>
              <Image
                src="https://images.unsplash.com/photo-1606755962773-d324e0a13086?q=80&w=2070"
                alt="وجبات حلو ومالح"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative z-10 flex h-full flex-col justify-between text-white">
              <div>
                <p className="text-sm uppercase tracking-[0.3em]">Sweet &amp; Salty</p>
                <h2 className="mt-4 text-3xl font-bold">خصم 25% على أول طلب لك</h2>
                <p className="mt-3 max-w-sm text-sm text-white/80">
                  أدخل الرمز HALWA عند الدفع وتمتع بمذاق لا يُقاوم مع توصيل مجاني لأول مرة.
                </p>
              </div>
              <div className="mt-6 grid grid-cols-3 gap-3 text-center text-sm font-semibold">
                <div className="rounded-2xl bg-white/15 p-3">
                  +120
                  <p className="text-xs font-normal text-white/70">طبق يومي</p>
                </div>
                <div className="rounded-2xl bg-white/15 p-3">
                  12K
                  <p className="text-xs font-normal text-white/70">عميل سعيد</p>
                </div>
                <div className="rounded-2xl bg-white/15 p-3">
                  24/7
                  <p className="text-xs font-normal text-white/70">دعم مباشر</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          {categories.slice(0, 3).map((category) => (
            <Link
              key={category.id}
              href={`/menu?category=${category.slug}`}
              className="group relative overflow-hidden rounded-3xl shadow-md transition hover:-translate-y-1 hover:shadow-lg"
            >
              <Image
                src={category.heroImage ?? "https://images.unsplash.com/photo-1525755662778-989d0524087e?q=80&w=2070"}
                alt={category.name}
                width={700}
                height={480}
                className="h-64 w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="text-2xl font-semibold">{category.name}</h3>
                <p className="text-sm text-white/80">
                  {category.description ?? "استكشف نكهات فريدة من مطبخ حلو ومالح"}
                </p>
              </div>
            </Link>
          ))}
        </section>

        <section className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">الأكثر طلباً</h2>
            <Link href="/menu" className="text-sm text-primary-600 hover:underline">
              مشاهدة الكل
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {mostOrdered.slice(0, 6).map((item) => (
              <article key={item.id} className="flex gap-4 rounded-3xl bg-white p-4 shadow-sm shadow-stone-200">
                <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-3xl">
                  {item.imageUrl ? (
                    <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center rounded-3xl bg-stone-100 text-stone-400">
                      صورة قادمة
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <span className="text-primary-600">{formatCurrency(item.price)}</span>
                  </div>
                  <p className="line-clamp-2 text-sm text-stone-600">{item.description}</p>
                  <div className="mt-auto text-xs text-stone-500">
                    مستوى الحارة: {item.spicyLevel ?? 0}/5
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">العروض الحية</h2>
            <span className="inline-flex items-center gap-2 rounded-full bg-primary-100 px-4 py-2 text-sm text-primary-600">
              <BadgePercent className="h-4 w-4" />
              خصومات حتى 35%
            </span>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {offers.map((offer) => (
              <article key={offer.id} className="rounded-3xl bg-gradient-to-br from-primary-500 via-primary-400 to-accent-500 p-[1px]">
                <div className="flex h-full flex-col gap-4 rounded-3xl bg-white/95 p-6 backdrop-blur">
                  <div>
                    <h3 className="text-xl font-semibold text-primary-700">{offer.title}</h3>
                    <p className="mt-1 text-sm text-stone-600">{offer.description}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500">
                    <span>
                      يبدأ {offer.startsAt.toLocaleDateString("ar-SA")} - ينتهي {offer.endsAt.toLocaleDateString("ar-SA")}
                    </span>
                    {offer.minimumSpend && (
                      <span>حد أدنى {formatCurrency(offer.minimumSpend.toNumber())}</span>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">توصيات الذكاء الاصطناعي لك</h2>
            <p className="text-sm text-stone-500">مبنية على تفضيلاتك وسجل طلباتك</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {recommended.map((rec) => (
              <article key={rec.id} className="flex flex-col gap-3 rounded-3xl bg-white p-5 shadow-sm shadow-stone-200">
                <div className="relative h-40 w-full overflow-hidden rounded-3xl">
                  {rec.menuItem.imageUrl ? (
                    <Image src={rec.menuItem.imageUrl} alt={rec.menuItem.name} fill className="object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-stone-100 text-stone-400">صورة قادمة</div>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-lg font-semibold">{rec.menuItem.name}</h3>
                  <p className="text-sm text-stone-600 line-clamp-2">{rec.menuItem.description}</p>
                  <div className="flex items-center justify-between text-sm font-medium text-primary-600">
                    {formatCurrency(rec.menuItem.price.toNumber())}
                    <span className="text-xs text-stone-500">{rec.context}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
      <footer className="mt-12 bg-stone-900 py-12 text-stone-200">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 md:flex-row md:justify-between">
          <div className="max-w-sm text-sm leading-7">
            <h3 className="text-lg font-semibold text-white">حلو ومالح</h3>
            <p className="mt-3 text-stone-400">
              نقدم لكم تجربة طعام سعودية متكاملة تجمع بين روعة الحلويات الشرقية وأصالة المخبوزات المحلية مع خيارات عالمية تلائم جميع الأذواق.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 text-sm">
            <div>
              <h4 className="text-white">الأقسام</h4>
              <ul className="mt-3 space-y-2 text-stone-400">
                <li>
                  <Link href="/menu?category=meals" className="hover:text-white">
                    الوجبات
                  </Link>
                </li>
                <li>
                  <Link href="/menu?category=desserts" className="hover:text-white">
                    الحلويات
                  </Link>
                </li>
                <li>
                  <Link href="/menu?category=coffee" className="hover:text-white">
                    القهوة
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white">الدعم</h4>
              <ul className="mt-3 space-y-2 text-stone-400">
                <li>
                  <Link href="/support" className="hover:text-white">
                    مركز المساعدة
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white">
                    الشروط والأحكام
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white">
                    سياسة الخصوصية
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="text-sm text-stone-400">
            <p>تابعنا على شبكات التواصل</p>
            <div className="mt-3 flex gap-3">
              <span className="rounded-full bg-white/10 px-4 py-2">@halwo.malo</span>
              <span className="rounded-full bg-white/10 px-4 py-2">+966 55 000 0000</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
