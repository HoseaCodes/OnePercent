/* eslint-disable import/prefer-default-export */
/* eslint-disable import/extensions */

import connectToDatabase from "@/lib/mongodb";
import Resource from "@/models/Resource";

export async function POST(req, { params }) {
  try {
    // const userId = await verifyAuth(req);
    const userId = "674f136660b6bee059d29d33"; // Temporary user ID

    const { type, users } = await req.json();
    await connectToDatabase();

    // Update resource share settings
    const resource = await Resource.findByIdAndUpdate(
      params.id,
      {
        shareSettings: {
          type,
          sharedWith: type === "specific" ? users : [],
          isPublic: type === "public",
          sharedBy: userId,
          sharedAt: new Date(),
        },
      },
      { new: true },
    ).populate("sharedBy", "name email");

    if (!resource) {
      return new Response(JSON.stringify({ error: "Resource not found" }), {
        status: 404,
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        message:
          type === "specific"
            ? `Resource shared with ${users.length} users`
            : "Resource shared successfully",
        resource,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Share resource error:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to share resource",
        details: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
