"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch("/api/auth/me", {
          method: "GET",
          credentials: "include",
        });
        if (!res.ok) throw new Error("Unauthorized");

        const data = await res.json();
        router.push(data.user.isAdmin ? "/admin/dashboard" : "/user/dashboard");
      } catch (error) {
        console.error("❌ Error fetching user data:", error);
        router.push("/login"); // Redirect to login if unauthorized
      }
    };

    fetchUserData();
  }, []);

  return null; // Redirect happens, no UI needed
}
