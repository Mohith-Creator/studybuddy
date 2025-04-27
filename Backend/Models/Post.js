import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
  email: { type: String, required: true },
  postType: { type: String, required: true },
  content: { type: String, required: true },
  skills: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Post", PostSchema);