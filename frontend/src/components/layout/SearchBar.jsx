import React, { useState } from 'react';
import { Search } from 'lucide-react';

export const SearchBar = ({ onSearch }) => {
  const [value, setValue] = useState('');

  const handleChange = (e) => {
    setValue(e.target.value);
    if (onSearch) {
      onSearch(e.target.value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex h-10 w-full max-w-[420px] items-center rounded-full border border-transparent bg-slate-100 pl-4 pr-1 transition-all duration-300 focus-within:border-primary focus-within:bg-background focus-within:ring-2 focus-within:ring-primary/20 dark:bg-slate-800 dark:focus-within:bg-slate-900"
    >
      <input
        type="text"
        placeholder="Search products..."
        value={value}
        onChange={handleChange}
        className="w-full bg-transparent text-sm font-medium text-foreground outline-none placeholder:text-muted-foreground"
      />
      <button
        type="submit"
        className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      >
        <Search size={14} />
      </button>
    </form>
  );
};

export default SearchBar;
