import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  otp: { type: String },
  kyc_document: [{ data: Buffer, content_type: String }],
  kyc_verified: { type: Boolean, default: false },
  status: { type: Number, default: 1 },
  is_blocked: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now() },
});

export const User = mongoose.model("User", userSchema);
