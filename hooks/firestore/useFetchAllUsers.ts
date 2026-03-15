import { db } from "@/app/config/firebase";
import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, limit, query, where } from "firebase/firestore";

const useFetchAllUsers = (text: string) =>
  useQuery({
    queryKey: ["users", text],
    queryFn: async () => {
      const lowercaseText = text.toLowerCase();
      const q = query(
        collection(db, "users"),
        where("username_lowercase", ">=", lowercaseText),
        where("username_lowercase", "<=", lowercaseText + "\uf8ff"),
        limit(5)
      );
      const snapshot = await getDocs(q);
      const users = snapshot.docs.map((doc) => ({
        id: doc.id,
        username: doc.data().username as string,
      }));
      return users;
    },
  });

export default useFetchAllUsers;
