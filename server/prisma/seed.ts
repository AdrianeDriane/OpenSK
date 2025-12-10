import { PrismaClient } from "../prisma/generated/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { ENV } from "../src/config/env";

const pool = new PrismaPg({
  connectionString: ENV.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter: pool });

async function main() {
  // console.log("🌱 Seeding roles...");

  // await prisma.role.createMany({
  //   data: [{ name: "SK Official" }, { name: "Admin" }],
  //   skipDuplicates: true, // avoids errors if already seeded
  // });

  // console.log("✅ Roles seeded successfully!");

  console.log("🌱 Seeding default themes for barangays...");

  const defaultConfig = {
    colors: {
      primary: "#203972",
      secondary: "#1a2e5a",
      accent: "#fbbf24",
      background: "#f7f9ff",
    },
    typography: {
      headingFont: "Inter",
      bodyFont: "Inter",
    },
    buttons: {
      primary: {
        borderRadius: 12,
        paddingX: 20,
        paddingY: 12,
        variant: "solid",
      },
      secondary: {
        borderRadius: 12,
        paddingX: 18,
        paddingY: 11,
        variant: "outline",
      },
    },
  } as const;

  const barangays = await prisma.barangay.findMany({ select: { id: true } });
  for (const b of barangays) {
    await prisma.theme.upsert({
      where: { barangayId: b.id },
      update: { config: defaultConfig, updatedAt: new Date(), isDefault: true },
      create: {
        barangayId: b.id,
        config: defaultConfig,
        updatedAt: new Date(),
        isDefault: true, // Mark seebded themes as default
      },
    });
  }

  console.log(`✅ Seeded themes for ${barangays.length} barangays`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
