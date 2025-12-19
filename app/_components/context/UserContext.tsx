"use client";

import { auth } from "@/app/config/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { usePathname, useRouter } from "next/navigation";

import { createContext, useContext, useEffect, useRef, useState } from "react";

type IUserContext = {
  user: User | null;
  isInitialLoadingPending: boolean;
};

export const UserContext = createContext<IUserContext>({
  user: null,
  isInitialLoadingPending: true,
});

const AUTH_REQUIRED_PAGES = ["/"];

const AUTH_ABSENCE_REQUIRED_PAGES = ["/login", "/signup"];

const UserContextProvider = ({ children }: React.PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(null);
  const [isInitialLoadingPending, setIsInitialLoadingPending] =
    useState<boolean>(true);
  const pathname = usePathname();
  const router = useRouter();
  const routerCallbackRef = useRef(router);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("Reloaded user", user);
      setUser(user);
      setIsInitialLoadingPending(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!isInitialLoadingPending) {
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
    }
  }, [pathname, user, isInitialLoadingPending]);
  return (
    <UserContext.Provider value={{ user, isInitialLoadingPending }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);

export default UserContextProvider;
