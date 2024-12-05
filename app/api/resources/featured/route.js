/* eslint-disable import/prefer-default-export */
/* eslint-disable import/extensions */

import Resource from "@/models/Resource";
import connectToDatabase from "@/lib/mongodb";

export async function GET() {
  try {
    await connectToDatabase();

    const featuredResources = await Resource.aggregate([
      {
        $match: {
          averageRating: { $gte: 4.0 }, // High rated resources
          totalRatings: { $gte: 5 }, // With minimum number of ratings
        },
      },
      {
        $addFields: {
          score: {
            $add: [
              "$averageRating",
              { $multiply: [{ $divide: ["$totalRatings", 100] }, 2] }, // Weight for number of ratings
              { $cond: [{ $eq: ["$type", "Free"] }, 1, 0] }, // Bonus for free resources
            ],
          },
        },
      },
      { $sort: { score: -1 } },
      { $limit: 3 },
      {
        $project: {
          _id: 1,
          title: 1,
          description: 1,
          category: 1,
          type: 1,
          estimatedTime: 1,
          averageRating: 1,
          totalRatings: 1,
          score: 1,
        },
      },
    ]);

    return new Response(JSON.stringify(featuredResources), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching featured resources:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch featured resources" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
