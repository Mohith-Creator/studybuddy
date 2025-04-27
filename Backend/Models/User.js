import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, "Invalid email format"],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    about: {
      type: String,
      trim: true,
    },
    college: {
      type: String,
      trim: true,
    },
    branch: {
      type: String,
      trim: true,
    },
    year: {
      type: Number,
      min: 1,
      max: 5,
    },
    studyGoal: {
      type: String,
      trim: true,
    },
    learningPace: {
      type: String,
      enum: ["Fast", "Moderate", "Slow"],
    },
    knownSkills: {
      type: [String],
      default: [],
    },
    wantToLearn: {
      type: [String],
      default: [],
    },
    profilePhotoUrl: {
      type: String,
      trim: true,
    },
    profilePhotoPublicId: {
      type: String,
      trim: true,
    },
    coverPhotoUrl: {
      type: String,
      trim: true,
    },
    coverPhotoPublicId: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const User = mongoose.model("User", userSchema);

export default User;
