"use client";

import usePasswordResetEmail from "@/hooks/auth/usePasswordResetEmail";
import { Lock } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const PasswordResetEmailPage = () => {
  const [email, setEmail] = useState<string>("");
  const { mutateAsync: passwordresetemail, isPending: isLinkSendingPending } =
    usePasswordResetEmail();

  return (
    <div className="flex flex-col h-screen">
      <div className="py-4 px-64 text-4xl font-bold italic border-b border-gray-700">
        Snapit
      </div>
      <div className="flex justify-center items-center py-12 flex-1">
        <Card className="flex flex-col items-center justify-between text-center pt-6 pb-0 w-full max-w-md">
          <CardHeader className="flex flex-col items-center w-full">
            <CardTitle className="flex flex-col items-center gap-3">
              <Lock size={80} />
              <h5 className="font-bold text-xl">Trouble with logging in?</h5>
            </CardTitle>
            <CardDescription>
              Enter your email address, phone number or username, and we&apos;ll
              send you a link to get back into your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="email"
              value={email}
              placeholder="Enter your email Address"
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button
              isLoading={isLinkSendingPending}
              onClick={() => passwordresetemail(email)}
              className="w-full mb-16"
            >
              Sent Login Link
            </Button>
          </CardContent>
          <CardFooter className="bg-input w-full flex justify-center rounded-b-xl p-4">
            <Link href={"/login"}>Back to Login</Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default PasswordResetEmailPage;
