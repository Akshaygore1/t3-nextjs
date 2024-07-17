import React from "react";
import { Banner } from "../_components/banner";
import { Login } from "../_components/login";

export default async function LoginPage() {
  return (
    <main className="flex h-full flex-col items-center justify-center text-black">
      <Banner />
      <div className="p-10">
        <Login />
      </div>
    </main>
  );
}
