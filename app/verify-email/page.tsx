"use client";

import { useEffect } from "react";
import { useUserContext } from "../_components/context/UserContext";
import { sendEmailVerification } from "firebase/auth";
import { useRouter } from "next/navigation";
import { FirebaseError } from "firebase/app";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";

const VerifyEmailPage = () => {
  const { user } = useUserContext();
  const router = useRouter();

  useEffect(() => {
    const intervalId = setInterval(async () => {
      if (!user) return;
      await user.reload();
      if (user.emailVerified) {
        window.location.href = "/";
      }
    }, 3000);

    return () => clearInterval(intervalId);
  }, [user, router]);

  const { mutate, isPending } = useMutation({
    mutationKey: ["resend"],
    mutationFn: async () => {
      if (!user) return;
      await sendEmailVerification(user);
    },
    onSuccess: () => alert("Verification email sent again!"),
    onError: (error) => {
      if (error instanceof FirebaseError) toast.error(error.message);
    },
  });

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
          disabled={isPending}
          onClick={() => mutate()}
        >
          {isPending ? "sending email..." : "resend email"}
        </button>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
