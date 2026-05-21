import selectRoundAndTimeLimit from "@/utils/selectRoundAndTimeLimit";
import { useState, useEffect, useRef, useCallback } from "react";

function Timer({ onReset, currentQuestionIndex, loadingNextQuestion }: { onReset: () => void, currentQuestionIndex: number, loadingNextQuestion: boolean }) {
  const intervalRef = useRef<number | null>(null);
  const timerRef = useRef(0); // Store time to avoid excessive re-renders
  const [timer, setTimer] = useState(() => selectRoundAndTimeLimit(currentQuestionIndex).timeLimit);

  // Format time in mm:ss
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  // Function to start or restart the timer
  const startTimer = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current); // Clear existing timer

    const newTimeLimit = selectRoundAndTimeLimit(currentQuestionIndex).timeLimit;
    timerRef.current = newTimeLimit;
    setTimer(newTimeLimit);

    intervalRef.current = window.setInterval(() => {
      if (timerRef.current > 0) {
        timerRef.current -= 1;
        setTimer(timerRef.current); // ✅ Only updates React state when necessary
      } else {
        clearInterval(intervalRef.current!);
        resetHandler(); // ✅ Reset only once when timer hits 0
      }
    }, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestionIndex]);

  // Function to reset the timer when time reaches 0
  const resetHandler = useCallback(async () => {
    clearInterval(intervalRef.current!);
    await onReset();
    startTimer(); // ✅ Automatically restart after reset
  }, [onReset, startTimer]);

  useEffect(() => {
    if (!loadingNextQuestion) {
      startTimer();
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [currentQuestionIndex, startTimer, loadingNextQuestion]);

  // Add additional effect to handle loading state changes
  useEffect(() => {
    if (loadingNextQuestion && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [loadingNextQuestion]);

  return (
    <span className={`select-none text-zinc-800 dark:text-zinc-200 font-semibold px-4 py-2 bg-zinc-200/80 dark:bg-zinc-800/80 rounded-md text-center ${timer <= 10 && "text-red-500"} ${loadingNextQuestion && "opacity-50 !cursor-not-allowed"}`}>
      {formatTime(timer)}
    </span>
  );
}

export default Timer;
