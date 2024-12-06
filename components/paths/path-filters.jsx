/* eslint-disable react/prop-types */
import { Filter } from "lucide-react";

export default function PathFilters({ filters, onChange }) {
  const categories = [
    { value: "", label: "All Categories" },
    { value: "Technical", label: "Technical" },
    { value: "Creative", label: "Creative" },
    { value: "Physical", label: "Physical" },
    { value: "Language", label: "Language" },
    { value: "Business", label: "Business" },
  ];

  const statuses = [
    { value: "", label: "All Statuses" },
    { value: "Not Started", label: "Not Started" },
    { value: "In Progress", label: "In Progress" },
    { value: "Completed", label: "Completed" },
  ];

  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2">
        <Filter className="h-5 w-5 text-gray-400" />
        <span className="text-gray-500">Filters:</span>
      </div>

      <select
        value={filters.category}
        onChange={(e) => onChange({ ...filters, category: e.target.value })}
        className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
      >
        {categories.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>

      <select
        value={filters.status}
        onChange={(e) => onChange({ ...filters, status: e.target.value })}
        className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
      >
        {statuses.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}
