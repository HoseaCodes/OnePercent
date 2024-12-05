import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Resource title is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Resource category is required"],
      enum: ["Book", "Video", "Article", "Course", "Tool", "Other"],
    },
    type: {
      type: String,
      required: [true, "Resource type is required"],
      enum: ["Free", "Premium", "Subscription"],
    },
    url: {
      type: String,
      required: [true, "Resource URL is required"],
      trim: true,
    },
    thumbnail: {
      type: String,
      trim: true,
    },
    author: {
      type: String,
      trim: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    estimatedTime: {
      type: Number,
      default: 0,
      min: 0,
    },
    difficulty: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },
    ratings: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        rating: {
          type: Number,
          required: true,
          min: 1,
          max: 5,
        },
        review: {
          type: String,
          trim: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    averageRating: {
      type: Number,
      default: 0,
    },
    totalRatings: {
      type: Number,
      default: 0,
    },
    pathIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Path",
      },
    ],
    shareSettings: {
      type: {
        type: String,
        enum: ["public", "specific"],
        default: "public",
      },
      sharedWith: [
        {
          type: String, // Email addresses
        },
      ],
      isPublic: {
        type: Boolean,
        default: false,
      },
      sharedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      sharedAt: Date,
    },
  },
  {
    timestamps: true,
  },
);

// Calculate average rating
resourceSchema.methods.calculateAverageRating = function () {
  if (!this.ratings.length) return 0;

  const sum = this.ratings.reduce((acc, curr) => acc + curr.rating, 0);
  return Math.round((sum / this.ratings.length) * 10) / 10;
};

// Pre-save middleware to update average rating
resourceSchema.pre("save", function (next) {
  if (this.ratings.length > 0) {
    this.averageRating = this.calculateAverageRating();
    this.totalRatings = this.ratings.length;
  }
  next();
});

// Index for text search
resourceSchema.index({
  title: "text",
  description: "text",
  tags: "text",
});

const Resource =
  mongoose.models.Resource || mongoose.model("Resource", resourceSchema);
export default Resource;
