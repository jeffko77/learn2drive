"use client";

import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { PhaseAccordion } from "@/components/PhaseAccordion";
import { GraduatedProgressBar } from "@/components/GraduatedProgressBar";
import { BirthdayCountdown } from "@/components/BirthdayCountdown";
import { Users, ChevronDown, CheckCircle2, Clock, Circle, BookOpen } from "lucide-react";
import Link from "next/link";

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
  phases: Phase[];
}

export default function TrainingPage() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "not_started" | "in_progress" | "completed">("all");

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      const res = await fetch("/api/drivers");
      const data = await res.json();
      const driverList = Array.isArray(data) ? data : [];
      setDrivers(driverList);
      if (driverList.length > 0) {
        setSelectedDriver(driverList[0]);
      }
    } catch (error) {
      console.error("Error fetching drivers:", error);
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
      await fetchDrivers();
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const handleTaskNotesChange = async (taskId: string, notes: string, feedback: string) => {
    if (!selectedDriver) return;
    
    try {
      const task = selectedDriver.phases
        .flatMap(p => p.tasks)
        .find(t => t.id === taskId);
      
      await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          taskId, 
          notes, 
          feedback,
          status: task?.progress?.status || "not_started"
        }),
      });
      await fetchDrivers();
    } catch (error) {
      console.error("Error updating task notes:", error);
    }
  };

  // Update selected driver when drivers list changes
  useEffect(() => {
    if (selectedDriver && drivers.length > 0) {
      const updated = drivers.find(d => d.id === selectedDriver.id);
      if (updated) {
        setSelectedDriver(updated);
      }
    }
  }, [drivers]);

  if (loading) {
    return (
      <main className="min-h-screen safe-bottom relative z-10 flex items-center justify-center">
        <div className="spinner" />
        <Navigation />
      </main>
    );
  }

  if (drivers.length === 0) {
    return (
      <main className="min-h-screen safe-bottom relative z-10">
        <div className="px-4 pt-8">
          <h1 className="text-2xl font-bold text-chrome mb-2">Training</h1>
          <p className="text-chrome/60 text-sm">Track driving skills progress</p>
        </div>

        <div className="px-4 mt-8">
          <div className="card p-8 text-center">
            <BookOpen className="w-12 h-12 text-chrome/30 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-chrome mb-2">
              No Drivers Yet
            </h3>
            <p className="text-chrome/60 mb-4">
              Add a driver to start tracking their training progress
            </p>
            <Link href="/drivers/new" className="btn btn-primary inline-flex">
              <Users size={20} />
              Add Driver
            </Link>
          </div>
        </div>

        <Navigation />
      </main>
    );
  }

  // Calculate stats for selected driver
  const allTasks = selectedDriver?.phases.flatMap((p) => p.tasks) || [];
  const completedTasks = allTasks.filter((t) => t.progress?.status === "completed");
  const inProgressTasks = allTasks.filter((t) => t.progress?.status === "in_progress");
  const notStartedTasks = allTasks.filter((t) => !t.progress || t.progress?.status === "not_started");

  // Filter phases based on status
  const filterPhases = (phases: Phase[]) => {
    if (filter === "all") return phases;
    
    return phases.map(phase => ({
      ...phase,
      tasks: phase.tasks.filter(task => {
        const status = task.progress?.status || "not_started";
        return status === filter;
      })
    })).filter(phase => phase.tasks.length > 0);
  };

  return (
    <main className="min-h-screen safe-bottom relative z-10">
      {/* Header */}
      <div className="px-4 pt-8 pb-4">
        <h1 className="text-2xl font-bold text-chrome mb-2">Training</h1>
        <p className="text-chrome/60 text-sm">Track driving skills progress</p>
      </div>

      {/* Driver Selector */}
      <div className="px-4 mb-4">
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-full card p-4 flex items-center justify-between tap-target"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-blue to-highway-orange flex items-center justify-center">
                <Users size={20} className="text-white" />
              </div>
              <div className="text-left">
                <p className="font-medium text-chrome">{selectedDriver?.name}</p>
                <p className="text-xs text-chrome/60">
                  {completedTasks.length} of {allTasks.length} complete
                </p>
              </div>
            </div>
            <ChevronDown
              size={20}
              className={`text-chrome/60 transition-transform ${
                dropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {dropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 card p-2 z-50 animate-fade-in">
              {drivers.map((driver) => (
                <button
                  key={driver.id}
                  onClick={() => {
                    setSelectedDriver(driver);
                    setDropdownOpen(false);
                  }}
                  className={`w-full p-3 rounded-lg text-left tap-target transition-colors ${
                    selectedDriver?.id === driver.id
                      ? "bg-sky-blue/20 text-sky-blue"
                      : "hover:bg-white/5 text-chrome"
                  }`}
                >
                  {driver.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Birthday Countdown */}
      {selectedDriver && (
        <div className="px-4 mb-4">
          <BirthdayCountdown birthDate={selectedDriver.birthDate} name={selectedDriver.name} />
        </div>
      )}

      {/* Progress Stats */}
      <div className="px-4 mb-4">
        <div className="card p-4">
          <GraduatedProgressBar 
            phases={selectedDriver?.phases.map(phase => ({
              id: phase.id,
              title: phase.title,
              completedTasks: phase.tasks.filter(t => t.progress?.status === "completed").length,
              totalTasks: phase.tasks.length,
            })) || []}
          />
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="px-4 mb-4 flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setFilter("all")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap tap-target transition-all ${
            filter === "all"
              ? "bg-sky-blue text-white"
              : "bg-chrome/10 text-chrome/60"
          }`}
        >
          All ({allTasks.length})
        </button>
        <button
          onClick={() => setFilter("not_started")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap tap-target transition-all ${
            filter === "not_started"
              ? "bg-chrome/60 text-white"
              : "bg-chrome/10 text-chrome/60"
          }`}
        >
          <Circle size={14} />
          Not Started ({notStartedTasks.length})
        </button>
        <button
          onClick={() => setFilter("in_progress")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap tap-target transition-all ${
            filter === "in_progress"
              ? "bg-signal-yellow text-road-dark"
              : "bg-chrome/10 text-chrome/60"
          }`}
        >
          <Clock size={14} />
          In Progress ({inProgressTasks.length})
        </button>
        <button
          onClick={() => setFilter("completed")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap tap-target transition-all ${
            filter === "completed"
              ? "bg-signal-green text-white"
              : "bg-chrome/10 text-chrome/60"
          }`}
        >
          <CheckCircle2 size={14} />
          Completed ({completedTasks.length})
        </button>
      </div>

      {/* Training Phases */}
      <div className="px-4">
        {selectedDriver && (
          <div className="space-y-3">
            {filterPhases(selectedDriver.phases)
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
      </div>

      <Navigation />
    </main>
  );
}

