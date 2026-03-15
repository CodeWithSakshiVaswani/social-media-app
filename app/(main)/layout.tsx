"use client";

import Sidebar from "../_components/sidebar/Sidebar";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col gap-7 py-16 px-32 items-center overflow-auto">
        {children}
      </div>
    </div>
  );
}
