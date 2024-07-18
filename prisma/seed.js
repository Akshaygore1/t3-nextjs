import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function seedUserCategories() {
  const user1 = await prisma.user.findUnique({ where: { username: "user1" } });
  const user2 = await prisma.user.findUnique({ where: { username: "user2" } });

  if (user1 && user2) {
    const categories = await prisma.category.findMany();

    const userCategories = [
      ...categories
        .slice(0, 10)
        .map((category) => ({ userId: user1.id, categoryId: category.id })),
      ...categories
        .slice(10, 20)
        .map((category) => ({ userId: user2.id, categoryId: category.id })),
    ];

    await prisma.userCategory.createMany({
      data: userCategories,
    });

    console.log("User categories seeded successfully");
  }
}

seedUserCategories()
  .then(() => {
    console.log("Seeding complete");
  })
  .catch((error) => {
    console.error("Error seeding:", error);
  });
