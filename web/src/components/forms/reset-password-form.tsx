"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";

const schema = z
  .object({
    password: z
      .string()
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/,
        "كلمة المرور ضعيفة"
      ),
    confirmPassword: z.string(),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "كلمتا المرور غير متطابقتين",
    path: ["confirmPassword"],
  });

type Values = z.infer<typeof schema>;

export function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>({ resolver: zodResolver(schema) });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const onSubmit = handleSubmit(async (values) => {
    setStatus("loading");
    const response = await fetch("/api/auth/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password: values.password }),
    });
    if (response.ok) {
      setStatus("success");
      setTimeout(() => router.push("/login"), 1200);
    } else {
      setStatus("error");
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <label className="flex flex-col gap-1 text-sm">
        <span>كلمة المرور الجديدة</span>
        <input
          type="password"
          {...register("password")}
          className="rounded-2xl border border-stone-200 px-4 py-3 focus:border-primary-400 focus:outline-none"
        />
        {errors.password && <span className="text-xs text-red-500">{errors.password.message}</span>}
      </label>
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
      {status === "success" && <p className="text-sm text-green-600">تم تحديث كلمة المرور بنجاح.</p>}
      {status === "error" && <p className="text-sm text-red-500">تعذر تحديث كلمة المرور.</p>}
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-full bg-primary-500 px-6 py-3 text-white shadow-lg transition hover:bg-primary-600 disabled:opacity-60"
      >
        {status === "loading" ? "جاري الحفظ..." : "تعيين كلمة المرور"}
      </button>
    </form>
  );
}
