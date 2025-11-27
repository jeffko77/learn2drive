"use client";

import { useState, useEffect, use } from "react";
import { Navigation } from "@/components/Navigation";
import { 
  ArrowLeft, 
  Trophy, 
  XCircle,
  CheckCircle2,
  ChevronDown,
  Car,
  User,
  Calendar,
  Award,
  AlertTriangle,
  Share2,
  RotateCcw
} from "lucide-react";
import Link from "next/link";
import { DRIVING_TEST_PASSING_SCORE, DRIVING_TEST_MAX_SCORE } from "@/lib/driving-test-seed-data";

interface Evaluation {
  id: string;
  pointsDeducted: number;
  evaluatorNotes: string | null;
  criteria: {
    id: string;
    criteriaName: string;
    evaluationGuide: string;
    maxPoints: number;
    category: {
      id: string;
      name: string;
    };
  };
}

interface Attempt {
  id: string;
  testDate: string;
  totalScore: number | null;
  maxPossibleScore: number | null;
  passed: boolean | null;
  evaluatorName: string | null;
  notes: string | null;
  driver: {
    id: string;
    name: string;
  };
  evaluations: Evaluation[];
}

interface CategoryBreakdown {
  name: string;
  earned: number;
  max: number;
  evaluations: Evaluation[];
}

export default function DrivingTestResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchAttempt();
  }, [resolvedParams.id]);

  const fetchAttempt = async () => {
    try {
      const response = await fetch(`/api/driving-test/attempts/${resolvedParams.id}`);
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
          <p className="text-chrome/60 mb-6">This driving test result could not be found.</p>
          <Link href="/driving-test" className="btn btn-primary">
            Back to Driving Test
          </Link>
        </div>
        <Navigation />
      </main>
    );
  }

  const percentage = attempt.totalScore && attempt.maxPossibleScore
    ? Math.round((attempt.totalScore / attempt.maxPossibleScore) * 100)
    : 0;
  
  const pointsDeducted = attempt.maxPossibleScore && attempt.totalScore
    ? attempt.maxPossibleScore - attempt.totalScore
    : 0;

  const isAutofail = attempt.notes?.startsWith("AUTOMATIC FAIL:");

  // Group evaluations by category
  const categoryBreakdowns: CategoryBreakdown[] = [];
  const categoryMap = new Map<string, CategoryBreakdown>();

  attempt.evaluations.forEach((evaluation) => {
    const categoryName = evaluation.criteria.category.name;
    if (!categoryMap.has(categoryName)) {
      categoryMap.set(categoryName, {
        name: categoryName,
        earned: 0,
        max: 0,
        evaluations: [],
      });
    }
    const breakdown = categoryMap.get(categoryName)!;
    breakdown.max += evaluation.criteria.maxPoints;
    breakdown.earned += evaluation.criteria.maxPoints - evaluation.pointsDeducted;
    breakdown.evaluations.push(evaluation);
  });

  categoryMap.forEach((breakdown) => {
    categoryBreakdowns.push(breakdown);
  });

  return (
    <main className="min-h-screen safe-bottom relative z-10">
      <div className="px-4 pt-8">
        <Link
          href="/driving-test"
          className="inline-flex items-center gap-2 text-chrome/60 hover:text-chrome mb-6 tap-target"
        >
          <ArrowLeft size={20} />
          <span>Back to Driving Test</span>
        </Link>

        {/* Result Card */}
        <div className={`card p-6 text-center ${attempt.passed ? "border-signal-green/30" : "border-signal-red/30"}`}>
          {isAutofail ? (
            <>
              <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center bg-signal-red/20">
                <AlertTriangle className="w-10 h-10 text-signal-red" />
              </div>
              <h2 className="text-2xl font-bold text-signal-red mb-2">
                Automatic Fail
              </h2>
              <p className="text-chrome/60 mb-4">
                {attempt.notes?.replace("AUTOMATIC FAIL: ", "")}
              </p>
            </>
          ) : (
            <>
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
                {attempt.passed ? "Test Passed!" : "Needs More Practice"}
              </h2>

              <p className="text-chrome/60 mb-6">
                {attempt.passed
                  ? "Great driving! Ready for the official DMV test."
                  : `Lost ${pointsDeducted} points. Max allowed is ${DRIVING_TEST_MAX_SCORE - DRIVING_TEST_PASSING_SCORE}.`}
              </p>
            </>
          )}

          <div className="flex items-center justify-center gap-8 mb-6">
            <div>
              <p className="text-4xl font-bold text-chrome">{attempt.totalScore}</p>
              <p className="text-sm text-chrome/60">Score</p>
            </div>
            <div className="w-px h-12 bg-chrome/20" />
            <div>
              <p className="text-4xl font-bold text-chrome">{pointsDeducted}</p>
              <p className="text-sm text-chrome/60">Lost</p>
            </div>
            <div className="w-px h-12 bg-chrome/20" />
            <div>
              <p className={`text-4xl font-bold ${attempt.passed ? "text-signal-green" : "text-signal-red"}`}>
                {percentage}%
              </p>
              <p className="text-sm text-chrome/60">Grade</p>
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
            {attempt.evaluatorName && (
              <div className="flex items-center gap-1">
                <Award size={14} />
                <span>By {attempt.evaluatorName}</span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-4">
          <Link href="/driving-test/start" className="btn btn-primary flex-1">
            <RotateCcw size={18} />
            New Test
          </Link>
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: `Driving Test Results - ${attempt.driver.name}`,
                  text: `Score: ${attempt.totalScore}/${attempt.maxPossibleScore} (${percentage}%) - ${attempt.passed ? "PASSED" : "FAILED"}`,
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
              const categoryPercentage = Math.round((breakdown.earned / breakdown.max) * 100);
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
                        {breakdown.earned}/{breakdown.max}
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
                      {breakdown.evaluations.map((evaluation) => {
                        const earned = evaluation.criteria.maxPoints - evaluation.pointsDeducted;
                        const perfect = evaluation.pointsDeducted === 0;
                        
                        return (
                          <div
                            key={evaluation.id}
                            className="flex items-start justify-between py-2"
                          >
                            <div className="flex items-start gap-2">
                              {perfect ? (
                                <CheckCircle2 className="w-4 h-4 text-signal-green mt-0.5" />
                              ) : (
                                <XCircle className="w-4 h-4 text-signal-red mt-0.5" />
                              )}
                              <div>
                                <p className="text-sm text-chrome">
                                  {evaluation.criteria.criteriaName}
                                </p>
                                {evaluation.evaluatorNotes && (
                                  <p className="text-xs text-chrome/50 mt-1">
                                    Note: {evaluation.evaluatorNotes}
                                  </p>
                                )}
                              </div>
                            </div>
                            <span className={`text-sm font-medium ${
                              perfect ? "text-signal-green" : "text-signal-red"
                            }`}>
                              {earned}/{evaluation.criteria.maxPoints}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Notes */}
        {attempt.notes && !isAutofail && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-chrome mb-3">Notes</h3>
            <div className="card p-4">
              <p className="text-chrome/80">{attempt.notes}</p>
            </div>
          </div>
        )}

        {/* Study Areas */}
        {!attempt.passed && (
          <div className="mt-6 mb-4">
            <h3 className="text-lg font-semibold text-chrome mb-3">Areas to Improve</h3>
            <div className="card p-4">
              <div className="space-y-3">
                {attempt.evaluations
                  .filter((e) => e.pointsDeducted > 0)
                  .sort((a, b) => b.pointsDeducted - a.pointsDeducted)
                  .slice(0, 5)
                  .map((evaluation) => (
                    <div key={evaluation.id} className="flex items-start gap-3">
                      <div className="p-1.5 rounded-lg bg-signal-red/20">
                        <AlertTriangle className="w-3 h-3 text-signal-red" />
                      </div>
                      <div>
                        <p className="text-chrome text-sm font-medium">
                          {evaluation.criteria.criteriaName}
                        </p>
                        <p className="text-xs text-chrome/50">
                          Lost {evaluation.pointsDeducted} points • {evaluation.criteria.category.name}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <Navigation />
    </main>
  );
}

