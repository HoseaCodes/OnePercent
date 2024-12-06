/* eslint-disable no-underscore-dangle */
/* eslint-disable react/prop-types */
/* eslint-disable import/extensions */
// components/paths/path-grid.js
import { ChevronRight, CheckCircle, Clock } from "lucide-react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function PathGrid({ paths, isLoading }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <PathCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {paths.map((path) => (
        <PathCard key={path._id} path={path} />
      ))}
    </div>
  );
}

function PathCard({ path }) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <Link href={`/paths/${path._id}`}>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">{path.title}</CardTitle>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </div>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-gray-600 line-clamp-2">{path.description}</p>

          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span className="px-2 py-1 bg-gray-100 rounded-full">
              {path.category}
            </span>
            <span>{path.status}</span>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span>Progress</span>
              <span>{path.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${path.progress}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="flex items-center text-gray-500">
              <CheckCircle className="h-4 w-4 mr-2" />
              <span className="text-sm">
                {path.milestones?.filter((m) => m.completed).length} /{" "}
                {path.milestones?.length}
              </span>
            </div>
            <div className="flex items-center text-gray-500">
              <Clock className="h-4 w-4 mr-2" />
              <span className="text-sm">{path.timeSpent || 0}h</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function PathCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="h-6 bg-gray-200 rounded w-2/3 animate-pulse" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
          <div className="h-2 bg-gray-200 rounded w-full animate-pulse" />
          <div className="grid grid-cols-2 gap-4">
            <div className="h-4 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
