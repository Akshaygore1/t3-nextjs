"use client";
import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const Banner = () => {
  const offers = [
    "Get 10% off on business sign up",
    "Get 20% off on shoes sign up",
    "Get 30% off on clothes sign up",
  ];

  const [currentOfferIndex, setCurrentOfferIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentOfferIndex((prevIndex) =>
      prevIndex === 0 ? offers.length - 1 : prevIndex - 1,
    );
  };

  const handleNext = () => {
    setCurrentOfferIndex((prevIndex) =>
      prevIndex === offers.length - 1 ? 0 : prevIndex + 1,
    );
  };

  return (
    <div className="flex w-full flex-row items-center justify-center gap-4 bg-[#F4F4F4] p-2 text-sm">
      <button onClick={handlePrevious}>
        <ChevronLeft />
      </button>
      <div>{offers[currentOfferIndex]}</div>
      <button onClick={handleNext}>
        <ChevronRight />
      </button>
    </div>
  );
};
