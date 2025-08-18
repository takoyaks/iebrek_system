// src/lib/protectedRoute.ts
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { onUserStateChange } from "./auth";

export function useProtectedRoute() {
  const router = useRouter();
  useEffect(() => {
    const unsubscribe = onUserStateChange((user) => {
      if (!user) {
        router.replace("/");
      }
    });
    return () => unsubscribe();
  }, [router]);
}
