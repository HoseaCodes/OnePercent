/* eslint-disable no-plusplus */
// models/Path.js
import mongoose from "mongoose";

const milestoneSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Milestone title is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    completedAt: {
      type: Date,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    dueDate: {
      type: Date,
    },
    order: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Task title is required"],
    trim: true,
  },
  day: String,
  task: String,
  description: String,
  duration: String,
  complete: {
    type: Boolean,
    default: false,
  },
  date: Date,
  priority: Number,
  milestoneId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Milestone",
  },
});

const dailyHabitSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Habit title is required"],
    trim: true,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  streak: {
    type: Number,
    default: 0,
  },
  lastCompleted: Date,
  minimumRequirement: String,
});

const dayPlanSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  date: {
    type: Date,
    required: true,
  },
  tasks: [taskSchema],
  habits: [dailyHabitSchema],
});

const weeklyPlanSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  startDate: Date,
  endDate: Date,
  milestones: [milestoneSchema],
  days: [dayPlanSchema],
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
  week: Date,
  tasks: [taskSchema],
});

const monthlySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  milestones: [milestoneSchema],
  weeks: [weeklyPlanSchema],
});

const quarterlySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  months: [monthlySchema],
});

const yearlySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  quarters: [quarterlySchema],
});

const kpiSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "KPI title is required"],
    trim: true,
  },
  description: String,
  target: Number,
  current: Number,
  unit: String,
  period: {
    type: String,
    enum: ["daily", "weekly", "monthly", "quarterly", "yearly"],
  },
});

const pathSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Path title is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    difficulty: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },
    estimatedTime: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: [true, "Path category is required"],
      enum: [
        "Technical",
        "Creative",
        "Physical",
        "Language",
        "Business",
        "Other",
      ],
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    progressTrend: {
      type: Number,
      default: 0,
    },
    timeSpent: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ["Not Started", "In Progress", "Completed", "On Hold"],
      default: "Not Started",
    },
    targetDate: {
      type: Date,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    resources: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Resource",
        },
      ],
      default: [], // Default should be at this level
    },
    years: [yearlySchema],
    defaultHabits: {
      type: [dailyHabitSchema],
      default: [],
    },
    kpis: [kpiSchema],
    milestones: [milestoneSchema],
  },
  {
    timestamps: true,
  },
);

// Calculate progress based on completed milestones across all time periods
pathSchema.methods.calculateProgress = function () {
  let totalMilestones = 0;
  let completedMilestones = 0;

  const countMilestones = (milestones) => {
    milestones.forEach((milestone) => {
      totalMilestones++;
      if (milestone.completed) completedMilestones++;
    });
  };

  this.years.forEach((year) => {
    year.quarters.forEach((quarter) => {
      quarter.months.forEach((month) => {
        countMilestones(month.milestones);
        month.weeks.forEach((week) => {
          countMilestones(week.milestones);
        });
      });
    });
  });

  return totalMilestones === 0
    ? 0
    : Math.round((completedMilestones / totalMilestones) * 100);
};

// Update status based on progress
pathSchema.methods.updateStatus = function () {
  if (this.progress === 0) this.status = "Not Started";
  else if (this.progress === 100) this.status = "Completed";
  else this.status = "In Progress";
};

// Pre-save middleware to update progress and status
pathSchema.pre("save", function (next) {
  this.progress = this.calculateProgress();
  this.updateStatus();
  next();
});

const Path = mongoose.models.Path || mongoose.model("Path", pathSchema);
export default Path;
