"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Navigation } from "@/components/Navigation";
import { BirthdayCountdown } from "@/components/BirthdayCountdown";
import { ProgressBar } from "@/components/ProgressBar";
import { PhaseAccordion } from "@/components/PhaseAccordion";
import { ArrowLeft, Edit2, Trophy, Clock, CheckCircle2, FileText } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

interface Task {
  id: string;
  title: string;
  description: string | null;
  orderIndex: number;
  progress: {
    status: string;
    notes: string | null;
    feedback: string | null;
    completionDate: string | null;
  } | null;
}

interface Phase {
  id: string;
  title: string;
  description: string | null;
  orderIndex: number;
  tasks: Task[];
}

interface Driver {
  id: string;
  name: string;
  birthDate: string;
  startDate: string;
  phases: Phase[];
}

export default function DriverDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [driver, setDriver] = useState<Driver | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"training" | "notes">("training");

  useEffect(() => {
    fetchDriver();
  }, [id]);

  const fetchDriver = async () => {
    try {
      const res = await fetch(`/api/drivers/${id}`);
      if (res.ok) {
        const data = await res.json();
        setDriver(data);
      } else {
        router.push("/drivers");
      }
    } catch (error) {
      console.error("Error fetching driver:", error);
      router.push("/drivers");
    } finally {
      setLoading(false);
    }
  };

  const handleTaskStatusChange = async (taskId: string, status: string) => {
    try {
      await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId, status }),
      });
      await fetchDriver();
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const handleTaskNotesChange = async (taskId: string, notes: string, feedback: string) => {
    try {
      await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          taskId, 
          notes, 
          feedback,
          status: driver?.phases
            .flatMap(p => p.tasks)
            .find(t => t.id === taskId)?.progress?.status || "not_started"
        }),
      });
      await fetchDriver();
    } catch (error) {
      console.error("Error updating task notes:", error);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen pb-24 relative z-10 flex items-center justify-center">
        <div className="spinner" />
      </main>
    );
  }

  if (!driver) {
    return null;
  }

  // Calculate stats
  const allTasks = driver.phases.flatMap((p) => p.tasks);
  const completedTasks = allTasks.filter((t) => t.progress?.status === "completed");
  const inProgressTasks = allTasks.filter((t) => t.progress?.status === "in_progress");
  const totalTasks = allTasks.length;

  // Get all tasks with notes or feedback
  const tasksWithNotes = allTasks.filter(
    (t) => t.progress?.notes || t.progress?.feedback
  );

  // Get recent completions
  const recentCompletions = completedTasks
    .filter((t) => t.progress?.completionDate)
    .sort((a, b) => 
      new Date(b.progress!.completionDate!).getTime() - 
      new Date(a.progress!.completionDate!).getTime()
    )
    .slice(0, 5);

  return (
    <main className="min-h-screen pb-24 relative z-10">
      {/* Header */}
      <div className="px-4 pt-8 pb-4">
        <Link
          href="/drivers"
          className="inline-flex items-center gap-2 text-chrome/60 hover:text-chrome mb-4 tap-target"
        >
          <ArrowLeft size={20} />
          <span>Back to Drivers</span>
        </Link>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-chrome">{driver.name}</h1>
            <p className="text-chrome/60 text-sm">
              Training since {format(new Date(driver.startDate), "MMMM yyyy")}
            </p>
          </div>
          <Link
            href={`/drivers/${id}/edit`}
            className="btn btn-ghost"
          >
            <Edit2 size={18} />
          </Link>
        </div>
      </div>

      {/* Birthday Countdown */}
      <div className="px-4 mb-6">
        <BirthdayCountdown birthDate={driver.birthDate} name={driver.name} />
      </div>

      {/* Progress Stats */}
      <div className="px-4 mb-6">
        <div className="card p-4">
          <h3 className="text-sm font-medium text-chrome/60 mb-3">
            Overall Progress
          </h3>
          <ProgressBar value={completedTasks.length} max={totalTasks} size="lg" />

          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-signal-green mb-1">
                <CheckCircle2 size={16} />
                <span className="text-xl font-bold">{completedTasks.length}</span>
              </div>
              <p className="text-xs text-chrome/60">Completed</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-signal-yellow mb-1">
                <Clock size={16} />
                <span className="text-xl font-bold">{inProgressTasks.length}</span>
              </div>
              <p className="text-xs text-chrome/60">In Progress</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-chrome/60 mb-1">
                <Trophy size={16} />
                <span className="text-xl font-bold">{totalTasks - completedTasks.length - inProgressTasks.length}</span>
              </div>
              <p className="text-xs text-chrome/60">Remaining</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 mb-4">
        <div className="flex gap-2 p-1 rounded-xl bg-dashboard/80">
          <button
            onClick={() => setActiveTab("training")}
            className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all tap-target ${
              activeTab === "training"
                ? "bg-sky-blue text-white"
                : "text-chrome/60 hover:text-chrome"
            }`}
          >
            Training Phases
          </button>
          <button
            onClick={() => setActiveTab("notes")}
            className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all tap-target ${
              activeTab === "notes"
                ? "bg-sky-blue text-white"
                : "text-chrome/60 hover:text-chrome"
            }`}
          >
            Notes & Feedback
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-4">
        {activeTab === "training" ? (
          <div className="space-y-3">
            {driver.phases
              .sort((a, b) => a.orderIndex - b.orderIndex)
              .map((phase, index) => (
                <PhaseAccordion
                  key={phase.id}
                  id={phase.id}
                  title={phase.title}
                  description={phase.description}
                  tasks={phase.tasks}
                  phaseNumber={index + 1}
                  onTaskStatusChange={handleTaskStatusChange}
                  onTaskNotesChange={handleTaskNotesChange}
                />
              ))}
          </div>
        ) : (
          <div className="space-y-4">
            {/* Recent Completions */}
            {recentCompletions.length > 0 && (
              <div className="card p-4">
                <h3 className="font-medium text-chrome mb-3 flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-signal-green" />
                  Recent Completions
                </h3>
                <div className="space-y-3">
                  {recentCompletions.map((task) => (
                    <div key={task.id} className="flex items-center justify-between py-2 border-b border-chrome/10 last:border-0">
                      <span className="text-sm text-chrome">{task.title}</span>
                      <span className="text-xs text-chrome/50">
                        {format(new Date(task.progress!.completionDate!), "MMM d")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notes & Feedback */}
            {tasksWithNotes.length > 0 ? (
              <div className="space-y-3">
                {tasksWithNotes.map((task) => (
                  <div key={task.id} className="card p-4">
                    <div className="flex items-start gap-3">
                      <FileText size={18} className="text-sky-blue mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-medium text-chrome">{task.title}</h4>
                        {task.progress?.notes && (
                          <div className="mt-2">
                            <p className="text-xs text-chrome/50 mb-1">Notes:</p>
                            <p className="text-sm text-chrome/80">{task.progress.notes}</p>
                          </div>
                        )}
                        {task.progress?.feedback && (
                          <div className="mt-2 p-3 rounded-lg bg-highway-orange/10 border border-highway-orange/20">
                            <p className="text-xs text-highway-orange mb-1">Instructor Feedback:</p>
                            <p className="text-sm text-chrome/80">{task.progress.feedback}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="card p-8 text-center">
                <FileText className="w-12 h-12 text-chrome/30 mx-auto mb-4" />
                <p className="text-chrome/60">No notes or feedback yet</p>
                <p className="text-sm text-chrome/40 mt-1">
                  Add notes while tracking progress
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <Navigation />
    </main>
  );
}

