"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { CheckCircle2, XCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface QuizQuestion {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

interface QuizSectionProps {
  questions: QuizQuestion[];
}

export function QuizSection({ questions }: QuizSectionProps) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState<Record<number, boolean>>({});

  const handleSelect = (qIdx: number, optIdx: number) => {
    if (showResults[qIdx]) return;
    setAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleCheck = (qIdx: number) => {
    setShowResults((prev) => ({ ...prev, [qIdx]: true }));
  };

  const handleReset = () => {
    setAnswers({});
    setShowResults({});
  };

  const totalAnswered = Object.keys(showResults).length;
  const totalCorrect = Object.entries(showResults).filter(
    ([qIdx]) => answers[Number(qIdx)] === questions[Number(qIdx)].answer
  ).length;

  return (
    <div className="mt-10 not-prose">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">자가 평가 퀴즈</h2>
        {totalAnswered > 0 && (
          <Button variant="ghost" size="sm" onClick={handleReset} className="gap-1">
            <RotateCcw className="h-3.5 w-3.5" />
            초기화
          </Button>
        )}
      </div>

      {totalAnswered === questions.length && (
        <div className="mb-4 p-3 rounded-lg bg-primary/10 text-center font-medium">
          결과: {questions.length}문제 중 {totalCorrect}문제 정답
        </div>
      )}

      <div className="space-y-6">
        {questions.map((q, qIdx) => {
          const isAnswered = showResults[qIdx];
          const isCorrect = answers[qIdx] === q.answer;

          return (
            <Card key={qIdx} className="p-4">
              <p className="font-medium mb-3">
                <span className="text-primary mr-2">Q{qIdx + 1}.</span>
                {q.question}
              </p>
              <div className="space-y-2 mb-3" role="radiogroup" aria-label={`문제 ${qIdx + 1} 선택지`}>
                {q.options.map((opt, optIdx) => (
                  <button
                    key={optIdx}
                    role="radio"
                    aria-checked={answers[qIdx] === optIdx}
                    onClick={() => handleSelect(qIdx, optIdx)}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-md border text-sm transition-colors",
                      answers[qIdx] === optIdx && !isAnswered && "border-primary bg-primary/5",
                      isAnswered && optIdx === q.answer && "border-green-500 bg-green-50 dark:bg-green-950/30",
                      isAnswered && answers[qIdx] === optIdx && optIdx !== q.answer && "border-red-500 bg-red-50 dark:bg-red-950/30",
                      !isAnswered && answers[qIdx] !== optIdx && "hover:bg-accent"
                    )}
                    disabled={isAnswered}
                  >
                    <span className="mr-2 text-muted-foreground">{String.fromCharCode(9312 + optIdx)}</span>
                    {opt}
                    {isAnswered && optIdx === q.answer && (
                      <CheckCircle2 className="inline ml-2 h-4 w-4 text-green-600" />
                    )}
                    {isAnswered && answers[qIdx] === optIdx && optIdx !== q.answer && (
                      <XCircle className="inline ml-2 h-4 w-4 text-red-600" />
                    )}
                  </button>
                ))}
              </div>
              {answers[qIdx] !== undefined && !isAnswered && (
                <Button size="sm" onClick={() => handleCheck(qIdx)}>
                  정답 확인
                </Button>
              )}
              {isAnswered && (
                <div className={cn(
                  "mt-2 p-3 rounded-md text-sm",
                  isCorrect ? "bg-green-50 dark:bg-green-950/20 text-green-800 dark:text-green-200" : "bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-200"
                )}>
                  <p className="font-medium mb-1">{isCorrect ? "정답입니다!" : "오답입니다."}</p>
                  <p>{q.explanation}</p>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
