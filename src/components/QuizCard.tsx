"use client";

import { useState, useEffect } from "react";
import { Check, X, ChevronRight, Clock, Trophy } from "lucide-react";

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

interface QuizCardProps {
  questions: Question[];
  driverId: string;
  mode: "practice" | "test";
  onComplete: (score: number, total: number, answers: Array<{questionId: string; selectedAnswer: string}>) => void;
}

export function QuizCard({ questions, driverId, mode, onComplete }: QuizCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState<Array<{questionId: string; selectedAnswer: string}>>([]);
  const [score, setScore] = useState(0);
  const [startTime] = useState(Date.now());
  const [timeElapsed, setTimeElapsed] = useState(0);

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;
  const isCorrect = selectedAnswer === currentQuestion?.correctAnswer;

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [startTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectAnswer = (answer: string) => {
    if (showResult && mode === "practice") return;
    setSelectedAnswer(answer);
    
    if (mode === "test") {
      // In test mode, just record the answer
      const newAnswers = [...answers, { questionId: currentQuestion.id, selectedAnswer: answer }];
      setAnswers(newAnswers);
      
      if (answer === currentQuestion.correctAnswer) {
        setScore(score + 1);
      }
      
      // Auto-advance in test mode
      setTimeout(() => {
        if (isLastQuestion) {
          onComplete(score + (answer === currentQuestion.correctAnswer ? 1 : 0), questions.length, newAnswers);
        } else {
          setCurrentIndex(currentIndex + 1);
          setSelectedAnswer(null);
        }
      }, 300);
    } else {
      setShowResult(true);
      const newAnswers = [...answers, { questionId: currentQuestion.id, selectedAnswer: answer }];
      setAnswers(newAnswers);
      if (answer === currentQuestion.correctAnswer) {
        setScore(score + 1);
      }
    }
  };

  const handleNext = () => {
    if (isLastQuestion) {
      onComplete(score, questions.length, answers);
    } else {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  const getOptionClass = (option: string) => {
    if (!showResult && mode === "practice") {
      return selectedAnswer === option ? "selected" : "";
    }
    
    if (showResult || mode === "test") {
      if (option === currentQuestion.correctAnswer) {
        return "correct";
      }
      if (selectedAnswer === option && option !== currentQuestion.correctAnswer) {
        return "incorrect";
      }
    }
    
    return selectedAnswer === option ? "selected" : "";
  };

  if (!currentQuestion) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-chrome/60">
          <Clock size={16} />
          <span className="font-mono">{formatTime(timeElapsed)}</span>
        </div>
        <div className="text-sm text-chrome/60">
          Question {currentIndex + 1} of {questions.length}
        </div>
        <div className="flex items-center gap-2 text-chrome/60">
          <Trophy size={16} />
          <span>{score}/{currentIndex + (showResult ? 1 : 0)}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="progress-bar h-2">
        <div
          className="progress-fill green"
          style={{ width: `${((currentIndex + (showResult ? 1 : 0)) / questions.length) * 100}%` }}
        />
      </div>

      {/* Topic Badge */}
      <div className="badge badge-info">{currentQuestion.topic}</div>

      {/* Question */}
      <div className="card p-6">
        <h3 className="text-lg font-medium text-chrome leading-relaxed">
          {currentQuestion.questionText}
        </h3>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {[
          { key: "A", value: currentQuestion.optionA },
          { key: "B", value: currentQuestion.optionB },
          { key: "C", value: currentQuestion.optionC },
          { key: "D", value: currentQuestion.optionD },
        ].map((option) => (
          <button
            key={option.key}
            onClick={() => handleSelectAnswer(option.key)}
            disabled={showResult && mode === "practice"}
            className={`quiz-option w-full text-left ${getOptionClass(option.key)}`}
          >
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-sky-blue/20 flex items-center justify-center font-semibold text-sky-blue">
                {option.key}
              </span>
              <span className="text-chrome pt-1">{option.value}</span>
              {showResult && option.key === currentQuestion.correctAnswer && (
                <Check className="ml-auto text-signal-green flex-shrink-0" size={20} />
              )}
              {showResult && selectedAnswer === option.key && option.key !== currentQuestion.correctAnswer && (
                <X className="ml-auto text-signal-red flex-shrink-0" size={20} />
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Explanation (Practice Mode) */}
      {showResult && mode === "practice" && currentQuestion.explanation && (
        <div className={`card p-4 ${isCorrect ? "border-signal-green/30 bg-signal-green/10" : "border-signal-red/30 bg-signal-red/10"}`}>
          <div className="flex items-start gap-3">
            {isCorrect ? (
              <Check className="text-signal-green flex-shrink-0 mt-0.5" size={20} />
            ) : (
              <X className="text-signal-red flex-shrink-0 mt-0.5" size={20} />
            )}
            <div>
              <p className={`font-medium ${isCorrect ? "text-signal-green" : "text-signal-red"}`}>
                {isCorrect ? "Correct!" : "Incorrect"}
              </p>
              <p className="text-chrome/80 text-sm mt-1">{currentQuestion.explanation}</p>
            </div>
          </div>
        </div>
      )}

      {/* Next Button (Practice Mode) */}
      {showResult && mode === "practice" && (
        <button onClick={handleNext} className="btn btn-primary w-full">
          {isLastQuestion ? "See Results" : "Next Question"}
          <ChevronRight size={18} />
        </button>
      )}
    </div>
  );
}

