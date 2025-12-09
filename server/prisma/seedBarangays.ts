import { PrismaClient } from "../prisma/generated/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { ENV } from "../src/config/env";

const pool = new PrismaPg({
  connectionString: ENV.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter: pool });

const barangays = [
  "Adlaon",
  "Agus",
  "Apas",
  "Babag",
  "Banilad",
  "Basak San Nicolas",
  "Basak Pardo",
  "Bonbon",
  "Budlaan",
  "Buhisan",
  "Bulacao",
  "Buot",
  "Busay",
  "Calamba",
  "Cambinocot",
  "Capitol Site",
  "Carreta",
  "Cogon Pardo",
  "Day-as",
  "Duljo-Fatima",
  "Ermita",
  "Guba",
  "Guadalupe",
  "Hipodromo",
  "Inayawan",
  "Kalunasan",
  "Kamagayan",
  "Kamputhaw",
  "Kasambagan",
  "Kinasang-an Pardo",
  "Labangon",
  "Lahug",
  "Lusaran",
  "Lorega-San Miguel",
  "Luz",
  "Mabolo",
  "Malubog",
  "Mambaling",
  "Pahina Central",
  "Pahina San Nicolas",
  "Pardo",
  "Pari-an",
  "Pasil",
  "Pit-os",
  "Pulangbato",
  "Pung-ol Sibugay",
  "Quiot Pardo",
  "Sambag I",
  "Sambag II",
  "San Antonio",
  "San Jose",
  "San Nicolas Proper",
  "San Roque",
  "Santa Cruz",
  "Santo Niño",
  "Sawang Calero",
  "Sinsin",
  "Sirao",
  "Suba",
  "Sudlon I",
  "Sudlon II",
  "Sum-ag",
  "T. Padilla",
  "Tabunan",
  "Tagbao",
  "Talamban",
  "Taptap",
  "Tejero",
  "Tinago",
  "Tisa",
  "Toong",
  "Zapatera",
];

async function seed() {
  for (const name of barangays) {
    await prisma.barangay.create({
      data: {
        name,
        slug: name.toLowerCase().replace(/ /g, "-"),
      },
    });
  }
}

seed().finally(() => prisma.$disconnect());
