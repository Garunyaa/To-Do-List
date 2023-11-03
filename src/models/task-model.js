import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  deadline: { type: Date, required: true },
  comments: { type: String },
  status: { type: String, enum: ["to-do", "in-progress", "completed"] },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  created_at: { type: Date, default: Date.now() },
});

export const Task = mongoose.model("Task", taskSchema);
