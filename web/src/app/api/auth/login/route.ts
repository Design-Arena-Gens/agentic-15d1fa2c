import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validators";
import { signAccessToken, signRefreshToken } from "@/lib/token";
import { verifyToken as verifyTwoFactor } from "@/lib/twofactor";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = loginSchema.extend({
      twoFactorCode: z.string().optional(),
    });
    const { email, password, twoFactorCode } = parsed.parse(body);

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: { twoFactorSetting: true },
    });

    if (!user || !user.password) {
      return NextResponse.json({ error: "بيانات الدخول غير صحيحة" }, { status: 401 });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json({ error: "بيانات الدخول غير صحيحة" }, { status: 401 });
    }

    if (user.twoFactorSetting?.enabled) {
      if (!twoFactorCode || !verifyTwoFactor(user.twoFactorSetting.secret, twoFactorCode)) {
        return NextResponse.json({ error: "رمز التحقق غير صحيح" }, { status: 403 });
      }
    }

    const payload = { sub: user.id, email: user.email, phone: user.phone };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        image: user.image,
      },
      tokens: { accessToken, refreshToken },
    });
  } catch (error) {
    console.error("login:error", error);
    return NextResponse.json({ error: "تعذر تسجيل الدخول" }, { status: 500 });
  }
}
