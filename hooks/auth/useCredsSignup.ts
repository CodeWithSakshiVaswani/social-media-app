import { auth } from "@/app/config/firebase";
import { useMutation } from "@tanstack/react-query";
import { FirebaseError } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { toast } from "sonner";

type UseCredsSignupData = {
  email: string;
  password: string;
};

const useCredsSignup = () =>
  useMutation({
    mutationKey: ["creds-signup"],
    mutationFn: async (data: UseCredsSignupData) => {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      await sendEmailVerification(userCredential.user);
    },
    onSuccess: () =>
      toast.success("Account created! Please check your email to verify"),
    onError: (err) => {
      toast.error(
        err instanceof FirebaseError && err.code === "auth/email-already-in-use"
          ? "Email already in use"
          : "Signup failed ! Please try again."
      );
    },
  });

export default useCredsSignup;
