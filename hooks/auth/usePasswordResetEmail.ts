import { auth } from "@/app/config/firebase";
import { useMutation } from "@tanstack/react-query";
import { FirebaseError } from "firebase/app";
import { sendPasswordResetEmail } from "firebase/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const usePasswordResetEmail = () => {
  const router = useRouter();

  return useMutation({
    mutationKey: ["password-reset"],
    mutationFn: async (email: string) => {
      await sendPasswordResetEmail(auth, email);
    },
    onSuccess: () => {
      toast.success("Password reset email sent!");
      router.push("/login");
    },
    onError: (err) => {
      if (err instanceof FirebaseError) toast.error(err.message);
    },
  });
};

export default usePasswordResetEmail;
