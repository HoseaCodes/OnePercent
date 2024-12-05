/* eslint-disable import/extensions */
/* eslint-disable no-underscore-dangle */
// app/api/resources/route.js
import connectToDatabase from "@/lib/mongodb";
import Resource from "@/models/Resource";
// import { verifyAuth } from '@/lib/auth';

export async function GET(req) {
  try {
    // const userId = await verifyAuth(req);
    // if (!userId) {
    //   return new Response(JSON.stringify({ error: 'Unauthorized' }), {
    //     status: 401,
    //     headers: { 'Content-Type': 'application/json' },
    //   });
    // }
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const query = searchParams.get("q");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    await connectToDatabase();

    const filter = {};
    if (category) filter.category = category;
    if (query) {
      filter.$or = [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { tags: { $in: [new RegExp(query, "i")] } },
      ];
    }

    const total = await Resource.countDocuments(filter);
    const resources = await Resource.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return new Response(
      JSON.stringify({
        resources,
        pagination: {
          total,
          pages: Math.ceil(total / limit),
          page,
          limit,
        },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function POST(req) {
  try {
    // Verify authentication
    // const userId = await verifyAuth(req);
    // if (!userId) {
    //   return new Response(JSON.stringify({ error: 'Unauthorized' }), {
    //     status: 401,
    //     headers: { 'Content-Type': 'application/json' },
    //   });
    // }
    const userId = "674f136660b6bee059d29d33";

    // Parse request body
    const data = await req.json();

    // Validate required fields
    const requiredFields = ["title", "description", "category", "type", "url"];
    const missingFields = requiredFields.filter((field) => !data[field]);

    if (missingFields.length > 0) {
      return new Response(
        JSON.stringify({
          error: "Missing required fields",
          fields: missingFields,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // Validate URL format
    const urlPattern = new RegExp(
      "^(https?:\\/\\/)?" + // protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
        "(\\#[-a-z\\d_]*)?$",
      "i", // fragment locator
    );

    if (!urlPattern.test(data.url)) {
      return new Response(JSON.stringify({ error: "Invalid URL format" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    await connectToDatabase();

    // Create the resource
    const resource = new Resource({
      createdBy: userId,
      title: data.title,
      description: data.description,
      category: data.category,
      type: data.type,
      url: data.url,
      author: data.author || null,
      difficulty: data.difficulty || "Beginner",
      tags: data.tags || [],
      thumbnail: data.thumbnail || null,
      averageRating: 0,
      totalRatings: 0,
      ratings: [],
      status: "Active",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await resource.save();

    // Clean the response data
    const responseData = {
      _id: resource._id,
      title: resource.title,
      description: resource.description,
      category: resource.category,
      type: resource.type,
      url: resource.url,
      author: resource.author,
      difficulty: resource.difficulty,
      tags: resource.tags,
      thumbnail: resource.thumbnail,
      createdAt: resource.createdAt,
    };

    return new Response(JSON.stringify(responseData), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating resource:", error);

    // Handle specific MongoDB errors
    if (error.code === 11000) {
      return new Response(JSON.stringify({ error: "Duplicate resource URL" }), {
        status: 409,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
