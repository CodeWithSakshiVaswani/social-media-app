import { useUserContext } from "@/app/_components/context/UserContext";
import { db } from "@/app/config/firebase";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { doc, setDoc } from "firebase/firestore";

const useAddUsername = () => {
  const queryClient = useQueryClient();
  const { user } = useUserContext();
  const uid = user?.uid;

  return useMutation({
    mutationKey: ["addUsername"],
    mutationFn: async (username: string | undefined) => {
      if (!uid) return;
      return await setDoc(doc(db, "users", uid), {
        username: username,
        username_lowercase: username?.toLowerCase(),
      });
    },
    onSuccess: (_, variables) =>
      queryClient.setQueryData(["fetchusername"], { username: variables }),
  });
};

export default useAddUsername;
