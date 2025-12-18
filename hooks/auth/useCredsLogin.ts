import { auth } from "@/app/config/firebase";
import { useMutation } from "@tanstack/react-query";
import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";
import { toast } from "sonner";

type UseCredsLoginData = {
  email: string;
  password: string;
};

const useCredsLogin = () =>
  useMutation({
    mutationKey: ["creds-login"],
    mutationFn: async (data: UseCredsLoginData) =>
      await signInWithEmailAndPassword(auth, data.email, data.password),
    onSuccess: () => toast.success("Login successful"),
    onError: (err) => {
      toast.error(
        err instanceof FirebaseError && err.code === "auth/invalid-credential"
          ? "Invalid credentials!"
          : "Login failed! Please try again."
      );
    },
  });

export default useCredsLogin;
