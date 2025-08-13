import React, { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { useAuthStore } from "../store/auth.slice";

const Layout = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <section
      className={`h-screen w-full flex overflow-hidden bg-black ${
        isAuthenticated ? "flex-row" : "flex-col"
      }`}
    >
      {isAuthenticated ? <Sidebar /> : <Header />}
      <main className="flex-1 overflow-y-auto p-4 mt-12">{children}</main>
    </section>
  );
};

export default Layout;
