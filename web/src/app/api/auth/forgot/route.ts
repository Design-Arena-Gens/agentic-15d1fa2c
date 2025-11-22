import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({ email: z.string().email() });

export async function POST(request: Request) {
  const body = await request.json();
  const { email } = schema.parse(body);

  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (!user) {
    return NextResponse.json({ message: "تم إرسال رابط إعادة التعيين إذا كان البريد مسجلاً" });
  }

  const token = randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 1000 * 60 * 30);

  await prisma.verificationToken.create({
    data: {
      identifier: user.email!,
      token,
      expires,
    },
  });

  console.info(`Password reset link for ${email}: https://agentic-15d1fa2c.vercel.app/reset-password?token=${token}`);

  return NextResponse.json({ message: "تم إرسال رابط إعادة التعيين إلى بريدك" });
}
