require("dotenv").config();

const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();
const port = Number(process.env.PORT) || 5002;

app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:5177" }));
app.use(express.json({ limit: "10kb" }));
app.get("/", (req, res) => res.json({ message: "Role authentication API is running" }));
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use((req, res) => res.status(404).json({ message: "Route not found" }));
app.use((error, req, res, next) => {
  if (error.code === 11000) return res.status(409).json({ message: "An account with this email already exists" });
  if (error.name === "ValidationError") {
    const message = Object.values(error.errors).map((item) => item.message).join(", ");
    return res.status(400).json({ message });
  }
  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    return res.status(400).json({ message: "Request body must be valid JSON" });
  }
  console.error(error);
  res.status(500).json({ message: "Internal server error" });
});

async function start() {
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI is required; copy .env.example to .env");
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    throw new Error("JWT_SECRET must be set to at least 32 characters");
  }
  await mongoose.connect(process.env.MONGO_URI);
  app.listen(port, () => console.log(`Auth API listening on http://localhost:${port}`));
}

start().catch((error) => {
  console.error(`Could not start Auth API: ${error.message}`);
  process.exit(1);
});
