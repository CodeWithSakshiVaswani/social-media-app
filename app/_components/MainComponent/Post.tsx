import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Ellipsis, Heart, MessageCircle } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { useUserContext } from "../context/UserContext";
import { useState } from "react";
import { Post as Ipost } from "@/types/post";
import useToggleLike from "@/hooks/firestore/useToggleLike";

type SinglePost = {
  post: Ipost;
};

const Post = ({ post }: SinglePost) => {
  const [showTags, setShowTags] = useState<boolean>(false);
  const { mutateAsync: toggleLike } = useToggleLike();
  const { user } = useUserContext();
  const initials = user?.displayName
    ? user.displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
    : user?.email
      ? user.email.split("@")[0].slice(0, 2).toUpperCase()
      : "";
  return (
    <div key={post.id} className="max-w-lg w-full">
      <div className="flex justify-between items-center">
        <span className="flex items-center gap-3 p-2">
          <Avatar className="size-10">
            <AvatarImage src={user?.photoURL || ""} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <span className="font-bold">{post.user.username}</span>
        </span>
        <span>
          <Ellipsis />
        </span>
      </div>
      <Carousel>
        <CarouselContent className="bg-black">
          {post.imageUrls.map((imageUrl, index) => (
            <CarouselItem
              key={index}
              className="w-full h-130 relative"
              style={{
                backgroundImage: `url(${imageUrl})`,
                backgroundPosition: "center",
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
              }}
              onClick={() => setShowTags((prev) => !prev)}
            >
              {/* {showTags && (
                      <Tags
                        tags={post.tags.filter(
                          (tag) => tag.imageIndex === index
                        )}
                      />
                    )} */}
              {showTags &&
                post.tags
                  .filter((tag) => tag.imageIndex === index)
                  .map((tag) => (
                    <Tooltip key={tag.id} open>
                      <TooltipTrigger
                        className="absolute"
                        style={{
                          left: `${tag.x}%`,
                          top: `${tag.y}%`,
                        }}
                        asChild
                      >
                        <div className="size-0"></div>
                      </TooltipTrigger>
                      <TooltipContent className="bg-accent text-white">
                        {tag.username}
                      </TooltipContent>
                    </Tooltip>
                  ))}
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-3 z-50 bg-black!" />
        <CarouselNext className="right-3 z-50 bg-black!" />
      </Carousel>
      <div>
        <div className="p-3 flex items-center gap-4">
          <Heart
            size={25}
            className="cursor-pointer"
            onClick={() =>
              user?.uid && toggleLike({ postId: post.id, userId: user.uid })
            }
          />
          <MessageCircle size={25} />
        </div>
        <div className="px-3 font-bold text-sm">{post.likeCount} likes</div>
        {post.caption && (
          <div className="px-3 py-2 font-black text-sm">{post.caption}</div>
        )}
        <input
          type="text"
          className="px-3 font-black text-sm py-2 placeholder:text-ring outline-none"
          placeholder="Add a comment..."
        />
      </div>
    </div>
  );
};

export default Post;
