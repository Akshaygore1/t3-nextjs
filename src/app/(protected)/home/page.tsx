import React from "react";
import { Banner } from "../../_components/banner";
import { api } from "@/trpc/server";
import { CategoryList } from "@/app/_components/categorieslist";

const ITEMS_PER_PAGE = 6;

export default async function Home({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const currentPage = Number(searchParams.page) || 1;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
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
            <CategoryList data={data} currentPage={currentPage} />
          </div>
        </div>
      </div>
    </main>
  );
}
