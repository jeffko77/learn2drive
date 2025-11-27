"use client";

import { useState, useEffect, use } from "react";
import { Navigation } from "@/components/Navigation";
import { 
  ArrowLeft, 
  Trophy, 
  XCircle,
  CheckCircle2,
  ChevronDown,
  Signpost,
  User,
  Calendar,
  Award,
  Clock,
  RotateCcw,
  Share2
} from "lucide-react";
import Link from "next/link";
import { ROAD_SIGN_PASSING_SCORE } from "@/lib/road-sign-seed-data";

interface SignAnswer {
  id: string;
  selectedAnswer: string | null;
  isCorrect: boolean;
  timeSpent: number | null;
  sign: {
    id: string;
    signName: string;
    signMeaning: string;
    shape: string;
    colorScheme: string;
    category: {
      id: string;
      name: string;
    };
  };
}

interface Attempt {
  id: string;
  testDate: string;
  totalQuestions: number;
  correctAnswers: number;
  percentage: number | null;
  passed: boolean | null;
  timeTaken: number | null;
  testMode: string;
  driver: {
    id: string;
    name: string;
  };
  answers: SignAnswer[];
}

interface CategoryBreakdown {
  name: string;
  correct: number;
  total: number;
  answers: SignAnswer[];
}

export default function RoadSignResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchAttempt();
  }, [resolvedParams.id]);

  const fetchAttempt = async () => {
    try {
      const response = await fetch(`/api/road-signs/attempts/${resolvedParams.id}`);
      if (response.ok) {
        const data = await response.json();
        setAttempt(data);
      }
    } catch (error) {
      console.error("Error fetching attempt:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(categoryName)) {
        next.delete(categoryName);
      } else {
        next.add(categoryName);
      }
      return next;
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <main className="min-h-screen safe-bottom relative z-10 flex items-center justify-center">
        <div className="spinner" />
        <Navigation />
      </main>
    );
  }

  if (!attempt) {
    return (
      <main className="min-h-screen safe-bottom relative z-10">
        <div className="px-4 pt-8 text-center">
          <XCircle className="w-12 h-12 text-signal-red mx-auto mb-4" />
          <h2 className="text-xl font-bold text-chrome mb-2">Test Not Found</h2>
          <p className="text-chrome/60 mb-6">This road sign test result could not be found.</p>
          <Link href="/road-signs" className="btn btn-primary">
            Back to Road Signs
          </Link>
        </div>
        <Navigation />
      </main>
    );
  }

  const percentage = Math.round(attempt.percentage || 0);
  const wrongCount = attempt.totalQuestions - attempt.correctAnswers;

  // Group answers by category
  const categoryBreakdowns: CategoryBreakdown[] = [];
  const categoryMap = new Map<string, CategoryBreakdown>();

  attempt.answers.forEach((answer) => {
    const categoryName = answer.sign.category.name;
    if (!categoryMap.has(categoryName)) {
      categoryMap.set(categoryName, {
        name: categoryName,
        correct: 0,
        total: 0,
        answers: [],
      });
    }
    const breakdown = categoryMap.get(categoryName)!;
    breakdown.total += 1;
    if (answer.isCorrect) breakdown.correct += 1;
    breakdown.answers.push(answer);
  });

  categoryMap.forEach((breakdown) => {
    categoryBreakdowns.push(breakdown);
  });

  // Sort by category name
  categoryBreakdowns.sort((a, b) => a.name.localeCompare(b.name));

  // Get missed signs for study recommendations
  const missedSigns = attempt.answers.filter((a) => !a.isCorrect);

  return (
    <main className="min-h-screen safe-bottom relative z-10">
      <div className="px-4 pt-8">
        <Link
          href="/road-signs"
          className="inline-flex items-center gap-2 text-chrome/60 hover:text-chrome mb-6 tap-target"
        >
          <ArrowLeft size={20} />
          <span>Back to Road Signs</span>
        </Link>

        {/* Result Card */}
        <div className={`card p-6 text-center ${attempt.passed ? "border-signal-green/30" : "border-signal-red/30"}`}>
          <div className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center ${
            attempt.passed ? "bg-signal-green/20" : "bg-signal-red/20"
          }`}>
            {attempt.passed ? (
              <Trophy className="w-10 h-10 text-signal-green" />
            ) : (
              <XCircle className="w-10 h-10 text-signal-red" />
            )}
          </div>

          <h2 className={`text-2xl font-bold mb-2 ${attempt.passed ? "text-signal-green" : "text-signal-red"}`}>
            {attempt.passed ? "You Passed!" : "Keep Practicing"}
          </h2>

          <p className="text-chrome/60 mb-6">
            {attempt.passed
              ? "Great job! You know your road signs well."
              : `You need ${ROAD_SIGN_PASSING_SCORE}% to pass. Review the missed signs and try again.`}
          </p>

          <div className="flex items-center justify-center gap-8 mb-6">
            <div>
              <p className="text-4xl font-bold text-chrome">{attempt.correctAnswers}</p>
              <p className="text-sm text-chrome/60">Correct</p>
            </div>
            <div className="w-px h-12 bg-chrome/20" />
            <div>
              <p className="text-4xl font-bold text-chrome">{wrongCount}</p>
              <p className="text-sm text-chrome/60">Wrong</p>
            </div>
            <div className="w-px h-12 bg-chrome/20" />
            <div>
              <p className={`text-4xl font-bold ${attempt.passed ? "text-signal-green" : "text-signal-red"}`}>
                {percentage}%
              </p>
              <p className="text-sm text-chrome/60">Score</p>
            </div>
          </div>

          {/* Test Meta */}
          <div className="flex flex-wrap justify-center gap-4 text-sm text-chrome/60">
            <div className="flex items-center gap-1">
              <User size={14} />
              <span>{attempt.driver.name}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              <span>{new Date(attempt.testDate).toLocaleDateString()}</span>
            </div>
            {attempt.timeTaken && (
              <div className="flex items-center gap-1">
                <Clock size={14} />
                <span>{formatTime(attempt.timeTaken)}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Award size={14} />
              <span className="capitalize">{attempt.testMode}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-4">
          <Link href="/road-signs/start" className="btn btn-primary flex-1">
            <RotateCcw size={18} />
            New Test
          </Link>
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: `Road Sign Test Results - ${attempt.driver.name}`,
                  text: `Score: ${attempt.correctAnswers}/${attempt.totalQuestions} (${percentage}%) - ${attempt.passed ? "PASSED" : "FAILED"}`,
                });
              }
            }}
            className="btn btn-ghost"
          >
            <Share2 size={18} />
          </button>
        </div>

        {/* Category Breakdown */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-chrome mb-4">Category Breakdown</h3>
          <div className="space-y-2">
            {categoryBreakdowns.map((breakdown) => {
              const categoryPercentage = Math.round((breakdown.correct / breakdown.total) * 100);
              const isExpanded = expandedCategories.has(breakdown.name);
              
              return (
                <div key={breakdown.name} className="card overflow-hidden">
                  <button
                    onClick={() => toggleCategory(breakdown.name)}
                    className="w-full p-4 flex items-center justify-between tap-target"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        categoryPercentage >= 80 ? "bg-signal-green" :
                        categoryPercentage >= 60 ? "bg-signal-yellow" :
                        "bg-signal-red"
                      }`} />
                      <span className="text-chrome font-medium">{breakdown.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`font-bold ${
                        categoryPercentage >= 80 ? "text-signal-green" :
                        categoryPercentage >= 60 ? "text-signal-yellow" :
                        "text-signal-red"
                      }`}>
                        {breakdown.correct}/{breakdown.total}
                      </span>
                      <ChevronDown
                        size={18}
                        className={`text-chrome/40 transition-transform ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-4 space-y-2 border-t border-chrome/10 pt-3">
                      {breakdown.answers.map((answer) => (
                        <div
                          key={answer.id}
                          className="flex items-start justify-between py-2"
                        >
                          <div className="flex items-start gap-2">
                            {answer.isCorrect ? (
                              <CheckCircle2 className="w-4 h-4 text-signal-green mt-0.5" />
                            ) : (
                              <XCircle className="w-4 h-4 text-signal-red mt-0.5" />
                            )}
                            <div>
                              <p className="text-sm text-chrome">
                                {answer.sign.signName}
                              </p>
                              {!answer.isCorrect && (
                                <p className="text-xs text-chrome/50 mt-1">
                                  Correct: {answer.sign.signMeaning}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Study Recommendations - Missed Signs */}
        {missedSigns.length > 0 && (
          <div className="mt-6 mb-4">
            <h3 className="text-lg font-semibold text-chrome mb-3">Signs to Review</h3>
            <div className="space-y-3">
              {missedSigns.map((answer) => (
                <div key={answer.id} className="card p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-signal-red/20">
                      <Signpost className="w-4 h-4 text-signal-red" />
                    </div>
                    <div className="flex-1">
                      <p className="text-chrome font-medium">
                        {answer.sign.signName}
                      </p>
                      <div className="flex gap-2 mt-1 mb-2">
                        <span className="text-xs px-2 py-0.5 rounded bg-chrome/10 text-chrome/60">
                          {answer.sign.shape}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded bg-chrome/10 text-chrome/60">
                          {answer.sign.colorScheme}
                        </span>
                      </div>
                      <p className="text-sm text-signal-green">
                        {answer.sign.signMeaning}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Perfect Score Celebration */}
        {percentage === 100 && (
          <div className="mt-6 card p-6 bg-gradient-to-br from-signal-green/20 to-signal-green/5 border-signal-green/30 text-center">
            <Trophy className="w-12 h-12 text-signal-green mx-auto mb-3" />
            <h3 className="text-lg font-bold text-signal-green mb-2">Perfect Score!</h3>
            <p className="text-chrome/60 text-sm">
              You got every single sign correct. Outstanding knowledge of road signs!
            </p>
          </div>
        )}
      </div>

      <Navigation />
    </main>
  );
}

