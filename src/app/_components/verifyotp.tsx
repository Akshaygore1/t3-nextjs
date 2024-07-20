"use client";
import React, { useState } from "react";
import Link from "next/link";
import { InputField } from "./ui/input";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import toast from "react-hot-toast";
import { obfuscateEmail } from "@/lib/otpUtils";

interface VerifyOtpProps {
  mail: string;
}

export const VerifyOtp: React.FC<VerifyOtpProps> = ({ mail }) => {
  const router = useRouter();
  const [otp, setOtp] = useState<string[]>(new Array(8).fill(""));
  const utils = api.useUtils();
  const [verificationStatus, setVerificationStatus] = useState<
    "idle" | "verifying" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const verifyOtp = api.auth.verifyOtp.useMutation({
    onMutate: () => {
      setVerificationStatus("verifying");
    },
    onSuccess: (data) => {
      console.log("OTP verified successfully:", data);
      void utils.auth.invalidate();
      setVerificationStatus("success");
      toast.success("OTP verified successfully!");
      setTimeout(() => router.push("/login"), 2000);
    },
    onError: (error) => {
      console.error("Error verifying OTP:", error);
      setVerificationStatus("error");
      setErrorMessage(error.message);
      toast.error(error.message);
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const { value } = e.target;
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value !== "" && index < 7) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) {
        (nextInput as HTMLInputElement).focus();
      }
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace" && index > 0 && otp[index] === "") {
      const previousInput = document.getElementById(`otp-input-${index - 1}`);
      if (previousInput) {
        (previousInput as HTMLInputElement).focus();
      }
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const otpValue = otp.join("");
    console.log("OTP submitted:", otpValue);
    verifyOtp.mutate({
      email: mail,
      otp: otpValue,
    });
  };

  return (
    <div className="flex max-w-[576px] flex-col items-center justify-center gap-4 rounded-lg border-2 border-[#C1C1C1] p-10">
      <h1 className="p-8 text-3xl font-semibold">Verify your OTP</h1>
      <div className="flex justify-center px-4 text-center">
        Enter the 8 digit code you have received on {obfuscateEmail(mail)}
      </div>
      <form
        className="flex w-full flex-col gap-8 text-base"
        onSubmit={handleSubmit}
      >
        <div className="flex justify-between gap-2">
          {otp.map((data, index) => (
            <InputField
              key={index}
              id={`otp-input-${index}`}
              type="text"
              maxLength={1}
              value={data}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="h-12 w-12 rounded-md border-2 border-gray-300 text-center text-xl font-semibold focus:border-black focus:outline-none"
              disabled={
                verificationStatus === "verifying" ||
                verificationStatus === "success"
              }
            />
          ))}
        </div>
        {verificationStatus === "error" && (
          <div className="text-center text-sm text-red-500">{errorMessage}</div>
        )}
        {verificationStatus === "success" && (
          <div className="text-center text-sm text-green-500">
            OTP verified successfully! Redirecting to login...
          </div>
        )}
        <button
          type="submit"
          className="w-full rounded-md bg-black py-3 text-base font-medium uppercase text-white disabled:cursor-not-allowed disabled:opacity-50"
          disabled={
            verificationStatus === "verifying" ||
            verificationStatus === "success" ||
            otp.some((digit) => digit === "")
          }
        >
          {verificationStatus === "verifying" ? "Verifying..." : "Verify OTP"}
        </button>
        <div className="text-center text-sm text-[#333333]">
          Don&apos;t have an Account?
          <Link href="/" className="px-2 uppercase text-black">
            Sign up
          </Link>
        </div>
      </form>
    </div>
  );
};
