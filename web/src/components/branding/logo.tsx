import Image from "next/image";
import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="inline-flex items-center gap-3">
      <div className="relative h-12 w-12 rounded-full bg-primary-500 p-2 shadow-lg shadow-primary-500/30">
        <Image src="/logo.svg" alt="حلو ومالح" fill className="object-contain" />
      </div>
      <div className="flex flex-col text-start">
        <span className="text-lg font-semibold leading-tight">حلو ومالح</span>
        <span className="text-xs text-stone-500">Sweet &amp; Salty</span>
      </div>
    </Link>
  );
}
