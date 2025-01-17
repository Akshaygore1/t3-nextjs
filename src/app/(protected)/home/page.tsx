import React from "react";
import { api } from "@/trpc/server";
import { CategoryList } from "@/app/_components/categorieslist";
import { isAuthenticated } from "@/lib/utils";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Banner } from "@/app/_components/banner";

export default async function Home({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const auth = await isAuthenticated();
  const ITEMS_PER_PAGE = 6;

  console.log("AUTH", auth);
  if (!auth) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-48 text-black">
        <h1 className="py-8 text-3xl font-semibold">
          Please login to continue
        </h1>
        <Link href="/login">Sign in</Link>
      </div>
    );
  }

  const currentPage = Number(searchParams.page) || 1;

  const data = await api.category.getPaginatedCategories({
    page: currentPage,
    itemsPerPage: ITEMS_PER_PAGE,
  });

  return (
    <main className="flex h-full flex-col items-center justify-center text-black">
      <Banner />
      <div className="flex h-full flex-col items-center justify-center p-48 text-black">
        <h1 className="py-8 text-3xl font-semibold">
          Please login to continue
        </h1>
        <Link href="/login">Sign in</Link>
      </div>
    </main>
  );
}
