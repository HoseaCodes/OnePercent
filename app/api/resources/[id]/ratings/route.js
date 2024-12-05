/* eslint-disable import/extensions */
/* eslint-disable import/prefer-default-export */

// import { verifyAuth } from "@/utils/auth";
import { connectToDatabase } from "@/utils/database";
import Resource from "@/models/Resource";

export async function POST(req, { params }) {
  try {
    // const userId = await verifyAuth(req);
    // if (!userId) {
    //   return new Response(JSON.stringify({ error: "Unauthorized" }), {
    //     status: 401,
    //     headers: { "Content-Type": "application/json" },
    //   });
    // }
    const userId = "674f136660b6bee059d29d33"; // Temporary user ID

    const { rating, review } = await req.json();

    if (!rating || rating < 1 || rating > 5) {
      return new Response(JSON.stringify({ error: "Invalid rating" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    await connectToDatabase();

    const resource = await Resource.findById(params.id);

    if (!resource) {
      return new Response(JSON.stringify({ error: "Resource not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Check if user already rated
    const existingRating = resource.ratings.find(
      (r) => r.userId.toString() === userId,
    );
    if (existingRating) {
      existingRating.rating = rating;
      existingRating.review = review;
    } else {
      resource.ratings.push({ userId, rating, review });
    }

    await resource.save();

    return new Response(JSON.stringify(resource), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
