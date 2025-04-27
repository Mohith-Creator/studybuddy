import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./Config/db.js";
import authRoutes from "./Routes/Auth.js";
import postRoutes from "./Routes/Post.js"; // Import Post routes
import userRoutes from "./Routes/User.js"; // Import User routes
import photoRoutes from "./Routes/photo.js"; // Import photo routes
import connectionRoutes from "./Routes/Connection.js"; // Import Connection routes
import Message from "./models/Message.js"; // Correct path
import Connection from "./Models/Connection.js"; // Import the Connection model
import { checkCloudinaryConnection } from "./Config/cloudinary.js"; // Import Cloudinary check function

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Frontend URL
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes); // Auth routes
app.use("/api/posts", postRoutes); // Post routes
app.use("/api/users", userRoutes); // User routes
app.use("/api/photo", photoRoutes); // Register photo routes
app.use("/api/connections", connectionRoutes); // Register connection routes

// Endpoint to check Cloudinary connection
app.get("/api/cloudinary/check", async (req, res) => {
  const isConnected = await checkCloudinaryConnection();
  if (isConnected) {
    res.status(200).json({ message: "Cloudinary is connected" });
  } else {
    res.status(500).json({ message: "Failed to connect to Cloudinary" });
  }
});

// API to fetch messages between two users
app.get("/api/messages", async (req, res) => {
  const { user1, user2 } = req.query;

  try {
    const messages = await Message.find({
      $or: [
        { sender: user1, receiver: user2 },
        { sender: user2, receiver: user1 },
      ],
    }).sort({ timestamp: 1 }); // Sort messages by timestamp
    res.status(200).json({ messages });
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
});

const connectedUsers = {}; // Store connected users

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Listen for user joining with their email
  socket.on("join", (email) => {
    connectedUsers[email] = socket.id; // Map email to socket.id
    console.log(`User with email ${email} connected with socket ID ${socket.id}`);
  });

  // Listen for "sendMessage" events
  socket.on("sendMessage", async ({ sender, receiver, message }) => {
    try {
      // Check if a connection exists between the sender and receiver
      const connection = await Connection.findOne({
        $or: [
          { email_user1: sender, email_user2: receiver, status: "connected" },
          { email_user1: receiver, email_user2: sender, status: "connected" },
        ],
      });

      if (!connection) {
        console.log("No connection exists between sender and receiver. Message not saved.");
        return; // Exit without saving the message
      }

      // Save the message to the database
      const newMessage = new Message({ sender, receiver, message });
      await newMessage.save();

      // Emit the message to the receiver if they are connected
      const receiverSocketId = connectedUsers[receiver];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receiveMessage", { sender, receiver, message });
        console.log(`Message sent to receiver: ${receiver}`);
      } else {
        console.log(`Receiver ${receiver} is not connected.`);
      }

      console.log("Message saved and emitted:", { sender, receiver, message });
    } catch (err) {
      console.error("Error saving message:", err);
    }
  });

  // Handle user disconnection
  socket.on("disconnect", () => {
    // Remove the user from the connectedUsers mapping
    for (const email in connectedUsers) {
      if (connectedUsers[email] === socket.id) {
        delete connectedUsers[email];
        console.log(`User with email ${email} disconnected.`);
        break;
      }
    }
  });
});

// Root endpoint
app.get("/", (req, res) => {
  res.send("Study Buddy Backend is Running...");
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
