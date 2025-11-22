import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/api-auth";
import { addressSchema } from "@/lib/validators";

export async function GET(request: NextRequest) {
  try {
    const user = await requireUser(request);
    const addresses = await prisma.address.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ addresses });
  } catch (error) {
    console.error("addresses:list", error);
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireUser(request);
    const payload = addressSchema.parse(await request.json());

    if (payload.isDefault) {
      await prisma.address.updateMany({ where: { userId: user.id }, data: { isDefault: false } });
    }

    const address = await prisma.address.create({
      data: {
        userId: user.id,
        ...payload,
      },
    });

    return NextResponse.json({ address }, { status: 201 });
  } catch (error) {
    console.error("addresses:create", error);
    if ((error as Error).message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }
    return NextResponse.json({ error: "تعذر إضافة العنوان" }, { status: 400 });
  }
}
