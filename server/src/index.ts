import express, { Request, Response } from "express";
import cors from "cors";
import { ENV } from "./config/env";
import { PrismaClient } from "../prisma/generated/client";
import { PrismaPg } from "@prisma/adapter-pg";

const pool = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter: pool });

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Test route
app.get("/api/health", (req: Request, res: Response) => {
  res.json({
    status: "ok",
    message: "OpenSK backend is running",
    timestamp: new Date().toISOString(),
  });
});

// Root route (optional)
app.get("/", (req: Request, res: Response) => {
  res.send("OpenSK backend (Express + TypeScript) is up.");
});

const port = Number(ENV.PORT);

app.listen(port, () => {
  console.log(`🚀 OpenSK server running on http://localhost:${port}`);
});
