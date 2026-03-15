import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { ArrowLeft, Image as ImageIcon, Plus, SquarePlay } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import CarouselSection from "./CarouselSection";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUserContext } from "../../context/UserContext";
import { useUploadThing } from "@/lib/uploadthing";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useAddPosts from "@/hooks/firestore/useAddPosts";
import { toast } from "sonner";
import { Post, Tag } from "@/types/post";

type CreateDialogProp = {
  collapseSidebar: boolean;
};

const CreateDialog = ({ collapseSidebar }: CreateDialogProp) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[] | undefined>(undefined);
  const [isTagging, setIsTagging] = useState(false);
  const [tags, setTags] = useState<Tag[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const { user, username } = useUserContext();
  const [caption, setCaption] = useState<string>("");
  const postIdRef = useRef<string>("");
  const { mutateAsync: savePost, isPending: isSaving } = useAddPosts();

  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onClientUploadComplete: async (res) => {
      const imageUrls = res.map((file) => file.ufsUrl);
      const finalPostData: Post = {
        id: postIdRef.current,
        imageUrls,
        caption,
        tags,
        user: {
          id: user?.uid,
          username: username,
        },
        fileCount: files?.length,
        createdAt: Date.now(),
        likeCount: 0,
        commentCount: 0,
      };
      await savePost(finalPostData);

      setFiles(undefined);
      setOpen(false);
    },
    onUploadError: () => {
      toast("Upload Failed. Please try again!");
    },
  });

  const initials = user?.displayName
    ? user.displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
    : user?.email
      ? user.email.split("@")[0].slice(0, 2).toUpperCase()
      : "";

  const previewUrls = useMemo(() => {
    if (!files) return undefined;
    return files.map((file) => URL.createObjectURL(file));
  }, [files]);

  useEffect(() => {
    if (previewUrls) {
      return () => {
        previewUrls.map((previewUrl) => URL.revokeObjectURL(previewUrl));
      };
    }
  }, [previewUrls]);

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        if (!open) {
          setFiles(undefined);
          setIsTagging(false);
          setTags([]);
        }
      }}
    >
      <DialogTrigger asChild>
        <li
          className={cn(
            "flex items-center gap-4 p-3 cursor-pointer",
            collapseSidebar ? "" : "hover:rounded-md hover:bg-secondary",
          )}
        >
          <button className="flex items-center gap-4 cursor-pointer">
            <Plus size={30} />
            {collapseSidebar ? "" : "Create"}
          </button>
        </li>
      </DialogTrigger>
      <DialogContent
        showCloseButton={!files}
        className={cn(
          isUploading
            ? "p-0 w-md!"
            : files
              ? "p-0 sm:max-w-4xl"
              : "flex flex-col items-center bg-accent",
        )}
      >
        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          accept="image/*"
          multiple
          onChange={(e) => {
            if (!e.target.files) return;
            const newFiles = Array.from(e.target.files);
            setFiles((prev) => [...(prev || []), ...newFiles]);
            e.target.value = "";
          }}
        />
        {!files ? (
          <>
            <DialogHeader>
              <DialogTitle>
                <div className="p-2 text-3xl font-semibold mb-20">
                  Create new post
                </div>
                <div className="relative mb-8 pl-12">
                  <ImageIcon size={80} className="rotate-[-10deg] bg-accent" />
                  <SquarePlay
                    size={80}
                    className="absolute top-6 left-20 z-10 bg-accent rotate-12"
                  />
                </div>
              </DialogTitle>
              <DialogDescription className="flex items-center justify-center text-xl font-normal text-primary">
                Drag photos and videos here
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mb-10">
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="cursor-pointer"
              >
                Select From Computer
              </Button>
            </DialogFooter>
          </>
        ) : !isUploading && !isSaving ? (
          <div className="flex flex-col">
            <div className="flex justify-between items-center border-b">
              <Button
                size="icon-lg"
                variant="ghost"
                onClick={() => setFiles(undefined)}
              >
                <ArrowLeft className="size-7.5" />
              </Button>
              <h2 className="text-xl font-bold">Create New Post</h2>
              <Button
                variant="ghost"
                className="text-md font-normal cursor-pointer"
                onClick={async () => {
                  const newPostId = crypto.randomUUID();
                  postIdRef.current = newPostId;
                  const renamedFiles = files.map((file, index) => {
                    const newName = `${newPostId}-${index}.webp`;
                    return new File([file], newName, { type: file.type });
                  });
                  await startUpload(renamedFiles);
                }}
              >
                Next
              </Button>
            </div>
            <div className="flex">
              <div className="flex-1 border-r">
                {previewUrls && (
                  <CarouselSection
                    previewUrls={previewUrls}
                    setFiles={setFiles}
                    isTagging={isTagging}
                    setIsTagging={setIsTagging}
                    tags={tags}
                    setTags={setTags}
                    fileInputRef={fileInputRef}
                  />
                )}
              </div>
              <div className="w-sm">
                <div className="flex items-center p-5 gap-5 mb-1">
                  <Avatar>
                    <AvatarImage src={user?.photoURL || ""} />
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                  <span className="text-md font-bold ">{username}</span>
                </div>
                <div>
                  <textarea
                    rows={6}
                    className="outline-none w-full p-5 border-b"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <Card className="w-full border-none shadow-none">
            <CardHeader className="flex justify-center">
              <CardTitle className="text-4xl font-bold">Sharing</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <p className="mb-12 text-2xl font-normal">Please wait...</p>
              <Spinner className="size-20" />
            </CardContent>
          </Card>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreateDialog;
