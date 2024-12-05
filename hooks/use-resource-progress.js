// hooks/use-resource-progress.js
import { useState, useEffect } from "react";

export function useResourceProgress(resourceId) {
  const [progress, setProgress] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProgress = async () => {
    try {
      const response = await fetch(`/api/resources/${resourceId}/progress`);
      if (!response.ok) throw new Error("Failed to fetch progress");
      const data = await response.json();
      setProgress(data);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, [resourceId]);

  const updateProgress = async (updates) => {
    try {
      const response = await fetch(`/api/resources/${resourceId}/progress`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error("Failed to update progress");
      const data = await response.json();
      setProgress(data);
      return data;
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  return { progress, isLoading, error, updateProgress };
}

export function useResourceTimeTracking(resourceId) {
  const [timeSpent, setTimeSpent] = useState(0);
  const [isTracking, setIsTracking] = useState(false);
  const [startTime, setStartTime] = useState(null);

  const startTracking = () => {
    setIsTracking(true);
    setStartTime(Date.now());
  };

  const stopTracking = async () => {
    if (!isTracking) return;

    const duration = Math.round((Date.now() - startTime) / 1000 / 60);
    setIsTracking(false);
    setStartTime(null);

    try {
      await fetch(`/api/resources/${resourceId}/time`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ duration }),
      });
      setTimeSpent((prev) => prev + duration);
    } catch (error) {
      console.error("Failed to save time:", error);
    }
  };

  useEffect(() => {
    const fetchTimeSpent = async () => {
      try {
        const response = await fetch(`/api/resources/${resourceId}/time`);
        if (response.ok) {
          const data = await response.json();
          setTimeSpent(data.timeSpent);
        }
      } catch (error) {
        console.error("Failed to fetch time spent:", error);
      }
    };

    fetchTimeSpent();
  }, [resourceId]);

  return { timeSpent, isTracking, startTracking, stopTracking };
}

export function useResourceCompletion(resourceId) {
  const [isCompleted, setIsCompleted] = useState(false);
  const [completedSections, setCompletedSections] = useState({});

  useEffect(() => {
    const fetchCompletion = async () => {
      try {
        const response = await fetch(`/api/resources/${resourceId}/completion`);
        if (response.ok) {
          const data = await response.json();
          setIsCompleted(data.isCompleted);
          setCompletedSections(data.sections);
        }
      } catch (error) {
        console.error("Failed to fetch completion status:", error);
      }
    };

    fetchCompletion();
  }, [resourceId]);

  const markSectionComplete = async (sectionId) => {
    try {
      const response = await fetch(
        `/api/resources/${resourceId}/sections/${sectionId}/complete`,
        {
          method: "POST",
        },
      );
      if (response.ok) {
        const data = await response.json();
        setCompletedSections(data.sections);
        setIsCompleted(data.isCompleted);
      }
    } catch (error) {
      console.error("Failed to mark section complete:", error);
      throw error;
    }
  };

  return { isCompleted, completedSections, markSectionComplete };
}
