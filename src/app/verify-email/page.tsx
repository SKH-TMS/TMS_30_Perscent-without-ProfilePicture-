"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function VerifyEmailPage() {
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.push("/login");
    }, 10000); // Redirect to login after 10 seconds

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="screenMiddleDiv">
      <div className="formDiv text-center">
        <h2 className="text-2xl font-bold text-green-600">
          Verification Email Sent!
        </h2>
        <p className="text-gray-600 mt-2">
          Please check your inbox and follow the link to verify your email
          address.
        </p>
        <p className="text-gray-500 text-sm mt-2">
          You will be redirected to login in a few seconds...
        </p>

        <div className="mt-4">
          <button onClick={() => router.push("/login")} className="formButton">
            Go to Login
          </button>
        </div>
      </div>
    </div>
  );
}
