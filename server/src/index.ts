import "./config/passport"; // important
import passport from "passport"; // the actual passport instance

import express from "express";
import cors from "cors";
import { ENV } from "./config/env";
import authRoutes from "./routes/auth.routes";
import barangayRoutes from "./routes/barangay.routes";
import verificationBypassRoutes from "./routes/verification-bypass.routes";
import verificationRequestRoutes from "./routes/verification-request.routes";
import themeRoutes from "./routes/theme.routes";
import announcementRoutes from "./routes/announcement.routes";
import skOfficialRoutes from "./routes/sk-official.routes";
import documentRoutes from "./routes/document.routes";
import inquiryRoutes from "./routes/inquiry.routes";
import adminRoutes from "./routes/admin.routes";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

app.use(passport.initialize());

const port = Number(ENV.PORT);

app.use("/api/auth", authRoutes);
app.use("/api/barangays", barangayRoutes);
app.use("/api/verify", verificationBypassRoutes);
app.use("/api/verification-requests", verificationRequestRoutes);
app.use("/api/themes", themeRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/sk-officials", skOfficialRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/inquiries", inquiryRoutes);
app.use("/api/admin", adminRoutes);

app.listen(port, () => {
  console.log(`🚀 OpenSK server running on http://localhost:${port}`);
});
