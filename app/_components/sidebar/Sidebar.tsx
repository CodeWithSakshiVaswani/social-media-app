import useSignout from "@/hooks/auth/useSignout";
import { Heart, House, List, Plus, Search, SquarePlay } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import SearchPanel from "./Panel/SearchPanel";
import NotificationsPanel from "./Panel/NotificationsPanel";
import { useUserContext } from "../context/UserContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

import CreateDialog from "./Panel/CreateDialog";

enum ActivePanel {
  Search = 1,
  Notifications,
}

const Sidebar = () => {
  const { mutateAsync: signout } = useSignout();
  const [activePanel, setActivePanel] = useState<ActivePanel | null>(null);
  const collapseSidebar = !!activePanel;
  const { user } = useUserContext();
  console.log(user);

  const initials = user?.displayName
    ? user.displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
    : user?.email
    ? user.email.split("@")[0].slice(0, 2).toUpperCase()
    : "";

  const handleActionNavigation = (action: ActivePanel) => {
    setActivePanel((prev) => (prev === action ? null : action));
  };

  const SIDEBAR_LINKS_AND_BUTTONS = [
    {
      icon: <House size={30} />,
      label: "Home",
      path: "/",
    },
    {
      icon: <Search size={30} />,
      label: "Search",
      action: ActivePanel.Search,
    },
    {
      icon: <Heart size={30} />,
      label: "Notifications",
      action: ActivePanel.Notifications,
    },
  ];

  const renderPanel = () => {
    if (!activePanel) return null;
    switch (activePanel) {
      case ActivePanel.Search:
        return <SearchPanel />;
      case ActivePanel.Notifications:
        return <NotificationsPanel />;
      default:
        return null;
    }
  };

  return (
    <div className={cn("relative flex h-full border-r")}>
      <div
        className={cn(
          "flex flex-col w-3xs py-10 px-4 z-20 transition-all duration-300",
          collapseSidebar ? "max-w-25" : ""
        )}
      >
        <h2
          className="text-4xl italic font-bold mb-16 p-3 cursor-pointer"
          onClick={() => setActivePanel(null)}
        >
          {!collapseSidebar ? (
            "Snapit"
          ) : (
            <Image src="/favicon.ico" alt="" width={30} height={30} />
          )}
        </h2>
        <div>
          <ul className="font-normal text-lg">
            {SIDEBAR_LINKS_AND_BUTTONS.map((linkAndButton, index) => {
              const child = (
                <>
                  {linkAndButton.icon}
                  {collapseSidebar ? "" : linkAndButton.label}
                </>
              );
              return (
                <li key={index}>
                  {linkAndButton.path ? (
                    <Link
                      href={linkAndButton.path}
                      className={cn(
                        "flex items-center gap-4 p-3",
                        collapseSidebar
                          ? ""
                          : "hover:rounded-md hover:bg-secondary"
                      )}
                      onClick={() => setActivePanel(null)}
                    >
                      {child}
                    </Link>
                  ) : (
                    <button
                      onClick={() =>
                        linkAndButton.action &&
                        handleActionNavigation(linkAndButton.action)
                      }
                      className={cn(
                        "flex items-center w-full gap-4 p-3 cursor-pointer",
                        collapseSidebar
                          ? ""
                          : "hover:rounded-md hover:bg-secondary"
                      )}
                    >
                      {child}
                    </button>
                  )}
                </li>
              );
            })}
            <CreateDialog collapseSidebar={collapseSidebar} />
            <li
              className={cn(
                "flex items-center gap-4 p-3 cursor-pointer",
                collapseSidebar ? "" : "hover:rounded-md hover:bg-secondary"
              )}
            >
              <Avatar>
                <AvatarImage src={user?.photoURL || ""} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <span>{collapseSidebar ? "" : "Profile"}</span>
            </li>
          </ul>
        </div>
        <div className="flex flex-col flex-1 justify-end">
          <ul className="font-normal text-lg space-y-2">
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <li
                  className={cn(
                    "flex items-center gap-4 p-2 cursor-pointer",
                    collapseSidebar ? "" : "hover:rounded-md hover:bg-secondary"
                  )}
                >
                  <List size={30} />
                  {collapseSidebar ? "" : "More"}
                </li>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Settings</DropdownMenuLabel>
                <DropdownMenuItem>Your Activity</DropdownMenuItem>
                <DropdownMenuItem>Saved</DropdownMenuItem>
                <DropdownMenuItem>Switch Appearances</DropdownMenuItem>
                <DropdownMenuItem>Switch Accounts</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signout()}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </ul>
        </div>
      </div>
      {activePanel && (
        <div className="w-100 absolute bg-background border-r rounded-r-3xl top-0 bottom-0 left-24 transition-all duration-300 ease-in-out z-10">
          {renderPanel()}
        </div>
      )}
    </div>
  );
};

export default Sidebar;
