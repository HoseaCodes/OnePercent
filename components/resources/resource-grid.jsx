/* eslint-disable react/prop-types */
/* eslint-disable import/extensions */

import { Book, Video, Link as LinkIcon, Star } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function ResourceGrid({ resources, isLoading }) {
  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {resources.map((resource) => (
        // eslint-disable-next-line no-underscore-dangle
        <ResourceCard key={resource._id} resource={resource} />
      ))}
    </div>
  );
}

function ResourceCard({ resource }) {
  const icons = { Book, Video, Article: LinkIcon };
  const Icon = icons[resource.type] || LinkIcon;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Icon className="h-6 w-6 text-blue-500" />
            <CardTitle>{resource.title}</CardTitle>
          </div>
          <span className="flex items-center text-yellow-500">
            <Star className="h-4 w-4 fill-current" />
            <span className="ml-1 text-sm">{resource.averageRating}</span>
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4">{resource.description}</p>
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-500">
            <span className="px-2 py-1 bg-gray-100 rounded-full">
              {resource.category}
            </span>
            <span className="mx-2">•</span>
            <span>{resource.type}</span>
          </div>
          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-700 text-sm"
          >
            View Resource →
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
