import { db } from "@/app/config/firebase";
import { Post } from "@/types/post";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { doc, setDoc } from "firebase/firestore";
import { toast } from "sonner";

const useAddPosts = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["addPosts"],
    mutationFn: async (finalPostData: Post) => {
      return await setDoc(doc(db, "posts", finalPostData.id), finalPostData);
    },
    onSuccess: (data, finalPostData) => {
      toast.success("Post has been shared!");
      queryClient.setQueryData<Post[]>(["posts"], (oldData) => {
        return [{ ...finalPostData }, ...(oldData || [])];
      });
    },
    onError: () =>
      toast.error("Post failed to share. Please try again after some time!"),
  });
};

export default useAddPosts;
