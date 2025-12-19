import { auth } from "@/app/config/firebase";
import { useMutation } from "@tanstack/react-query";
import { FirebaseError } from "firebase/app";
import { signOut } from "firebase/auth";
import { toast } from "sonner";

const useSignout = () =>
  useMutation({
    mutationKey: ["signout"],
    mutationFn: async () => await signOut(auth),
    onSuccess: () => toast.success("Signed out successfully!"),
    onError: (err) => {
      if (err instanceof FirebaseError)
        toast.error("Signout failed. Please try again!");
    },
  });

export default useSignout;
