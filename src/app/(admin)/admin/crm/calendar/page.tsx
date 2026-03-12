import { CalendarView } from "@/components/admin/calendar-view";

export default function CalendarPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Calendrier</h1>
        <p className="mt-1 text-sm text-gray-500">
          Vue de tous les appels planifiés et passés
        </p>
      </div>
      <CalendarView />
    </div>
  );
}
