import React, { createContext, useState } from "react";

const SearchFiltersContext = createContext();

export const SearchFiltersProvider = ({ children }) => {
  const [search, setSearch] = useState("");

  return (
    <SearchFiltersContext.Provider value={{ search, setSearch }}>
      {children}
    </SearchFiltersContext.Provider>
  );
};

export default SearchFiltersContext;
