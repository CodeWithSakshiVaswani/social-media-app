import { db } from "@/app/config/firebase";
import { Post } from "@/types/post";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { doc, increment, runTransaction } from "firebase/firestore";

type Props = {
  postId: string;
  userId: string;
};

const useToggleLike = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["toggle"],
    mutationFn: async ({ postId, userId }: Props) => {
      const postRef = doc(db, "posts", postId);
      const likeRef = doc(db, "posts", postId, "likes", userId);
      const result = await runTransaction(db, async (transaction) => {
        const likeDoc = await transaction.get(likeRef);
        if (likeDoc.exists()) {
          transaction.delete(likeRef);
          transaction.update(postRef, { likeCount: increment(-1) });
          return {
            liked: false,
          };
        } else {
          transaction.set(likeRef, {
            likedAt: Date.now(),
          });
          transaction.update(postRef, { likeCount: increment(1) });
          return {
            liked: true,
          };
        }
      });

      return result;
    },
    onSuccess: ({ liked }, { postId }) =>
      queryClient.setQueryData<Post[]>(
        ["posts"],
        (prev) =>
          prev &&
          prev.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  likeCount: liked ? post.likeCount + 1 : post.likeCount - 1,
                  likedByCurrentUser: liked,
                }
              : post,
          ),
      ),
  });
};

export default useToggleLike;
