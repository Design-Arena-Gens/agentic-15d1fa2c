import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z
  .object({
    token: z.string(),
    password: z
      .string()
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/,
        "كلمة المرور ضعيفة"
      ),
  });

export async function POST(request: Request) {
  try {
    const { token, password } = schema.parse(await request.json());

    const verification = await prisma.verificationToken.findUnique({ where: { token } });
    if (!verification || verification.expires < new Date()) {
      return NextResponse.json({ error: "رمز منتهي أو غير صحيح" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email: verification.identifier } });
    if (!user) {
      return NextResponse.json({ error: "المستخدم غير موجود" }, { status: 404 });
    }

    const hashed = await bcrypt.hash(password, 12);

    await prisma.$transaction([
      prisma.user.update({ where: { id: user.id }, data: { password: hashed } }),
      prisma.verificationToken.delete({ where: { token } }),
    ]);

    return NextResponse.json({ message: "تم تحديث كلمة المرور" });
  } catch (error) {
    console.error("reset-password", error);
    return NextResponse.json({ error: "تعذر إعادة التعيين" }, { status: 400 });
  }
}
