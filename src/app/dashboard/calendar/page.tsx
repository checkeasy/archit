'use client';

import { useState, useMemo, useCallback } from 'react';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Flag,
  List,
  Grid3X3,
  X,
} from 'lucide-react';

// ─── Types ──────────────────────────────────────────────────────────────
type EventType = 'meeting' | 'deadline' | 'review' | 'milestone';

interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  type: EventType;
  color: string;
  project?: string;
  time?: string;
  location?: string;
}

// ─── Constants ──────────────────────────────────────────────────────────
const EVENT_TYPE_COLORS: Record<EventType, string> = {
  meeting: '#2563EB',
  deadline: '#dc2626',
  review: '#7c3aed',
  milestone: '#059669',
};

const EVENT_TYPE_LABELS: Record<EventType, string> = {
  meeting: 'Réunion',
  deadline: 'Échéance',
  review: 'Revue',
  milestone: 'Jalon',
};

const DAY_HEADERS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

const MOCK_EVENTS: CalendarEvent[] = [
  {
    id: '1',
    title: 'Réunion client - Maison Martin',
    date: '2026-02-05',
    type: 'meeting',
    color: EVENT_TYPE_COLORS.meeting,
    project: 'Maison Martin',
    time: '10:00',
    location: 'Cabinet',
  },
  {
    id: '2',
    title: 'Dépôt permis - École Montessori',
    date: '2026-02-10',
    type: 'deadline',
    color: EVENT_TYPE_COLORS.deadline,
    project: 'École Montessori',
    time: '17:00',
  },
  {
    id: '3',
    title: 'Revue APS - Villa Lefèbvre',
    date: '2026-02-12',
    type: 'review',
    color: EVENT_TYPE_COLORS.review,
    project: 'Villa Lefèbvre',
    time: '14:00',
    location: 'Salle de réunion',
  },
  {
    id: '4',
    title: 'Livraison plans - Bureaux Nextech',
    date: '2026-02-15',
    type: 'deadline',
    color: EVENT_TYPE_COLORS.deadline,
    project: 'Bureaux Nextech',
    time: '12:00',
  },
  {
    id: '5',
    title: 'Réunion chantier - Restaurant Le Comptoir',
    date: '2026-02-18',
    type: 'meeting',
    color: EVENT_TYPE_COLORS.meeting,
    project: 'Restaurant Le Comptoir',
    time: '09:00',
    location: 'Sur site',
  },
  {
    id: '6',
    title: 'Dépôt PC - École Montessori',
    date: '2026-02-22',
    type: 'deadline',
    color: EVENT_TYPE_COLORS.deadline,
    project: 'École Montessori',
    time: '16:00',
  },
  {
    id: '7',
    title: 'Validation DCE - Résidence Les Terrasses',
    date: '2026-02-25',
    type: 'milestone',
    color: EVENT_TYPE_COLORS.milestone,
    project: 'Résidence Les Terrasses',
    time: '11:00',
  },
  {
    id: '8',
    title: 'Rendu DCE - Résidence Les Terrasses',
    date: '2026-02-28',
    type: 'deadline',
    color: EVENT_TYPE_COLORS.deadline,
    project: 'Résidence Les Terrasses',
    time: '18:00',
  },
  {
    id: '9',
    title: 'Réunion chantier - Restaurant',
    date: '2026-03-05',
    type: 'meeting',
    color: EVENT_TYPE_COLORS.meeting,
    project: 'Restaurant Le Comptoir',
    time: '09:30',
    location: 'Sur site',
  },
  {
    id: '10',
    title: 'Phase PRO - Bureaux Nextech',
    date: '2026-03-10',
    type: 'milestone',
    color: EVENT_TYPE_COLORS.milestone,
    project: 'Bureaux Nextech',
    time: '10:00',
  },
];

// ─── Helpers ────────────────────────────────────────────────────────────
function getMonthName(month: number): string {
  const names = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
  ];
  return names[month];
}

function isSameDay(a: string, b: string): boolean {
  return a === b;
}

function toDateKey(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function getTodayKey(): string {
  const now = new Date();
  return toDateKey(now.getFullYear(), now.getMonth(), now.getDate());
}

/** Returns an array of { date: Date, dateKey: string } representing each cell
 *  in a 6-row monthly calendar grid starting on Monday. */
function buildCalendarGrid(year: number, month: number) {
  const firstOfMonth = new Date(year, month, 1);
  // JS getDay(): 0=Sun..6=Sat  →  convert to Mon=0..Sun=6
  let startDay = firstOfMonth.getDay() - 1;
  if (startDay < 0) startDay = 6;

  const grid: { date: Date; dateKey: string }[] = [];

  // Previous month fill
  for (let i = startDay - 1; i >= 0; i--) {
    const d = new Date(year, month, -i);
    grid.push({ date: d, dateKey: toDateKey(d.getFullYear(), d.getMonth(), d.getDate()) });
  }

  // Current month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let d = 1; d <= daysInMonth; d++) {
    const dt = new Date(year, month, d);
    grid.push({ date: dt, dateKey: toDateKey(year, month, d) });
  }

  // Next month fill (up to 42 cells = 6 rows)
  while (grid.length < 42) {
    const d = new Date(year, month + 1, grid.length - startDay - daysInMonth + 1);
    grid.push({ date: d, dateKey: toDateKey(d.getFullYear(), d.getMonth(), d.getDate()) });
  }

  return grid;
}

function formatDateFr(dateKey: string): string {
  const [y, m, d] = dateKey.split('-').map(Number);
  const dayNames = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  const dt = new Date(y, m - 1, d);
  return `${dayNames[dt.getDay()]} ${d} ${getMonthName(m - 1)} ${y}`;
}

// ─── Component ──────────────────────────────────────────────────────────
export default function CalendarPage() {
  const today = getTodayKey();
  const [currentYear, setCurrentYear] = useState(() => {
    const parts = today.split('-');
    return Number(parts[0]);
  });
  const [currentMonth, setCurrentMonth] = useState(() => {
    const parts = today.split('-');
    return Number(parts[1]) - 1;
  });
  const [view, setView] = useState<'month' | 'list'>('month');
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  // Build events map  dateKey → events[]
  const eventsMap = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    MOCK_EVENTS.forEach((ev) => {
      if (!map[ev.date]) map[ev.date] = [];
      map[ev.date].push(ev);
    });
    return map;
  }, []);

  // Calendar grid for current month
  const grid = useMemo(
    () => buildCalendarGrid(currentYear, currentMonth),
    [currentYear, currentMonth]
  );

  // Events for the current month range (for list view)
  const monthEvents = useMemo(() => {
    return MOCK_EVENTS.filter((ev) => {
      const [y, m] = ev.date.split('-').map(Number);
      return y === currentYear && m === currentMonth + 1;
    }).sort((a, b) => a.date.localeCompare(b.date));
  }, [currentYear, currentMonth]);

  // Events grouped by date for list view
  const groupedEvents = useMemo(() => {
    const groups: { dateKey: string; events: CalendarEvent[] }[] = [];
    const seen = new Set<string>();
    monthEvents.forEach((ev) => {
      if (!seen.has(ev.date)) {
        seen.add(ev.date);
        groups.push({ dateKey: ev.date, events: monthEvents.filter((e) => e.date === ev.date) });
      }
    });
    return groups;
  }, [monthEvents]);

  // Navigation
  const goToPrevMonth = useCallback(() => {
    setCurrentMonth((m) => {
      if (m === 0) {
        setCurrentYear((y) => y - 1);
        return 11;
      }
      return m - 1;
    });
    setSelectedDay(null);
  }, []);

  const goToNextMonth = useCallback(() => {
    setCurrentMonth((m) => {
      if (m === 11) {
        setCurrentYear((y) => y + 1);
        return 0;
      }
      return m + 1;
    });
    setSelectedDay(null);
  }, []);

  const goToToday = useCallback(() => {
    const now = new Date();
    setCurrentYear(now.getFullYear());
    setCurrentMonth(now.getMonth());
    setSelectedDay(null);
  }, []);

  // Selected day events
  const selectedDayEvents = selectedDay ? eventsMap[selectedDay] ?? [] : [];

  // Responsive: detect mobile for default list view
  // We use a simple width check via CSS — on mobile list view is default

  return (
    <div className="flex flex-col" style={{ gap: '0px' }}>
      {/* ─── Header ────────────────────────────────────────────── */}
      <div
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between"
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          padding: '16px 20px',
          border: '1px solid #e5e7eb',
          marginBottom: '20px',
          gap: '12px',
        }}
      >
        {/* Left: Month nav */}
        <div className="flex items-center" style={{ gap: '12px' }}>
          <button
            onClick={goToPrevMonth}
            style={{
              padding: '8px',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              backgroundColor: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 150ms',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f3f4f6')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
          >
            <ChevronLeft style={{ width: '18px', height: '18px', color: '#374151' }} />
          </button>

          <h2
            style={{
              fontSize: '18px',
              fontWeight: 700,
              color: '#111827',
              minWidth: '200px',
              textAlign: 'center',
            }}
          >
            {getMonthName(currentMonth)} {currentYear}
          </h2>

          <button
            onClick={goToNextMonth}
            style={{
              padding: '8px',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              backgroundColor: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 150ms',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f3f4f6')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
          >
            <ChevronRight style={{ width: '18px', height: '18px', color: '#374151' }} />
          </button>

          <button
            onClick={goToToday}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              backgroundColor: '#ffffff',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 500,
              color: '#374151',
              transition: 'background-color 150ms',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f3f4f6')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
          >
            Aujourd&apos;hui
          </button>
        </div>

        {/* Right: View toggle */}
        <div
          className="flex items-center"
          style={{
            backgroundColor: '#f3f4f6',
            borderRadius: '8px',
            padding: '3px',
            gap: '2px',
          }}
        >
          <button
            onClick={() => setView('month')}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: view === 'month' ? '#ffffff' : 'transparent',
              boxShadow: view === 'month' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 500,
              color: view === 'month' ? '#111827' : '#6b7280',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 150ms',
            }}
          >
            <Grid3X3 style={{ width: '14px', height: '14px' }} />
            Mois
          </button>
          <button
            onClick={() => setView('list')}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: view === 'list' ? '#ffffff' : 'transparent',
              boxShadow: view === 'list' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 500,
              color: view === 'list' ? '#111827' : '#6b7280',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 150ms',
            }}
          >
            <List style={{ width: '14px', height: '14px' }} />
            Liste
          </button>
        </div>
      </div>

      {/* ─── Legend ─────────────────────────────────────────────── */}
      <div
        className="flex flex-wrap items-center"
        style={{
          gap: '16px',
          marginBottom: '16px',
          padding: '0 4px',
        }}
      >
        {(Object.keys(EVENT_TYPE_COLORS) as EventType[]).map((type) => (
          <div key={type} className="flex items-center" style={{ gap: '6px' }}>
            <span
              style={{
                display: 'inline-block',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: EVENT_TYPE_COLORS[type],
              }}
            />
            <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: 500 }}>
              {EVENT_TYPE_LABELS[type]}
            </span>
          </div>
        ))}
      </div>

      {/* ─── Content Area ──────────────────────────────────────── */}
      <div className="flex" style={{ gap: '20px' }}>
        {/* Calendar / List */}
        <div className="flex-1" style={{ minWidth: 0 }}>
          {view === 'month' ? (
            <MonthView
              grid={grid}
              eventsMap={eventsMap}
              currentMonth={currentMonth}
              today={today}
              selectedDay={selectedDay}
              onSelectDay={setSelectedDay}
            />
          ) : (
            <ListView
              groupedEvents={groupedEvents}
              monthName={`${getMonthName(currentMonth)} ${currentYear}`}
            />
          )}
        </div>

        {/* ─── Side Panel (month view only) ───────────────────── */}
        {view === 'month' && selectedDay && (
          <div
            className="hidden lg:block"
            style={{
              width: '340px',
              flexShrink: 0,
            }}
          >
            <DayDetailPanel
              dateKey={selectedDay}
              events={selectedDayEvents}
              onClose={() => setSelectedDay(null)}
            />
          </div>
        )}
      </div>

      {/* ─── Mobile Day Detail Modal ───────────────────────────── */}
      {view === 'month' && selectedDay && (
        <div className="lg:hidden">
          <div
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0,0,0,0.3)',
              zIndex: 60,
            }}
            onClick={() => setSelectedDay(null)}
          />
          <div
            style={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 70,
              backgroundColor: '#ffffff',
              borderTopLeftRadius: '16px',
              borderTopRightRadius: '16px',
              maxHeight: '70vh',
              overflowY: 'auto',
              boxShadow: '0 -4px 20px rgba(0,0,0,0.15)',
            }}
          >
            <DayDetailPanel
              dateKey={selectedDay}
              events={selectedDayEvents}
              onClose={() => setSelectedDay(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Month View Component ───────────────────────────────────────────────
function MonthView({
  grid,
  eventsMap,
  currentMonth,
  today,
  selectedDay,
  onSelectDay,
}: {
  grid: ReturnType<typeof buildCalendarGrid>;
  eventsMap: Record<string, CalendarEvent[]>;
  currentMonth: number;
  today: string;
  selectedDay: string | null;
  onSelectDay: (day: string) => void;
}) {
  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        overflow: 'hidden',
      }}
    >
      {/* Day headers */}
      <div
        className="grid"
        style={{
          gridTemplateColumns: 'repeat(7, 1fr)',
          borderBottom: '1px solid #e5e7eb',
          backgroundColor: '#f9fafb',
        }}
      >
        {DAY_HEADERS.map((day) => (
          <div
            key={day}
            style={{
              padding: '10px 4px',
              textAlign: 'center',
              fontSize: '12px',
              fontWeight: 600,
              color: '#6b7280',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div
        className="grid"
        style={{
          gridTemplateColumns: 'repeat(7, 1fr)',
        }}
      >
        {grid.map(({ dateKey, date }, idx) => {
          const isCurrentMonth = date.getMonth() === currentMonth;
          const isToday = isSameDay(dateKey, today);
          const isSelected = selectedDay === dateKey;
          const dayEvents = eventsMap[dateKey] ?? [];
          const dayNum = date.getDate();

          return (
            <div
              key={idx}
              onClick={() => onSelectDay(dateKey)}
              style={{
                minHeight: '90px',
                padding: '6px 8px',
                borderRight: (idx + 1) % 7 !== 0 ? '1px solid #f3f4f6' : 'none',
                borderBottom: idx < 35 ? '1px solid #f3f4f6' : 'none',
                backgroundColor: isSelected
                  ? '#eff6ff'
                  : isToday
                    ? '#fefce8'
                    : '#ffffff',
                cursor: 'pointer',
                transition: 'background-color 150ms',
                position: 'relative',
              }}
              onMouseEnter={(e) => {
                if (!isSelected) e.currentTarget.style.backgroundColor = '#f9fafb';
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.backgroundColor = isToday ? '#fefce8' : '#ffffff';
                }
              }}
            >
              {/* Day number */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  marginBottom: '4px',
                }}
              >
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: isToday ? '26px' : 'auto',
                    height: isToday ? '26px' : 'auto',
                    borderRadius: isToday ? '50%' : '0',
                    backgroundColor: isToday ? '#2563EB' : 'transparent',
                    color: isToday
                      ? '#ffffff'
                      : isCurrentMonth
                        ? '#111827'
                        : '#d1d5db',
                    fontSize: '13px',
                    fontWeight: isToday ? 700 : isCurrentMonth ? 500 : 400,
                  }}
                >
                  {dayNum}
                </span>
              </div>

              {/* Event pills */}
              <div className="flex flex-col" style={{ gap: '2px' }}>
                {dayEvents.slice(0, 3).map((ev) => (
                  <div
                    key={ev.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '1px 5px',
                      borderRadius: '4px',
                      backgroundColor: `${ev.color}15`,
                      borderLeft: `3px solid ${ev.color}`,
                      overflow: 'hidden',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 500,
                        color: ev.color,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {ev.title}
                    </span>
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <span
                    style={{
                      fontSize: '10px',
                      color: '#6b7280',
                      fontWeight: 500,
                      paddingLeft: '4px',
                    }}
                  >
                    +{dayEvents.length - 3} de plus
                  </span>
                )}
              </div>

              {/* Today indicator border */}
              {isToday && (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    border: '2px solid #2563EB',
                    borderRadius: '0',
                    pointerEvents: 'none',
                  }}
                />
              )}
              {/* Selected indicator border */}
              {isSelected && !isToday && (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    border: '2px solid #93c5fd',
                    borderRadius: '0',
                    pointerEvents: 'none',
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Day Detail Panel ───────────────────────────────────────────────────
function DayDetailPanel({
  dateKey,
  events,
  onClose,
}: {
  dateKey: string;
  events: CalendarEvent[];
  onClose: () => void;
}) {
  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        overflow: 'hidden',
      }}
    >
      {/* Panel header */}
      <div
        className="flex items-center justify-between"
        style={{
          padding: '16px 20px',
          borderBottom: '1px solid #e5e7eb',
          backgroundColor: '#f9fafb',
        }}
      >
        <div>
          <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#111827', margin: 0 }}>
            {formatDateFr(dateKey)}
          </h3>
          <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
            {events.length} événement{events.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={onClose}
          style={{
            padding: '6px',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            color: '#9ca3af',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'color 150ms',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#374151')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#9ca3af')}
        >
          <X style={{ width: '18px', height: '18px' }} />
        </button>
      </div>

      {/* Events list */}
      <div style={{ padding: '12px 16px' }}>
        {events.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center"
            style={{ padding: '32px 16px', gap: '8px' }}
          >
            <Calendar style={{ width: '32px', height: '32px', color: '#d1d5db' }} />
            <p style={{ fontSize: '13px', color: '#9ca3af', textAlign: 'center' }}>
              Aucun événement prévu ce jour
            </p>
          </div>
        ) : (
          <div className="flex flex-col" style={{ gap: '10px' }}>
            {events.map((ev) => (
              <div
                key={ev.id}
                style={{
                  padding: '14px 16px',
                  borderRadius: '10px',
                  border: '1px solid #f3f4f6',
                  backgroundColor: '#ffffff',
                  borderLeft: `4px solid ${ev.color}`,
                  transition: 'box-shadow 150ms',
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)')
                }
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
              >
                {/* Type badge */}
                <div className="flex items-center justify-between" style={{ marginBottom: '8px' }}>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '2px 8px',
                      borderRadius: '999px',
                      backgroundColor: `${ev.color}15`,
                      color: ev.color,
                      fontSize: '11px',
                      fontWeight: 600,
                    }}
                  >
                    {EVENT_TYPE_LABELS[ev.type]}
                  </span>
                </div>

                {/* Title */}
                <h4
                  style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#111827',
                    margin: '0 0 8px 0',
                    lineHeight: '1.4',
                  }}
                >
                  {ev.title}
                </h4>

                {/* Meta info */}
                <div className="flex flex-col" style={{ gap: '4px' }}>
                  {ev.time && (
                    <div className="flex items-center" style={{ gap: '6px' }}>
                      <Clock style={{ width: '13px', height: '13px', color: '#9ca3af' }} />
                      <span style={{ fontSize: '12px', color: '#6b7280' }}>{ev.time}</span>
                    </div>
                  )}
                  {ev.location && (
                    <div className="flex items-center" style={{ gap: '6px' }}>
                      <MapPin style={{ width: '13px', height: '13px', color: '#9ca3af' }} />
                      <span style={{ fontSize: '12px', color: '#6b7280' }}>{ev.location}</span>
                    </div>
                  )}
                  {ev.project && (
                    <div className="flex items-center" style={{ gap: '6px' }}>
                      <Flag style={{ width: '13px', height: '13px', color: '#9ca3af' }} />
                      <span style={{ fontSize: '12px', color: '#6b7280' }}>{ev.project}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── List View Component ────────────────────────────────────────────────
function ListView({
  groupedEvents,
  monthName,
}: {
  groupedEvents: { dateKey: string; events: CalendarEvent[] }[];
  monthName: string;
}) {
  if (groupedEvents.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center"
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          padding: '60px 20px',
          gap: '12px',
        }}
      >
        <Calendar style={{ width: '40px', height: '40px', color: '#d1d5db' }} />
        <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#374151' }}>
          Aucun événement
        </h3>
        <p style={{ fontSize: '13px', color: '#9ca3af' }}>
          Aucun événement prévu en {monthName}
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        overflow: 'hidden',
      }}
    >
      {/* List header */}
      <div
        style={{
          padding: '16px 20px',
          borderBottom: '1px solid #e5e7eb',
          backgroundColor: '#f9fafb',
        }}
      >
        <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#111827', margin: 0 }}>
          Événements du mois - {monthName}
        </h3>
      </div>

      {/* Timeline */}
      <div style={{ padding: '16px 20px' }}>
        {groupedEvents.map((group, gIdx) => (
          <div key={group.dateKey}>
            {/* Date header */}
            <div
              className="flex items-center"
              style={{
                gap: '10px',
                marginBottom: '12px',
                marginTop: gIdx > 0 ? '24px' : '0',
              }}
            >
              {/* Date circle */}
              <div
                className="flex items-center justify-center"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: group.dateKey === getTodayKey() ? '#2563EB' : '#f3f4f6',
                  color: group.dateKey === getTodayKey() ? '#ffffff' : '#374151',
                  fontSize: '14px',
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {Number(group.dateKey.split('-')[2])}
              </div>
              <span
                style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#374151',
                }}
              >
                {formatDateFr(group.dateKey)}
              </span>
            </div>

            {/* Events for that date */}
            <div
              className="flex flex-col"
              style={{
                gap: '8px',
                marginLeft: '18px',
                paddingLeft: '26px',
                borderLeft: '2px solid #e5e7eb',
                paddingBottom: gIdx < groupedEvents.length - 1 ? '4px' : '0',
              }}
            >
              {group.events.map((ev) => (
                <div
                  key={ev.id}
                  className="flex items-start"
                  style={{
                    padding: '12px 16px',
                    borderRadius: '10px',
                    border: '1px solid #f3f4f6',
                    backgroundColor: '#ffffff',
                    borderLeft: `4px solid ${ev.color}`,
                    gap: '12px',
                    transition: 'box-shadow 150ms',
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)')
                  }
                  onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
                >
                  <div className="flex-1" style={{ minWidth: 0 }}>
                    {/* Type badge + time */}
                    <div
                      className="flex items-center flex-wrap"
                      style={{ gap: '8px', marginBottom: '6px' }}
                    >
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          padding: '2px 8px',
                          borderRadius: '999px',
                          backgroundColor: `${ev.color}15`,
                          color: ev.color,
                          fontSize: '11px',
                          fontWeight: 600,
                        }}
                      >
                        {EVENT_TYPE_LABELS[ev.type]}
                      </span>
                      {ev.time && (
                        <span
                          className="flex items-center"
                          style={{ gap: '4px', fontSize: '12px', color: '#6b7280' }}
                        >
                          <Clock style={{ width: '12px', height: '12px' }} />
                          {ev.time}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h4
                      style={{
                        fontSize: '14px',
                        fontWeight: 600,
                        color: '#111827',
                        margin: '0 0 6px 0',
                      }}
                    >
                      {ev.title}
                    </h4>

                    {/* Meta */}
                    <div className="flex items-center flex-wrap" style={{ gap: '12px' }}>
                      {ev.location && (
                        <span
                          className="flex items-center"
                          style={{ gap: '4px', fontSize: '12px', color: '#6b7280' }}
                        >
                          <MapPin style={{ width: '12px', height: '12px' }} />
                          {ev.location}
                        </span>
                      )}
                      {ev.project && (
                        <span
                          className="flex items-center"
                          style={{ gap: '4px', fontSize: '12px', color: '#6b7280' }}
                        >
                          <Flag style={{ width: '12px', height: '12px' }} />
                          {ev.project}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
