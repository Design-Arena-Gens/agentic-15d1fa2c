import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/providers/app-providers";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  display: "swap",
  variable: "--font-cairo",
});

export const metadata: Metadata = {
  title: "حلو ومالح | Sweet & Salty",
  description:
    "تطبيق توصيل طعام فاخر يقدم تجربة مميزة مع الحلويات والمأكولات الشرقية والعالمية من مطعم حلو ومالح.",
  authors: [{ name: "حلو ومالح" }],
  keywords: [
    "توصيل طعام",
    "حلو ومالح",
    "مطعم",
    "حلويات",
    "سندويتشات",
    "قهوة",
    "فطور",
  ],
  metadataBase: new URL("https://agentic-15d1fa2c.vercel.app"),
  openGraph: {
    title: "حلو ومالح | Sweet & Salty",
    description:
      "أشهى الأطباق الشرقية والعالمية مع عروض يومية وتوصيل سريع في جميع أنحاء المملكة.",
    url: "https://agentic-15d1fa2c.vercel.app",
    siteName: "حلو ومالح",
    locale: "ar_SA",
    type: "website",
  },
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${cairo.variable} bg-stone-50 text-stone-900`}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
