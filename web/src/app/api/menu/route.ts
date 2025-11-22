import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [categories, offers, mostOrderedRaw, recommendedRaw] = await Promise.all([
      prisma.menuCategory.findMany({
        orderBy: { order: "asc" },
        include: {
          items: {
            where: { isAvailable: true },
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
      }),
      prisma.offer.findMany({
        where: {
          isActive: true,
          startsAt: { lte: new Date() },
          endsAt: { gte: new Date() },
        },
        include: {
          menuItems: {
            include: {
              menuItem: true,
            },
          },
        },
      }),
      prisma.orderItem.groupBy({
        by: ["menuItemId"],
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: "desc" } },
        take: 10,
      }),
      prisma.recommendation.findMany({
        orderBy: { weight: "desc" },
        take: 10,
        include: { menuItem: true },
      }),
    ]);

    const menu = categories.map((category) => ({
      id: category.id,
      name: category.name,
      description: category.description,
      heroImage: category.heroImage,
      items: category.items.map((item) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price.toNumber(),
        imageUrl: item.imageUrl,
        tags: item.tags,
        preparationTime: item.preparationTime,
        calories: item.calories,
        spicyLevel: item.spicyLevel,
        options: item.options.map((option) => ({
          id: option.id,
          label: option.label,
          type: option.type,
          isRequired: option.isRequired,
          maxSelectable: option.maxSelectable,
          values: option.values.map((value) => ({
            id: value.id,
            name: value.name,
            priceDelta: value.priceDelta.toNumber(),
            isDefault: value.isDefault,
          })),
        })),
      })),
    }));

    const offerPayload = offers.map((offer) => ({
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

    const mostOrderedItems = await prisma.menuItem.findMany({
      where: { id: { in: mostOrderedRaw.map((item) => item.menuItemId) } },
    });

    const mostOrdered = mostOrderedRaw
      .map((item) => {
        const menuItem = mostOrderedItems.find((m) => m.id === item.menuItemId);
        if (!menuItem) return null;
        return {
          id: menuItem.id,
          name: menuItem.name,
          description: menuItem.description,
          price: menuItem.price.toNumber(),
          imageUrl: menuItem.imageUrl,
          sold: item._sum.quantity ?? 0,
        };
      })
      .filter(Boolean);

    const recommended = recommendedRaw.map((rec) => ({
      id: rec.menuItem.id,
      name: rec.menuItem.name,
      description: rec.menuItem.description,
      price: rec.menuItem.price.toNumber(),
      imageUrl: rec.menuItem.imageUrl,
      context: rec.context,
      weight: rec.weight,
    }));

    return NextResponse.json({ menu, offers: offerPayload, mostOrdered, recommended });
  } catch (error) {
    console.error("menu:list", error);
    return NextResponse.json({ error: "تعذر جلب القائمة" }, { status: 500 });
  }
}
