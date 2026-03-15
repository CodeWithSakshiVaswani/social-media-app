"use client";

import { useUserContext } from "@/app/_components/context/UserContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useFetchPosts from "@/hooks/firestore/useFetchPosts";
import { Copy, Grid, Settings } from "lucide-react";
import Image from "next/image";

const Profile = () => {
  const { username } = useUserContext();
  const { data: posts } = useFetchPosts();

  return (
    <div>
      <div className="flex items-center gap-10 justify-center">
        <div>
          <Avatar className="size-44 border-2">
            <AvatarImage src="" />
            <AvatarFallback className="overflow-hidden bg-transparent">
              <Image
                src="/instagramUser.jpg"
                alt="User"
                width={300}
                height={300}
                className="size-75 object-cover "
              />
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="flex flex-col gap-6">
          <span className="text-3xl font-extrabold flex gap-4 items-center">
            {username} <Settings size={35} />
          </span>
          <span>
            {posts?.filter((post) => post.user.username === username).length}{" "}
            posts
          </span>
          <span className="font-bold">@ {username}</span>
        </div>
      </div>
      <div className="flex flex-col w-181.5 items-center mt-12">
        <span>
          <div className="p-5 border-b-4 border-white">
            <Grid size={35} />
          </div>
        </span>
        <div className="w-full h-auto flex flex-1 overflow-hidden flex-wrap rounded-2xl">
          {posts
            ?.filter((post) => post.user.username === username)
            .map((post) => (
              <div
                key={post.id}
                style={{
                  backgroundImage: `url(${post.imageUrls[0]})`,
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                }}
                className="w-60 h-80 border border-accent relative"
              >
                <div className="absolute right-0 p-1 z-50 rounded-full bg-accent">
                  <Copy />
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
