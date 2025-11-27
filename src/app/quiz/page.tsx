"use client";

import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Trophy, BookOpen, Clock, Target, Users, ChevronRight, Award, Zap, Car, ClipboardCheck, Signpost } from "lucide-react";
import Link from "next/link";

interface Topic {
  topic: string;
  count: number;
}

interface Driver {
  id: string;
  name: string;
}

interface QuizAttempt {
  id: string;
  score: number;
  totalQuestions: number;
  dateTaken: string;
  mode: string;
  driver: {
    name: string;
  };
}

export default function QuizPage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [recentAttempts, setRecentAttempts] = useState<QuizAttempt[]>([]);
  const [stats, setStats] = useState({ questions: 0, drivers: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [topicsRes, driversRes, attemptsRes, statsRes] = await Promise.all([
        fetch("/api/quiz/topics"),
        fetch("/api/drivers"),
        fetch("/api/quiz/attempts"),
        fetch("/api/seed"),
      ]);

      const [topicsData, driversData, attemptsData, statsData] = await Promise.all([
        topicsRes.json(),
        driversRes.json(),
        attemptsRes.json(),
        statsRes.json(),
      ]);

      setTopics(Array.isArray(topicsData) ? topicsData : []);
      setDrivers(Array.isArray(driversData) ? driversData : []);
      setRecentAttempts(Array.isArray(attemptsData) ? attemptsData.slice(0, 5) : []);
      setStats(statsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSeedQuestions = async () => {
    setLoading(true);
    try {
      await fetch("/api/seed", { method: "POST" });
      await fetchData();
    } catch (error) {
      console.error("Error seeding questions:", error);
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

  const totalQuestions = topics.reduce((acc, t) => acc + t.count, 0);

  return (
    <main className="min-h-screen safe-bottom relative z-10">
      {/* Header */}
      <div className="px-4 pt-8 pb-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-highway-orange/20">
            <Trophy className="w-6 h-6 text-highway-orange" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-chrome">Quiz Center</h1>
            <p className="text-chrome/60 text-sm">Missouri DMV Test Prep</p>
          </div>
        </div>
      </div>

      {/* Seed Questions if needed */}
      {totalQuestions === 0 && (
        <div className="px-4 mb-6">
          <div className="card p-6 text-center">
            <BookOpen className="w-12 h-12 text-chrome/30 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-chrome mb-2">
              No Questions Loaded
            </h3>
            <p className="text-chrome/60 mb-4">
              Load 100+ Missouri DMV practice questions to get started
            </p>
            <button onClick={handleSeedQuestions} className="btn btn-primary">
              <Zap size={18} />
              Load Quiz Questions
            </button>
          </div>
        </div>
      )}

      {/* Test Type Selection */}
      <div className="px-4 mb-6">
        <h2 className="text-lg font-semibold text-chrome mb-4">Test Types</h2>
        <div className="grid grid-cols-3 gap-3">
          {/* Written Test Card */}
          <Link href="/quiz#written" className="card p-4 bg-gradient-to-br from-highway-orange/20 to-highway-orange/5 border-highway-orange/30 hover:border-highway-orange/50 transition-all">
            <div className="p-2 rounded-lg bg-highway-orange/30 w-fit mb-3">
              <BookOpen className="w-5 h-5 text-highway-orange" />
            </div>
            <h3 className="font-semibold text-chrome mb-1 text-sm">Written Test</h3>
            <p className="text-xs text-chrome/60">DMV knowledge</p>
          </Link>

          {/* Road Signs Test Card */}
          <Link href="/road-signs" className="card p-4 bg-gradient-to-br from-sky-blue/20 to-sky-blue/5 border-sky-blue/30 hover:border-sky-blue/50 transition-all">
            <div className="p-2 rounded-lg bg-sky-blue/30 w-fit mb-3">
              <Signpost className="w-5 h-5 text-sky-blue" />
            </div>
            <h3 className="font-semibold text-chrome mb-1 text-sm">Road Signs</h3>
            <p className="text-xs text-chrome/60">Sign recognition</p>
          </Link>

          {/* Driving Test Card */}
          <Link href="/driving-test" className="card p-4 bg-gradient-to-br from-signal-green/20 to-signal-green/5 border-signal-green/30 hover:border-signal-green/50 transition-all">
            <div className="p-2 rounded-lg bg-signal-green/30 w-fit mb-3">
              <Car className="w-5 h-5 text-signal-green" />
            </div>
            <h3 className="font-semibold text-chrome mb-1 text-sm">Driving Test</h3>
            <p className="text-xs text-chrome/60">Behind-wheel eval</p>
          </Link>
        </div>
      </div>

      {totalQuestions > 0 && (
        <>
          {/* Quick Start */}
          <div className="px-4 mb-6" id="written">
            <div className="card p-4 bg-gradient-to-br from-highway-orange/20 to-highway-orange/5 border-highway-orange/30">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-highway-orange/30">
                    <Target className="w-5 h-5 text-highway-orange" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-chrome">Practice Test</h3>
                    <p className="text-xs text-chrome/60">25 questions, like the real test</p>
                  </div>
                </div>
              </div>
              
              <Link
                href="/quiz/start?mode=test&count=25"
                className="btn btn-warning w-full"
              >
                <Clock size={18} />
                Start 25-Question Test
              </Link>
              
              <p className="text-xs text-center text-chrome/50 mt-2">
                Pass with 80% (20/25) to be ready for the DMV!
              </p>
            </div>
          </div>

          {/* Practice by Topic */}
          <div className="px-4 mb-6">
            <h2 className="text-lg font-semibold text-chrome mb-4">Practice by Topic</h2>
            <div className="space-y-2">
              {topics.map((topic) => (
                <Link
                  key={topic.topic}
                  href={`/quiz/start?topic=${encodeURIComponent(topic.topic)}&mode=practice`}
                >
                  <div className="card p-4 hover:border-sky-blue/40 transition-all group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <BookOpen size={18} className="text-sky-blue" />
                        <span className="text-chrome group-hover:text-sky-blue transition-colors">
                          {topic.topic}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="badge badge-info">{topic.count} Q</span>
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
            <div className="grid grid-cols-2 gap-3">
              <div className="card p-4 text-center">
                <Award className="w-8 h-8 text-highway-orange mx-auto mb-2" />
                <p className="text-2xl font-bold text-chrome">{recentAttempts.length}</p>
                <p className="text-xs text-chrome/60">Quizzes Taken</p>
              </div>
              <div className="card p-4 text-center">
                <Trophy className="w-8 h-8 text-signal-green mx-auto mb-2" />
                <p className="text-2xl font-bold text-chrome">
                  {recentAttempts.length > 0
                    ? Math.round(
                        (recentAttempts.reduce((acc, a) => acc + a.score, 0) /
                          recentAttempts.reduce((acc, a) => acc + a.totalQuestions, 0)) *
                          100
                      )
                    : 0}%
                </p>
                <p className="text-xs text-chrome/60">Avg Score</p>
              </div>
            </div>
          </div>

          {/* Recent Attempts */}
          {recentAttempts.length > 0 && (
            <div className="px-4 mb-6">
              <h2 className="text-lg font-semibold text-chrome mb-4">Recent Attempts</h2>
              <div className="space-y-2">
                {recentAttempts.map((attempt) => {
                  const percentage = Math.round((attempt.score / attempt.totalQuestions) * 100);
                  const passed = percentage >= 80;
                  
                  return (
                    <div key={attempt.id} className="card p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-chrome">
                            {attempt.driver.name}
                          </p>
                          <p className="text-xs text-chrome/60">
                            {new Date(attempt.dateTaken).toLocaleDateString()} • {attempt.mode}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`text-lg font-bold ${passed ? "text-signal-green" : "text-signal-red"}`}>
                            {attempt.score}/{attempt.totalQuestions}
                          </p>
                          <p className={`text-xs ${passed ? "text-signal-green" : "text-signal-red"}`}>
                            {percentage}% {passed ? "PASS" : "FAIL"}
                          </p>
                        </div>
                      </div>
                    </div>
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

