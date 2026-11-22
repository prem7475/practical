require("dotenv").config();

const cors = require("cors");
const express = require("express");
const { rateLimit } = require("express-rate-limit");
const helmet = require("helmet");
const { randomUUID } = require("crypto");

const app = express();
const port = Number(process.env.PORT) || 5001;
const notes = [];
const allowedOrigin = process.env.CLIENT_ORIGIN || "http://localhost:5173";

app.disable("x-powered-by");
app.use(helmet());
app.use(cors({ origin: allowedOrigin }));
app.use(express.json({ limit: "10kb" }));
app.use(rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  limit: Number(process.env.RATE_LIMIT_MAX) || 100,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { message: "Too many requests. Please try again later." }
}));

function validateNote(body) {
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const content = typeof body.content === "string" ? body.content.trim() : "";
  if (!title || title.length > 100) return "Title is required and must be 100 characters or fewer";
  if (!content || content.length > 2000) return "Content is required and must be 2000 characters or fewer";
  return null;
}

app.get("/", (req, res) => res.json({ message: "Notes API is running", storage: "in-memory" }));
app.get("/home", (req, res) => {
  res.type("html").send(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Practical 5 - REST API</title>
    <style>
      body { margin: 0; font-family: Arial, sans-serif; background: #f4f7fb; color: #243247; }
      nav { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 8px; padding: 14px 20px; background: #dceaf7; color: #214f78; }
      main { max-width: 760px; margin: 24px auto; padding: 0 18px; }
      section { padding: 18px; border: 1px solid #cbd9e6; border-radius: 8px; background: white; }
      h1, h2 { color: #315f85; }
      a { display: inline-block; padding: 8px 12px; border-radius: 5px; background: #315f85; color: white; text-decoration: none; }
    </style>
  </head>
  <body>
    <nav><strong>Practical 5 - REST API</strong><span></span></nav>
    <main>
      <section>
        <h1>Notes API</h1>
        <p>This practical demonstrates a simple REST API for notes.</p>
        <h2>Notes endpoint</h2>
        <p>View the current notes collection:</p>
        <a href="/api/notes">Open notes</a>
      </section>
    </main>
  </body>
</html>`);
});
app.get("/api/notes", (req, res) => res.json(notes));
app.get("/api/notes/:id", (req, res) => {
  const note = notes.find((item) => item.id === req.params.id);
  if (!note) return res.status(404).json({ message: "Note not found" });
  res.json(note);
});

app.post("/api/notes", (req, res, next) => {
  try {
    const problem = validateNote(req.body || {});
    if (problem) return res.status(400).json({ message: problem });
    const note = {
      id: randomUUID(),
      title: req.body.title.trim(),
      content: req.body.content.trim(),
      createdAt: new Date().toISOString()
    };
    notes.unshift(note);
    res.status(201).json(note);
  } catch (error) {
    next(error);
  }
});

app.put("/api/notes/:id", (req, res, next) => {
  try {
    const problem = validateNote(req.body || {});
    if (problem) return res.status(400).json({ message: problem });
    const index = notes.findIndex((note) => note.id === req.params.id);
    if (index === -1) return res.status(404).json({ message: "Note not found" });
    notes[index] = {
      ...notes[index],
      title: req.body.title.trim(),
      content: req.body.content.trim(),
      updatedAt: new Date().toISOString()
    };
    res.json(notes[index]);
  } catch (error) {
    next(error);
  }
});

app.delete("/api/notes/:id", (req, res) => {
  const index = notes.findIndex((note) => note.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: "Note not found" });
  notes.splice(index, 1);
  res.json({ message: "Note deleted" });
});

app.use((req, res) => res.status(404).json({ message: "Route not found" }));
app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    return res.status(400).json({ message: "Request body must be valid JSON" });
  }
  console.error(error);
  res.status(500).json({ message: "Internal server error" });
});

app.listen(port, () => console.log(`Notes API listening on http://localhost:${port}`));
