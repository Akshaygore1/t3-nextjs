"use client";
import React, { type FC, useState } from "react";
import { type InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const InputField: FC<InputFieldProps> = ({
  label,
  type,
  placeholder,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="w-full">
      {label && <div className="text-base font-normal">{label}</div>}
      <div className="relative">
        <input
          type={showPassword ? "text" : type}
          placeholder={placeholder}
          className="w-full rounded-lg border-2 border-[#C1C1C1] px-4 py-2 focus:outline-none active:outline-none"
          {...props}
        />
        {type === "password" && (
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 transform focus:outline-none"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};
