import "regenerator-runtime/runtime";
import { useEffect, useRef, useState } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

export const previousTranscriptions: Record<number, string> = {};

export function useAutoSpeechRecognizer(questionAnswerIndex: number) {
  const { transcript, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
  const [storedTranscript, setStoredTranscript] = useState<string>("");
  const prevQuestionAnswerIndex = useRef<number | null>(null);
  const transcriptRef = useRef<string>("");

  useEffect(() => {
    transcriptRef.current = transcript;
  }, [transcript]);

  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      console.error("Browser does not support speech recognition.");
      return;
    }

    SpeechRecognition.startListening({ continuous: true, language: "en-IN" });

    return () => {
      SpeechRecognition.stopListening();
    };
  }, [browserSupportsSpeechRecognition]);

  useEffect(() => {
    if (!browserSupportsSpeechRecognition) return;

    const previousIndex = prevQuestionAnswerIndex.current;
    if (previousIndex !== null) {
      const combinedTranscript = storedTranscript + transcriptRef.current;
      previousTranscriptions[previousIndex] = combinedTranscript;
    }

    const newStoredTranscript = previousTranscriptions[questionAnswerIndex] || "";
    setStoredTranscript(newStoredTranscript);
    resetTranscript();

    prevQuestionAnswerIndex.current = questionAnswerIndex;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionAnswerIndex, browserSupportsSpeechRecognition, resetTranscript]);

  const combinedTranscript = storedTranscript + transcript;
  return { transcript: combinedTranscript };
}