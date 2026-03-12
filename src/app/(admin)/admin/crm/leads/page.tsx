import Link from "next/link";
import { getLeads } from "@/lib/crm/queries";
import {
  PIPELINE_STAGES,
  STAGE_LABELS,
  STAGE_TEXT_COLORS,
} from "@/types/crm";
import type { PipelineStage } from "@/types/crm";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LeadsFilters } from "@/components/admin/leads-filters";

interface LeadsPageProps {
  searchParams: Promise<{
    stage?: string;
    search?: string;
    sortBy?: string;
    sortDir?: string;
    page?: string;
  }>;
}

function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function ScoreBadge({ score }: { score: number }) {
  let color = "bg-gray-100 text-gray-700";
  if (score >= 70) color = "bg-emerald-50 text-emerald-700";
  else if (score >= 40) color = "bg-amber-50 text-amber-700";
  else if (score >= 20) color = "bg-orange-50 text-orange-700";
  else color = "bg-red-50 text-red-700";

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${color}`}
    >
      {score}
    </span>
  );
}

export default async function LeadsListPage({ searchParams }: LeadsPageProps) {
  const params = await searchParams;
  const stage = PIPELINE_STAGES.includes(params.stage as PipelineStage)
    ? (params.stage as PipelineStage)
    : undefined;
  const sortBy = (params.sortBy as "createdAt" | "score" | "name" | "updatedAt") || "createdAt";
  const sortDir = (params.sortDir as "asc" | "desc") || "desc";
  const page = parseInt(params.page || "1", 10);

  const result = await getLeads({
    stage,
    search: params.search,
    sortBy,
    sortDir,
    page,
    limit: 25,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
          <p className="mt-1 text-sm text-gray-500">
            {result.total} lead{result.total !== 1 ? "s" : ""} au total
          </p>
        </div>
      </div>

      {/* Filters */}
      <LeadsFilters
        currentStage={stage}
        currentSearch={params.search}
        currentSortBy={sortBy}
        currentSortDir={sortDir}
      />

      {/* Table */}
      <div className="rounded-lg border border-gray-200 bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Budget</TableHead>
              <TableHead className="text-center">Score</TableHead>
              <TableHead>Stage</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {result.leads.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="py-12 text-center text-sm text-gray-400"
                >
                  Aucun lead trouvé
                </TableCell>
              </TableRow>
            ) : (
              result.leads.map((lead) => (
                <TableRow key={lead.id} className="group cursor-pointer">
                  <TableCell>
                    <Link
                      href={`/admin/crm/leads/${lead.id}`}
                      className="font-medium text-gray-900 group-hover:text-blue-600"
                    >
                      {lead.name}
                    </Link>
                    {lead.company && (
                      <p className="text-xs text-gray-400">{lead.company}</p>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {lead.email}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {lead.service || "—"}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {lead.budget || "—"}
                  </TableCell>
                  <TableCell className="text-center">
                    <ScoreBadge score={lead.score} />
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={`text-xs ${STAGE_TEXT_COLORS[lead.stage as PipelineStage] || ""}`}
                    >
                      {STAGE_LABELS[lead.stage as PipelineStage] || lead.stage}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {formatDate(lead.createdAt)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {result.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Page {result.page} sur {result.totalPages}
          </p>
          <div className="flex gap-2">
            {result.page > 1 && (
              <Link
                href={`/admin/crm/leads?${new URLSearchParams({
                  ...(stage ? { stage } : {}),
                  ...(params.search ? { search: params.search } : {}),
                  sortBy,
                  sortDir,
                  page: String(result.page - 1),
                }).toString()}`}
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
              >
                ← Précédent
              </Link>
            )}
            {result.page < result.totalPages && (
              <Link
                href={`/admin/crm/leads?${new URLSearchParams({
                  ...(stage ? { stage } : {}),
                  ...(params.search ? { search: params.search } : {}),
                  sortBy,
                  sortDir,
                  page: String(result.page + 1),
                }).toString()}`}
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
              >
                Suivant →
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
