"use client";

import { auth } from "@/app/config/firebase";
import useFetchUsername from "@/hooks/firestore/useFetchUsername";
import { onAuthStateChanged, User } from "firebase/auth";
import { usePathname, useRouter } from "next/navigation";

import { createContext, useContext, useEffect, useRef, useState } from "react";

type IUserContext = {
  user: User | null;
  isInitialLoadingPending: boolean;
  username: string | null;
  username_lowercase: string | null;
};

export const UserContext = createContext<IUserContext>({
  user: null,
  isInitialLoadingPending: true,
  username: null,
  username_lowercase: null,
});

const AUTH_REQUIRED_PAGES = ["/"];

const AUTH_ABSENCE_REQUIRED_PAGES = ["/login", "/signup"];

const USERNAME_ABSENCE_REQUIRED_PAGES = [
  "/login",
  "/signup",
  "/verify-email",
  "/set-username",
];

const UserContextProvider = ({ children }: React.PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(null);
  const [isInitialLoadingPending, setIsInitialLoadingPending] =
    useState<boolean>(true);
  const { data, isLoading: isUsernameLoading } = useFetchUsername({
    uid: user?.uid,
  });
  const username = data?.username;
  const username_lowercase = data?.username_lowercase;
  const pathname = usePathname();
  const router = useRouter();
  const routerCallbackRef = useRef(router);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsInitialLoadingPending(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!isInitialLoadingPending && !isUsernameLoading) {
      if (
        AUTH_ABSENCE_REQUIRED_PAGES.includes(pathname) &&
        user?.emailVerified
      ) {
        routerCallbackRef.current.push("/");
      }
      if (
        AUTH_ABSENCE_REQUIRED_PAGES.includes(pathname) &&
        user &&
        !user?.emailVerified
      ) {
        routerCallbackRef.current.push("/verify-email");
      }
      if (AUTH_REQUIRED_PAGES.includes(pathname)) {
        if (!user) routerCallbackRef.current.push("/login");
        else if (!user.emailVerified)
          routerCallbackRef.current.push("/verify-email");
      }
      if (
        !USERNAME_ABSENCE_REQUIRED_PAGES.includes(pathname) &&
        user?.emailVerified &&
        !isUsernameLoading &&
        !username
      ) {
        routerCallbackRef.current.push("/set-username");
      }
    }
  }, [pathname, user, username, isInitialLoadingPending, isUsernameLoading]);
  return (
    <UserContext.Provider
      value={{ user, username, username_lowercase, isInitialLoadingPending }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);

export default UserContextProvider;
