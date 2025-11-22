import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyOtpSchema } from "@/lib/validators";
import { signAccessToken, signRefreshToken } from "@/lib/token";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone, code } = verifyOtpSchema.parse(body);

    const verification = await prisma.phoneVerification.findFirst({
      where: {
        phone,
        consumedAt: null,
        expiresAt: {
          gte: new Date(),
        },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!verification || verification.code !== code) {
      return NextResponse.json({ error: "رمز التحقق غير صحيح" }, { status: 401 });
    }

    await prisma.phoneVerification.update({
      where: { id: verification.id },
      data: { consumedAt: new Date() },
    });

    let user = await prisma.user.findUnique({ where: { phone } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          phone,
          name: "ضيف حلو ومالح",
          password: await bcrypt.hash(generateRandomPassword(), 12),
          phoneVerifiedAt: new Date(),
        },
      });
    } else if (!user.phoneVerifiedAt) {
      await prisma.user.update({ where: { id: user.id }, data: { phoneVerifiedAt: new Date() } });
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
      },
      tokens: { accessToken, refreshToken },
    });
  } catch (error) {
    console.error("verify-otp:error", error);
    return NextResponse.json({ error: "تعذر التحقق من الرمز" }, { status: 500 });
  }
}

function generateRandomPassword() {
  return randomBytes(9).toString("base64url");
}
