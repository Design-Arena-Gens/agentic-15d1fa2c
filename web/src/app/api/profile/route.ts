import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/api-auth";

const profileSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().toLowerCase().optional(),
  deliveryInstructions: z.string().max(240).optional(),
  image: z.string().url().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const user = await requireUser(request);
    const profile = await prisma.user.findUnique({
      where: { id: user.id },
      include: { addresses: true },
    });
    return NextResponse.json({ profile });
  } catch (error) {
    console.error("profile:get", error);
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await requireUser(request);
    const payload = profileSchema.parse(await request.json());

    if (payload.email) {
      const emailExists = await prisma.user.findFirst({
        where: { email: payload.email, id: { not: user.id } },
      });
      if (emailExists) {
        return NextResponse.json({ error: "البريد مستخدم" }, { status: 409 });
      }
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: payload,
    });

    return NextResponse.json({ profile: updated });
  } catch (error) {
    console.error("profile:update", error);
    if ((error as Error).message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }
    return NextResponse.json({ error: "تعذر تحديث الملف" }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await requireUser(request);
    await prisma.user.delete({ where: { id: user.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("profile:delete", error);
    if ((error as Error).message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }
    return NextResponse.json({ error: "تعذر حذف الحساب" }, { status: 400 });
  }
}
