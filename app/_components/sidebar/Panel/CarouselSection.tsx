import { cn } from "@/lib/utils";
import { Images, Plus, Tags as TagsIcon, X } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import useFetchAllUsers from "@/hooks/firestore/useFetchAllUsers";
import useDebounceTechnique from "@/hooks/firestore/useDebounceTechnique";
import { Spinner } from "@/components/ui/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type PreviewUrlProp = {
  previewUrls: string[];
  setFiles: React.Dispatch<React.SetStateAction<File[] | undefined>>;
  isTagging: boolean;
  setIsTagging: (val: boolean) => void;
  tags: Tags[];
  setTags: React.Dispatch<React.SetStateAction<Tags[]>>;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
};

type Tags = {
  id: number;
  x: number;
  y: number;
  username: string;
  imageIndex: number;
};

type UserResult = {
  id: string;
  username: string;
};

const CarouselSection = ({
  previewUrls,
  setFiles,
  isTagging,
  setIsTagging,
  tags,
  setTags,
  fileInputRef,
}: PreviewUrlProp) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, flushDebouncedSearchQuery] =
    useDebounceTechnique(searchQuery, 500);
  const [showInputTag, setShowInputTag] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [api, setApi] = useState<CarouselApi>();
  const { data: users, isLoading: isUsersLoading } =
    useFetchAllUsers(debouncedSearchQuery);

  useEffect(() => {
    if (!api) return;

    setActiveImageIndex(api.selectedScrollSnap());

    const onSelect = () => setActiveImageIndex(api.selectedScrollSnap());

    api.on("select", onSelect);

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  const handleImageClick = (
    e: React.MouseEvent<HTMLDivElement>,
    imageIndex: number
  ) => {
    setShowInputTag(true);
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    //eslint-disable-next-line
    const newTags = { id: Date.now(), x, y, username: "", imageIndex };
    setTags((prev) => [...prev.filter((t) => t.username !== ""), newTags]);
    setSearchQuery("");
    flushDebouncedSearchQuery("");
  };

  const handleSelectedUsername = (user: UserResult) => {
    setTags((prev) => {
      const updatedTags = [...prev];
      if (updatedTags.length > 0) {
        updatedTags[updatedTags.length - 1].username = user.username;
      }
      return updatedTags;
    });
    setShowInputTag(false);
    setSearchQuery("");
  };

  return (
    <Carousel setApi={setApi}>
      <CarouselContent>
        {previewUrls.map((previewUrl, index) => (
          <CarouselItem
            key={index}
            className={cn(
              "w-full h-130 relative",
              isTagging ? "cursor-crosshair" : ""
            )}
            onClick={isTagging ? (e) => handleImageClick(e, index) : undefined}
            style={{
              backgroundImage: `url(${previewUrl})`,
              backgroundPosition: "center",
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
            }}
          >
            {/* Popover */}
            <Popover
              open={
                showInputTag &&
                isTagging &&
                tags[tags.length - 1]?.imageIndex === index
              }
              onOpenChange={setShowInputTag}
            >
              {tags.length > 0 &&
                tags[tags.length - 1].imageIndex === index && (
                  <PopoverAnchor
                    className="w-1 h-1 absolute"
                    style={{
                      left: `${tags[tags.length - 1].x}%`,
                      top: `${tags[tags.length - 1].y}%`,
                    }}
                  />
                )}
              <PopoverTrigger asChild>
                <div className="hidden"></div>
              </PopoverTrigger>
              <PopoverContent
                side="top"
                align="center"
                className="w-48 p-2 z-100"
                onOpenAutoFocus={(e) => e.preventDefault()}
              >
                <div onClick={(e) => e.stopPropagation()}>
                  <input
                    autoFocus
                    type="text"
                    placeholder="Tag a user..."
                    value={searchQuery}
                    className="w-full bg-transparent outline-none text-sm"
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {isUsersLoading && (
                    <div className="flex justify-center p-2">
                      <Spinner />
                    </div>
                  )}
                  {!isUsersLoading &&
                  users &&
                  !!debouncedSearchQuery.trim() &&
                  users.length > 0 ? (
                    <div className="mt-2 max-h-40 overflow-y-auto">
                      {users?.map((user) => (
                        <div
                          key={user.id}
                          className="p-2 hover:bg-secondary cursor-pointer text-sm rounded-sm transition-colors"
                          onClick={() => handleSelectedUsername(user)}
                        >
                          {user.username}
                        </div>
                      ))}
                    </div>
                  ) : !isUsersLoading && debouncedSearchQuery ? (
                    <div className="text-sm text-red-500">
                      no search results !
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </PopoverContent>
            </Popover>
            {/* Tags */}
            {/* {tags && (
              <Tags
                tags={tags.filter(
                  (tag) =>
                    tag.imageIndex === index &&
                    index === activeImageIndex &&
                    tag.username
                )}
                onRemove={(tag) => {
                  setTags((prev) => prev.filter((t) => t.id !== tag.id));
                  setShowInputTag(false);
                }}
              />
            )} */}
            {tags &&
              tags
                .filter(
                  (tag) =>
                    tag.imageIndex === index &&
                    index === activeImageIndex &&
                    tag.username
                )
                .map((tag) => (
                  <Tooltip key={tag.id} open={index === activeImageIndex}>
                    <TooltipTrigger
                      key={tag.id}
                      className="absolute"
                      style={{
                        left: `${tag.x}%`,
                        top: `${tag.y}%`,
                      }}
                      asChild
                    >
                      <div className="size-0"></div>
                    </TooltipTrigger>
                    <TooltipContent className="text-xs text-white bg-accent p-2 rounded flex gap-2">
                      {tag.username}{" "}
                      <X
                        className="cursor-pointer"
                        size={15}
                        onClick={(e) => {
                          e.stopPropagation();
                          setTags((prev) =>
                            prev.filter((t) => t.id !== tag.id)
                          );
                          setShowInputTag(false);
                        }}
                      />
                    </TooltipContent>
                  </Tooltip>
                ))}

            {/* multiple-image-button*/}
            <div className="absolute right-0 bottom-0 p-5 z-20">
              <Popover>
                <PopoverTrigger asChild>
                  <div
                    className="w-9 h-9 rounded-full bg-accent flex justify-center items-center cursor-pointer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Images />
                  </div>
                </PopoverTrigger>
                <PopoverContent
                  side="top"
                  align="center"
                  className="p-0 w-52"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Carousel className="p-2 flex items-center">
                    <CarouselPrevious className="static translate-0" />
                    <CarouselContent className="p-0 flex items-center flex-1 ml-1.5 gap-2 pr-3">
                      {previewUrls.map((previewUrl, index) => (
                        <CarouselItem
                          key={index}
                          className="flex-none! w-14! h-14! p-0 relative"
                          style={{
                            backgroundImage: `url(${previewUrl})`,
                            backgroundColor: "black",
                            backgroundPosition: "center",
                            backgroundSize: "contain",
                            backgroundRepeat: "no-repeat",
                          }}
                        >
                          <button
                            onClick={() =>
                              setFiles((prev) => {
                                if (!prev) return undefined;
                                const newFiles = prev.filter(
                                  (_, i) => i !== index
                                );
                                return newFiles.length > 0
                                  ? newFiles
                                  : undefined;
                              })
                            }
                          >
                            <div className="bg-accent/80 hover:bg-accent w-5 h-5 rounded-full flex items-center justify-center transition-colors">
                              <X
                                size={12}
                                className="text-primary cursor-pointer"
                              />
                            </div>
                          </button>
                        </CarouselItem>
                      ))}
                      <CarouselItem className="flex-none! w-auto flex items-center justify-center">
                        <button
                          type="button"
                          className="z-50 cursor-pointer"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <div className="w-9 h-9 rounded-full bg-accent flex justify-center items-center">
                            <Plus />
                          </div>
                        </button>
                      </CarouselItem>
                    </CarouselContent>
                    <CarouselNext className="static translate-0" />
                  </Carousel>
                </PopoverContent>
              </Popover>
            </div>
            {/* tag-button*/}
            <div className="absolute right-15 bottom-0 p-5 z-20">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  const newTaggingState = !isTagging;
                  setIsTagging(newTaggingState);
                  if (!newTaggingState) {
                    setShowInputTag(false);
                    setTags((prev) => prev.filter((t) => t.username !== ""));
                  }
                }}
              >
                <div className="w-9 h-9 rounded-full bg-accent flex justify-center items-center cursor-pointer">
                  <TagsIcon />
                </div>
              </button>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious
        className="left-0 z-50 bg-black!"
        onClick={() => api?.scrollPrev(true)}
      />
      <CarouselNext
        className="right-0 z-50 bg-black!"
        onClick={() => api?.scrollNext(true)}
      />
    </Carousel>
  );
};

export default CarouselSection;
