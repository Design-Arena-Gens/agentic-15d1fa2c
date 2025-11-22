import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/api-auth";

const addSchema = z.object({
  menuItemId: z.string().cuid(),
  notes: z.string().max(120).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const user = await requireUser(request);
    const favorites = await prisma.favoriteItem.findMany({
      where: { userId: user.id },
      include: { menuItem: true },
    });
    return NextResponse.json({ favorites });
  } catch (error) {
    console.error("favorites:list", error);
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireUser(request);
    const { menuItemId, notes } = addSchema.parse(await request.json());

    const favorite = await prisma.favoriteItem.upsert({
      where: {
        userId_menuItemId: {
          userId: user.id,
          menuItemId,
        },
      },
      create: {
        userId: user.id,
        menuItemId,
        notes,
      },
      update: { notes },
      include: { menuItem: true },
    });

    return NextResponse.json({ favorite }, { status: 201 });
  } catch (error) {
    console.error("favorites:add", error);
    if ((error as Error).message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }
    return NextResponse.json({ error: "تعذر حفظ المفضلة" }, { status: 400 });
  }
}
