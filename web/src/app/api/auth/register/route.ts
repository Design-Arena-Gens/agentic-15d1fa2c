import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validators";
import { signAccessToken, signRefreshToken } from "@/lib/token";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = registerSchema.refine((data) => data.password === data.confirmPassword, {
      message: "كلمتا المرور غير متطابقتين",
      path: ["confirmPassword"],
    });

    const payload = parsed.parse(body);

    const existingEmail = await prisma.user.findUnique({ where: { email: payload.email } });
    if (existingEmail) {
      return NextResponse.json({ error: "البريد مستخدم مسبقاً" }, { status: 409 });
    }

    const existingPhone = await prisma.user.findUnique({ where: { phone: payload.phone } });
    if (existingPhone) {
      return NextResponse.json({ error: "رقم الجوال مستخدم مسبقاً" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(payload.password, 12);
    const user = await prisma.user.create({
      data: {
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        password: hashedPassword,
      },
    });

    const accessToken = signAccessToken({ sub: user.id, email: user.email, phone: user.phone });
    const refreshToken = signRefreshToken({ sub: user.id, email: user.email, phone: user.phone });

    return NextResponse.json(
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
        },
        tokens: {
          accessToken,
          refreshToken,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("register:error", error);
    return NextResponse.json({ error: "تعذر إنشاء الحساب" }, { status: 500 });
  }
}
