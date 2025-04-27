import mongoose from "mongoose";

const ConnectionSchema = new mongoose.Schema(
  {
    email_user1: {
      type: String, // Email of the user who sent the connection request
      required: true,
    },
    email_user2: {
      type: String, // Email of the user who received the connection request
      required: true,
    },
    status: {
      type: String,
      enum: ["connected", "pending", "rejected"], // Possible statuses
      default: "pending",
    },
    connectedAt: {
      type: Date, // Timestamp for when the connection was established
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Check if the model already exists before defining it
const Connection = mongoose.models.Connection || mongoose.model("Connection", ConnectionSchema);

export default Connection;