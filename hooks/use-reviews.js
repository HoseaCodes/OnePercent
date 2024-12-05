/* eslint-disable import/prefer-default-export */

import { useState, useEffect } from "react";

export function useReviews(resourceId) {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: {},
  });

  const fetchReviews = async () => {
    const response = await fetch(`/api/resources/${resourceId}/reviews`);
    const data = await response.json();
    console.log(data);
    setReviews(data.reviews);
    setStats(data.stats);
  };

  useEffect(() => {
    fetchReviews();
  }, [resourceId]);

  const addReview = async (reviewData) => {
    const response = await fetch(`/api/resources/${resourceId}/reviews`, {
      method: "POST",
      body: JSON.stringify(reviewData),
    });
    if (response.ok) {
      fetchReviews();
    }
  };

  return { reviews, stats, addReview };
}
