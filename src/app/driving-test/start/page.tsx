"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navigation } from "@/components/Navigation";
import { 
  ArrowLeft, 
  Users, 
  ChevronDown, 
  Car, 
  CheckCircle2,
  Minus,
  Plus,
  AlertTriangle,
  ChevronRight,
  Timer,
  Info,
  Save,
  XCircle
} from "lucide-react";
import Link from "next/link";
import { DRIVING_TEST_PASSING_SCORE, DRIVING_TEST_MAX_SCORE, automaticFailConditions } from "@/lib/driving-test-seed-data";

interface Driver {
  id: string;
  name: string;
}

interface Criteria {
  id: string;
  criteriaName: string;
  evaluationGuide: string;
  maxPoints: number;
  orderIndex: number;
}

interface Category {
  id: string;
  name: string;
  description: string | null;
  orderIndex: number;
  criteria: Criteria[];
}

interface Evaluation {
  criteriaId: string;
  pointsDeducted: number;
  evaluatorNotes: string;
}

export default function DrivingTestStartPage() {
  const router = useRouter();
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [started, setStarted] = useState(false);
  const [evaluatorName, setEvaluatorName] = useState("");
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [evaluations, setEvaluations] = useState<Record<string, Evaluation>>({});
  const [expandedGuide, setExpandedGuide] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showAutofailModal, setShowAutofailModal] = useState(false);
  const [autofailReason, setAutofailReason] = useState("");
  const [parkingTimer, setParkingTimer] = useState<number | null>(null);
  const [timerRunning, setTimerRunning] = useState(false);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerRunning && parkingTimer !== null) {
      interval = setInterval(() => {
        setParkingTimer((prev) => (prev !== null ? prev + 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning, parkingTimer]);

  const fetchData = async () => {
    try {
      const [driversRes, categoriesRes] = await Promise.all([
        fetch("/api/drivers"),
        fetch("/api/driving-test/categories"),
      ]);

      const [driversData, categoriesData] = await Promise.all([
        driversRes.json(),
        categoriesRes.json(),
      ]);

      setDrivers(Array.isArray(driversData) ? driversData : []);
      if (driversData.length > 0) {
        setSelectedDriver(driversData[0]);
      }
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      
      // Initialize evaluations
      const initialEvaluations: Record<string, Evaluation> = {};
      if (Array.isArray(categoriesData)) {
        categoriesData.forEach((cat: Category) => {
          cat.criteria.forEach((crit: Criteria) => {
            initialEvaluations[crit.id] = {
              criteriaId: crit.id,
              pointsDeducted: 0,
              evaluatorNotes: "",
            };
          });
        });
      }
      setEvaluations(initialEvaluations);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handlePointsChange = (criteriaId: string, delta: number, maxPoints: number) => {
    setEvaluations((prev) => {
      const current = prev[criteriaId]?.pointsDeducted || 0;
      const newValue = Math.max(0, Math.min(maxPoints, current + delta));
      return {
        ...prev,
        [criteriaId]: {
          ...prev[criteriaId],
          criteriaId,
          pointsDeducted: newValue,
        },
      };
    });
  };

  const handleNotesChange = (criteriaId: string, notes: string) => {
    setEvaluations((prev) => ({
      ...prev,
      [criteriaId]: {
        ...prev[criteriaId],
        criteriaId,
        evaluatorNotes: notes,
      },
    }));
  };

  const calculateCurrentScore = () => {
    const totalDeducted = Object.values(evaluations).reduce(
      (sum, e) => sum + e.pointsDeducted,
      0
    );
    return DRIVING_TEST_MAX_SCORE - totalDeducted;
  };

  const calculateCategoryScore = (category: Category) => {
    const maxPoints = category.criteria.reduce((sum, c) => sum + c.maxPoints, 0);
    const deducted = category.criteria.reduce(
      (sum, c) => sum + (evaluations[c.id]?.pointsDeducted || 0),
      0
    );
    return { earned: maxPoints - deducted, max: maxPoints };
  };

  const handleSubmit = async (isAutofail: boolean = false) => {
    if (!selectedDriver) return;

    setSubmitting(true);
    try {
      const evaluationsList = Object.values(evaluations);
      
      const response = await fetch("/api/driving-test/attempts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          driverId: selectedDriver.id,
          evaluations: evaluationsList,
          evaluatorName: evaluatorName || undefined,
          notes: isAutofail ? autofailReason : notes,
          automaticFail: isAutofail,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        router.push(`/driving-test/results/${result.id}`);
      } else {
        console.error("Failed to submit test");
      }
    } catch (error) {
      console.error("Error submitting test:", error);
    } finally {
      setSubmitting(false);
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

  // Setup screen
  if (!started) {
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

          <div className="card p-6">
            <h2 className="text-xl font-bold text-chrome mb-2">
              Start Driving Evaluation
            </h2>
            <p className="text-chrome/60 mb-6">
              {categories.length} categories • {categories.reduce((sum, c) => sum + c.criteria.length, 0)} criteria
            </p>

            {/* Driver Selector */}
            {drivers.length > 0 && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-chrome/60 mb-2">
                  Select Driver
                </label>
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="w-full card p-3 flex items-center justify-between tap-target"
                  >
                    <div className="flex items-center gap-3">
                      <Users size={18} className="text-sky-blue" />
                      <span className="text-chrome">{selectedDriver?.name || "Select driver"}</span>
                    </div>
                    <ChevronDown
                      size={18}
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
            )}

            {/* Evaluator Name */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-chrome/60 mb-2">
                Evaluator Name (Optional)
              </label>
              <input
                type="text"
                value={evaluatorName}
                onChange={(e) => setEvaluatorName(e.target.value)}
                placeholder="Parent or instructor name"
                className="input"
              />
            </div>

            {/* Test Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between py-2 border-b border-chrome/10">
                <span className="text-chrome/60">Total Points</span>
                <span className="text-chrome font-medium">{DRIVING_TEST_MAX_SCORE}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-chrome/10">
                <span className="text-chrome/60">Passing Score</span>
                <span className="text-chrome font-medium">{DRIVING_TEST_PASSING_SCORE}+ ({Math.round((DRIVING_TEST_PASSING_SCORE / DRIVING_TEST_MAX_SCORE) * 100)}%)</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-chrome/60">Max Deductions</span>
                <span className="text-chrome font-medium">{DRIVING_TEST_MAX_SCORE - DRIVING_TEST_PASSING_SCORE} points</span>
              </div>
            </div>

            {/* Start Button */}
            <button
              onClick={() => setStarted(true)}
              disabled={!selectedDriver}
              className="btn btn-success w-full"
            >
              <Car size={18} />
              Begin Evaluation
            </button>

            {!selectedDriver && drivers.length === 0 && (
              <p className="text-sm text-chrome/50 text-center mt-3">
                <Link href="/drivers/new" className="text-sky-blue">
                  Add a driver
                </Link>{" "}
                to start an evaluation
              </p>
            )}
          </div>
        </div>

        <Navigation />
      </main>
    );
  }

  const currentCategory = categories[currentCategoryIndex];
  const currentScore = calculateCurrentScore();
  const isPassing = currentScore >= DRIVING_TEST_PASSING_SCORE;
  const isParallelParking = currentCategory?.name.toLowerCase().includes("parallel");

  return (
    <main className="min-h-screen safe-bottom relative z-10">
      {/* Sticky Header with Score */}
      <div className="sticky top-0 z-50 bg-dashboard/95 backdrop-blur-lg border-b border-chrome/10">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-chrome/60">Score:</span>
              <span className={`text-xl font-bold ${isPassing ? "text-signal-green" : "text-signal-red"}`}>
                {currentScore}/{DRIVING_TEST_MAX_SCORE}
              </span>
            </div>
            <button
              onClick={() => setShowAutofailModal(true)}
              className="btn btn-danger text-xs py-2 px-3"
            >
              <AlertTriangle size={14} />
              Auto Fail
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-chrome/60">
              {currentCategoryIndex + 1}/{categories.length}
            </span>
            <div className="flex-1 h-1.5 bg-chrome/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-signal-green rounded-full transition-all"
                style={{ width: `${((currentCategoryIndex + 1) / categories.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 pt-4 pb-24">
        {/* Category Header */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-chrome mb-1">
            {currentCategory?.name}
          </h2>
          <p className="text-sm text-chrome/60">
            {currentCategory?.description}
          </p>
        </div>

        {/* Parallel Parking Timer */}
        {isParallelParking && (
          <div className="card p-4 mb-4 bg-highway-orange/10 border-highway-orange/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Timer className="w-5 h-5 text-highway-orange" />
                <div>
                  <p className="text-chrome font-medium">Parking Timer</p>
                  <p className="text-2xl font-bold text-highway-orange font-mono">
                    {parkingTimer !== null ? formatTime(parkingTimer) : "0:00"}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                {parkingTimer === null ? (
                  <button
                    onClick={() => {
                      setParkingTimer(0);
                      setTimerRunning(true);
                    }}
                    className="btn btn-warning text-xs py-2"
                  >
                    Start
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => setTimerRunning(!timerRunning)}
                      className="btn btn-ghost text-xs py-2"
                    >
                      {timerRunning ? "Pause" : "Resume"}
                    </button>
                    <button
                      onClick={() => {
                        setParkingTimer(null);
                        setTimerRunning(false);
                      }}
                      className="btn btn-ghost text-xs py-2"
                    >
                      Reset
                    </button>
                  </>
                )}
              </div>
            </div>
            {parkingTimer !== null && parkingTimer > 120 && (
              <p className="text-xs text-signal-red mt-2">
                Over 2 minute limit - deduct points for timing
              </p>
            )}
          </div>
        )}

        {/* Criteria List */}
        <div className="space-y-3">
          {currentCategory?.criteria.map((criteria) => {
            const evaluation = evaluations[criteria.id];
            const pointsEarned = criteria.maxPoints - (evaluation?.pointsDeducted || 0);
            const isExpanded = expandedGuide === criteria.id;

            return (
              <div key={criteria.id} className="card p-4">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1">
                    <p className="font-medium text-chrome">
                      {criteria.criteriaName}
                    </p>
                    <button
                      onClick={() => setExpandedGuide(isExpanded ? null : criteria.id)}
                      className="flex items-center gap-1 text-xs text-sky-blue mt-1"
                    >
                      <Info size={12} />
                      {isExpanded ? "Hide guide" : "View evaluation guide"}
                    </button>
                    {isExpanded && (
                      <p className="text-sm text-chrome/60 mt-2 p-2 bg-chrome/5 rounded">
                        {criteria.evaluationGuide}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <span className={`text-lg font-bold ${
                      evaluation?.pointsDeducted === 0 
                        ? "text-signal-green" 
                        : evaluation?.pointsDeducted === criteria.maxPoints 
                          ? "text-signal-red"
                          : "text-signal-yellow"
                    }`}>
                      {pointsEarned}/{criteria.maxPoints}
                    </span>
                  </div>
                </div>

                {/* Points Adjuster */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-chrome/60">Points Deducted:</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handlePointsChange(criteria.id, -1, criteria.maxPoints)}
                      disabled={evaluation?.pointsDeducted === 0}
                      className="tap-target p-2 rounded-lg bg-signal-green/20 text-signal-green disabled:opacity-30"
                    >
                      <Minus size={18} />
                    </button>
                    <span className="w-8 text-center font-bold text-chrome">
                      {evaluation?.pointsDeducted || 0}
                    </span>
                    <button
                      onClick={() => handlePointsChange(criteria.id, 1, criteria.maxPoints)}
                      disabled={evaluation?.pointsDeducted === criteria.maxPoints}
                      className="tap-target p-2 rounded-lg bg-signal-red/20 text-signal-red disabled:opacity-30"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>

                {/* Quick Notes */}
                <input
                  type="text"
                  value={evaluation?.evaluatorNotes || ""}
                  onChange={(e) => handleNotesChange(criteria.id, e.target.value)}
                  placeholder="Notes (optional)"
                  className="input mt-3 text-sm py-2"
                />
              </div>
            );
          })}
        </div>

        {/* Category Score Summary */}
        <div className="mt-4 card p-4 bg-chrome/5">
          {currentCategory && (
            <div className="flex items-center justify-between">
              <span className="text-chrome/60">Category Score:</span>
              <span className="font-bold text-chrome">
                {calculateCategoryScore(currentCategory).earned}/{calculateCategoryScore(currentCategory).max}
              </span>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => setCurrentCategoryIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentCategoryIndex === 0}
            className="btn btn-ghost flex-1 disabled:opacity-30"
          >
            <ArrowLeft size={18} />
            Previous
          </button>
          
          {currentCategoryIndex === categories.length - 1 ? (
            <button
              onClick={() => handleSubmit(false)}
              disabled={submitting}
              className="btn btn-success flex-1"
            >
              {submitting ? (
                <div className="spinner w-5 h-5" />
              ) : (
                <Save size={18} />
              )}
              {submitting ? "Saving..." : "Submit Test"}
            </button>
          ) : (
            <button
              onClick={() => setCurrentCategoryIndex((prev) => Math.min(categories.length - 1, prev + 1))}
              className="btn btn-primary flex-1"
            >
              Next
              <ChevronRight size={18} />
            </button>
          )}
        </div>

        {/* General Notes */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-chrome/60 mb-2">
            General Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Overall observations, recommendations..."
            className="input min-h-[100px] resize-none"
          />
        </div>
      </div>

      {/* Auto-fail Modal */}
      {showAutofailModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70">
          <div className="card p-6 max-w-md w-full animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-signal-red/20">
                <AlertTriangle className="w-6 h-6 text-signal-red" />
              </div>
              <h3 className="text-lg font-bold text-chrome">Automatic Fail</h3>
            </div>

            <p className="text-chrome/60 mb-4">
              Select the reason for automatic failure:
            </p>

            <div className="space-y-2 mb-4">
              {automaticFailConditions.map((condition) => (
                <button
                  key={condition}
                  onClick={() => setAutofailReason(condition)}
                  className={`w-full p-3 rounded-lg text-left transition-colors ${
                    autofailReason === condition
                      ? "bg-signal-red/20 border border-signal-red/50 text-signal-red"
                      : "bg-chrome/5 text-chrome hover:bg-chrome/10"
                  }`}
                >
                  {condition}
                </button>
              ))}
            </div>

            <textarea
              value={autofailReason}
              onChange={(e) => setAutofailReason(e.target.value)}
              placeholder="Or describe the situation..."
              className="input min-h-[80px] resize-none mb-4"
            />

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowAutofailModal(false);
                  setAutofailReason("");
                }}
                className="btn btn-ghost flex-1"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSubmit(true)}
                disabled={!autofailReason || submitting}
                className="btn btn-danger flex-1"
              >
                {submitting ? (
                  <div className="spinner w-5 h-5" />
                ) : (
                  <XCircle size={18} />
                )}
                Confirm Fail
              </button>
            </div>
          </div>
        </div>
      )}

      <Navigation />
    </main>
  );
}

