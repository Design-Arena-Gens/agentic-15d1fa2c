"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  twoFactorCode: z.string().optional(),
});

type LoginValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") ?? "/";
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = handleSubmit(async (values) => {
    setLoading(true);
    setError(null);
    const result = await signIn("email-password", {
      redirect: false,
      email: values.email,
      password: values.password,
      twoFactorCode: values.twoFactorCode,
      callbackUrl,
    });

    if (result?.error) {
      setError("بيانات الدخول غير صحيحة أو رمز التحقق غير صحيح");
      setLoading(false);
      return;
    }

    router.push(result?.url ?? callbackUrl);
  });

  const handleGoogle = async () => {
    await signIn("google", { callbackUrl });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="flex flex-col gap-1 text-sm">
        <label>البريد الإلكتروني</label>
        <input
          {...register("email")}
          className="rounded-2xl border border-stone-200 px-4 py-3 focus:border-primary-400 focus:outline-none"
        />
        {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
      </div>
      <div className="flex flex-col gap-1 text-sm">
        <label>كلمة المرور</label>
        <input
          type="password"
          {...register("password")}
          className="rounded-2xl border border-stone-200 px-4 py-3 focus:border-primary-400 focus:outline-none"
        />
        {errors.password && <span className="text-xs text-red-500">{errors.password.message}</span>}
      </div>
      <div className="flex flex-col gap-1 text-sm">
        <label>رمز التحقق الثنائي (اختياري)</label>
        <input
          {...register("twoFactorCode")}
          className="rounded-2xl border border-stone-200 px-4 py-3 focus:border-primary-400 focus:outline-none"
        />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-primary-500 px-6 py-3 text-white shadow-lg transition hover:bg-primary-600 disabled:opacity-60"
      >
        {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
      </button>
      <button
        type="button"
        onClick={handleGoogle}
        className="w-full rounded-full border border-stone-200 px-6 py-3 text-sm font-medium text-stone-700 transition hover:border-primary-400 hover:text-primary-600"
      >
        الدخول عبر Google
      </button>
    </form>
  );
}
