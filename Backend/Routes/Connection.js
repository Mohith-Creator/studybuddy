import express from "express";
import Connection from "../Models/Connection.js";
import User from "../Models/User.js"; // Import the User model

const router = express.Router();

// Send a connection request
router.post("/request", async (req, res) => {
  const { email_user1, email_user2 } = req.body;
  console.log("Request body:", req.body); // Debugging log

  try {
    if (!email_user1 || !email_user2) {
      return res.status(400).json({ message: "Both email_user1 and email_user2 are required" });
    }

    // Check if a connection already exists
    const existingConnection = await Connection.findOne({
      $or: [
        { email_user1, email_user2 },
        { email_user1: email_user2, email_user2: email_user1 },
      ],
    });

    if (existingConnection) {
      return res.status(400).json({ message: "Connection already exists" });
    }

    // Create a new connection request
    const newConnection = new Connection({ email_user1, email_user2 });
    await newConnection.save();

    res.status(201).json({ message: "Connection request sent", connection: newConnection });
  } catch (err) {
    console.error("Error sending connection request:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Accept a connection request
router.post("/accept", async (req, res) => {
  const { email_user1, email_user2 } = req.body;

  try {
    const connection = await Connection.findOneAndUpdate(
      { email_user1, email_user2, status: "pending" },
      { status: "connected", connectedAt: new Date() },
      { new: true }
    );

    if (!connection) {
      return res.status(404).json({ message: "Connection request not found" });
    }

    res.status(200).json({ message: "Connection request accepted", connection });
  } catch (err) {
    console.error("Error accepting connection request:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Reject a connection request
router.post("/reject", async (req, res) => {
  const { email_user1, email_user2 } = req.body;

  try {
    // Find and delete the connection request
    const connection = await Connection.findOneAndDelete({
      email_user1,
      email_user2,
      status: "pending",
    });

    if (!connection) {
      return res.status(404).json({ message: "Connection request not found" });
    }

    res.status(200).json({ message: "Connection request rejected and removed", connection });
  } catch (err) {
    console.error("Error rejecting connection request:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Fetch all connections for a user
router.get("/:userEmail", async (req, res) => {
  const { userEmail } = req.params;

  try {
    const connections = await Connection.find({
      $or: [{ email_user1: userEmail }, { email_user2: userEmail }],
    });

    // Fetch user details for both email_user1 and email_user2
    const populatedConnections = await Promise.all(
      connections.map(async (connection) => {
        const user1 = await User.findOne({ email: connection.email_user1 }, "name profilePhotoUrl");
        const user2 = await User.findOne({ email: connection.email_user2 }, "name profilePhotoUrl");

        return {
          ...connection._doc,
          email_user1: {
            email: connection.email_user1,
            name: user1?.name || "Unknown User",
            profilePhotoUrl: user1?.profilePhotoUrl || "",
          },
          email_user2: {
            email: connection.email_user2,
            name: user2?.name || "Unknown User",
            profilePhotoUrl: user2?.profilePhotoUrl || "",
          },
        };
      })
    );

    res.status(200).json({ connections: populatedConnections });
  } catch (err) {
    console.error("Error fetching connections:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/requests/:userEmail", async (req, res) => {
  const { userEmail } = req.params;

  try {
    const requests = await Connection.find({
      email_user2: userEmail,
      status: "pending",
    });

    // Fetch user details for email_user1
    const populatedRequests = await Promise.all(
      requests.map(async (request) => {
        const user = await User.findOne({ email: request.email_user1 }, "name profilePhotoUrl");
        return {
          ...request._doc,
          email_user1: {
            email: request.email_user1,
            name: user?.name || "Unknown User",
            profilePhotoUrl: user?.profilePhotoUrl || "",
          },
        };
      })
    );

    res.status(200).json({ requests: populatedRequests });
  } catch (err) {
    console.error("Error fetching connection requests:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;