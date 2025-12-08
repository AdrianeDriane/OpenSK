import { PrismaClient } from "../../prisma/generated/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { ENV } from "../config/env";

const pool = new PrismaPg({
  connectionString: ENV.DATABASE_URL!,
});

export const prisma = new PrismaClient({ adapter: pool });
