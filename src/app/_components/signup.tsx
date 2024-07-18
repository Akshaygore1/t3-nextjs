"use client";
import React, { useState, type ChangeEvent, type FocusEvent } from "react";
import Link from "next/link";
import { InputField } from "./ui/input";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import toast from "react-hot-toast";

export const Signup = () => {
  const router = useRouter();
  const utils = api.useUtils();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const createUser = api.auth.userSignUp.useMutation({
    onSuccess: (data) => {
      console.log("User created successfully:", data);
      void utils.auth.invalidate();
      router.push(`/verify-otp/${formData.email}`);
    },
    onError: (error) => {
      void utils.auth.invalidate();
      console.error("Error creating user:", error.message);
      toast.error(error.message);
    },
  });

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let error = "";

    if (!value) {
      error = `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
    } else if (name === "email" && !validateEmail(value)) {
      error = "Invalid email format";
    } else if (name === "password" && !validatePassword(value)) {
      error =
        "Password must be at least 8 characters long, and include at least one uppercase letter, one lowercase letter, one digit, and one special character";
    }

    setErrors({ ...errors, [name]: error });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      name: !formData.name ? "Name is required" : "",
      email: !formData.email
        ? "Email is required"
        : !validateEmail(formData.email)
          ? "Invalid email format"
          : "",
      password: !formData.password
        ? "Password is required"
        : !validatePassword(formData.password)
          ? "Password must be at least 8 characters long, and include at least one uppercase letter, one lowercase letter, one digit, and one special character"
          : "",
    };

    setErrors(newErrors);

    const isValid = Object.values(newErrors).every((error) => error === "");

    if (isValid) {
      try {
        console.log("Form submitted:", formData);
        await createUser.mutateAsync({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });

        setTimeout(() => router.push(`/verify-otp/${formData.email}`), 2000);
      } catch (error) {
        console.error("---", error);
      }
    }
  };

  const hasErrors =
    Object.values(errors).some((error) => error !== "") ||
    !formData.name ||
    !formData.email ||
    !formData.password;

  return (
    <div className="flex max-w-[576px] flex-col items-center justify-center gap-4 rounded-lg border-2 border-[#C1C1C1] p-10">
      <div>
        <h1 className="p-8 text-3xl font-semibold">Create your account</h1>
      </div>
      <form
        className="flex w-full flex-col gap-8 text-base"
        onSubmit={handleSubmit}
      >
        <div>
          <InputField
            label="Name"
            name="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleInputChange}
            onBlur={handleBlur}
          />
          {errors.name && (
            <div className="text-sm text-red-500">{errors.name}</div>
          )}
        </div>
        <div>
          <InputField
            label="Email"
            name="email"
            placeholder="Enter your email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            onBlur={handleBlur}
          />
          {errors.email && (
            <div className="text-sm text-red-500">{errors.email}</div>
          )}
        </div>
        <div className="w-full">
          <InputField
            label="Password"
            name="password"
            placeholder="Enter your password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            onBlur={handleBlur}
            autoComplete="on"
          />
          {errors.password && (
            <div className="w-80 text-sm text-red-500">{errors.password}</div>
          )}
        </div>
        <button
          type="submit"
          className="rounded- w-full rounded-md bg-black py-3 text-base font-medium uppercase text-white disabled:cursor-not-allowed disabled:opacity-50"
          disabled={hasErrors}
        >
          Create account
        </button>
        <div className="text-center text-sm text-[#333333]">
          Have an Account?{" "}
          <Link href="/login" className="uppercase text-black">
            Login
          </Link>
        </div>
      </form>
    </div>
  );
};
