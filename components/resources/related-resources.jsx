/* eslint-disable import/extensions */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/prop-types */

// components/resources/related-resources.js
import Link from "next/link";
import { useRelatedResources } from "@/hooks/use-related-resources";

export default function RelatedResources({ currentResource }) {
  const { relatedResources, isLoading, error } = useRelatedResources(
    currentResource._id,
    {
      category: currentResource.category,
      tags: currentResource.tags || [],
      difficulty: currentResource.difficulty,
    },
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-4 bg-gray-50 rounded-lg animate-pulse">
            <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-full mb-2" />
            <div className="flex space-x-4">
              <div className="h-4 bg-gray-200 rounded w-20" />
              <div className="h-4 bg-gray-200 rounded w-20" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-sm text-gray-500 text-center">
        Unable to load related resources
      </div>
    );
  }

  if (relatedResources.length === 0) {
    return (
      <div className="p-4 text-sm text-gray-500 text-center">
        No related resources found
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {relatedResources.map((resource) => (
        <Link
          key={resource._id}
          href={`/resources/${resource._id}`}
          className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100"
        >
          <h3 className="font-medium">{resource.title}</h3>
          <p className="text-sm text-gray-500 mt-1">{resource.description}</p>
          <div className="flex items-center space-x-4 mt-2">
            <span className="text-sm text-gray-500">{resource.category}</span>
            <span className="text-sm text-gray-500">{resource.difficulty}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
