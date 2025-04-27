import express from "express";
import User from "../Models/User.js";

const router = express.Router();

// Fetch all users except the logged-in user
router.get("/", async (req, res) => {
  const loggedInUserEmail = req.query.email; // Get the logged-in user's email from the query parameter

  try {
    const users = await User.find(loggedInUserEmail ? { email: { $ne: loggedInUserEmail } } : {}); // Exclude the logged-in user
    res.status(200).json({ users });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Fetch user by email
router.get("/:email", async (req, res) => {
  const { email } = req.params; // Extract email from the route parameter

  try {
    const user = await User.findOne({ email }); // Find the user by email
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update user details
router.put("/update", async (req, res) => {
  const { email, ...updateData } = req.body;
  try {
    if (!email) {
      return res.status(400).json({ message: "Email is required for updating profile" });
    }

    const user = await User.findOneAndUpdate({ email }, updateData, { new: true });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;