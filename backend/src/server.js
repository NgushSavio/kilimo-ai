import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import "dotenv/config";

import pricesRouter from "./routes/prices.js";
import marketsRouter from "./routes/markets.js";
import aiRouter from "./routes/ai.js";
import adminRouter from "./routes/admin.js";
import geocodeRouter from "./routes/geocode.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  })
);
app.use(express.json());

// Generous but present — protects the Claude API budget and Nominatim's
// fair-use policy from accidental hammering during the demo.
app.use(
  rateLimit({
    windowMs: 60_000,
    limit: 60,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.get("/api/health", (_req, res) => res.json({ status: "ok", service: "kilimo-ai-backend" }));

app.use("/api/prices", pricesRouter);
app.use("/api/markets", marketsRouter);
app.use("/api/ai", aiRouter);
app.use("/api/admin", adminRouter);
app.use("/api/geocode", geocodeRouter);

app.use((req, res) => {
  res.status(404).json({ error: `No route for ${req.method} ${req.path}` });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error("[unhandled error]", err);
  res.status(500).json({ error: "Something went wrong on our end." });
});

app.listen(PORT, () => {
  console.log(`Kilimo AI backend running on http://localhost:${PORT}`);
});
