import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/api-auth";

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser(request);
    const { id } = await context.params;
    const favorite = await prisma.favoriteOrder.findUnique({ where: { id } });
    if (!favorite || favorite.userId !== user.id) {
      return NextResponse.json({ error: "المفضلة غير موجودة" }, { status: 404 });
    }
    await prisma.favoriteOrder.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("favorite-orders:delete", error);
    if ((error as Error).message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }
    return NextResponse.json({ error: "تعذر الحذف" }, { status: 400 });
  }
}
