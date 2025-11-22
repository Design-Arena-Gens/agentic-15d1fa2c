"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";

const schema = z.object({ email: z.string().email() });

type Values = z.infer<typeof schema>;

export function ForgotPasswordForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>({ resolver: zodResolver(schema) });
  const [message, setMessage] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading">("idle");

  const onSubmit = handleSubmit(async (values) => {
    setStatus("loading");
    const response = await fetch("/api/auth/forgot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const body = await response.json();
    setMessage(body.message ?? "تم إرسال رابط إعادة التعيين");
    setStatus("idle");
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <label className="flex flex-col gap-1 text-sm">
        <span>البريد الإلكتروني</span>
        <input
          {...register("email")}
          className="rounded-2xl border border-stone-200 px-4 py-3 focus:border-primary-400 focus:outline-none"
        />
        {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
      </label>
      {message && <p className="text-sm text-green-600">{message}</p>}
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-full bg-primary-500 px-6 py-3 text-white shadow-lg transition hover:bg-primary-600 disabled:opacity-60"
      >
        {status === "loading" ? "جاري الإرسال..." : "إرسال رابط إعادة التعيين"}
      </button>
    </form>
  );
}
