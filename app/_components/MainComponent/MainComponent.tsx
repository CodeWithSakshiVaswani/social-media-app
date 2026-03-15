import useFetchPosts from "@/hooks/firestore/useFetchPosts";
import Post from "./Post";

const MainComponent = () => {
  const { data: posts } = useFetchPosts();
  console.log(posts);

  return (
    <>
      {posts?.map((post) => {
        return <Post key={post.id} post={post} />;
      })}
    </>
  );
};

export default MainComponent;
