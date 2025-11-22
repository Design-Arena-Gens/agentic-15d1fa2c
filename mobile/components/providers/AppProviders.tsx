import { ReactNode, useEffect, useState } from "react";
import { QueryProvider } from "./QueryProvider";
import { useAuthStore } from "@/lib/auth";

export function AppProviders({ children }: { children: ReactNode }) {
  const hydrate = useAuthStore((state) => state.hydrate);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    hydrate().finally(() => setReady(true));
  }, [hydrate]);

  if (!ready) {
    return null;
  }

  return <QueryProvider>{children}</QueryProvider>;
}
