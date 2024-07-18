import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function seedCategories() {
  for (let i = 0; i < 100; i++) {
    const category = await prisma.category.create({
      data: {
        name: faker.commerce.productName(),
      },
    });
    console.log("Category created:", category);
  }
}

seedCategories()
  .then(() => {
    console.log("Seeding complete");
  })
  .catch((error) => {
    console.error("Error seeding:", error);
  });
