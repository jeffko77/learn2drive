"use client";

import Link from "next/link";
import { User, Calendar, ChevronRight, Trash2 } from "lucide-react";
import { format, differenceInYears, differenceInDays, addYears, parseISO } from "date-fns";
import { ProgressBar } from "./ProgressBar";

interface Phase {
  tasks: Array<{
    progress: {
      status: string;
    } | null;
  }>;
}

interface DriverCardProps {
  id: string;
  name: string;
  birthDate: Date | string;
  startDate: Date | string;
  phases: Phase[];
  onDelete?: (id: string) => void;
}

// Parse date string to local date (avoiding timezone issues)
function parseLocalDate(dateInput: Date | string): Date {
  if (dateInput instanceof Date) {
    // For Date objects, extract UTC components to avoid timezone shift
    return new Date(dateInput.getUTCFullYear(), dateInput.getUTCMonth(), dateInput.getUTCDate());
  }
  if (dateInput.includes('T')) {
    const parsed = parseISO(dateInput);
    // Create a new date using UTC year/month/day to avoid timezone shift
    return new Date(parsed.getUTCFullYear(), parsed.getUTCMonth(), parsed.getUTCDate());
  }
  const [year, month, day] = dateInput.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function DriverCard({
  id,
  name,
  birthDate,
  startDate,
  phases,
  onDelete,
}: DriverCardProps) {
  const birth = parseLocalDate(birthDate);
  const age = differenceInYears(new Date(), birth);
  const sixteenthBirthday = addYears(birth, 16);
  const daysUntil16 = differenceInDays(sixteenthBirthday, new Date());
  const isPast16 = daysUntil16 <= 0;

  // Calculate overall progress
  const allTasks = phases.flatMap((p) => p.tasks);
  const completedTasks = allTasks.filter(
    (t) => t.progress?.status === "completed"
  ).length;
  const totalTasks = allTasks.length;

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete && confirm(`Are you sure you want to delete ${name}? This cannot be undone.`)) {
      onDelete(id);
    }
  };

  return (
    <Link href={`/drivers/${id}`}>
      <div className="card p-4 hover:border-sky-blue/40 transition-all cursor-pointer group">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-blue to-highway-orange flex items-center justify-center flex-shrink-0">
            <User className="w-6 h-6 text-white" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-chrome text-lg truncate">
                {name}
              </h3>
              <div className="flex items-center gap-2">
                {onDelete && (
                  <button
                    onClick={handleDelete}
                    className="p-2 text-chrome/40 hover:text-signal-red transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
                <ChevronRight className="w-5 h-5 text-chrome/40 group-hover:text-sky-blue transition-colors" />
              </div>
            </div>

            <div className="flex items-center gap-4 mt-2 text-sm text-chrome/60">
              <span className="flex items-center gap-1">
                <Calendar size={14} />
                Age {age}
              </span>
              <span>
                Started {format(parseLocalDate(startDate), "MMM yyyy")}
              </span>
            </div>

            <div className="mt-3">
              <ProgressBar value={completedTasks} max={totalTasks} size="sm" />
            </div>

            <div className="mt-2 flex items-center justify-between">
              <span className="text-xs text-chrome/50">
                {completedTasks} of {totalTasks} skills
              </span>
              {!isPast16 && (
                <span className="badge badge-warning text-[10px]">
                  {daysUntil16} days to 16
                </span>
              )}
              {isPast16 && (
                <span className="badge badge-success text-[10px]">
                  Ready to drive!
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

