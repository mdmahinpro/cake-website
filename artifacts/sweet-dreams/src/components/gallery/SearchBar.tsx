import { FaSearch, FaTimes } from "react-icons/fa";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  resultCount: number;
}

export default function SearchBar({
  searchQuery,
  onSearchChange,
  resultCount,
}: SearchBarProps) {
  return (
    <div className="py-4 px-4 max-w-7xl mx-auto w-full">
      <div className="relative max-w-xl">
        <FaSearch
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-caramel-400 pointer-events-none"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search cakes by name or category..."
          className="input-dark pl-10 pr-10"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-caramel-400 hover:text-white transition-colors"
          >
            <FaTimes size={14} />
          </button>
        )}
      </div>
      {(searchQuery || true) && (
        <p className="text-sm text-caramel-400 mt-1.5">
          {resultCount} {resultCount === 1 ? "result" : "results"} found
        </p>
      )}
    </div>
  );
}
