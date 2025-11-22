"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { z } from "zod";
import { useRouter } from "next/navigation";

const registerSchema = z
  .object({
    name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().regex(/^\+?\d{8,15}$/u, "رقم غير صالح"),
    password: z
      .string()
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/,
        "كلمة المرور ضعيفة"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "كلمتا المرور غير متطابقتين",
    path: ["confirmPassword"],
  });

type RegisterValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterValues>({ resolver: zodResolver(registerSchema) });

  const onSubmit = handleSubmit(async (values) => {
    setStatus("loading");
    setMessage(null);
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (response.ok) {
      setMessage("تم إنشاء الحساب بنجاح. يمكنك تسجيل الدخول الآن.");
      setStatus("idle");
      setTimeout(() => router.push("/login"), 1200);
    } else {
      const body = await response.json();
      setMessage(body.error ?? "تعذر إنشاء الحساب");
      setStatus("error");
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-3 md:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm">
          <span>الاسم الكامل</span>
          <input
            {...register("name")}
            className="rounded-2xl border border-stone-200 px-4 py-3 focus:border-primary-400 focus:outline-none"
          />
          {errors.name && <span className="text-xs text-red-500">{errors.name.message}</span>}
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span>البريد الإلكتروني</span>
          <input
            {...register("email")}
            className="rounded-2xl border border-stone-200 px-4 py-3 focus:border-primary-400 focus:outline-none"
          />
          {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
        </label>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm">
          <span>رقم الجوال</span>
          <input
            {...register("phone")}
            className="rounded-2xl border border-stone-200 px-4 py-3 focus:border-primary-400 focus:outline-none"
          />
          {errors.phone && <span className="text-xs text-red-500">{errors.phone.message}</span>}
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span>كلمة المرور</span>
          <input
            type="password"
            {...register("password")}
            className="rounded-2xl border border-stone-200 px-4 py-3 focus:border-primary-400 focus:outline-none"
          />
          {errors.password && <span className="text-xs text-red-500">{errors.password.message}</span>}
        </label>
      </div>
      <label className="flex flex-col gap-1 text-sm">
        <span>تأكيد كلمة المرور</span>
        <input
          type="password"
          {...register("confirmPassword")}
          className="rounded-2xl border border-stone-200 px-4 py-3 focus:border-primary-400 focus:outline-none"
        />
        {errors.confirmPassword && (
          <span className="text-xs text-red-500">{errors.confirmPassword.message}</span>
        )}
      </label>
      {message && <p className={`text-sm ${status === "error" ? "text-red-500" : "text-green-600"}`}>{message}</p>}
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-full bg-primary-500 px-6 py-3 text-white shadow-lg transition hover:bg-primary-600 disabled:opacity-60"
      >
        {status === "loading" ? "جاري إنشاء الحساب..." : "إنشاء حساب"}
      </button>
    </form>
  );
}
