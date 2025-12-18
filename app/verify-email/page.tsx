"use client";

import { useEffect, useState } from "react";
import { useUserContext } from "../_components/context/UserContext";
import { sendEmailVerification } from "firebase/auth";
import { useRouter } from "next/navigation";

const VerifyEmailPage = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useUserContext();
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(async () => {
      if (!user) return;
      await user.reload();
      if (user.emailVerified) {
        router.push("/");
        clearInterval(interval);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [user, router]);

  const resendVerificationEmail = async () => {
    if (!user) return;
    setLoading(true);
    await sendEmailVerification(user);
    setLoading(false);

    alert("Verification email sent again!");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="max-w-md rounded-xl bg-white p-6 text-center shadow">
        <h1 className="mb-2 text-2xl font-bold">Verify your email 📩</h1>

        <p className="mb-4 text-gray-600">
          We have sent a verification link to your email. Please verify your
          email to continue.
        </p>
        <button
          className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
          disabled={loading}
          onClick={resendVerificationEmail}
        >
          {loading ? "sending email..." : "resend email"}
        </button>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
