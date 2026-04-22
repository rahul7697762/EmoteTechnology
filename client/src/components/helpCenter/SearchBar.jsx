import React from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="relative max-w-2xl mx-auto w-full group">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400 group-focus-within:text-[#6C7EF5] transition-colors" />
      </div>
      <input
        type="text"
        className="block w-full pl-11 pr-4 py-4 bg-white dark:bg-[#252A41] border border-transparent rounded-xl leading-5 placeholder-gray-400 dark:placeholder-[#8B90B8] text-gray-900 dark:text-[#E8EAF2] focus:outline-none focus:ring-2 focus:ring-[#6C7EF5] focus:border-transparent sm:text-lg transition-all shadow-lg hover:shadow-xl focus:shadow-xl dark:shadow-none dark:border-[#3B4FD8]/20"
        placeholder="Search for answers..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
