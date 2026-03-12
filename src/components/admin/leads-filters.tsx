"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { PIPELINE_STAGES, STAGE_LABELS } from "@/types/crm";
import type { PipelineStage } from "@/types/crm";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface LeadsFiltersProps {
  currentStage?: PipelineStage;
  currentSearch?: string;
  currentSortBy: string;
  currentSortDir: string;
}

export function LeadsFilters({
  currentStage,
  currentSearch,
  currentSortBy,
  currentSortDir,
}: LeadsFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(currentSearch || "");

  const updateParams = useCallback(
    (updates: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());
      // Reset to page 1 on filter change
      params.delete("page");
      for (const [key, value] of Object.entries(updates)) {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      }
      router.push(`/admin/crm/leads?${params.toString()}`);
    },
    [router, searchParams]
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams({ search: search || undefined });
  };

  return (
    <div className="space-y-4">
      {/* Stage tabs */}
      <div className="flex flex-wrap gap-1">
        <button
          onClick={() => updateParams({ stage: undefined })}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
            !currentStage
              ? "bg-gray-900 text-white"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Tous
        </button>
        {PIPELINE_STAGES.map((stage) => (
          <button
            key={stage}
            onClick={() =>
              updateParams({
                stage: currentStage === stage ? undefined : stage,
              })
            }
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              currentStage === stage
                ? "bg-gray-900 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {STAGE_LABELS[stage]}
          </button>
        ))}
      </div>

      {/* Search + sort */}
      <div className="flex gap-3">
        <form onSubmit={handleSearch} className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Rechercher par nom, email, entreprise..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </form>
        <select
          value={`${currentSortBy}-${currentSortDir}`}
          onChange={(e) => {
            const [sortBy, sortDir] = e.target.value.split("-");
            updateParams({ sortBy, sortDir });
          }}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700"
        >
          <option value="createdAt-desc">Plus récents</option>
          <option value="createdAt-asc">Plus anciens</option>
          <option value="score-desc">Score ↓</option>
          <option value="score-asc">Score ↑</option>
          <option value="name-asc">Nom A-Z</option>
          <option value="name-desc">Nom Z-A</option>
        </select>
      </div>
    </div>
  );
}
