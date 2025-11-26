"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Car, Clock, FileText, Edit2 } from "lucide-react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  parseISO,
} from "date-fns";

interface DrivingLog {
  id: string;
  date: string;
  duration: number;
  notes: string | null;
  weather: string | null;
  roadTypes: string | null;
}

interface DrivingCalendarProps {
  logs: DrivingLog[];
  onDateClick?: (date: Date, logs: DrivingLog[]) => void;
  onLogClick?: (log: DrivingLog) => void;
  onEditLog?: (log: DrivingLog) => void;
}

export function DrivingCalendar({ logs, onDateClick, onLogClick, onEditLog }: DrivingCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  // Create a map of dates to logs
  const logsByDate = logs.reduce((acc, log) => {
    const dateKey = format(parseISO(log.date), "yyyy-MM-dd");
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(log);
    return acc;
  }, {} as Record<string, DrivingLog[]>);

  // Generate calendar days
  const days: Date[] = [];
  let day = calendarStart;
  while (day <= calendarEnd) {
    days.push(day);
    day = addDays(day, 1);
  }

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    const dateKey = format(date, "yyyy-MM-dd");
    const dateLogs = logsByDate[dateKey] || [];
    onDateClick?.(date, dateLogs);
  };

  const getDateLogs = (date: Date) => {
    const dateKey = format(date, "yyyy-MM-dd");
    return logsByDate[dateKey] || [];
  };

  const getTotalMinutes = (date: Date) => {
    const dateLogs = getDateLogs(date);
    return dateLogs.reduce((sum, log) => sum + log.duration, 0);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }
    return `${mins}m`;
  };

  const selectedDateLogs = selectedDate ? getDateLogs(selectedDate) : [];

  return (
    <div className="space-y-4">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="tap-target p-2 rounded-lg hover:bg-chrome/10 text-chrome/60 hover:text-chrome"
        >
          <ChevronLeft size={20} />
        </button>
        <h3 className="text-lg font-semibold text-chrome">
          {format(currentMonth, "MMMM yyyy")}
        </h3>
        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="tap-target p-2 rounded-lg hover:bg-chrome/10 text-chrome/60 hover:text-chrome"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((dayName) => (
          <div
            key={dayName}
            className="text-center text-xs font-medium text-chrome/50 py-2"
          >
            {dayName}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((date, index) => {
          const dateLogs = getDateLogs(date);
          const hasLogs = dateLogs.length > 0;
          const totalMinutes = getTotalMinutes(date);
          const isCurrentMonth = isSameMonth(date, currentMonth);
          const isSelected = selectedDate && isSameDay(date, selectedDate);
          const isToday = isSameDay(date, new Date());

          return (
            <button
              key={index}
              onClick={() => handleDateClick(date)}
              className={`
                relative aspect-square p-1 rounded-lg transition-all tap-target
                ${!isCurrentMonth ? "opacity-30" : ""}
                ${isSelected ? "bg-sky-blue/30 ring-2 ring-sky-blue" : "hover:bg-chrome/10"}
                ${isToday && !isSelected ? "ring-1 ring-chrome/30" : ""}
                ${hasLogs ? "bg-signal-green/20" : ""}
              `}
            >
              <div className="flex flex-col items-center h-full">
                <span className={`text-sm ${hasLogs ? "font-bold text-signal-green" : "text-chrome/80"}`}>
                  {format(date, "d")}
                </span>
                {hasLogs && (
                  <div className="flex items-center gap-0.5 mt-0.5">
                    <Car size={10} className="text-signal-green" />
                    <span className="text-[9px] text-signal-green font-medium">
                      {formatDuration(totalMinutes)}
                    </span>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected date details */}
      {selectedDate && (
        <div className="card p-4 mt-4 animate-fade-in">
          <h4 className="font-medium text-chrome mb-3">
            {format(selectedDate, "EEEE, MMMM d, yyyy")}
          </h4>
          
          {selectedDateLogs.length > 0 ? (
            <div className="space-y-3">
              {selectedDateLogs.map((log) => (
                <div
                  key={log.id}
                  onClick={() => onLogClick?.(log)}
                  className="p-3 rounded-lg bg-dashboard/50 border border-chrome/10 cursor-pointer hover:border-sky-blue/30 transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-sky-blue" />
                      <span className="font-medium text-chrome">
                        {formatDuration(log.duration)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {log.weather && (
                        <span className="text-xs px-2 py-1 rounded-full bg-chrome/10 text-chrome/60">
                          {log.weather}
                        </span>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditLog?.(log);
                        }}
                        className="p-1.5 rounded-lg hover:bg-chrome/20 text-chrome/50 hover:text-sky-blue transition-all"
                        title="Edit session"
                      >
                        <Edit2 size={14} />
                      </button>
                    </div>
                  </div>
                  
                  {log.roadTypes && (
                    <div className="text-xs text-chrome/60 mb-2">
                      {log.roadTypes}
                    </div>
                  )}
                  
                  {log.notes && (
                    <div className="flex items-start gap-2 mt-2 pt-2 border-t border-chrome/10">
                      <FileText size={12} className="text-highway-orange mt-0.5" />
                      <p className="text-sm text-chrome/70 line-clamp-2">{log.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-chrome/50">No driving sessions recorded</p>
          )}
        </div>
      )}
    </div>
  );
}

