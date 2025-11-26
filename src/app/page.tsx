"use client";

import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Car, Users, BookOpen, Trophy, TrendingUp, Award } from "lucide-react";
import Link from "next/link";

interface Driver {
  id: string;
  name: string;
  birthDate: string;
  startDate: string;
  phases: Array<{
    tasks: Array<{
      progress: { status: string } | null;
    }>;
  }>;
}

interface Stats {
  questions: number;
  drivers: number;
}

export default function Home() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [stats, setStats] = useState<Stats>({ questions: 0, drivers: 0 });
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [driversRes, statsRes] = await Promise.all([
        fetch("/api/drivers"),
        fetch("/api/seed"),
      ]);
      
      const driversData = await driversRes.json();
      const statsData = await statsRes.json();
      
      setDrivers(Array.isArray(driversData) ? driversData : []);
      setStats(statsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSeedQuestions = async () => {
    setSeeding(true);
    try {
      await fetch("/api/seed", { method: "POST" });
      await fetchData();
    } catch (error) {
      console.error("Error seeding data:", error);
    } finally {
      setSeeding(false);
    }
  };

  // Calculate overall stats
  const totalSkills = drivers.reduce(
    (acc, d) => acc + d.phases.reduce((a, p) => a + p.tasks.length, 0),
    0
  );
  const completedSkills = drivers.reduce(
    (acc, d) =>
      acc +
      d.phases.reduce(
        (a, p) =>
          a + p.tasks.filter((t) => t.progress?.status === "completed").length,
        0
      ),
    0
  );

  return (
    <main className="min-h-screen pb-24 relative z-10">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-blue/20 via-transparent to-highway-orange/20" />
        <div className="relative px-4 pt-12 pb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-sky-blue to-highway-orange">
              <Car className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-center text-chrome">
            Learn2Drive
          </h1>
          <p className="text-center text-chrome/60 mt-2">
            Teen Driver Training Tracker
          </p>

          <div className="road-line" />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="px-4 -mt-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="card p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-sky-blue/20">
                <Users className="w-5 h-5 text-sky-blue" />
              </div>
              <div>
                <p className="text-2xl font-bold text-chrome">{drivers.length}</p>
                <p className="text-xs text-chrome/60">Active Drivers</p>
              </div>
            </div>
          </div>

          <div className="card p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-signal-green/20">
                <TrendingUp className="w-5 h-5 text-signal-green" />
              </div>
              <div>
                <p className="text-2xl font-bold text-chrome">
                  {totalSkills > 0 ? Math.round((completedSkills / totalSkills) * 100) : 0}%
                </p>
                <p className="text-xs text-chrome/60">Overall Progress</p>
              </div>
            </div>
          </div>

          <div className="card p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-highway-orange/20">
                <Award className="w-5 h-5 text-highway-orange" />
              </div>
              <div>
                <p className="text-2xl font-bold text-chrome">{completedSkills}</p>
                <p className="text-xs text-chrome/60">Skills Mastered</p>
              </div>
            </div>
          </div>

          <div className="card p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-signal-yellow/20">
                <BookOpen className="w-5 h-5 text-signal-yellow" />
              </div>
              <div>
                <p className="text-2xl font-bold text-chrome">{stats.questions}</p>
                <p className="text-xs text-chrome/60">Quiz Questions</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-4 mt-6">
        <h2 className="text-lg font-semibold text-chrome mb-4">Quick Actions</h2>
        <div className="grid gap-3">
          <Link href="/drivers/new">
            <div className="card p-4 hover:border-sky-blue/40 transition-all cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-sky-blue/20 to-sky-blue/10">
                  <Users className="w-6 h-6 text-sky-blue" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-chrome group-hover:text-sky-blue transition-colors">
                    Add New Driver
                  </h3>
                  <p className="text-sm text-chrome/60">
                    Create a new driver profile with training checklist
                  </p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/quiz">
            <div className="card p-4 hover:border-highway-orange/40 transition-all cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-highway-orange/20 to-highway-orange/10">
                  <Trophy className="w-6 h-6 text-highway-orange" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-chrome group-hover:text-highway-orange transition-colors">
                    Take Practice Quiz
                  </h3>
                  <p className="text-sm text-chrome/60">
                    Study for the Missouri written driver&apos;s test
                  </p>
                </div>
              </div>
            </div>
          </Link>

          {stats.questions === 0 && (
            <button
              onClick={handleSeedQuestions}
              disabled={seeding}
              className="card p-4 hover:border-signal-green/40 transition-all cursor-pointer text-left w-full group"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-signal-green/20 to-signal-green/10">
                  <BookOpen className="w-6 h-6 text-signal-green" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-chrome group-hover:text-signal-green transition-colors">
                    {seeding ? "Loading Questions..." : "Load Quiz Questions"}
                  </h3>
                  <p className="text-sm text-chrome/60">
                    Initialize 100+ Missouri DMV practice questions
                  </p>
                </div>
              </div>
            </button>
          )}
        </div>
      </div>

      {/* Recent Drivers */}
      {drivers.length > 0 && (
        <div className="px-4 mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-chrome">Recent Drivers</h2>
            <Link href="/drivers" className="text-sm text-sky-blue">
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {drivers.slice(0, 3).map((driver) => {
              const total = driver.phases.reduce((a, p) => a + p.tasks.length, 0);
              const completed = driver.phases.reduce(
                (a, p) =>
                  a + p.tasks.filter((t) => t.progress?.status === "completed").length,
                0
              );
              const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

              return (
                <Link key={driver.id} href={`/drivers/${driver.id}`}>
                  <div className="card p-4 hover:border-sky-blue/40 transition-all">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-chrome">{driver.name}</h3>
                        <p className="text-sm text-chrome/60">
                          {completed} of {total} skills completed
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-sky-blue">{progress}%</p>
                        <p className="text-xs text-chrome/60">complete</p>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="spinner" />
        </div>
      )}

      <Navigation />
    </main>
  );
}
