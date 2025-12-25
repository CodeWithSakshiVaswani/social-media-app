"use client";

import { useEffect } from "react";
import { useUserContext } from "../_components/context/UserContext";
import { sendEmailVerification } from "firebase/auth";
import { useRouter } from "next/navigation";
import { FirebaseError } from "firebase/app";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MailCheck } from "lucide-react";

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
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            Verify your email <MailCheck size={18} />
          </CardTitle>
          <CardDescription>
            We have sent a verification link to your email. Please verify your
            email to continue.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button
            className="w-full"
            isLoading={isPending}
            disabled={isPending}
            onClick={() => mutate()}
          >
            {isPending ? "Sending email..." : "Resend email"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default VerifyEmailPage;
