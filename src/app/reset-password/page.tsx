"use client";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function ResetPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword }),
    });

    const data = await res.json();
    setMessage(data.message);

    if (res.ok) {
      alert("Password reset successful! Redirecting to login...");
      router.push("/login");
    }
  };

  return (
    <div className="screenMiddleDiv">
      <div className="formDiv">
        <h2 className="text-2xl font-bold text-center">Reset Password</h2>
        <form onSubmit={handleResetPassword} className="space-y-4">
          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="formInput"
            required
          />
          <button type="submit" className="formButton">
            Reset Password
          </button>
        </form>
        {message && <p className="text-center mt-2">{message}</p>}
      </div>
    </div>
  );
}
