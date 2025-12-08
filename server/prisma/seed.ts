import { PrismaClient } from "../prisma/generated/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { ENV } from "../src/config/env";

const pool = new PrismaPg({
  connectionString: ENV.DATABASE_URL!,
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
