/* eslint-disable no-shadow */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-console */

import { useState, useEffect } from "react";

export function useRelatedResources(
  resourceId,
  { category, tags, difficulty },
) {
  const [relatedResources, setRelatedResources] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRelatedResources = async () => {
      try {
        setIsLoading(true);
        const queryParams = new URLSearchParams({
          category,
          tags: tags.join(","),
          difficulty,
          exclude: resourceId,
          limit: 5,
        });

        const response = await fetch(
          `/api/resources/search/related?${queryParams}`,
        );
        if (!response.ok) {
          throw new Error("Failed to fetch related resources");
        }
        const data = await response.json();
        setRelatedResources(data);
        setError(null);
      } catch (error) {
        console.error("Failed to fetch related resources:", error);
        setError(error.message);
        setRelatedResources([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (resourceId && category) {
      fetchRelatedResources();
    }
  }, [resourceId, category, tags.join(","), difficulty]);

  return { relatedResources, isLoading, error };
}
