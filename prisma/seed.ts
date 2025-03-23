import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
  console.log("... Deleting Existing Data ...");
  await prisma.bookmarkCategory.deleteMany({});
  await prisma.bookmarkUrl.deleteMany({});
  await prisma.bookmark.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.user.deleteMany({});

  console.log("... Creating Users ...");
  await prisma.user.createMany({
    data: Array.from({ length: 10 }, () => ({
      name: faker.internet.username(),
      email: faker.internet.email(),
      passwordHash: faker.internet.password(),
    })),
    skipDuplicates: true,
  });

  console.log("... Creating Categories ...");
  const categoryNames = [
    { name: "Programming", slug: "programming" },
    { name: "Math", slug: "math" },
    { name: "Tech", slug: "tech" },
    { name: "Gaming", slug: "gaming" },
    { name: "Science", slug: "science" },
    { name: "AI", slug: "ai" },
    { name: "Books", slug: "books" },
  ];

  await prisma.category.createMany({
    data: categoryNames.map((c) => ({
      ...c,
      description: faker.lorem.sentence(),
    })),
    skipDuplicates: true,
  });

  // Fetch inserted categories and users
  const categoryRecords = await prisma.category.findMany();
  const categoryMap = Object.fromEntries(categoryRecords.map((c) => [c.slug, c.id]));
  const userRecords = await prisma.user.findMany();

  console.log("... Creating Bookmarks ...");
  for (let i = 0; i < 50; i++) {
    const user = faker.helpers.arrayElement(userRecords);
    const numCategories = faker.number.int({ min: 1, max: 3 });
    const selectedCategories = faker.helpers.arrayElements(Object.values(categoryMap), numCategories);

    await prisma.bookmark.create({
      data: {
        name: faker.lorem.words(3),
        description: faker.lorem.sentence(),
        user: { connect: { id: user.id } },
        categories: {
          create: selectedCategories.map((categoryId) => ({
            category: { connect: { id: categoryId } },
          })),
        },
        urls: {
          create: Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () => ({
            url: faker.internet.url(),
						title: faker.word.noun()
          })),
        },
      },
    });
  }

  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

