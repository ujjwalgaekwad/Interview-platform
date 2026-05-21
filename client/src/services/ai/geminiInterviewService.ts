import { z } from "zod";

import { QuestionAnswerType, RoundType } from "@/types/InterviewData";

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent";
const MAX_RETRIES = 2;
const REQUEST_TIMEOUT_MS = 15000;

const apiKey = import.meta.env.VITE_GEMINI_KEY;

if (!apiKey) {
  throw new Error("Missing VITE_GEMINI_KEY environment variable.");
}

type GeminiCandidate = {
  content?: {
    parts?: Array<{
      text?: string;
    }>;
  };
};

type GeminiResponse = {
  candidates?: GeminiCandidate[];
  error?: {
    message?: string;
  };
};

const interviewEvaluationSchema = z.object({
  answerReview: z.string().min(1),
  score: z.number().min(0).max(10),
  correctAnswer: z.string().min(1),
});

const interviewEvaluationListSchema = z.array(interviewEvaluationSchema).min(1);

export type InterviewEvaluation = z.infer<typeof interviewEvaluationSchema>;

export type candidateDetailsType = {
  yearsOfExperience: number;
  candidateName: string | null;
  jobRole: string;
  skills: string[];
};

export type candidateAnswerDetailType = {
  round: RoundType;
  timeLimit: number;
  previousAnswer: string;
  college: string;
  achievements: string;
  currentJobRole: string | null;
  higherEducation: string;
} & candidateDetailsType;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const getRetryDelay = (retryAfterHeader?: string, attempt = 0) => {
  const retryAfter = Number(retryAfterHeader);

  if (!Number.isNaN(retryAfter) && retryAfter > 0) {
    return retryAfter * 1000;
  }

  return Math.min(1000 * Math.pow(2, attempt), 5000);
};

const buildRequestBody = (prompt: string) => ({
  contents: [
    {
      role: "user",
      parts: [{ text: prompt }],
    },
  ],
  generationConfig: {
    temperature: 0.4,
    topP: 0.95,
    maxOutputTokens: 1024,
  },
});

const postToGemini = async (prompt: string) => {
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(buildRequestBody(prompt)),
        signal: controller.signal,
      });

      window.clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 429 && attempt < MAX_RETRIES) {
          const retryAfter = response.headers.get("retry-after") ?? undefined;
          const delay = getRetryDelay(retryAfter, attempt);
          await sleep(delay);
          continue;
        }

        if (response.status === 429) {
          console.error("Please retry after a short delay.");
          return null;
        }

        if (response.status === 400) {
          console.error("Invalid Gemini request payload");
          return null;
        }

        const errorData = (await response.json().catch(() => null)) as GeminiResponse | null;
        const providerMessage =
          errorData?.error?.message || response.statusText || "Gemini request failed";

        console.error(providerMessage);
        return null;
      }

      return (await response.json()) as GeminiResponse;
    } catch (error) {
      window.clearTimeout(timeoutId);

      if (error instanceof DOMException && error.name === "AbortError") {
        console.error("Gemini request timed out");
        return null;
      }

      if (attempt < MAX_RETRIES) {
        await sleep(getRetryDelay(undefined, attempt));
        continue;
      }

      throw error;
    }
  }

  return null;
};

const extractText = (response: GeminiResponse) => {
  const text = response.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

  return text.trim();
};

const stripCodeFences = (text: string) =>
  text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

const extractJsonArray = (text: string) => {
  const cleaned = stripCodeFences(text);
  const startIndex = cleaned.indexOf("[");
  const endIndex = cleaned.lastIndexOf("]");

  if (startIndex === -1 || endIndex === -1 || endIndex <= startIndex) {
    throw new Error("Gemini did not return a JSON array.");
  }

  return cleaned.slice(startIndex, endIndex + 1);
};

const getBasePromptForNextQuestion = ({
  yearsOfExperience,
  candidateName,
  jobRole,
  skills,
  round,
  timeLimit,
  previousAnswer,
  college,
  currentJobRole,
  achievements,
  higherEducation,
}: candidateAnswerDetailType) => {
  return `You are a senior interview panelist.

Create exactly one ${round} interview question for the candidate below.

Candidate profile:
- Name: ${candidateName ?? "Not provided"}
- Years of experience: ${yearsOfExperience}
- Job role: ${jobRole}
- Skills: ${skills.join(", ")}
- College: ${college}
- Current job role: ${currentJobRole ?? "Not provided"}
- Higher education: ${higherEducation}
- Achievements: ${achievements}
- Previous answer: ${previousAnswer || "No previous answer"}

Rules:
- Keep the question aligned to the ${round} round.
- Respect the time limit of ${timeLimit} seconds.
- Make the question appropriate for the candidate's experience level.
- If the round is technical, ask only a coding or core CS question.
- Return only the question text.
`;
};

const getBasePromptForQuestionFeedback = (
  candidateDetails: candidateDetailsType,
  questionAnswerSets: QuestionAnswerType[]
) => {
  return `You are an expert interview evaluator.

Evaluate each question-answer pair and return a JSON array only.

Candidate details:
${JSON.stringify(candidateDetails)}

Question-answer sets:
${JSON.stringify(questionAnswerSets)}

Output requirements:
- Return a JSON array.
- Each item must contain exactly these keys:
  - "answerReview": a concise, constructive review of the answer.
  - "score": a number from 0 to 10.
  - "correctAnswer": a brief correct answer or code snippet if relevant.
- Do not wrap the result in markdown.
- Do not include any text outside the JSON array.
`;
};

export async function generateNextQuestion(
  candidateDetails: candidateAnswerDetailType
): Promise<string | null> {
  try {
    const response = await postToGemini(getBasePromptForNextQuestion(candidateDetails));

    if (!response) {
      return null;
    }

    const text = extractText(response);

    if (!text) {
      console.error("No text response from AI");
      return null;
    }

    return text;
  } catch (error) {
    console.error("Error generating content:", error);
    return null;
  }
}

export async function generateFeedback(
  candidateDetails: candidateDetailsType,
  questionAnswerSets: QuestionAnswerType[]
): Promise<InterviewEvaluation[] | null> {
  try {
    const response = await postToGemini(
      getBasePromptForQuestionFeedback(candidateDetails, questionAnswerSets)
    );

    if (!response) {
      return null;
    }

    const text = extractText(response);

    if (!text) {
      console.error("No text response from AI");
      return null;
    }

    const parsed = JSON.parse(extractJsonArray(text));
    const validated = interviewEvaluationListSchema.parse(parsed);

    return validated;
  } catch (error) {
    console.error("Error generating content:", error);
    return null;
  }
}