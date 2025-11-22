"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, ShoppingBag, MapPin, Clock } from "lucide-react";

import { Logo } from "@/components/branding/logo";

export function MainHeader() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-lg shadow-sm shadow-stone-200">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-4">
        <Logo />
        <form onSubmit={handleSubmit} className="relative hidden flex-1 items-center md:flex" role="search">
          <Search className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400" />
          <input
            className="w-full rounded-full border border-stone-200 bg-white py-3 pl-5 pr-12 text-sm shadow-inner focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
            placeholder="ابحث عن وجبتك المفضلة..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </form>
        <div className="flex items-center gap-4 text-sm">
          <div className="hidden items-center gap-2 rounded-full bg-stone-100 px-3 py-2 sm:flex">
            <MapPin className="h-4 w-4 text-primary-500" />
            <span className="leading-none">التوصيل خلال 25-35 دقيقة</span>
          </div>
          <Link
            href="/orders/cart"
            className="flex items-center gap-2 rounded-full bg-primary-500 px-4 py-2 text-white shadow-lg shadow-primary-500/30 transition hover:bg-primary-600"
          >
            <ShoppingBag className="h-4 w-4" />
            <span>سلتي</span>
          </Link>
          <Link
            href="/orders"
            className="flex items-center gap-2 rounded-full border border-stone-200 px-4 py-2 text-stone-700 transition hover:border-primary-400 hover:text-primary-600"
          >
            <Clock className="h-4 w-4" />
            <span>تتبع الطلب</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
