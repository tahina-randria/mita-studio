import Link from "next/link";
import { getDashboardStats } from "@/lib/crm/queries";
import {
  STAGE_LABELS,
  STAGE_TEXT_COLORS,
  PIPELINE_STAGES,
} from "@/types/crm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  TrendingUp,
  DollarSign,
  Clock,
  ArrowUpRight,
} from "lucide-react";

function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
  }).format(cents / 100);
}

function timeAgo(date: Date | string): string {
  const now = new Date();
  const d = new Date(date);
  const seconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (seconds < 60) return "à l'instant";
  if (seconds < 3600) return `il y a ${Math.floor(seconds / 60)}min`;
  if (seconds < 86400) return `il y a ${Math.floor(seconds / 3600)}h`;
  return `il y a ${Math.floor(seconds / 86400)}j`;
}

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  const kpis = [
    {
      label: "Leads aujourd'hui",
      value: stats.todayLeads,
      sub: `${stats.weekLeads} cette semaine`,
      icon: Users,
      color: "text-blue-600 bg-blue-50",
    },
    {
      label: "Leads ce mois",
      value: stats.monthLeads,
      sub: `${stats.totalLeads} au total`,
      icon: TrendingUp,
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      label: "Taux conversion",
      value: `${stats.conversionRate}%`,
      sub: "leads → gagné",
      icon: ArrowUpRight,
      color: "text-purple-600 bg-purple-50",
    },
    {
      label: "Valeur pipeline",
      value: formatCurrency(stats.pipelineValue),
      sub: "en cours",
      icon: DollarSign,
      color: "text-amber-600 bg-amber-50",
    },
  ];

  // Active stages only (not WON/LOST) for funnel
  const activeStages = PIPELINE_STAGES.filter(
    (s) => s !== "WON" && s !== "LOST"
  );
  const maxCount = Math.max(
    ...activeStages.map((s) => stats.stageCounts[s] || 0),
    1
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Vue d&apos;ensemble de votre pipeline commercial
        </p>
      </div>

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.label}>
              <CardContent className="flex items-start gap-4 pt-6">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${kpi.color}`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{kpi.label}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {kpi.value}
                  </p>
                  <p className="text-xs text-gray-400">{kpi.sub}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Pipeline funnel */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pipeline</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {activeStages.map((stage) => {
              const count = stats.stageCounts[stage] || 0;
              const percentage = (count / maxCount) * 100;
              return (
                <div key={stage} className="flex items-center gap-3">
                  <span className="w-28 shrink-0 text-xs text-gray-600">
                    {STAGE_LABELS[stage]}
                  </span>
                  <div className="h-6 flex-1 overflow-hidden rounded-md bg-gray-100">
                    <div
                      className={`h-full rounded-md transition-all ${
                        count > 0 ? "bg-gray-900" : ""
                      }`}
                      style={{ width: `${Math.max(percentage, count > 0 ? 8 : 0)}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-sm font-medium text-gray-900">
                    {count}
                  </span>
                </div>
              );
            })}

            {/* Won / Lost summary */}
            <div className="mt-4 flex gap-4 border-t border-gray-100 pt-4">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-emerald-500" />
                <span className="text-sm text-gray-600">
                  Gagné : {stats.stageCounts["WON"] || 0}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                <span className="text-sm text-gray-600">
                  Perdu : {stats.stageCounts["LOST"] || 0}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent activity */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Activité récente</CardTitle>
            <Link
              href="/admin/crm/leads"
              className="text-sm text-gray-500 hover:text-gray-900"
            >
              Voir tout →
            </Link>
          </CardHeader>
          <CardContent>
            {stats.recentActivity.length === 0 ? (
              <p className="py-8 text-center text-sm text-gray-400">
                Aucune activité récente
              </p>
            ) : (
              <div className="space-y-3">
                {stats.recentActivity.slice(0, 10).map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 text-sm"
                  >
                    <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-gray-300" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-gray-700">
                        <Link
                          href={`/admin/crm/leads/${activity.lead.id}`}
                          className="font-medium text-gray-900 hover:underline"
                        >
                          {activity.lead.name}
                        </Link>{" "}
                        — {activity.title}
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="secondary"
                          className="text-xs"
                        >
                          {activity.type.replace(/_/g, " ")}
                        </Badge>
                        <span className="text-xs text-gray-400">
                          <Clock className="mr-1 inline h-3 w-3" />
                          {timeAgo(activity.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
