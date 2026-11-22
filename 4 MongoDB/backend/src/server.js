require("dotenv").config();

const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const studentRoutes = require("./routes/studentRoutes");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:5176" }));
app.use(express.json());
app.get("/", (req, res) => res.json({ message: "Student API is running" }));
app.use("/api/students", studentRoutes);

app.use((req, res) => res.status(404).json({ message: "Route not found" }));
app.use((error, req, res, next) => {
  if (error.code === 11000) {
    return res.status(409).json({ message: "A student with this email already exists" });
  }
  if (error.name === "ValidationError") {
    const message = Object.values(error.errors).map((item) => item.message).join(", ");
    return res.status(400).json({ message });
  }
  console.error(error);
  res.status(500).json({ message: "Internal server error" });
});

async function start() {
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI is required; copy .env.example to .env");
  await mongoose.connect(process.env.MONGO_URI);
  app.listen(port, () => console.log(`Student API listening on http://localhost:${port}`));
}

start().catch((error) => {
  console.error(`Could not start Student API: ${error.message}`);
  process.exit(1);
});
