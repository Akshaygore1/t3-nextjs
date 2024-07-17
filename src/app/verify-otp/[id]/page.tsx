import React from "react";
import { Banner } from "../../_components/banner";
import { VerifyOtp } from "../../_components/verifyotp";

export default async function VetifyOtpPage({
  params,
}: {
  params: { id: string };
}) {
  const mail: string = decodeURIComponent(params.id);
  return (
    <main className="flex h-full flex-col items-center justify-center text-black">
      <Banner />
      <div className="p-10">
        <VerifyOtp mail={mail} />
      </div>
    </main>
  );
}
