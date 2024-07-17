import React from "react";
import { Banner } from "../../_components/banner";

export default function Home() {
  return (
    <main className="flex h-full flex-col items-center justify-center text-black">
      <Banner />
      <div className="p-10">{/* <VerifyOtp mail={mail} /> */}</div>
    </main>
  );
}
