import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const offers = await prisma.offer.findMany({
      where: {
        isActive: true,
        endsAt: { gte: new Date() },
      },
      include: {
        menuItems: {
          include: { menuItem: true },
        },
      },
      orderBy: { startsAt: "asc" },
    });

    const payload = offers.map((offer) => ({
      id: offer.id,
      title: offer.title,
      description: offer.description,
      imageUrl: offer.imageUrl,
      discountType: offer.discountType,
      value: offer.value.toNumber(),
      minimumSpend: offer.minimumSpend?.toNumber() ?? null,
      startsAt: offer.startsAt,
      endsAt: offer.endsAt,
      isStackable: offer.isStackable,
      menuItems: offer.menuItems.map(({ menuItem }) => ({
        id: menuItem.id,
        name: menuItem.name,
        price: menuItem.price.toNumber(),
        imageUrl: menuItem.imageUrl,
      })),
    }));

    return NextResponse.json({ offers: payload });
  } catch (error) {
    console.error("offers:list", error);
    return NextResponse.json({ error: "تعذر جلب العروض" }, { status: 500 });
  }
}
