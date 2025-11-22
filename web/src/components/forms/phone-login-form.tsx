"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { z } from "zod";
import { useRouter } from "next/navigation";

const requestSchema = z.object({
  phone: z.string().regex(/^\+?\d{8,15}$/u, "رقم غير صحيح")
});
const verifySchema = z.object({
  phone: z.string(),
  code: z.string().length(6),
});

type RequestValues = z.infer<typeof requestSchema>;
type VerifyValues = z.infer<typeof verifySchema>;

type Step = "request" | "verify";

export function PhoneLoginForm() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("request");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [phone, setPhone] = useState<string>("");

  const requestForm = useForm<RequestValues>({ resolver: zodResolver(requestSchema) });
  const verifyForm = useForm<VerifyValues>({ resolver: zodResolver(verifySchema) });

  const handleRequest = requestForm.handleSubmit(async (values) => {
    setStatus("loading");
    const response = await fetch("/api/auth/phone/request-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (response.ok) {
      setPhone(values.phone);
      verifyForm.reset({ phone: values.phone, code: "" });
      setStep("verify");
      setStatus("idle");
      setMessage("تم إرسال الرمز إلى جوالك");
    } else {
      const body = await response.json();
      setStatus("error");
      setMessage(body.error ?? "تعذر إرسال الرمز");
    }
  });

  const handleVerify = verifyForm.handleSubmit(async (values) => {
    setStatus("loading");
    const response = await fetch("/api/auth/phone/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (response.ok) {
      setStatus("idle");
      setMessage("تم تسجيل الدخول بنجاح");
      router.push("/");
    } else {
      const body = await response.json();
      setStatus("error");
      setMessage(body.error ?? "رمز غير صحيح");
    }
  });

  return (
    <div className="space-y-4">
      {step === "request" ? (
        <form onSubmit={handleRequest} className="space-y-4">
          <div className="flex flex-col gap-1 text-sm">
            <label>رقم الجوال</label>
            <input
              {...requestForm.register("phone")}
              className="rounded-2xl border border-stone-200 px-4 py-3 focus:border-primary-400 focus:outline-none"
              placeholder="مثال: +9665xxxxxxx"
            />
            {requestForm.formState.errors.phone && (
              <span className="text-xs text-red-500">{requestForm.formState.errors.phone.message}</span>
            )}
          </div>
          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full rounded-full bg-primary-500 px-6 py-3 text-white shadow-lg transition hover:bg-primary-600 disabled:opacity-60"
          >
            {status === "loading" ? "جاري الإرسال..." : "إرسال رمز التحقق"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerify} className="space-y-4">
          <div className="text-sm text-stone-600">أدخل الرمز المرسل إلى {phone}</div>
          <div className="flex flex-col gap-1 text-sm">
            <label>رمز التحقق</label>
            <input
              {...verifyForm.register("code")}
              className="rounded-2xl border border-stone-200 px-4 py-3 text-center text-lg tracking-[0.5em] focus:border-primary-400 focus:outline-none"
              inputMode="numeric"
              maxLength={6}
            />
            {verifyForm.formState.errors.code && (
              <span className="text-xs text-red-500">{verifyForm.formState.errors.code.message}</span>
            )}
          </div>
          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full rounded-full bg-primary-500 px-6 py-3 text-white shadow-lg transition hover:bg-primary-600 disabled:opacity-60"
          >
            {status === "loading" ? "جاري التحقق..." : "تأكيد الرمز"}
          </button>
        </form>
      )}
      {message && <p className={`text-sm ${status === "error" ? "text-red-500" : "text-green-600"}`}>{message}</p>}
    </div>
  );
}
