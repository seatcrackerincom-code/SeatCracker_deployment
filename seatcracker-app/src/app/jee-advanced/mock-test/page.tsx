"use client";

import { useState, useEffect } from "react";
import RealBattleMode from "@/components/jee-advanced/RealBattleMode";
import { useRouter } from "next/navigation";
import { onAuthChange, type User } from "@/lib/firebase";

export default function MockTestPage() {
  const router = useRouter();
  const [authUser, setAuthUser] = useState<User | null>(null);

  useEffect(() => {
    const unsub = onAuthChange((user) => setAuthUser(user));
    return () => unsub();
  }, []);

  return (
    <RealBattleMode
      onBack={() => router.push("/jee-advanced")}
      authUser={authUser}
      userId={authUser?.uid}
    />
  );
}
