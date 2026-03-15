import { db } from "@/app/config/firebase";
import { useQuery } from "@tanstack/react-query";
import { doc, getDoc } from "firebase/firestore";

type UseFetchUsernameProps = {
  uid?: string;
};

const useFetchUsername = ({ uid }: UseFetchUsernameProps) => {
  return useQuery({
    queryKey: ["fetchusername", uid],
    queryFn: async () => {
      if (!uid) return;

      const docRef = doc(db, "users", uid);

      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? docSnap.data() : null;
    },

    enabled: !!uid,
  });
};

export default useFetchUsername;
