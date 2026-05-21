import { z } from "zod";

export type RoundType =
  | "aptitude"
  | "technical"
  | "behavioral"
  | "system-design"
  | "end";

export type QuestionAnswerType = {
  question: string;
  answer: string | string[];
  startTime: number;
  code?: { code: string; language: string }[];
  round: RoundType;
  timeLimit: number;
};

export const jobRoleSchema = z.enum([
  "front-end",
  "back-end",
  "full-stack",
  "ai-engineer",
  "network-engineer",
  "cloud-architect",
  "data-analyst",
  "python-developer",
  "js-developer",
  "java-developer",
  "android-developer",
]);

export type FaceExpressionType = {
  expressionState: string;
  timeStamp: number;
};

export type JobRoleType = z.infer<typeof jobRoleSchema>;

export type AboutCandidateType = {
  id: string | null;
  email: string | null;
  name: string | null;
  yearsOfExperience: number;
  jobRole: JobRoleType;
  skills: string[];
};

export type QuestionSchema = {
  question: string;
  answer: string;
  code?: { code: string; language: string }[];
  answerReview: string;
  correctAnswer: string;
  score: number;
  timeLimit: number;
  round: RoundType;
  startTime: number;
  endTime: number | null;
  faceExpressions: FaceExpression[];
  gazeTracking: GazeTracking[];
  questionAnswerIndex: number;
};

export type FaceExpression = {
  expressionState: string;
  timeStamp: number;
};

export type GazeTracking = {
  timeStamp: number;
  x: number;
  y: number;
};

export type InterviewSession = {
  _id: string;
  sessionId: string;
  candidate: {
    email: string;
    name: string;
    jobRole: string;
    skills: string[];
    yearsOfExperience: number;
  };
  questions: QuestionSchema[];
  startTime: number;
  endTime: number | null;
  currentQuestionIndex: number;
  status: "pending" | "active" | "completed";
};

export type InterviewSessionData = {
  _id: string
  candidate: string
  startTime: number
  endTime: number
  skills: string[]
  userId: string
  jobRole: string
  yearsOfExperience: number
  questions: QuestionSchema[]
};
