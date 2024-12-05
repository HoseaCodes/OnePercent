/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable import/extensions */

"use client";

import { useState } from "react";
import Link from "next/link";
import { Star, Book, Clock, Users, ChevronLeft, Share2 } from "lucide-react";
import { useResourceDetail } from "@/hooks/use-resources";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import ReviewSection from "@/components/resources/review-section";
import ResourceProgress from "@/components/resources/resource-progress";
import RelatedResources from "@/components/resources/related-resources";
import ShareResourceModal from "@/components/resources/share-resource-modal";

function ResourceDetailSkeleton() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="w-32 h-6 bg-gray-200 rounded animate-pulse" />
        <div className="w-24 h-6 bg-gray-200 rounded animate-pulse" />
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          {/* Main Content Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-4">
                  <div className="w-96 h-8 bg-gray-200 rounded animate-pulse" />
                  <div className="flex items-center space-x-4">
                    <div className="w-32 h-5 bg-gray-200 rounded animate-pulse" />
                    <div className="w-4 h-4 bg-gray-200 rounded-full animate-pulse" />
                    <div className="w-24 h-5 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
                <div className="w-32 h-8 bg-gray-200 rounded animate-pulse" />
              </div>

              <div className="mt-6 space-y-4">
                <div className="w-48 h-6 bg-gray-200 rounded animate-pulse" />
                <div className="space-y-2">
                  <div className="w-full h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="w-full h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>

              <div className="mt-6 flex justify-between items-center">
                <div className="flex space-x-4">
                  <div className="w-32 h-5 bg-gray-200 rounded animate-pulse" />
                  <div className="w-32 h-5 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="w-36 h-10 bg-gray-200 rounded animate-pulse" />
              </div>
            </CardContent>
          </Card>

          {/* Reviews Section Skeleton */}
          <Card>
            <CardHeader>
              <div className="w-48 h-6 bg-gray-200 rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-4 bg-gray-50 rounded-lg space-y-2">
                    <div className="w-full h-5 bg-gray-200 rounded animate-pulse" />
                    <div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse" />
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
                      <div className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Progress Card Skeleton */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="w-full h-6 bg-gray-200 rounded animate-pulse" />
                <div className="w-full h-4 bg-gray-200 rounded animate-pulse" />
                <div className="w-full h-8 bg-gray-200 rounded animate-pulse" />
              </div>
            </CardContent>
          </Card>

          {/* Tags Card Skeleton */}
          <Card>
            <CardHeader>
              <div className="w-24 h-6 bg-gray-200 rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-24 h-8 bg-gray-200 rounded-full animate-pulse"
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Related Resources Card Skeleton */}
          <Card>
            <CardHeader>
              <div className="w-48 h-6 bg-gray-200 rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-4 bg-gray-50 rounded-lg space-y-2">
                    <div className="w-48 h-5 bg-gray-200 rounded animate-pulse" />
                    <div className="w-32 h-4 bg-gray-200 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function ResourceDetail({ params }) {
  const { resource, isLoading, error } = useResourceDetail(params.id);
  const [showShare, setShowShare] = useState(false);

  if (isLoading) return <ResourceDetailSkeleton />;
  if (error)
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">
          Error: {error.message}
        </div>
      </div>
    );

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/resources"
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ChevronLeft className="h-5 w-5" />
          <span>Back to Resources</span>
        </Link>
        <button
          type="button"
          onClick={() => setShowShare(true)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 group"
        >
          <Share2 className="h-5 w-5 group-hover:text-blue-600" />
          <span className="group-hover:text-blue-600">Share</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{resource.title}</h1>
                  <div className="flex items-center space-x-4 text-gray-500">
                    <span className="flex items-center">
                      <Book className="h-5 w-5 mr-2" />
                      {resource.category}
                    </span>
                    <span>•</span>
                    <span>{resource.type}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="text-xl font-bold">
                    {resource.averageRating?.toFixed(1) || "N/A"}
                  </span>
                  <span className="text-gray-500">
                    ({resource.totalRatings || 0} reviews)
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-2">
                  About this Resource
                </h2>
                <p className="text-gray-600">{resource.description}</p>
              </div>

              <div className="mt-6 flex justify-between items-center flex-wrap gap-4">
                <div className="flex flex-wrap items-center gap-4">
                  <span className="flex items-center text-gray-500">
                    <Clock className="h-5 w-5 mr-2" />
                    {resource.estimatedTime ||
                      0} hours
                  </span>
                  <span className="flex items-center text-gray-500">
                    <Users className="h-5 w-5 mr-2" />
                    {resource.activeUsers ||
                      0} active learners
                  </span>
                </div>
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Access Resource
                </a>
              </div>
            </CardContent>
          </Card>

          <ReviewSection
            resourceId={params.id}
            reviews={resource.ratings || []}
          />
        </div>

        <div className="space-y-6">
          <ResourceProgress resource={resource} />

          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {resource.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700 hover:bg-gray-200 transition-colors"
                  >
                    {tag}
                  </span>
                )) || "No tags available"}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Related Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <RelatedResources currentResource={resource} />
            </CardContent>
          </Card>
        </div>
      </div>

      <ShareResourceModal
        resource={resource}
        isOpen={showShare}
        onClose={() => setShowShare(false)}
      />
    </div>
  );
}
