"use client";

import { api } from "@/trpc/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function CategoryList({
  data,
  currentPage,
}: {
  data: {
    categories: { id: number; name: string }[];
    totalPages: number;
  };
  currentPage: number;
}) {
  const userId = 1;
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);

  const {
    data: userCategories,
    isLoading: isLoadingUserCategories,
    isError: isErrorUserCategories,
    refetch: refetchUserCategories,
  } = api.category.getCategoriesByUser.useQuery({ userId });

  const handleCheckboxChange = (categoryId: number) => {
    setSelectedCategories((prevSelected) =>
      prevSelected.includes(categoryId)
        ? prevSelected.filter((id) => id !== categoryId)
        : [...prevSelected, categoryId],
    );
  };

  if (!data || data.categories.length === 0)
    return <p>No categories available.</p>;

  return (
    <div className="flex w-full flex-col justify-center">
      <div className="mt-4 flex w-full flex-col space-y-4 px-10">
        {data.categories.map((category) => (
          <label
            key={category.id}
            className="flex cursor-pointer items-center space-x-4"
          >
            <input
              type="checkbox"
              value={category.name}
              checked={
                userCategories &&
                userCategories?.length > 0 &&
                userCategories?.includes(category.id)
              }
              onChange={() => handleCheckboxChange(category.id)}
              className="form-checkbox custom-checkbox h-5 w-5 rounded-md border-2 border-black text-black accent-black checked:bg-black"
            />
            <span className="text-base">{category.name}</span>
          </label>
        ))}
      </div>
      <div className="mt-10 flex w-full items-center justify-between">
        <Link
          href={`/home/?page=${Math.max(currentPage - 1, 1)}`}
          className={`rounded bg-black px-4 py-2 text-white ${
            currentPage === 1 ? "pointer-events-none opacity-50" : ""
          }`}
        >
          <ChevronLeft />
        </Link>
        <span>
          Page {currentPage} of {data.totalPages}
        </span>
        <Link
          href={`/home/?page=${Math.min(currentPage + 1, data.totalPages)}`}
          className={`rounded bg-black px-4 py-2 text-white ${
            currentPage === data.totalPages
              ? "pointer-events-none opacity-50"
              : ""
          }`}
        >
          <ChevronRight />
        </Link>
      </div>
    </div>
  );
}
