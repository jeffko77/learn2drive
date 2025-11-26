"use client";

import { useState } from "react";
import { Check, Circle, Clock, MessageSquare, ChevronDown, ChevronUp } from "lucide-react";

interface TaskCardProps {
  id: string;
  title: string;
  description?: string | null;
  status: "not_started" | "in_progress" | "completed";
  notes?: string | null;
  feedback?: string | null;
  completionDate?: Date | string | null;
  onStatusChange: (taskId: string, status: string) => void;
  onNotesChange: (taskId: string, notes: string, feedback: string) => void;
}

export function TaskCard({
  id,
  title,
  description,
  status,
  notes,
  feedback,
  completionDate,
  onStatusChange,
  onNotesChange,
}: TaskCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [localNotes, setLocalNotes] = useState(notes || "");
  const [localFeedback, setLocalFeedback] = useState(feedback || "");
  const [saving, setSaving] = useState(false);

  const statusConfig = {
    not_started: {
      icon: Circle,
      color: "text-chrome/40",
      bgColor: "bg-chrome/10",
      label: "Not Started",
    },
    in_progress: {
      icon: Clock,
      color: "text-signal-yellow",
      bgColor: "bg-signal-yellow/20",
      label: "In Progress",
    },
    completed: {
      icon: Check,
      color: "text-signal-green",
      bgColor: "bg-signal-green/20",
      label: "Completed",
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  const handleStatusCycle = () => {
    const statusOrder: Array<"not_started" | "in_progress" | "completed"> = [
      "not_started",
      "in_progress",
      "completed",
    ];
    const currentIndex = statusOrder.indexOf(status);
    const nextStatus = statusOrder[(currentIndex + 1) % 3];
    onStatusChange(id, nextStatus);
  };

  const handleSaveNotes = async () => {
    setSaving(true);
    await onNotesChange(id, localNotes, localFeedback);
    setSaving(false);
  };

  return (
    <div
      className={`card p-4 transition-all ${
        status === "completed" ? "opacity-75" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={handleStatusCycle}
          className={`tap-target p-2 rounded-xl ${config.bgColor} transition-all hover:scale-110`}
          aria-label={`Change status, currently ${config.label}`}
        >
          <Icon className={`w-5 h-5 ${config.color}`} />
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4
              className={`font-medium ${
                status === "completed" ? "line-through text-chrome/60" : "text-chrome"
              }`}
            >
              {title}
            </h4>
            <button
              onClick={() => setExpanded(!expanded)}
              className="tap-target p-2 text-chrome/60 hover:text-chrome"
            >
              {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
          </div>

          {description && (
            <p className="text-sm text-chrome/60 mt-1">{description}</p>
          )}

          {status === "completed" && completionDate && (
            <p className="text-xs text-signal-green mt-2">
              Completed on {new Date(completionDate).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-chrome/10 animate-fade-in">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-chrome/80 mb-2">
                <MessageSquare size={14} className="inline mr-2" />
                Notes / Observations
              </label>
              <textarea
                value={localNotes}
                onChange={(e) => setLocalNotes(e.target.value)}
                placeholder="Add notes about this skill..."
                className="input min-h-[80px] resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-chrome/80 mb-2">
                Instructor Feedback
              </label>
              <textarea
                value={localFeedback}
                onChange={(e) => setLocalFeedback(e.target.value)}
                placeholder="Feedback for the driver..."
                className="input min-h-[80px] resize-none"
              />
            </div>

            <button
              onClick={handleSaveNotes}
              disabled={saving}
              className="btn btn-primary w-full"
            >
              {saving ? "Saving..." : "Save Notes"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

