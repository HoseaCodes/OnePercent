/* eslint-disable react/no-array-index-key */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable import/extensions */

import { useState } from "react";
import { Star } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import AddReviewModal from "@/components/resources/add-review-modal";
import { useReviews } from "@/hooks/use-reviews";

export default function ReviewSection({ resourceId, reviews: initialReviews }) {
  const [showAddReview, setShowAddReview] = useState(false);
  const { reviews, stats, addReview } = useReviews(resourceId);

  const handleSubmitReview = async (reviewData) => {
    try {
      await addReview(reviewData);
      setShowAddReview(false);
    } catch (error) {
      throw new Error("Failed to submit review");
    }
  };

  const displayReviews = reviews.length > 0 ? reviews : initialReviews;

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Reviews</CardTitle>
              <p className="text-sm text-gray-500 mt-1">
                {stats.totalReviews || displayReviews.length} reviews •{" "}
                {stats.averageRating || resourceId.averageRating} average rating
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowAddReview(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Write a Review
            </button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Rating Distribution */}
          <div className="mb-6 border-b pb-6">
            <div className="grid grid-cols-[auto,1fr,auto] gap-4 items-center">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="contents">
                  <div className="flex items-center space-x-2 w-12">
                    <span>{rating}</span>
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  </div>
                  <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full bg-yellow-400"
                      style={{
                        width: `${
                          ((stats.ratingDistribution?.[rating] || 0) /
                            (stats.totalReviews || displayReviews.length)) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                  <div className="text-sm text-gray-500 w-12">
                    {stats.ratingDistribution?.[rating] || 0}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews List */}
          <div className="space-y-6">
            {displayReviews.map((review) => (
              <div key={review._id} className="border-b pb-6 last:border-0">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center space-x-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="font-medium">{review.user.name}</span>
                    </div>
                    <p className="text-gray-500 text-sm mt-1">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <p className="mt-2 text-gray-600">{review.review}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <AddReviewModal
        resourceId={resourceId}
        isOpen={showAddReview}
        onClose={() => setShowAddReview(false)}
        onSubmit={handleSubmitReview}
      />
    </>
  );
}
