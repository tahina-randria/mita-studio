"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Phone, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string | null;
  color: string;
  lead: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    company: string | null;
    service: string | null;
    budget: string | null;
    score: number;
    stage: string;
    callResult: string | null;
    callVideoLink: string | null;
    callDurationMinutes: number | null;
    callNotes: string | null;
    isNoShow: boolean;
    noShowCount: number;
  };
}

type ViewMode = "month" | "week";

function getMonthRange(date: Date): { start: Date; end: Date } {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  start.setDate(start.getDate() - start.getDay() + 1); // Start on Monday
  if (start.getDate() > 7) start.setDate(start.getDate() - 7);

  const end = new Date(start);
  end.setDate(end.getDate() + 42); // 6 weeks

  return { start, end };
}

function getWeekRange(date: Date): { start: Date; end: Date } {
  const start = new Date(date);
  const day = start.getDay();
  const diff = day === 0 ? -6 : 1 - day; // Monday start
  start.setDate(start.getDate() + diff);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(end.getDate() + 7);

  return { start, end };
}

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Paris",
  });
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

const DAYS_FR = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const MONTHS_FR = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];

export function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    const range =
      viewMode === "month"
        ? getMonthRange(currentDate)
        : getWeekRange(currentDate);

    try {
      const res = await fetch(
        `/api/admin/crm/calendar?start=${range.start.toISOString()}&end=${range.end.toISOString()}`,
      );
      if (res.ok) {
        const data = await res.json();
        setEvents(data.events ?? []);
      }
    } catch {
      // Silently handle
    }
    setLoading(false);
  }, [currentDate, viewMode]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  function navigate(direction: number) {
    const next = new Date(currentDate);
    if (viewMode === "month") {
      next.setMonth(next.getMonth() + direction);
    } else {
      next.setDate(next.getDate() + direction * 7);
    }
    setCurrentDate(next);
  }

  function goToToday() {
    setCurrentDate(new Date());
  }

  function getEventsForDay(date: Date): CalendarEvent[] {
    return events.filter((e) => isSameDay(new Date(e.start), date));
  }

  // Generate calendar grid
  const range =
    viewMode === "month"
      ? getMonthRange(currentDate)
      : getWeekRange(currentDate);

  const days: Date[] = [];
  const cursor = new Date(range.start);
  while (cursor < range.end) {
    days.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }

  // For week view, only 7 days
  const displayDays = viewMode === "week" ? days.slice(0, 7) : days;
  const weeks: Date[][] = [];
  for (let i = 0; i < displayDays.length; i += 7) {
    weeks.push(displayDays.slice(i, i + 7));
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
            <ChevronLeft className="size-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={goToToday}>
            Aujourd&apos;hui
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigate(1)}>
            <ChevronRight className="size-4" />
          </Button>
          <h2 className="ml-2 text-lg font-semibold text-gray-900">
            {viewMode === "month"
              ? `${MONTHS_FR[currentDate.getMonth()]} ${currentDate.getFullYear()}`
              : `Semaine du ${range.start.toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}`}
          </h2>
          {loading && <Loader2 className="size-4 animate-spin text-gray-400" />}
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-gray-200 p-0.5">
          <button
            onClick={() => setViewMode("month")}
            className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
              viewMode === "month"
                ? "bg-gray-900 text-white"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Mois
          </button>
          <button
            onClick={() => setViewMode("week")}
            className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
              viewMode === "week"
                ? "bg-gray-900 text-white"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Semaine
          </button>
        </div>
      </div>

      <div className="flex gap-4">
        {/* Calendar grid */}
        <div className="flex-1">
          <Card>
            <CardContent className="p-0">
              {/* Day headers */}
              <div className="grid grid-cols-7 border-b border-gray-200">
                {DAYS_FR.map((day) => (
                  <div
                    key={day}
                    className="p-2 text-center text-xs font-medium text-gray-500"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Weeks */}
              {weeks.map((week, wIdx) => (
                <div key={wIdx} className="grid grid-cols-7 border-b border-gray-100 last:border-b-0">
                  {week.map((day) => {
                    const dayEvents = getEventsForDay(day);
                    const isCurrentMonth =
                      day.getMonth() === currentDate.getMonth();
                    const today = isToday(day);

                    return (
                      <div
                        key={day.toISOString()}
                        className={`min-h-[80px] border-r border-gray-100 p-1 last:border-r-0 ${
                          viewMode === "week" ? "min-h-[120px]" : ""
                        } ${!isCurrentMonth && viewMode === "month" ? "bg-gray-50" : ""}`}
                      >
                        <div
                          className={`mb-1 flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                            today
                              ? "bg-gray-900 font-bold text-white"
                              : isCurrentMonth
                                ? "text-gray-700"
                                : "text-gray-400"
                          }`}
                        >
                          {day.getDate()}
                        </div>
                        <div className="space-y-0.5">
                          {dayEvents.slice(0, 3).map((event) => (
                            <button
                              key={event.id}
                              onClick={() => setSelectedEvent(event)}
                              className="flex w-full items-center gap-1 rounded px-1 py-0.5 text-left text-xs transition-colors hover:bg-gray-100"
                            >
                              <span
                                className="size-1.5 shrink-0 rounded-full"
                                style={{ backgroundColor: event.color }}
                              />
                              <span className="truncate font-medium text-gray-700">
                                {formatTime(event.start)} {event.title}
                              </span>
                            </button>
                          ))}
                          {dayEvents.length > 3 && (
                            <p className="px-1 text-[10px] text-gray-400">
                              +{dayEvents.length - 3} autres
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Event detail panel */}
        {selectedEvent && (
          <Card className="w-80 shrink-0">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Phone className="size-4 text-gray-400" />
                  <h3 className="font-semibold text-gray-900">
                    {selectedEvent.lead.name}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  &times;
                </button>
              </div>

              <div className="space-y-2 text-sm">
                <p className="text-gray-600">
                  {new Date(selectedEvent.start).toLocaleDateString("fr-FR", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    hour: "2-digit",
                    minute: "2-digit",
                    timeZone: "Europe/Paris",
                  })}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  <Badge variant="secondary" className="text-xs">
                    Score: {selectedEvent.lead.score}
                  </Badge>
                  {selectedEvent.lead.callResult && (
                    <Badge
                      variant="secondary"
                      className="text-xs"
                      style={{ color: selectedEvent.color }}
                    >
                      {selectedEvent.lead.callResult}
                    </Badge>
                  )}
                  {selectedEvent.lead.isNoShow && (
                    <Badge className="text-xs text-red-700 bg-red-50">
                      No-show ({selectedEvent.lead.noShowCount}x)
                    </Badge>
                  )}
                </div>

                <div className="space-y-1 text-xs text-gray-500">
                  <p>{selectedEvent.lead.email}</p>
                  {selectedEvent.lead.phone && <p>{selectedEvent.lead.phone}</p>}
                  {selectedEvent.lead.company && (
                    <p>{selectedEvent.lead.company}</p>
                  )}
                  {selectedEvent.lead.service && (
                    <p>Service : {selectedEvent.lead.service}</p>
                  )}
                  {selectedEvent.lead.budget && (
                    <p>Budget : {selectedEvent.lead.budget}</p>
                  )}
                </div>

                {selectedEvent.lead.callNotes && (
                  <div className="rounded-lg bg-gray-50 p-2">
                    <p className="text-xs font-medium text-gray-600 mb-1">
                      Notes
                    </p>
                    <p className="text-xs text-gray-700 line-clamp-4">
                      {selectedEvent.lead.callNotes}
                    </p>
                  </div>
                )}

                {selectedEvent.lead.callVideoLink &&
                  new Date(selectedEvent.start) > new Date() && (
                    <a
                      href={selectedEvent.lead.callVideoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-xs text-blue-600 hover:underline"
                    >
                      Rejoindre la visio
                    </a>
                  )}
              </div>

              <Link
                href={`/admin/crm/leads/${selectedEvent.lead.id}`}
                className="block"
              >
                <Button variant="outline" size="sm" className="w-full text-xs">
                  Voir le lead
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <span className="size-2 rounded-full bg-blue-500" />A venir
        </span>
        <span className="flex items-center gap-1">
          <span className="size-2 rounded-full bg-emerald-500" />
          Bon fit
        </span>
        <span className="flex items-center gap-1">
          <span className="size-2 rounded-full bg-amber-500" />
          Fit moyen
        </span>
        <span className="flex items-center gap-1">
          <span className="size-2 rounded-full bg-gray-500" />
          Mauvais fit
        </span>
        <span className="flex items-center gap-1">
          <span className="size-2 rounded-full bg-red-500" />
          No-show
        </span>
      </div>
    </div>
  );
}
