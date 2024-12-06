/* eslint-disable no-param-reassign */
/* eslint-disable no-shadow */
/* eslint-disable import/extensions */

import { ObjectId } from "mongodb";
import connectToDatabase from "@/lib/mongodb";
import Path from "@/models/Path";

export async function GET(req) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);

    // Query parameters
    const category = searchParams.get("category");
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const difficulty = searchParams.get("difficulty");
    const sortBy = searchParams.get("sortBy") || "updatedAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    const userId = "674f136660b6bee059d29d33";
    const query = { userId: new ObjectId(userId) };

    // Build query filters
    if (category) query.category = category;
    if (status) query.status = status;
    if (difficulty) query.difficulty = difficulty;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    // Build sort object
    const sortObj = {};
    sortObj[sortBy] = sortOrder === "asc" ? 1 : -1;

    // Execute query with pagination
    const paths = await Path.find(query)
      .sort(sortObj)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()
      .exec();

    const total = await Path.countDocuments(query);

    // Format response data
    const formattedPaths = paths.map((path) => ({
      ...path,
      stats: {
        progress: path.progress || 0,
        milestones: {
          total: path.milestones?.length || 0,
          completed: path.milestones?.filter((m) => m.completed)?.length || 0,
        },
        resources: {
          total: path.resources?.length || 0,
          completed:
            path.resources?.filter((r) => r.status === "Completed")?.length ||
            0,
        },
        time: {
          estimated: path.estimatedTime || 0,
          spent: path.timeSpent || 0,
          remaining: Math.max(
            0,
            (path.estimatedTime || 0) - (path.timeSpent || 0),
          ),
        },
      },
      activityStats: {
        lastModified: path.updatedAt,
        recentActivity: path.weeklyPlan?.lastUpdated,
        nextMilestone: path.milestones
          ?.filter((m) => !m.completed)
          ?.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))[0],
      },
    }));

    // Get category counts for filters
    const categoryCount = await Path.aggregate([
      { $match: { userId: new ObjectId(userId) } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);

    // Get status distribution
    const statusCount = await Path.aggregate([
      { $match: { userId: new ObjectId(userId) } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    return new Response(
      JSON.stringify({
        paths: formattedPaths,
        pagination: {
          total,
          pages: Math.ceil(total / limit),
          page,
          limit,
        },
        filters: {
          categories: categoryCount,
          statuses: statusCount,
        },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Failed to fetch paths:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to fetch paths",
        details: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}

export async function POST(req) {
  try {
    const data = await req.json();
    await connectToDatabase();

    // Create initial year structure
    const currentYear = new Date().getFullYear();
    const initialYear = {
      title: currentYear.toString(),
      quarters: Array.from({ length: 4 }, (_, i) => ({
        title: `Q${i + 1}`,
        months: Array.from({ length: 3 }, (_, j) => {
          const monthIndex = i * 3 + j;
          return {
            title: new Date(currentYear, monthIndex).toLocaleString("default", {
              month: "long",
            }),
            milestones: [],
            weeks: [],
          };
        }),
      })),
    };

    // Default habits configuration
    const defaultHabits = [
      {
        title: "Code",
        minimumRequirement: "2 hours",
        frequency: "daily",
        type: "technical",
      },
      {
        title: "Read",
        minimumRequirement: "1 paper",
        frequency: "daily",
        type: "learning",
      },
      {
        title: "Document",
        minimumRequirement: "1 entry",
        frequency: "daily",
        type: "documentation",
      },
      {
        title: "Network",
        minimumRequirement: "1 interaction",
        frequency: "weekly",
        type: "social",
      },
      {
        title: "Health",
        minimumRequirement: "30 minutes exercise",
        frequency: "daily",
        type: "wellness",
      },
      {
        title: "Review Goals",
        minimumRequirement: "Daily review",
        frequency: "daily",
        type: "planning",
      },
      {
        title: "Track Progress",
        minimumRequirement: "Daily update",
        frequency: "daily",
        type: "monitoring",
      },
      {
        title: "Portfolio",
        minimumRequirement: "1 contribution",
        frequency: "weekly",
        type: "development",
      },
      {
        title: "Community",
        minimumRequirement: "1 contribution",
        frequency: "weekly",
        type: "engagement",
      },
      {
        title: "Problem Solving",
        minimumRequirement: "1 problem",
        frequency: "daily",
        type: "skills",
      },
    ];

    // Distribute milestones across months
    const distributeMilestones = (milestones, months) => {
      if (!milestones?.length) return;

      const milestonesPerMonth = Math.ceil(milestones.length / months.length);
      let milestoneIndex = 0;

      months.forEach((month) => {
        const monthMilestones = milestones
          .slice(milestoneIndex, milestoneIndex + milestonesPerMonth)
          .map((m, index) => ({
            ...m,
            order: index,
            completed: false,
            createdAt: new Date(),
            status: "pending",
          }));

        month.milestones = monthMilestones;
        milestoneIndex += milestonesPerMonth;
      });
    };

    // Distribute provided milestones
    if (data.milestones?.length) {
      const firstQuarterMonths = initialYear.quarters[0].months;
      distributeMilestones(data.milestones, firstQuarterMonths);
    }

    // Create new path
    const path = new Path({
      userId: "674f136660b6bee059d29d33",
      title: data.title,
      description: data.description,
      category: data.category,
      estimatedTime: data.estimatedTime || 0,
      difficulty: data.difficulty || "Beginner",
      status: "Not Started",
      progress: 0,
      progressTrend: 0,
      timeSpent: 0,
      years: [initialYear],
      milestones: [],
      defaultHabits,
      kpis: [],
      resources: [],
      tags: data.tags || [],
      targetDate: data.targetDate,
      createdAt: new Date(),
      updatedAt: new Date(),
      weeklyPlan: {
        week: new Date(),
        tasks: [],
        lastUpdated: new Date(),
      },
    });

    await path.save();

    return new Response(
      JSON.stringify({
        message: "Path created successfully",
        path,
      }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Failed to create path:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to create path",
        details: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
