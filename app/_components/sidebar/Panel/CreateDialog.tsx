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
import { Image as ImageIcon, Plus, SquarePlay } from "lucide-react";
import { useRef } from "react";

type CreateDialogProp = {
  collapseSidebar: boolean;
};

const CreateDialog = ({ collapseSidebar }: CreateDialogProp) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <li
          className={cn(
            "flex items-center gap-4 p-3 cursor-pointer",
            collapseSidebar ? "" : "hover:rounded-md hover:bg-secondary"
          )}
        >
          <button className="flex items-center gap-4 cursor-pointer">
            <Plus size={30} />
            {collapseSidebar ? "" : "Create"}
          </button>
        </li>
      </DialogTrigger>
      <DialogContent className="flex flex-col items-center bg-accent">
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
          <input
            type="file"
            className="hidden"
            ref={fileInputRef}
            onChange={(e) => console.log(e.target.files?.[0])}
          />
          <Button onClick={() => fileInputRef.current?.click()}>
            Select From Computer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateDialog;
