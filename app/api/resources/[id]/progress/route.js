/* eslint-disable import/extensions */
// app/api/resources/[id]/progress/route.js
import { verifyAuth } from "@/lib/auth";
import UserProgress from "@/models/UserProgress";

export async function GET(req, { params }) {
  const userId = await verifyAuth(req);
  const progress = await UserProgress.findOne({
    userId,
    resourceId: params.id,
  });
  return new Response(
    JSON.stringify(progress || { status: "Not Started", progress: 0 }),
  );
}

export async function PUT(req, { params }) {
  const userId = await verifyAuth(req);
  const updates = await req.json();

  const progress = await UserProgress.findOneAndUpdate(
    { userId, resourceId: params.id },
    {
      ...updates,
      lastAccessed: new Date(),
      ...(updates.status === "Completed" && { completedAt: new Date() }),
    },
    { new: true, upsert: true },
  );

  return new Response(JSON.stringify(progress));
}
