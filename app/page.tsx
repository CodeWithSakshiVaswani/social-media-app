"use client";

import useSignout from "@/hooks/auth/useSignout";

export default function Home() {
  const { mutateAsync: signout } = useSignout();
  return (
    <div>
      <button onClick={() => signout()}>signout</button>
    </div>
  );
}
