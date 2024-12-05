// models/UserProgress.js
import mongoose from "mongoose";

const userProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    resourceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resource",
      required: true,
    },
    status: {
      type: String,
      enum: ["Not Started", "In Progress", "Completed"],
      default: "Not Started",
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    sections: [
      {
        sectionId: String,
        completed: Boolean,
        timeSpent: Number,
        lastAccessed: Date,
      },
    ],
    timeSpent: {
      type: Number,
      default: 0,
    },
    lastAccessed: Date,
    completedAt: Date,
  },
  {
    timestamps: true,
  },
);

const UserProgress =
  mongoose.models.UserProgress ||
  mongoose.model("UserProgress", userProgressSchema);
export default UserProgress;
