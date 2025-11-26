"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, CheckCircle2, Circle, Clock } from "lucide-react";
import { TaskCard } from "./TaskCard";
import { ProgressBar } from "./ProgressBar";

interface Task {
  id: string;
  title: string;
  description: string | null;
  teachingNotes?: string | null;
  orderIndex: number;
  progress: {
    status: string;
    notes: string | null;
    feedback: string | null;
    completionDate: Date | string | null;
  } | null;
}

interface PhaseAccordionProps {
  id: string;
  title: string;
  description: string | null;
  tasks: Task[];
  phaseNumber: number;
  onTaskStatusChange: (taskId: string, status: string) => void;
  onTaskNotesChange: (taskId: string, notes: string, feedback: string) => void;
}

export function PhaseAccordion({
  id,
  title,
  description,
  tasks,
  phaseNumber,
  onTaskStatusChange,
  onTaskNotesChange,
}: PhaseAccordionProps) {
  const [expanded, setExpanded] = useState(false);

  const completedTasks = tasks.filter(
    (t) => t.progress?.status === "completed"
  ).length;
  const inProgressTasks = tasks.filter(
    (t) => t.progress?.status === "in_progress"
  ).length;
  const totalTasks = tasks.length;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const getStatusIcon = () => {
    if (completedTasks === totalTasks) {
      return <CheckCircle2 className="w-6 h-6 text-signal-green" />;
    }
    if (inProgressTasks > 0 || completedTasks > 0) {
      return <Clock className="w-6 h-6 text-signal-yellow" />;
    }
    return <Circle className="w-6 h-6 text-chrome/40" />;
  };

  return (
    <div className="card overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-center gap-4 tap-target text-left hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-sky-blue/20 text-sky-blue font-bold">
          {phaseNumber}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-chrome truncate">
              {title.replace(/^Phase \d+: /, "")}
            </h3>
            {getStatusIcon()}
          </div>
          <p className="text-sm text-chrome/60 mt-1 truncate">{description}</p>
          <div className="mt-2">
            <ProgressBar value={completedTasks} max={totalTasks} size="sm" showLabel={false} />
          </div>
          <p className="text-xs text-chrome/50 mt-1">
            {completedTasks} of {totalTasks} tasks complete
          </p>
        </div>

        <div className="text-chrome/60">
          {expanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-chrome/10 p-4 animate-fade-in">
          <div className="space-y-3">
            {tasks
              .sort((a, b) => a.orderIndex - b.orderIndex)
              .map((task) => (
                <TaskCard
                  key={task.id}
                  id={task.id}
                  title={task.title}
                  description={task.description}
                  teachingNotes={task.teachingNotes}
                  status={(task.progress?.status as "not_started" | "in_progress" | "completed") || "not_started"}
                  notes={task.progress?.notes}
                  feedback={task.progress?.feedback}
                  completionDate={task.progress?.completionDate}
                  onStatusChange={onTaskStatusChange}
                  onNotesChange={onTaskNotesChange}
                />
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

