"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Navigation } from "@/components/Navigation";
import { 
  ArrowLeft, 
  Users, 
  ChevronDown, 
  Signpost, 
  CheckCircle2,
  XCircle,
  Clock,
  ChevronRight,
  HelpCircle
} from "lucide-react";
import Link from "next/link";
import { ROAD_SIGN_PASSING_SCORE, ROAD_SIGN_TIME_PER_QUESTION } from "@/lib/road-sign-seed-data";

interface Driver {
  id: string;
  name: string;
}

interface SignOption {
  letter: string;
  text: string;
  signId: string;
}

interface SignQuestion {
  signId: string;
  signName: string;
  shape: string;
  colorScheme: string;
  categoryName: string;
  additionalNotes: string | null;
  options: SignOption[];
  correctAnswer: string;
}

interface Answer {
  signId: string;
  selectedAnswer: string | null;
  selectedSignId: string | null;
  timeSpent: number;
}

function RoadSignsTestContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const mode = searchParams.get("mode") || "all";
  const categoryId = searchParams.get("categoryId");
  const count = parseInt(searchParams.get("count") || "20");

  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [questions, setQuestions] = useState<SignQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [timeLeft, setTimeLeft] = useState(ROAD_SIGN_TIME_PER_QUESTION);
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());
  const [submitting, setSubmitting] = useState(false);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    fetchData();
  }, [categoryId, count]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (started && mode === "timed" && !showFeedback && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimeUp();
            return ROAD_SIGN_TIME_PER_QUESTION;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [started, mode, showFeedback, timeLeft]);

  const fetchData = async () => {
    try {
      const [driversRes, questionsRes] = await Promise.all([
        fetch("/api/drivers"),
        fetch(`/api/road-signs/test?count=${count}${categoryId ? `&categoryId=${categoryId}` : ""}`),
      ]);

      const [driversData, questionsData] = await Promise.all([
        driversRes.json(),
        questionsRes.json(),
      ]);

      setDrivers(Array.isArray(driversData) ? driversData : []);
      if (driversData.length > 0) {
        setSelectedDriver(driversData[0]);
      }
      setQuestions(Array.isArray(questionsData) ? questionsData : []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTimeUp = () => {
    // Auto-submit with no answer if time runs out
    handleAnswerSubmit(null);
  };

  const handleAnswerSelect = (letter: string) => {
    if (showFeedback && mode !== "practice") return;
    setSelectedAnswer(letter);
    
    if (mode === "practice") {
      setShowFeedback(true);
    }
  };

  const handleAnswerSubmit = (forcedAnswer: string | null = selectedAnswer) => {
    const currentQuestion = questions[currentIndex];
    const timeSpent = Math.round((Date.now() - questionStartTime) / 1000);
    
    const selectedOption = currentQuestion.options.find(
      (opt) => opt.letter === forcedAnswer
    );
    
    const newAnswer: Answer = {
      signId: currentQuestion.signId,
      selectedAnswer: forcedAnswer,
      selectedSignId: selectedOption?.signId || null,
      timeSpent,
    };

    const newAnswers = [...answers, newAnswer];
    setAnswers(newAnswers);

    if (mode === "practice") {
      setShowFeedback(true);
    } else {
      moveToNext(newAnswers);
    }
  };

  const moveToNext = async (currentAnswers: Answer[]) => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setShowHint(false);
      setTimeLeft(ROAD_SIGN_TIME_PER_QUESTION);
      setQuestionStartTime(Date.now());
    } else {
      // Test complete - submit
      await submitTest(currentAnswers);
    }
  };

  const handleNextQuestion = () => {
    moveToNext(answers);
  };

  const submitTest = async (finalAnswers: Answer[]) => {
    if (!selectedDriver) return;

    setSubmitting(true);
    try {
      const totalTime = finalAnswers.reduce((sum, a) => sum + a.timeSpent, 0);
      
      const response = await fetch("/api/road-signs/attempts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          driverId: selectedDriver.id,
          answers: finalAnswers,
          timeTaken: totalTime,
          testMode: mode,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        router.push(`/road-signs/results/${result.id}`);
      } else {
        console.error("Failed to submit test");
      }
    } catch (error) {
      console.error("Error submitting test:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const getShapeEmoji = (shape: string) => {
    const shapeMap: Record<string, string> = {
      "Octagon": "🛑",
      "Triangle (pointing down)": "🔻",
      "Diamond": "◆",
      "Square": "⬜",
      "Vertical rectangle": "▯",
      "Horizontal rectangle": "▭",
      "Circle (round)": "⭕",
      "Pentagon (5-sided)": "⬠",
      "Shield": "🛡️",
      "X-shape (crossbuck)": "✕",
    };
    return shapeMap[shape] || "📍";
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
            href="/road-signs"
            className="inline-flex items-center gap-2 text-chrome/60 hover:text-chrome mb-6 tap-target"
          >
            <ArrowLeft size={20} />
            <span>Back to Road Signs</span>
          </Link>

          <div className="card p-6">
            <h2 className="text-xl font-bold text-chrome mb-2">
              Road Sign Recognition Test
            </h2>
            <p className="text-chrome/60 mb-6">
              {questions.length} signs • {mode === "timed" ? "Timed" : mode === "practice" ? "Practice" : "Standard"}
            </p>

            {/* Driver Selector */}
            {drivers.length > 0 && (
              <div className="mb-6">
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

            {/* Test Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between py-2 border-b border-chrome/10">
                <span className="text-chrome/60">Questions</span>
                <span className="text-chrome font-medium">{questions.length}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-chrome/10">
                <span className="text-chrome/60">Passing Score</span>
                <span className="text-chrome font-medium">{ROAD_SIGN_PASSING_SCORE}%</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-chrome/10">
                <span className="text-chrome/60">Mode</span>
                <span className="badge badge-info capitalize">{mode}</span>
              </div>
              {mode === "timed" && (
                <div className="flex items-center justify-between py-2">
                  <span className="text-chrome/60">Time Per Question</span>
                  <span className="text-chrome font-medium">{ROAD_SIGN_TIME_PER_QUESTION} seconds</span>
                </div>
              )}
            </div>

            {/* Start Button */}
            <button
              onClick={() => {
                setStarted(true);
                setQuestionStartTime(Date.now());
              }}
              disabled={!selectedDriver}
              className="btn btn-primary w-full"
            >
              <Signpost size={18} />
              Start Test
            </button>

            {!selectedDriver && drivers.length === 0 && (
              <p className="text-sm text-chrome/50 text-center mt-3">
                <Link href="/drivers/new" className="text-sky-blue">
                  Add a driver
                </Link>{" "}
                to track test scores
              </p>
            )}
          </div>
        </div>

        <Navigation />
      </main>
    );
  }

  const currentQuestion = questions[currentIndex];
  const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
  const correctOption = currentQuestion.options.find(
    (opt) => opt.letter === currentQuestion.correctAnswer
  );

  return (
    <main className="min-h-screen safe-bottom relative z-10">
      {/* Progress Header */}
      <div className="sticky top-0 z-50 bg-dashboard/95 backdrop-blur-lg border-b border-chrome/10">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-chrome/60">
              Question {currentIndex + 1} of {questions.length}
            </span>
            {mode === "timed" && !showFeedback && (
              <div className={`flex items-center gap-2 ${timeLeft <= 10 ? "text-signal-red" : "text-chrome"}`}>
                <Clock size={16} />
                <span className="font-mono font-bold">{timeLeft}s</span>
              </div>
            )}
          </div>
          
          {/* Progress Bar */}
          <div className="h-1.5 bg-chrome/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-sky-blue rounded-full transition-all"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="px-4 pt-4 pb-24">
        {/* Sign Display */}
        <div className="card p-6 mb-6 text-center">
          <div className="text-4xl mb-3">
            {getShapeEmoji(currentQuestion.shape)}
          </div>
          <h2 className="text-xl font-bold text-chrome mb-2">
            {currentQuestion.signName}
          </h2>
          <div className="flex flex-wrap justify-center gap-2 mb-3">
            <span className="badge badge-info">{currentQuestion.shape}</span>
            <span className="badge badge-warning">{currentQuestion.colorScheme}</span>
          </div>
          <p className="text-sm text-chrome/50">{currentQuestion.categoryName}</p>
          
          {/* Hint Button */}
          {currentQuestion.additionalNotes && (
            <button
              onClick={() => setShowHint(!showHint)}
              className="mt-3 text-xs text-sky-blue flex items-center gap-1 mx-auto"
            >
              <HelpCircle size={14} />
              {showHint ? "Hide hint" : "Show hint"}
            </button>
          )}
          {showHint && currentQuestion.additionalNotes && (
            <p className="text-sm text-chrome/60 mt-2 p-2 bg-chrome/5 rounded">
              {currentQuestion.additionalNotes}
            </p>
          )}
        </div>

        {/* Question */}
        <h3 className="text-lg font-semibold text-chrome mb-4">
          What does this sign mean?
        </h3>

        {/* Options */}
        <div className="space-y-3">
          {currentQuestion.options.map((option) => {
            let optionClass = "quiz-option";
            
            if (showFeedback) {
              if (option.letter === currentQuestion.correctAnswer) {
                optionClass += " correct";
              } else if (option.letter === selectedAnswer && !isCorrect) {
                optionClass += " incorrect";
              }
            } else if (selectedAnswer === option.letter) {
              optionClass += " selected";
            }

            return (
              <button
                key={option.letter}
                onClick={() => handleAnswerSelect(option.letter)}
                disabled={showFeedback && mode !== "practice"}
                className={`w-full text-left ${optionClass}`}
              >
                <div className="flex items-start gap-3">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    showFeedback && option.letter === currentQuestion.correctAnswer
                      ? "bg-signal-green text-white"
                      : showFeedback && option.letter === selectedAnswer && !isCorrect
                        ? "bg-signal-red text-white"
                        : selectedAnswer === option.letter
                          ? "bg-sky-blue text-white"
                          : "bg-chrome/10 text-chrome"
                  }`}>
                    {option.letter}
                  </span>
                  <span className="flex-1 pt-1">{option.text}</span>
                  {showFeedback && option.letter === currentQuestion.correctAnswer && (
                    <CheckCircle2 className="w-5 h-5 text-signal-green mt-1" />
                  )}
                  {showFeedback && option.letter === selectedAnswer && !isCorrect && (
                    <XCircle className="w-5 h-5 text-signal-red mt-1" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Feedback / Actions */}
        {showFeedback && mode === "practice" && (
          <div className={`mt-4 p-4 rounded-lg ${isCorrect ? "bg-signal-green/10" : "bg-signal-red/10"}`}>
            <div className="flex items-center gap-2 mb-2">
              {isCorrect ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-signal-green" />
                  <span className="font-semibold text-signal-green">Correct!</span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-signal-red" />
                  <span className="font-semibold text-signal-red">Incorrect</span>
                </>
              )}
            </div>
            {!isCorrect && correctOption && (
              <p className="text-sm text-chrome/60">
                The correct answer is: <span className="text-signal-green">{correctOption.text}</span>
              </p>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6">
          {mode === "practice" && showFeedback ? (
            <button
              onClick={handleNextQuestion}
              disabled={submitting}
              className="btn btn-primary w-full"
            >
              {submitting ? (
                <div className="spinner w-5 h-5" />
              ) : currentIndex < questions.length - 1 ? (
                <>
                  Next Question
                  <ChevronRight size={18} />
                </>
              ) : (
                "See Results"
              )}
            </button>
          ) : mode !== "practice" && selectedAnswer ? (
            <button
              onClick={() => handleAnswerSubmit()}
              disabled={submitting}
              className="btn btn-primary w-full"
            >
              {submitting ? (
                <div className="spinner w-5 h-5" />
              ) : currentIndex < questions.length - 1 ? (
                <>
                  Next Question
                  <ChevronRight size={18} />
                </>
              ) : (
                "Submit Test"
              )}
            </button>
          ) : null}
        </div>
      </div>

      <Navigation />
    </main>
  );
}

export default function RoadSignsStartPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen safe-bottom relative z-10 flex items-center justify-center">
        <div className="spinner" />
        <Navigation />
      </main>
    }>
      <RoadSignsTestContent />
    </Suspense>
  );
}

