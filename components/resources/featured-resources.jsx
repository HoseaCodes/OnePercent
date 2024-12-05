/* eslint-disable import/extensions */
/* eslint-disable no-underscore-dangle */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Star, Video, Code } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function FeaturedResources() {
  const [featuredResources, setFeaturedResources] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchFeaturedResources = async () => {
      try {
        const response = await fetch("/api/resources/featured");
        const data = await response.json();
        setFeaturedResources(data);
      } catch (error) {
        console.error("Failed to fetch featured resources:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedResources();
  }, []);

  const getIcon = (category) => {
    switch (category) {
      case "Books":
        return <BookOpen className="h-8 w-8 text-gray-400" />;
      case "Video Courses":
        return <Video className="h-8 w-8 text-gray-400" />;
      default:
        return <Code className="h-8 w-8 text-gray-400" />;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Featured Resources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="border rounded-lg p-4 space-y-4 animate-pulse"
              >
                <div className="aspect-video bg-gray-100 rounded-lg" />
                <div className="h-4 bg-gray-100 rounded w-3/4" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
                <div className="flex justify-between">
                  <div className="h-3 bg-gray-100 rounded w-1/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Featured Resources</CardTitle>
        <button
          type="button"
          onClick={() => router.push("/resources?filter=featured")}
          className="text-sm text-blue-600 hover:text-blue-700"
        >
          View All
        </button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {featuredResources.map((resource) => (
            <div
              key={resource._id}
              onClick={() => router.push(`/resources/${resource._id}`)}
              className="border rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer group"
            >
              <div className="aspect-video bg-gray-100 rounded-lg mb-4 flex items-center justify-center group-hover:bg-gray-50">
                {getIcon(resource.category)}
              </div>
              <h3 className="font-medium line-clamp-1 group-hover:text-blue-600">
                {resource.title}
              </h3>
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                {resource.description}
              </p>
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600">
                    {resource.averageRating?.toFixed(1) || "N/A"}
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  {resource.estimatedTime} hours
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
