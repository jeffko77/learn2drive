"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Navigation } from "@/components/Navigation";
import { BirthdayCountdown } from "@/components/BirthdayCountdown";
import { ProgressBar } from "@/components/ProgressBar";
import { PhaseAccordion } from "@/components/PhaseAccordion";
import { DrivingCalendar } from "@/components/DrivingCalendar";
import { DrivingLogForm } from "@/components/DrivingLogForm";
import { ArrowLeft, Edit2, Trophy, Clock, CheckCircle2, FileText, Car, Plus } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

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

interface DrivingLog {
  id: string;
  date: string;
  duration: number;
  notes: string | null;
  weather: string | null;
  roadTypes: string | null;
}

export default function DriverDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [driver, setDriver] = useState<Driver | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"training" | "notes" | "driving">("training");
  const [drivingLogs, setDrivingLogs] = useState<DrivingLog[]>([]);
  const [showLogForm, setShowLogForm] = useState(false);
  const [selectedLogDate, setSelectedLogDate] = useState<Date | null>(null);
  const [editingLog, setEditingLog] = useState<DrivingLog | null>(null);

  useEffect(() => {
    fetchDriver();
    fetchDrivingLogs();
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

  const fetchDrivingLogs = async () => {
    try {
      const res = await fetch(`/api/driving-logs?driverId=${id}`);
      if (res.ok) {
        const data = await res.json();
        setDrivingLogs(data);
      }
    } catch (error) {
      console.error("Error fetching driving logs:", error);
    }
  };

  const handleAddDrivingLog = async (data: {
    date: string;
    duration: number;
    notes: string;
    weather: string;
    roadTypes: string;
  }) => {
    try {
      if (editingLog) {
        // Update existing log
        const res = await fetch(`/api/driving-logs/${editingLog.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (res.ok) {
          await fetchDrivingLogs();
          setShowLogForm(false);
          setSelectedLogDate(null);
          setEditingLog(null);
        }
      } else {
        // Create new log
        const res = await fetch("/api/driving-logs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ driverId: id, ...data }),
        });
        if (res.ok) {
          await fetchDrivingLogs();
          setShowLogForm(false);
          setSelectedLogDate(null);
        }
      }
    } catch (error) {
      console.error("Error saving driving log:", error);
    }
  };

  const handleEditLog = (log: DrivingLog) => {
    setEditingLog(log);
    setShowLogForm(true);
  };

  // Calculate total driving time
  const totalDrivingMinutes = drivingLogs.reduce((sum, log) => sum + log.duration, 0);
  const totalDrivingHours = Math.floor(totalDrivingMinutes / 60);
  const remainingMinutes = totalDrivingMinutes % 60;

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
    <main className="min-h-screen safe-bottom relative z-10">
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
        <div className="flex gap-1 p-1 rounded-xl bg-dashboard/80">
          <button
            onClick={() => setActiveTab("training")}
            className={`flex-1 py-2.5 px-2 rounded-lg text-xs font-medium transition-all tap-target ${
              activeTab === "training"
                ? "bg-sky-blue text-white"
                : "text-chrome/60 hover:text-chrome"
            }`}
          >
            Training
          </button>
          <button
            onClick={() => setActiveTab("driving")}
            className={`flex-1 py-2.5 px-2 rounded-lg text-xs font-medium transition-all tap-target ${
              activeTab === "driving"
                ? "bg-sky-blue text-white"
                : "text-chrome/60 hover:text-chrome"
            }`}
          >
            Driving Log
          </button>
          <button
            onClick={() => setActiveTab("notes")}
            className={`flex-1 py-2.5 px-2 rounded-lg text-xs font-medium transition-all tap-target ${
              activeTab === "notes"
                ? "bg-sky-blue text-white"
                : "text-chrome/60 hover:text-chrome"
            }`}
          >
            Notes
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-4">
        {activeTab === "training" && (
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
        )}

        {activeTab === "driving" && (
          <div className="space-y-4">
            {/* Driving Stats */}
            <div className="card p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-chrome flex items-center gap-2">
                  <Car size={18} className="text-sky-blue" />
                  Total Driving Time
                </h3>
                <button
                  onClick={() => {
                    setEditingLog(null);
                    setSelectedLogDate(new Date());
                    setShowLogForm(true);
                  }}
                  className="btn btn-primary py-2 px-3 text-sm"
                >
                  <Plus size={16} />
                  Log Session
                </button>
              </div>
              <div className="text-center py-4">
                <div className="text-4xl font-bold text-chrome">
                  {totalDrivingHours}
                  <span className="text-lg text-chrome/60">h</span>
                  {" "}
                  {remainingMinutes}
                  <span className="text-lg text-chrome/60">m</span>
                </div>
                <p className="text-sm text-chrome/50 mt-2">
                  {drivingLogs.length} session{drivingLogs.length !== 1 ? "s" : ""} logged
                </p>
              </div>
            </div>

            {/* Log Form */}
            {showLogForm && (
              <DrivingLogForm
                driverId={id}
                initialDate={selectedLogDate || undefined}
                existingLog={editingLog || undefined}
                onSubmit={handleAddDrivingLog}
                onCancel={() => {
                  setShowLogForm(false);
                  setSelectedLogDate(null);
                  setEditingLog(null);
                }}
              />
            )}

            {/* Calendar */}
            <div className="card p-4">
              <DrivingCalendar
                logs={drivingLogs}
                onDateClick={(date, logs) => {
                  if (logs.length === 0) {
                    setEditingLog(null);
                    setSelectedLogDate(date);
                    setShowLogForm(true);
                  }
                }}
                onEditLog={handleEditLog}
              />
            </div>
          </div>
        )}

        {activeTab === "notes" && (
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
                          <div className="mt-2 p-3 rounded-lg bg-sky-blue/10 border border-sky-blue/20">
                            <p className="text-xs text-sky-blue mb-1">Instructor Feedback:</p>
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

