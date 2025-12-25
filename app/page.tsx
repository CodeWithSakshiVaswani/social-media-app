"use client";

import Sidebar from "./_components/sidebar/Sidebar";

export default function Home() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1">hello</div>
    </div>
  );
}
