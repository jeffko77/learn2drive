"use client";

import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { 
  Signpost, 
  BookOpen, 
  ChevronRight, 
  Zap, 
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  Target,
  Layers
} from "lucide-react";
import Link from "next/link";

interface Driver {
  id: string;
  name: string;
}

interface SignCategory {
  id: string;
  name: string;
  description: string;
  _count?: {
    signs: number;
  };
  signs: Array<{ id: string }>;
}

interface RoadSignAttempt {
  id: string;
  correctAnswers: number;
  totalQuestions: number;
  percentage: number | null;
  passed: boolean | null;
  testDate: string;
  testMode: string;
  driver: {
    name: string;
  };
}

interface SeedStatus {
  categories: number;
  signs: number;
  seeded: boolean;
}

export default function RoadSignsPage() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [categories, setCategories] = useState<SignCategory[]>([]);
  const [recentAttempts, setRecentAttempts] = useState<RoadSignAttempt[]>([]);
  const [seedStatus, setSeedStatus] = useState<SeedStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [driversRes, categoriesRes, attemptsRes, seedRes] = await Promise.all([
        fetch("/api/drivers"),
        fetch("/api/road-signs/categories"),
        fetch("/api/road-signs/attempts"),
        fetch("/api/road-signs/seed"),
      ]);

      const [driversData, categoriesData, attemptsData, seedData] = await Promise.all([
        driversRes.json(),
        categoriesRes.json(),
        attemptsRes.json(),
        seedRes.json(),
      ]);

      setDrivers(Array.isArray(driversData) ? driversData : []);
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      setRecentAttempts(Array.isArray(attemptsData) ? attemptsData.slice(0, 5) : []);
      setSeedStatus(seedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSeedData = async () => {
    setSeeding(true);
    try {
      await fetch("/api/road-signs/seed", { method: "POST" });
      await fetchData();
    } catch (error) {
      console.error("Error seeding data:", error);
    } finally {
      setSeeding(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen safe-bottom relative z-10 flex items-center justify-center">
        <div className="spinner" />
        <Navigation />
      </main>
    );
  }

  const isSeeded = seedStatus?.seeded;
  const totalSigns = categories.reduce((sum, c) => sum + (c.signs?.length || 0), 0);

  // Calculate stats from recent attempts
  const passedTests = recentAttempts.filter(a => a.passed).length;
  const avgScore = recentAttempts.length > 0
    ? Math.round(
        recentAttempts.reduce((acc, a) => acc + (a.percentage || 0), 0) /
        recentAttempts.length
      )
    : 0;

  return (
    <main className="min-h-screen safe-bottom relative z-10">
      {/* Header */}
      <div className="px-4 pt-8 pb-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-sky-blue/20">
            <Signpost className="w-6 h-6 text-sky-blue" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-chrome">Road Signs Test</h1>
            <p className="text-chrome/60 text-sm">Missouri Sign Recognition</p>
          </div>
        </div>
      </div>

      {/* Seed Data if needed */}
      {!isSeeded && (
        <div className="px-4 mb-6">
          <div className="card p-6 text-center">
            <Signpost className="w-12 h-12 text-chrome/30 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-chrome mb-2">
              No Sign Data Loaded
            </h3>
            <p className="text-chrome/60 mb-4">
              Load Missouri road sign data to get started
            </p>
            <button 
              onClick={handleSeedData} 
              disabled={seeding}
              className="btn btn-primary"
            >
              {seeding ? (
                <div className="spinner w-5 h-5" />
              ) : (
                <Zap size={18} />
              )}
              {seeding ? "Loading..." : "Load Road Signs"}
            </button>
          </div>
        </div>
      )}

      {isSeeded && (
        <>
          {/* Quick Start */}
          <div className="px-4 mb-6">
            <div className="card p-4 bg-gradient-to-br from-sky-blue/20 to-sky-blue/5 border-sky-blue/30">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-sky-blue/30">
                    <Target className="w-5 h-5 text-sky-blue" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-chrome">Practice Test</h3>
                    <p className="text-xs text-chrome/60">20 random signs</p>
                  </div>
                </div>
              </div>
              
              <Link
                href="/road-signs/start?mode=all&count=20"
                className="btn btn-primary w-full"
              >
                <Signpost size={18} />
                Start 20-Sign Test
              </Link>
              
              <p className="text-xs text-center text-chrome/50 mt-2">
                Pass with 80% (16/20) to be ready for the DMV!
              </p>
            </div>
          </div>

          {/* Test Options */}
          <div className="px-4 mb-6">
            <h2 className="text-lg font-semibold text-chrome mb-4">Test Options</h2>
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/road-signs/start?mode=timed&count=20"
                className="card p-4 hover:border-highway-orange/40 transition-all"
              >
                <Clock className="w-6 h-6 text-highway-orange mb-2" />
                <h3 className="font-medium text-chrome text-sm">Timed Test</h3>
                <p className="text-xs text-chrome/60">30 sec per sign</p>
              </Link>
              <Link
                href="/road-signs/start?mode=practice&count=10"
                className="card p-4 hover:border-signal-green/40 transition-all"
              >
                <BookOpen className="w-6 h-6 text-signal-green mb-2" />
                <h3 className="font-medium text-chrome text-sm">Practice</h3>
                <p className="text-xs text-chrome/60">Instant feedback</p>
              </Link>
            </div>
          </div>

          {/* Practice by Category */}
          <div className="px-4 mb-6">
            <h2 className="text-lg font-semibold text-chrome mb-4">Practice by Category</h2>
            <div className="space-y-2">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/road-signs/start?categoryId=${category.id}&mode=practice`}
                >
                  <div className="card p-4 hover:border-sky-blue/40 transition-all group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Layers size={18} className="text-sky-blue" />
                        <div>
                          <span className="text-chrome group-hover:text-sky-blue transition-colors">
                            {category.name}
                          </span>
                          <p className="text-xs text-chrome/50">{category.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="badge badge-info">{category.signs?.length || 0}</span>
                        <ChevronRight size={18} className="text-chrome/40" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="px-4 mb-6">
            <h2 className="text-lg font-semibold text-chrome mb-4">Your Stats</h2>
            <div className="grid grid-cols-3 gap-3">
              <div className="card p-4 text-center">
                <Signpost className="w-6 h-6 text-sky-blue mx-auto mb-2" />
                <p className="text-xl font-bold text-chrome">{recentAttempts.length}</p>
                <p className="text-xs text-chrome/60">Tests</p>
              </div>
              <div className="card p-4 text-center">
                <CheckCircle2 className="w-6 h-6 text-signal-green mx-auto mb-2" />
                <p className="text-xl font-bold text-chrome">{passedTests}</p>
                <p className="text-xs text-chrome/60">Passed</p>
              </div>
              <div className="card p-4 text-center">
                <Award className="w-6 h-6 text-highway-orange mx-auto mb-2" />
                <p className="text-xl font-bold text-chrome">{avgScore}%</p>
                <p className="text-xs text-chrome/60">Avg Score</p>
              </div>
            </div>
          </div>

          {/* Recent Attempts */}
          {recentAttempts.length > 0 && (
            <div className="px-4 mb-6">
              <h2 className="text-lg font-semibold text-chrome mb-4">Recent Tests</h2>
              <div className="space-y-2">
                {recentAttempts.map((attempt) => {
                  const percentage = Math.round(attempt.percentage || 0);
                  
                  return (
                    <Link
                      key={attempt.id}
                      href={`/road-signs/results/${attempt.id}`}
                    >
                      <div className="card p-4 hover:border-sky-blue/40 transition-all group">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-chrome group-hover:text-sky-blue transition-colors">
                              {attempt.driver.name}
                            </p>
                            <p className="text-xs text-chrome/60">
                              {new Date(attempt.testDate).toLocaleDateString()}
                              {` • ${attempt.testMode}`}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <p className={`text-lg font-bold ${attempt.passed ? "text-signal-green" : "text-signal-red"}`}>
                                {attempt.correctAnswers}/{attempt.totalQuestions}
                              </p>
                              <div className="flex items-center gap-1 justify-end">
                                {attempt.passed ? (
                                  <CheckCircle2 className="w-3 h-3 text-signal-green" />
                                ) : (
                                  <XCircle className="w-3 h-3 text-signal-red" />
                                )}
                                <span className={`text-xs ${attempt.passed ? "text-signal-green" : "text-signal-red"}`}>
                                  {percentage}% {attempt.passed ? "PASS" : "FAIL"}
                                </span>
                              </div>
                            </div>
                            <ChevronRight size={18} className="text-chrome/40" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Sign Count */}
          <div className="px-4 mb-6">
            <div className="card p-4 bg-chrome/5 text-center">
              <p className="text-chrome/60 text-sm">
                {totalSigns} signs across {categories.length} categories from the{" "}
                <span className="text-sky-blue">Missouri DOR</span>
              </p>
            </div>
          </div>
        </>
      )}

      <Navigation />
    </main>
  );
}

