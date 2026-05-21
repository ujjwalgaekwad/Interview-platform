import { AboutCandidateType, QuestionAnswerType } from "@/types/InterviewData";
import { create } from "zustand";

interface interviewState {
  questionAnswerSets: QuestionAnswerType[] | null;
  candidate: AboutCandidateType | null;
  updateAnswer: (answer: string, index: number) => void;
  addQuestionAnswerSet: (questionAnswerSet: QuestionAnswerType) => void;
  addCodeAttempt: (code: string, language: string, index: number) => void;
  setQuestionAnswerSets: (
    questionAnswerSets: QuestionAnswerType[] | null
  ) => void;
  setCandidate: (candidate: AboutCandidateType | null) => void;
}

const useInterviewStore = create<interviewState>((set) => ({
  questionAnswerSets: null,
  candidate: null,
  updateAnswer: (answer, index) =>
    set((state) => ({
      questionAnswerSets: state.questionAnswerSets?.map((q, i) =>
        i === index ? { ...q, answer } : q
      ),
    })),
  addQuestionAnswerSet: (questionAnswerSet) =>
    set((state) => ({
      questionAnswerSets: [
        ...(state.questionAnswerSets || []),
        questionAnswerSet,
      ],
    })),
  addCodeAttempt: (code, language, index) => {
    set((state) => ({
      questionAnswerSets: state.questionAnswerSets?.map((q, i) =>
        i === index
          ? {
              ...q,
              code: [...(q.code || []), { code, language }],
            }
          : q
      ),
    }));
  },
  setQuestionAnswerSets: (questionAnswerSets) => set({ questionAnswerSets }),
  setCandidate: (candidate) => set({ candidate }),
}));

export default useInterviewStore;
