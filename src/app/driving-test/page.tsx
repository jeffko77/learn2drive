"use client";

import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { 
  Car, 
  ClipboardCheck, 
  Clock, 
  ChevronRight, 
  Zap, 
  Award,
  CheckCircle2,
  XCircle,
  AlertTriangle
} from "lucide-react";
import Link from "next/link";

interface Driver {
  id: string;
  name: string;
}

interface DrivingTestAttempt {
  id: string;
  totalScore: number | null;
  maxPossibleScore: number | null;
  passed: boolean | null;
  testDate: string;
  evaluatorName: string | null;
  driver: {
    name: string;
  };
}

interface SeedStatus {
  categories: number;
  criteria: number;
  seeded: boolean;
}

export default function DrivingTestPage() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [recentAttempts, setRecentAttempts] = useState<DrivingTestAttempt[]>([]);
  const [seedStatus, setSeedStatus] = useState<SeedStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [driversRes, attemptsRes, seedRes] = await Promise.all([
        fetch("/api/drivers"),
        fetch("/api/driving-test/attempts"),
        fetch("/api/driving-test/seed"),
      ]);

      const [driversData, attemptsData, seedData] = await Promise.all([
        driversRes.json(),
        attemptsRes.json(),
        seedRes.json(),
      ]);

      setDrivers(Array.isArray(driversData) ? driversData : []);
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
      await fetch("/api/driving-test/seed", { method: "POST" });
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

  // Calculate stats from recent attempts
  const passedTests = recentAttempts.filter(a => a.passed).length;
  const avgScore = recentAttempts.length > 0
    ? Math.round(
        recentAttempts.reduce((acc, a) => acc + (a.totalScore || 0), 0) /
        recentAttempts.length
      )
    : 0;

  return (
    <main className="min-h-screen safe-bottom relative z-10">
      {/* Header */}
      <div className="px-4 pt-8 pb-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-signal-green/20">
            <Car className="w-6 h-6 text-signal-green" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-chrome">Driving Test</h1>
            <p className="text-chrome/60 text-sm">Missouri Behind-the-Wheel Exam</p>
          </div>
        </div>
      </div>

      {/* Seed Data if needed */}
      {!isSeeded && (
        <div className="px-4 mb-6">
          <div className="card p-6 text-center">
            <ClipboardCheck className="w-12 h-12 text-chrome/30 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-chrome mb-2">
              No Test Criteria Loaded
            </h3>
            <p className="text-chrome/60 mb-4">
              Load the Missouri driving exam criteria to get started
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
              {seeding ? "Loading..." : "Load Test Criteria"}
            </button>
          </div>
        </div>
      )}

      {isSeeded && (
        <>
          {/* Quick Start */}
          <div className="px-4 mb-6">
            <div className="card p-4 bg-gradient-to-br from-signal-green/20 to-signal-green/5 border-signal-green/30">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-signal-green/30">
                    <ClipboardCheck className="w-5 h-5 text-signal-green" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-chrome">Start Evaluation</h3>
                    <p className="text-xs text-chrome/60">Evaluate a student driver</p>
                  </div>
                </div>
              </div>
              
              <Link
                href="/driving-test/start"
                className="btn btn-success w-full"
              >
                <Car size={18} />
                Begin Driving Test
              </Link>
              
              <p className="text-xs text-center text-chrome/50 mt-2">
                Pass with 120/150 points (80%) - max 30 points deducted
              </p>
            </div>
          </div>

          {/* Test Info */}
          <div className="px-4 mb-6">
            <h2 className="text-lg font-semibold text-chrome mb-4">Test Information</h2>
            <div className="card p-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-sky-blue/20">
                    <ClipboardCheck className="w-4 h-4 text-sky-blue" />
                  </div>
                  <div>
                    <p className="text-chrome font-medium">8 Categories</p>
                    <p className="text-xs text-chrome/60">Vehicle controls, turns, parking, and more</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-highway-orange/20">
                    <Award className="w-4 h-4 text-highway-orange" />
                  </div>
                  <div>
                    <p className="text-chrome font-medium">150 Total Points</p>
                    <p className="text-xs text-chrome/60">Lose no more than 30 points to pass</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-signal-red/20">
                    <AlertTriangle className="w-4 h-4 text-signal-red" />
                  </div>
                  <div>
                    <p className="text-chrome font-medium">Automatic Fail Conditions</p>
                    <p className="text-xs text-chrome/60">Crash, traffic violation, dangerous driving</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="px-4 mb-6">
            <h2 className="text-lg font-semibold text-chrome mb-4">Your Stats</h2>
            <div className="grid grid-cols-3 gap-3">
              <div className="card p-4 text-center">
                <Car className="w-6 h-6 text-sky-blue mx-auto mb-2" />
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
                <p className="text-xl font-bold text-chrome">{avgScore}</p>
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
                  const percentage = attempt.totalScore && attempt.maxPossibleScore
                    ? Math.round((attempt.totalScore / attempt.maxPossibleScore) * 100)
                    : 0;
                  
                  return (
                    <Link
                      key={attempt.id}
                      href={`/driving-test/results/${attempt.id}`}
                    >
                      <div className="card p-4 hover:border-sky-blue/40 transition-all group">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-chrome group-hover:text-sky-blue transition-colors">
                              {attempt.driver.name}
                            </p>
                            <p className="text-xs text-chrome/60">
                              {new Date(attempt.testDate).toLocaleDateString()}
                              {attempt.evaluatorName && ` • By ${attempt.evaluatorName}`}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <p className={`text-lg font-bold ${attempt.passed ? "text-signal-green" : "text-signal-red"}`}>
                                {attempt.totalScore}/{attempt.maxPossibleScore}
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
        </>
      )}

      <Navigation />
    </main>
  );
}

