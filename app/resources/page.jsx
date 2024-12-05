/* eslint-disable no-nested-ternary */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable import/extensions */

"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  Grid,
  List,
  Filter,
  BookOpen,
  Video,
  Code,
  Star,
  BookMarked,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import AddResourceModal from "@/components/resources/add-resource-modal";
import { useResources } from "@/hooks/use-resources";
import FeaturedResources from "@/components/resources/featured-resources";

export default function ResourcesPage() {
  const [viewMode, setViewMode] = useState("grid");
  const [filters, setFilters] = useState({
    category: "",
    type: "",
    search: "",
  });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { resources, isLoading } = useResources(filters);

  const categories = [
    "All Resources",
    "Books",
    "Video Courses",
    "Articles",
    "Documentation",
    "Tools",
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Resource Library</h1>
        <div className="flex space-x-4">
          <div className="flex space-x-2">
            <button
              type="button"
              className={`p-2 border rounded-lg hover:bg-gray-50 ${viewMode === "grid" ? "bg-gray-100" : ""}`}
              onClick={() => setViewMode("grid")}
            >
              <Grid className="h-5 w-5" />
            </button>
            <button
              type="button"
              className={`p-2 border rounded-lg hover:bg-gray-50 ${viewMode === "list" ? "bg-gray-100" : ""}`}
              onClick={() => setViewMode("list")}
            >
              <List className="h-5 w-5" />
            </button>
          </div>
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Add Resource</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search resources..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
        </div>
        <select
          value={filters.type}
          onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="">All Types</option>
          <option value="Free">Free</option>
          <option value="Premium">Premium</option>
          <option value="Subscription">Subscription</option>
        </select>
        <button
          type="button"
          className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center space-x-2"
        >
          <Filter className="h-5 w-5" />
          <span>Filters</span>
        </button>
      </div>

      {/* Categories */}
      <div className="flex space-x-4 overflow-x-auto py-2">
        {categories.map((category) => (
          <button
            type="button"
            key={category}
            onClick={() =>
              setFilters({
                ...filters,
                category: category === "All Resources" ? "" : category,
              })
            }
            className={`px-4 py-2 rounded-full whitespace-nowrap ${
              (category === "All Resources" && !filters.category) ||
              filters.category === category
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {category}
          </button>
        ))}
      </div>
      <FeaturedResources />

      {/* Resources Grid/List */}
      {isLoading ? (
        <div className="text-center py-12">Loading...</div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {resources.map((resource) => (
            <ResourceCard key={resource._id} resource={resource} />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {resources.map((resource) => (
            <ResourceListItem key={resource._id} resource={resource} />
          ))}
        </div>
      )}

      <AddResourceModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}

function ResourceCard({ resource }) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/resources/${resource._id}`);
  };

  const getIcon = () => {
    switch (resource.category) {
      case "Books":
        return <BookOpen className="h-8 w-8 text-gray-400" />;
      case "Video Courses":
        return <Video className="h-8 w-8 text-gray-400" />;
      default:
        return <Code className="h-8 w-8 text-gray-400" />;
    }
  };

  return (
    <Card
      className="hover:shadow-lg transition-shadow cursor-pointer"
      onClick={handleClick}
    >
      <CardContent className="p-4">
        <div className="aspect-video bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
          {getIcon()}
        </div>
        <h3 className="font-medium">{resource.title}</h3>
        <p className="text-sm text-gray-500 mt-1">{resource.description}</p>
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600">
              {resource.averageRating}
            </span>
          </div>
          <span className="text-sm text-gray-500">{resource.type}</span>
        </div>
      </CardContent>
    </Card>
  );
}

function ResourceListItem({ resource }) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/resources/${resource._id}`);
  };

  const getIcon = () => {
    switch (resource.category) {
      case "Books":
        return <BookOpen className="h-8 w-8 text-gray-400" />;
      case "Video Courses":
        return <Video className="h-8 w-8 text-gray-400" />;
      default:
        return <Code className="h-8 w-8 text-gray-400" />;
    }
  };

  return (
    <Card
      className="hover:shadow-lg transition-shadow cursor-pointer"
      onClick={handleClick}
    >
      <CardContent className="p-4">
        <div className="flex space-x-4">
          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
            {getIcon()}
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium">{resource.title}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  By {resource.author}
                </p>
              </div>
              <button
                type="button"
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
              >
                <BookMarked className="h-5 w-5" />
              </button>
            </div>
            <div className="flex items-center space-x-4 mt-2">
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="text-sm text-gray-600">
                  {resource.averageRating}
                </span>
              </div>
              <span className="text-sm text-gray-500">•</span>
              <span className="text-sm text-gray-500">{resource.type}</span>
              <span className="text-sm text-gray-500">•</span>
              <span className="text-sm text-gray-500">{resource.category}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
