require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    priority: { type: String, required: true, enum: ["Low", "Medium", "High"] },
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);

app.get("/", (req, res) => res.send("Task Planner API running"));

app.post("/api/tasks", async (req, res) => {
  const { title, priority } = req.body;

  if (typeof title !== "string" || title.trim() === "") {
    return res.status(400).json({ error: "Title cannot be empty" });
  }

  if (!["Low", "Medium", "High"].includes(priority)) {
    return res.status(400).json({ error: "Priority must be Low, Medium, or High" });
  }

  try {
    const task = await Task.create({ title: title.trim(), priority });
    return res.status(201).json(task);
  } catch (err) {
    return res.status(500).json({ error: "Failed to create task" });
  }
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server on port ${PORT}`));
  })
  .catch((err) => console.error("MongoDB connection error:", err.message));
