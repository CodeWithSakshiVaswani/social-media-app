import { db } from "@/app/config/firebase";
import { Post } from "@/types/post";
import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, query } from "firebase/firestore";

const useFetchPosts = () =>
  useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const q = query(collection(db, "posts"));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        ...doc.data(),
      })) as Post[];
    },
  });

export default useFetchPosts;
