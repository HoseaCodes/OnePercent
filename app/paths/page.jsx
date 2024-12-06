/* eslint-disable import/extensions */
// app/paths/page.js

"use client";

import { useState } from "react";
import { Plus, Search } from "lucide-react";
import PathGrid from "@/components/paths/path-grid";
import CreatePathModal from "@/components/paths/create-path-modal";
import PathFilters from "@/components/paths/path-filters";
import { usePaths } from "@/hooks/use-paths";

export default function PathsPage() {
  const [filters, setFilters] = useState({
    category: "",
    status: "",
    search: "",
  });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { paths, isLoading } = usePaths(filters);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Learning Paths</h1>
        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="inline-block mr-2 h-5 w-5" />
          Create Path
        </button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search paths..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
        </div>
        <PathFilters filters={filters} onChange={setFilters} />
      </div>

      <PathGrid paths={paths.paths} isLoading={isLoading} />

      <CreatePathModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}
