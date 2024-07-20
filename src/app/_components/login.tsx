"use client";
import React, { useState } from "react";
import Link from "next/link";
import { InputField } from "./ui/input";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import toast from "react-hot-toast";

export const Login = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const loginMutation = api.auth.login.useMutation({
    onSuccess: (data) => {
      toast.success("Login successful!");
      localStorage.setItem("authToken", data.token);
      router.refresh();
      setInterval(() => router.push("/home/1"), 1000);
    },
    onError: (error) => {
      console.error("Login error:", error);
      toast.error(error.message);
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let error = "";

    if (!value) {
      error = `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
    } else if (name === "email" && !validateEmail(value)) {
      error = "Invalid email format";
    } else if (name === "password" && value.length < 8) {
      error = "Password must be at least 8 characters long";
    }

    setErrors({ ...errors, [name]: error });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = {
      email: !formData.email
        ? "Email is required"
        : !validateEmail(formData.email)
          ? "Invalid email format"
          : "",
      password: !formData.password
        ? "Password is required"
        : formData.password.length < 8
          ? "Password must be at least 8 characters long"
          : "",
    };
    setErrors(newErrors);

    if (Object.values(newErrors).every((error) => error === "")) {
      console.log("Form submitted:", formData);
      loginMutation.mutate({
        email: formData.email,
        password: formData.password,
      });
    }
  };

  const hasErrors =
    Object.values(errors).some((error) => error !== "") ||
    !formData.email ||
    !formData.password;

  return (
    <div className="flex max-w-[576px] flex-col items-center justify-center gap-4 rounded-lg border-2 border-[#C1C1C1] p-10">
      <div>
        <h1 className="p-8 text-3xl font-semibold">Login to your account</h1>
      </div>
      <form
        className="flex w-full flex-col gap-8 text-base"
        onSubmit={handleSubmit}
      >
        <div>
          <InputField
            type="email"
            placeholder="Enter your email"
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            onBlur={handleBlur}
          />
          {errors.email && (
            <div className="text-sm text-red-500">{errors.email}</div>
          )}
        </div>
        <div className="relative">
          <InputField
            type="password"
            placeholder="Enter your password"
            label="Password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            onBlur={handleBlur}
          />
          {errors.password && (
            <div className="text-sm text-red-500">{errors.password}</div>
          )}
        </div>
        <button
          type="submit"
          className="w-full rounded-md bg-black py-3 text-base font-medium uppercase text-white disabled:cursor-not-allowed disabled:opacity-50"
          disabled={hasErrors}
        >
          Login
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
