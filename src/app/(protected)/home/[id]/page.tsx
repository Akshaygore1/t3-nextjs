import React from "react";
import { Banner } from "../../../_components/banner";
import { api } from "@/trpc/server";
import { CategoryList } from "@/app/_components/categorieslist";
import { isAuthenticated } from "@/lib/utils";
import Link from "next/link";

export default async function Home({ params }: { params: { id?: string } }) {
  const auth = await isAuthenticated();
  const ITEMS_PER_PAGE = 6;

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

  const currentPage = Number(params.id) || 1;

  const data = await api.category.getPaginatedCategories({
    page: currentPage,
    itemsPerPage: ITEMS_PER_PAGE,
  });

  return (
    <main className="flex h-full flex-col items-center justify-center text-black">
      <Banner />
      <div className="p-10">
        <div className="flex max-w-[576px] flex-col items-center justify-center gap-4 rounded-lg border-2 border-[#C1C1C1] p-10">
          <div className="flex w-full flex-col justify-center">
            <h1 className="p-8 text-center text-3xl font-semibold">
              Please mark your interests!
            </h1>
            <p className="mb-6 text-center">We will keep you notified.</p>
            <CategoryList
              data={data}
              currentPage={currentPage}
              userId={auth.userId}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
