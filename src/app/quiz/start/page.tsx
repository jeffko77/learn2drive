"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Navigation } from "@/components/Navigation";
import { QuizCard } from "@/components/QuizCard";
import { ArrowLeft, Users, ChevronDown, Trophy, XCircle, CheckCircle2, RotateCcw } from "lucide-react";
import Link from "next/link";

interface Question {
  id: string;
  topic: string;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string;
  explanation: string | null;
}

interface Driver {
  id: string;
  name: string;
}

interface QuizResult {
  score: number;
  total: number;
  passed: boolean;
  answers: Array<{
    questionId: string;
    selectedAnswer: string;
    question?: Question;
  }>;
}

function QuizContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const mode = (searchParams.get("mode") as "practice" | "test") || "practice";
  const topic = searchParams.get("topic");
  const count = parseInt(searchParams.get("count") || "10");

  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [started, setStarted] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);

  useEffect(() => {
    fetchData();
  }, [topic, count]);

  const fetchData = async () => {
    try {
      const [driversRes, questionsRes] = await Promise.all([
        fetch("/api/drivers"),
        fetch(`/api/quiz/questions?random=true&limit=${count}${topic ? `&topic=${encodeURIComponent(topic)}` : ""}`),
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

  const handleComplete = async (
    score: number,
    total: number,
    answers: Array<{ questionId: string; selectedAnswer: string }>
  ) => {
    const passed = (score / total) >= 0.8;
    
    // Save attempt to database
    if (selectedDriver) {
      try {
        await fetch("/api/quiz/attempts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            driverId: selectedDriver.id,
            answers,
            mode,
          }),
        });
      } catch (error) {
        console.error("Error saving attempt:", error);
      }
    }

    // Map answers with questions
    const answersWithQuestions = answers.map(a => ({
      ...a,
      question: questions.find(q => q.id === a.questionId),
    }));

    setResult({ score, total, passed, answers: answersWithQuestions });
  };

  const handleRetry = () => {
    setResult(null);
    setStarted(false);
    fetchData();
  };

  if (loading) {
    return (
      <main className="min-h-screen safe-bottom relative z-10 flex items-center justify-center">
        <div className="spinner" />
        <Navigation />
      </main>
    );
  }

  if (result) {
    const percentage = Math.round((result.score / result.total) * 100);
    
    return (
      <main className="min-h-screen safe-bottom relative z-10">
        <div className="px-4 pt-8">
          <Link
            href="/quiz"
            className="inline-flex items-center gap-2 text-chrome/60 hover:text-chrome mb-6 tap-target"
          >
            <ArrowLeft size={20} />
            <span>Back to Quiz</span>
          </Link>

          {/* Result Card */}
          <div className={`card p-8 text-center ${result.passed ? "border-signal-green/30" : "border-signal-red/30"}`}>
            <div className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center ${
              result.passed ? "bg-signal-green/20" : "bg-signal-red/20"
            }`}>
              {result.passed ? (
                <Trophy className="w-10 h-10 text-signal-green" />
              ) : (
                <XCircle className="w-10 h-10 text-signal-red" />
              )}
            </div>

            <h2 className={`text-2xl font-bold mb-2 ${result.passed ? "text-signal-green" : "text-signal-red"}`}>
              {result.passed ? "You Passed!" : "Keep Practicing"}
            </h2>

            <p className="text-chrome/60 mb-6">
              {result.passed
                ? "Great job! You're ready for the DMV test."
                : "You need 80% to pass. Review and try again."}
            </p>

            <div className="flex items-center justify-center gap-8 mb-6">
              <div>
                <p className="text-4xl font-bold text-chrome">{result.score}</p>
                <p className="text-sm text-chrome/60">Correct</p>
              </div>
              <div className="w-px h-12 bg-chrome/20" />
              <div>
                <p className="text-4xl font-bold text-chrome">{result.total - result.score}</p>
                <p className="text-sm text-chrome/60">Wrong</p>
              </div>
              <div className="w-px h-12 bg-chrome/20" />
              <div>
                <p className={`text-4xl font-bold ${result.passed ? "text-signal-green" : "text-signal-red"}`}>
                  {percentage}%
                </p>
                <p className="text-sm text-chrome/60">Score</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={handleRetry} className="btn btn-primary flex-1">
                <RotateCcw size={18} />
                Try Again
              </button>
              <Link href="/quiz" className="btn btn-ghost flex-1">
                Back to Quiz
              </Link>
            </div>
          </div>

          {/* Answer Review */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-chrome mb-4">Review Answers</h3>
            <div className="space-y-3">
              {result.answers.map((answer, index) => {
                const question = answer.question;
                if (!question) return null;
                
                const isCorrect = answer.selectedAnswer === question.correctAnswer;
                
                return (
                  <div
                    key={answer.questionId}
                    className={`card p-4 ${
                      isCorrect ? "border-signal-green/30" : "border-signal-red/30"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-1.5 rounded-lg ${
                        isCorrect ? "bg-signal-green/20" : "bg-signal-red/20"
                      }`}>
                        {isCorrect ? (
                          <CheckCircle2 className="w-4 h-4 text-signal-green" />
                        ) : (
                          <XCircle className="w-4 h-4 text-signal-red" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-chrome/60 mb-1">Question {index + 1}</p>
                        <p className="text-chrome font-medium mb-2">{question.questionText}</p>
                        
                        {!isCorrect && (
                          <div className="text-sm">
                            <p className="text-signal-red">
                              Your answer: {answer.selectedAnswer}. {
                                answer.selectedAnswer === "A" ? question.optionA :
                                answer.selectedAnswer === "B" ? question.optionB :
                                answer.selectedAnswer === "C" ? question.optionC :
                                question.optionD
                              }
                            </p>
                            <p className="text-signal-green mt-1">
                              Correct: {question.correctAnswer}. {
                                question.correctAnswer === "A" ? question.optionA :
                                question.correctAnswer === "B" ? question.optionB :
                                question.correctAnswer === "C" ? question.optionC :
                                question.optionD
                              }
                            </p>
                          </div>
                        )}
                        
                        {question.explanation && (
                          <p className="text-sm text-chrome/60 mt-2 p-2 bg-chrome/5 rounded">
                            {question.explanation}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <Navigation />
      </main>
    );
  }

  if (!started) {
    return (
      <main className="min-h-screen safe-bottom relative z-10">
        <div className="px-4 pt-8">
          <Link
            href="/quiz"
            className="inline-flex items-center gap-2 text-chrome/60 hover:text-chrome mb-6 tap-target"
          >
            <ArrowLeft size={20} />
            <span>Back to Quiz</span>
          </Link>

          <div className="card p-6">
            <h2 className="text-xl font-bold text-chrome mb-2">
              {mode === "test" ? "Practice Test" : "Practice Quiz"}
            </h2>
            <p className="text-chrome/60 mb-6">
              {topic || "All Topics"} • {questions.length} questions
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

            {/* Quiz Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between py-2 border-b border-chrome/10">
                <span className="text-chrome/60">Questions</span>
                <span className="text-chrome font-medium">{questions.length}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-chrome/10">
                <span className="text-chrome/60">Passing Score</span>
                <span className="text-chrome font-medium">80% (20/25)</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-chrome/60">Mode</span>
                <span className="badge badge-info capitalize">{mode}</span>
              </div>
            </div>

            {/* Start Button */}
            <button
              onClick={() => setStarted(true)}
              disabled={!selectedDriver}
              className="btn btn-primary w-full"
            >
              <Trophy size={18} />
              Start Quiz
            </button>

            {!selectedDriver && drivers.length === 0 && (
              <p className="text-sm text-chrome/50 text-center mt-3">
                <Link href="/drivers/new" className="text-sky-blue">
                  Add a driver
                </Link>{" "}
                to track quiz scores
              </p>
            )}
          </div>
        </div>

        <Navigation />
      </main>
    );
  }

  return (
    <main className="min-h-screen safe-bottom relative z-10">
      <div className="px-4 pt-8">
        <QuizCard
          questions={questions}
          driverId={selectedDriver?.id || ""}
          mode={mode}
          onComplete={handleComplete}
        />
      </div>

      <Navigation />
    </main>
  );
}

export default function QuizStartPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen safe-bottom relative z-10 flex items-center justify-center">
        <div className="spinner" />
        <Navigation />
      </main>
    }>
      <QuizContent />
    </Suspense>
  );
}

