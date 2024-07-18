import { z } from "zod";

// import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const categoriesRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  getAllCategories: publicProcedure.query(({ ctx }) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    return ctx.db.category.findMany();
  }),
  getPaginatedCategories: publicProcedure
    .input(
      z.object({
        page: z.number().int().positive(),
        itemsPerPage: z.number().int().positive(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { page, itemsPerPage } = input;
      const skip = (page - 1) * itemsPerPage;

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const [categories, totalCount] = await Promise.all([
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        ctx.db.category.findMany({
          take: itemsPerPage,
          skip: skip,
          orderBy: { name: "asc" },
        }),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        ctx.db.category.count(),
      ]);

      return {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        categories,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        totalCount,
        totalPages: Math.ceil(totalCount / itemsPerPage),
      };
    }),

  getCategoriesByUser: publicProcedure
    .input(z.object({ userId: z.number().int().positive() }))
    .query(async ({ ctx, input }) => {
      const { userId } = input;

      const categories = await ctx.db.userCategory.findMany({
        where: { userId },
        select: { categoryId: true },
      });
      console.log("categories", categories);
      return categories.map((category) => category.categoryId);
    }),
});
