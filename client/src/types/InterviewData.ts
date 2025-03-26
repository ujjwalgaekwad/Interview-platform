import { z } from "zod";

export type RoundType = "aptitude" | "technical" | "behavioral" | "system-design";

export type QuestionAnswerType = {
  question: string;
  answer: string | string[] | { code: string; language: string };
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
}

export type JobRoleType = z.infer<typeof jobRoleSchema>;

export type AboutCandidateType = {
  email: string | null;
  name: string | null;
  yearsOfExperience: number;
  jobRole: JobRoleType;
  skills: string[];
};
