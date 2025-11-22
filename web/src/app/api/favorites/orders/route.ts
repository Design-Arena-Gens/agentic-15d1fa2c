import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/api-auth";

const addSchema = z.object({
  orderId: z.string().cuid(),
  label: z.string().min(2).max(60),
});

export async function GET(request: NextRequest) {
  try {
    const user = await requireUser(request);
    const favorites = await prisma.favoriteOrder.findMany({
      where: { userId: user.id },
      include: {
        order: {
          include: {
            items: {
              include: { menuItem: true },
            },
          },
        },
      },
    });
    return NextResponse.json({ favorites });
  } catch (error) {
    console.error("favorite-orders:list", error);
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireUser(request);
    const { orderId, label } = addSchema.parse(await request.json());

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order || order.userId !== user.id) {
      return NextResponse.json({ error: "الطلب غير موجود" }, { status: 404 });
    }

    const favorite = await prisma.favoriteOrder.upsert({
      where: {
        userId_orderId: {
          userId: user.id,
          orderId,
        },
      },
      create: { userId: user.id, orderId, label },
      update: { label },
    });

    return NextResponse.json({ favorite }, { status: 201 });
  } catch (error) {
    console.error("favorite-orders:add", error);
    if ((error as Error).message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }
    return NextResponse.json({ error: "تعذر حفظ الطلب" }, { status: 400 });
  }
}
