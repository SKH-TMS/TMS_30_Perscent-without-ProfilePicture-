"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        console.log("❌ Login failed:", data.message);
        window.alert(data.message); // ✅ Show error message in alert dialog
      } else {
        console.log("✅ Login successful! Redirecting to /dashboard...");
        router.push("/dashboard"); // Redirect to dashboard after successful login
      }
    } catch (err) {
      console.log("❌ Error during login:", err);
      window.alert("Something went wrong. Please try again."); // ✅ Show general error alert
    }
  };

  return (
    <div className="screenMiddleDiv">
      <div className="formDiv">
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-center text-2xl font-bold">Login</h2>

          {/* Email Input */}
          <div>
            <label htmlFor="email" className="formLabel">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="formLabel">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="formButton">
            Login
          </button>
        </form>
        {/* Forgot Password Link */}
        <div className="text-center mt-4">
          <a href="/forgot-password" className="text-blue-500 hover:underline">
            Forgot Password?
          </a>
        </div>
      </div>
    </div>
  );
}
