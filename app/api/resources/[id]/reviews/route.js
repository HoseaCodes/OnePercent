/* eslint-disable no-underscore-dangle */
/* eslint-disable import/prefer-default-export */
/* eslint-disable import/extensions */
// app/api/resources/[id]/reviews/route.js
// import { verifyAuth } from "@/lib/auth";
import Review from "@/models/Review";
import Resource from "@/models/Resource";
import connectToDatabase from "@/lib/mongodb";

export async function GET(req, { params }) {
  try {
    await connectToDatabase();

    // Fetch all reviews for the resource
    const reviews = await Review.find({ resourceId: params.id })
      .populate("userId", "name") // Populate user details
      .sort({ createdAt: -1 }); // Sort by newest first

    // Calculate rating distribution
    const ratingDistribution = reviews.reduce((acc, review) => {
      acc[review.rating] = (acc[review.rating] || 0) + 1;
      return acc;
    }, {});

    // Calculate average rating
    const totalRatings = reviews.length;
    const averageRating =
      totalRatings > 0
        ? (
            reviews.reduce((acc, review) => acc + review.rating, 0) /
            totalRatings
          ).toFixed(1)
        : 0;

    // Format the reviews for response
    const formattedReviews = reviews.map((review) => ({
      _id: review._id,
      rating: review.rating,
      review: review.review,
      createdAt: review.createdAt,
      user: {
        _id: review.userId._id,
        name: review.userId.name,
      },
    }));

    const response = {
      reviews: formattedReviews,
      stats: {
        averageRating: parseFloat(averageRating),
        totalReviews: totalRatings,
        ratingDistribution,
      },
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch reviews" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}

export async function POST(req, { params }) {
  // const userId = await verifyAuth(req);
  const userId = "674f136660b6bee059d29d33";

  const { rating, review } = await req.json();

  const newReview = await Review.create({
    userId,
    resourceId: params.id,
    rating,
    review,
  });

  await connectToDatabase();

  // Update resource average rating
  const reviews = await Review.find({ resourceId: params.id });
  const avgRating =
    reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length;

  await Resource.findByIdAndUpdate(params.id, {
    averageRating: avgRating,
    totalReviews: reviews.length,
  });

  return new Response(JSON.stringify(newReview), { status: 201 });
}
