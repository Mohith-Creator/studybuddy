import express from "express";
import multer from "multer";
import cloudinary from "../Config/cloudinary.js";
import User from "../Models/User.js";

const router = express.Router();

// Multer setup for file uploads
const storage = multer.diskStorage({});
const upload = multer({ storage });

// Upload profile photo
router.post("/upload-profile-photo", upload.single("image"), async (req, res) => {
  try {
    const { email } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "profile_photos",
    });

    const user = await User.findOneAndUpdate(
      { email },
      {
        profilePhotoUrl: result.secure_url,
        profilePhotoPublicId: result.public_id,
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile photo uploaded successfully",
      profilePhotoUrl: result.secure_url,
    });
  } catch (err) {
    console.error("Error uploading profile photo:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Upload cover photo
router.post("/upload-cover-photo", upload.single("image"), async (req, res) => {
  try {
    const { email } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "cover_photos",
    });

    const user = await User.findOneAndUpdate(
      { email },
      {
        coverPhotoUrl: result.secure_url,
        coverPhotoPublicId: result.public_id,
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Cover photo uploaded successfully",
      coverPhotoUrl: result.secure_url,
    });
  } catch (err) {
    console.error("Error uploading cover photo:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;