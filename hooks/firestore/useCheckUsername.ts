import { db } from "@/app/config/firebase";
import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, query, where } from "firebase/firestore";

const useCheckUsername = (username: string | undefined) => {
  return useQuery({
    queryKey: ["checkusername", username],
    queryFn: async () => {
      if (!username) return false;
      const q = query(
        collection(db, "users"),
        where("username", "==", username)
      );
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    },
    enabled: !!username,
  });
};

export default useCheckUsername;
