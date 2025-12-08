import express from "express";
import cors from "cors";
import { ENV } from "./config/env";
import passport from "./config/passport";
import authRoutes from "./routes/auth.routes";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

app.use(passport.initialize());

const port = Number(ENV.PORT);

app.use("/api/auth", authRoutes);

app.listen(port, () => {
  console.log(`🚀 OpenSK server running on http://localhost:${port}`);
});
