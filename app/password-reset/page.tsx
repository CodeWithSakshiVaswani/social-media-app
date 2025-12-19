"use client";

import usePasswordResetEmail from "@/hooks/auth/usePasswordResetEmail";
import { Lock } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const PasswordResetEmailPage = () => {
  const [email, setEmail] = useState<string>("");
  const { mutateAsync: passwordresetemail } = usePasswordResetEmail();

  return (
    <div className="flex flex-col h-screen">
      <div className="py-4 px-64 text-4xl font-bold italic border-b border-gray-700">
        Snapit
      </div>
      <div className="flex justify-center items-center py-12 flex-1">
        <div className="flex flex-col items-center justify-between pt-6 max-w-md border border-gray-700 rounded-b-xs">
          <div className="flex flex-col items-center justify-between gap-2 px-16 mb-28">
            <Lock size={100} />
            <h5 className="font-bold text-xl">Trouble with logging in?</h5>
            <p className="text-center font-normal text-sm text-gray-400 mb-6">
              Enter your email address, phone number or username, and we&apos;ll
              send you a link to get back into your account.
            </p>

            <input
              type="email"
              value={email}
              placeholder="Enter your email Address"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 bg-gray-800 rounded-xs mb-3"
            />
            <button
              onClick={() => passwordresetemail(email)}
              className="w-full p-1 rounded-sm bg-blue-800"
            >
              Sent Login Link
            </button>
          </div>
          <div className="flex items-center justify-center bg-gray-700 w-full p-3 ">
            <Link href={"/login"}>Back to Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetEmailPage;
