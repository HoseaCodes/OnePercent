/* eslint-disable react/prop-types */

export default function ResourceFilters({ filters, onChange }) {
  const categories = ["All", "Book", "Video", "Article", "Course"];
  const types = ["All", "Free", "Premium", "Subscription"];

  return (
    <div className="flex space-x-4">
      <select
        value={filters.category}
        onChange={(e) => onChange({ ...filters, category: e.target.value })}
        className="px-4 py-2 border rounded-lg"
      >
        {categories.map((category) => (
          <option key={category} value={category === "All" ? "" : category}>
            {category}
          </option>
        ))}
      </select>

      <select
        value={filters.type}
        onChange={(e) => onChange({ ...filters, type: e.target.value })}
        className="px-4 py-2 border rounded-lg"
      >
        {types.map((type) => (
          <option key={type} value={type === "All" ? "" : type}>
            {type}
          </option>
        ))}
      </select>
    </div>
  );
}
