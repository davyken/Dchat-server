import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  filename: String,
  path: String,
  type: String,
  uploadDate: { type: Date, default: Date.now }
});

export const File = mongoose.model('File', fileSchema);