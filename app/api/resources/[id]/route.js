/* eslint-disable import/extensions */
// app/api/resources/[id]/route.js
import Resource from "@/models/Resource";
import connectToDatabase from "@/lib/mongodb";

export async function GET(req, { params }) {
  try {
    // const userId = await verifyAuth(req);
    // if (!userId) {
    //   return new Response(JSON.stringify({ error: 'Unauthorized' }), {
    //     status: 401,
    //     headers: { 'Content-Type': 'application/json' },
    //   });
    // }

    await connectToDatabase();

    const resource = await Resource.findById(params.id);

    if (!resource) {
      return new Response(JSON.stringify({ error: "Resource not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(resource), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.log("Failed to fetch resource:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function PUT(req, { params }) {
  try {
    // const userId = await verifyAuth(req);
    // if (!userId) {
    //   return new Response(JSON.stringify({ error: "Unauthorized" }), {
    //     status: 401,
    //     headers: { "Content-Type": "application/json" },
    //   });
    // }

    const updates = await req.json();

    await connectToDatabase();

    const resource = await Resource.findById(params.id);

    if (!resource) {
      return new Response(JSON.stringify({ error: "Resource not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Update allowed fields
    const allowedUpdates = [
      "title",
      "description",
      "category",
      "type",
      "url",
      "thumbnail",
      "author",
      "tags",
      "difficulty",
    ];
    allowedUpdates.forEach((field) => {
      if (updates[field] !== undefined) {
        resource[field] = updates[field];
      }
    });

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

export async function DELETE(req, { params }) {
  try {
    // const userId = await verifyAuth(req);
    // if (!userId) {
    //   return new Response(JSON.stringify({ error: "Unauthorized" }), {
    //     status: 401,
    //     headers: { "Content-Type": "application/json" },
    //   });
    // }

    await connectToDatabase();

    const resource = await Resource.findByIdAndDelete(params.id);

    if (!resource) {
      return new Response(JSON.stringify({ error: "Resource not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ message: "Resource deleted successfully" }),
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
