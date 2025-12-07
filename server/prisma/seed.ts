import { PrismaClient } from "../prisma/generated/client";
import { PrismaPg } from "@prisma/adapter-pg";

const pool = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter: pool });

async function main() {
  console.log("🌱 Seeding roles...");

  await prisma.role.createMany({
    data: [{ name: "SK Official" }, { name: "Admin" }],
    skipDuplicates: true, // avoids errors if already seeded
  });

  console.log("✅ Roles seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
