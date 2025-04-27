import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: { type: String, required: true }, // Sender's email
    receiver: { type: String, required: true }, // Receiver's email
    message: { type: String, required: true }, // Message content
    timestamp: { type: Date, default: Date.now }, // Timestamp of the message
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);
export default Message;