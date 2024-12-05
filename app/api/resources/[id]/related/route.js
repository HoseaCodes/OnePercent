/* eslint-disable import/prefer-default-export */
/* eslint-disable import/extensions */
import { ObjectId } from "mongodb";
import Resource from "@/models/Resource";
import connectToDatabase from "@/lib/mongodb";

export async function GET(req) {
  try {
    await connectToDatabase();

    const url = new URL(req.url);
    const category = url.searchParams.get("category");
    const tags = url.searchParams.get("tags")?.split(",") || [];
    const difficulty = url.searchParams.get("difficulty");
    const excludeId = url.searchParams.get("exclude");
    const limit = parseInt(url.searchParams.get("limit") || "5", 10);

    // Convert excludeId to ObjectId
    const excludeObjectId = new ObjectId(excludeId);

    // Build query
    const query = {
      _id: { $ne: excludeObjectId },
      $or: [{ category }, { tags: { $in: tags } }, { difficulty }],
    };

    // Find related resources
    const relatedResources = await Resource.aggregate([
      { $match: query },
      {
        $addFields: {
          relevanceScore: {
            $add: [
              { $cond: [{ $eq: ["$category", category] }, 3, 0] },
              {
                $size: {
                  $setIntersection: ["$tags", tags],
                },
              },
              { $cond: [{ $eq: ["$difficulty", difficulty] }, 2, 0] },
            ],
          },
        },
      },
      { $sort: { relevanceScore: -1 } },
      { $limit: limit },
      {
        $project: {
          _id: 1,
          title: 1,
          description: 1,
          category: 1,
          difficulty: 1,
          type: 1,
          averageRating: 1,
        },
      },
    ]);

    return new Response(JSON.stringify(relatedResources), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in related resources:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to fetch related resources",
        details: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
