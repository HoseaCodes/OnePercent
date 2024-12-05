/* eslint-disable consistent-return */
/* eslint-disable no-useless-catch */
/* eslint-disable import/extensions */
import { useState, useEffect, useCallback } from "react";
// import { useNotification } from "@/components/ui/notifications";

export function useResources(filters) {
  const [resources, setResources] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      setIsLoading(true);
      try {
        const queryParams = new URLSearchParams();

        if (filters.search) {
          queryParams.append("search", filters.search);
        }
        if (filters.category) {
          queryParams.append("category", filters.category);
        }
        if (filters.type) {
          queryParams.append("type", filters.type);
        }

        const response = await fetch(
          `/api/resources?${queryParams.toString()}`,
        );
        const data = await response.json();

        // Apply client-side filtering for search if needed
        let filteredData = data.resources;
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          filteredData = data.filter(
            (resource) =>
              resource.title.toLowerCase().includes(searchLower) ||
              resource.description.toLowerCase().includes(searchLower) ||
              resource.author.toLowerCase().includes(searchLower) ||
              (resource.tags &&
                resource.tags.some((tag) =>
                  tag.toLowerCase().includes(searchLower),
                )),
          );
        }

        setResources(filteredData);
      } catch (error) {
        console.error("Error fetching resources:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResources();
  }, [filters]);

  return { resources, isLoading };
}

export function useResourceDetail(resourceId) {
  const [resource, setResource] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  // const { addNotification } = useNotification();

  // Fetch resource details
  const fetchResource = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/resources/${resourceId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch resource");
      }
      const data = await response.json();
      // Artificial 3-second delay
      await new Promise((resolve) => {
        setTimeout(resolve, 2000);
      });
      setResource(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      // addNotification({
      //     type: 'error',
      //     message: 'Failed to load resource details',
      //     duration: 3000
      // });
    } finally {
      setIsLoading(false);
    }
    // }, [resourceId, addNotification]);
  }, [resourceId]);

  // Initial fetch
  useEffect(() => {
    fetchResource();
  }, [fetchResource]);

  // Update resource
  const updateResource = async (updates) => {
    try {
      const response = await fetch(`/api/resources/${resourceId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error("Failed to update resource");
      }

      const updatedResource = await response.json();
      setResource(updatedResource);
      // addNotification({
      //     type: 'success',
      //     message: 'Resource updated successfully',
      //     duration: 3000
      // });

      return updatedResource;
    } catch (err) {
      // addNotification({
      //     type: 'error',
      //     message: 'Failed to update resource',
      //     duration: 3000
      // });
      throw err;
    }
  };

  // Add rating
  const addRating = async (rating, review) => {
    try {
      const response = await fetch(`/api/resources/${resourceId}/ratings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, review }),
      });

      if (!response.ok) {
        throw new Error("Failed to add rating");
      }

      const updatedResource = await response.json();
      setResource(updatedResource);
      // addNotification({
      //     type: 'success',
      //     message: 'Rating added successfully',
      //     duration: 3000
      // });

      return updatedResource;
    } catch (err) {
      // addNotification({
      //     type: 'error',
      //     message: 'Failed to add rating',
      //     duration: 3000
      // });
      throw err;
    }
  };

  // Track progress
  const updateProgress = async (progress) => {
    try {
      const response = await fetch(`/api/resources/${resourceId}/progress`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(progress),
      });

      if (!response.ok) {
        throw new Error("Failed to update progress");
      }

      const updatedProgress = await response.json();
      setResource((prev) => ({
        ...prev,
        userProgress: updatedProgress,
      }));

      return updatedProgress;
    } catch (err) {
      // addNotification({
      //     type: 'error',
      //     message: 'Failed to update progress',
      //     duration: 3000
      // });
      throw err;
    }
  };

  // Track time spent
  const trackTime = async (duration) => {
    try {
      const response = await fetch(`/api/resources/${resourceId}/time`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ duration }),
      });

      if (!response.ok) {
        throw new Error("Failed to track time");
      }

      const updatedProgress = await response.json();
      setResource((prev) => ({
        ...prev,
        userProgress: updatedProgress,
      }));

      return updatedProgress;
    } catch (err) {
      console.error("Failed to track time:", err);
    }
  };

  // Delete resource
  const deleteResource = async () => {
    try {
      const response = await fetch(`/api/resources/${resourceId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete resource");
      }

      // addNotification({
      //     type: 'success',
      //     message: 'Resource deleted successfully',
      //     duration: 3000
      // });

      return true;
    } catch (err) {
      // addNotification({
      //     type: 'error',
      //     message: 'Failed to delete resource',
      //     duration: 3000
      // });
      throw err;
    }
  };

  return {
    resource,
    isLoading,
    error,
    updateResource,
    addRating,
    updateProgress,
    trackTime,
    deleteResource,
    refresh: fetchResource,
  };
}
