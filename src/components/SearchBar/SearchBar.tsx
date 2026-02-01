import { useState, useEffect, useMemo } from 'react';
import Fuse from 'fuse.js';
import { User } from '../../types';

interface SearchBarProps {
  users: User[];
  onSearchResults: (matchedIds: string[]) => void;
}

export default function SearchBar({ users, onSearchResults }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [resultCount, setResultCount] = useState(0);

  // Configure Fuse.js - memoized to avoid recreation on every render
  const fuse = useMemo(() => new Fuse(users, {
    keys: [
      'profile.interests',
      'profile.location',
      'profile.industry',
      'name'
    ],
    threshold: 0.3,
    includeScore: true
  }), [users]);

  // Search on query change
  useEffect(() => {
    if (!query.trim()) {
      onSearchResults([]);
      setResultCount(0);
      return;
    }

    const results = fuse.search(query);
    const matchedIds = results.map(r => r.item.id);

    onSearchResults(matchedIds);
    setResultCount(matchedIds.length);
  }, [query, fuse, onSearchResults]);

  const handleClear = () => {
    setQuery('');
    onSearchResults([]);
    setResultCount(0);
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <label htmlFor="search-connections" className="sr-only">
          Search connections
        </label>
        <input
          id="search-connections"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by interest, location, or industry..."
          className="w-full px-4 py-2 pl-10 pr-10 border border-neutral-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow text-neutral-900 placeholder:text-neutral-400"
          aria-label="Search connections"
        />

        {/* Search Icon */}
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>

        {/* Clear Button */}
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
            aria-label="Clear search"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Result Count */}
      {query && (
        <p className="mt-2 text-sm text-neutral-600 font-medium">
          {resultCount} {resultCount === 1 ? 'result' : 'results'} found
        </p>
      )}
    </div>
  );
}
