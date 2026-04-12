"use client";

import { Search, X, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

interface Column {
  key: string;
  label: string;
}

interface TableFiltersProps {
  columns: Column[];
  onFilterChange: (filters: { column: string; value: string }) => void;
  placeholder?: string;
}

export function TableFilters({ columns, onFilterChange, placeholder = "Filter data..." }: TableFiltersProps) {
  const [selectedColumn, setSelectedColumn] = useState<string>(columns[0]?.key || "");
  const [filterValue, setFilterValue] = useState<string>("");

  useEffect(() => {
    onFilterChange({ column: selectedColumn, value: filterValue });
  }, [selectedColumn, filterValue]);

  const handleClear = () => {
    setFilterValue("");
  };

  return (
    <div className="flex flex-col md:flex-row items-center gap-3 bg-card p-4 rounded-xl border border-border/50 shadow-sm mb-6 animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="hidden md:flex items-center gap-2 text-muted-foreground mr-2">
        <Filter className="w-4 h-4" />
        <span className="text-xs font-bold uppercase tracking-wider">Filters</span>
      </div>
      
      <div className="w-full md:w-[200px]">
        <Select value={selectedColumn} onValueChange={setSelectedColumn}>
          <SelectTrigger className="bg-background border-border/60 focus:ring-primary/20">
            <SelectValue placeholder="Select column" />
          </SelectTrigger>
          <SelectContent>
            {columns.map((col) => (
              <SelectItem key={col.key} value={col.key}>
                {col.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="relative w-full flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={placeholder}
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
          className="pl-9 pr-9 bg-background border-border/60 focus:ring-primary/20 w-full"
        />
        {filterValue && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 hover:bg-muted rounded-full transition-colors"
          >
            <X className="h-3 w-3 text-muted-foreground" />
          </button>
        )}
      </div>
      
      {filterValue && (
        <Button variant="ghost" size="sm" onClick={handleClear} className="text-xs font-medium text-muted-foreground hover:text-foreground">
          Clear All
        </Button>
      )}
    </div>
  );
}
