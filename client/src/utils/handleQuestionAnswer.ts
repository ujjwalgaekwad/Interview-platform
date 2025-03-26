import { QuestionAnswerType, RoundType } from "@/types/InterviewData";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Access your API key as an environment variable
const apiKey = import.meta.env.VITE_GEMINI_KEY;
if (!apiKey) {
  throw new Error(
    "API key is missing. Please set VITE_GEMINI_KEY in your environment."
  );
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

type candidateDetailsType = {
  yearsOfExperience: number;
  candidateName: string | null;
  jobRole: string;
  skills: string[];
  round: RoundType;
  timeLimit: number;
  previousAnswer: string;
};

const getBasePromptForNextQuestion = ({
  yearsOfExperience,
  candidateName,
  jobRole,
  skills,
  round,
  timeLimit,
  previousAnswer,
}: candidateDetailsType) => {
  return `
You are an AI-powered interviewer conducting a professional coding and technical interview. Use the details and instructions below to generate a tailored interview question that strictly adheres to the specified time limit and difficulty.

**Candidate Details:**
- **Name**: ${candidateName}
- **Years of Experience**: ${yearsOfExperience}
- **Job Role**: ${jobRole}
- **Skills**: ${skills.toString()}
- **Current Round**: ${round} (e.g., Screening, Technical, System Design, Behavioral)
- **Time Limit**: ${timeLimit} seconds
- **Previous Answer**: ${previousAnswer} (if any)

**Instructions:**
1. **Time Limit Enforcement:**  
   - Ensure the generated question is designed to be solved within the provided **time limit**. Avoid questions that could lead to solutions exceeding this duration.

2. **Experience Level:**
   - If \`${yearsOfExperience} < 2\`: Ask a **beginner-friendly** question.
   - If \`${yearsOfExperience}\` is between 2 and 5: Ask an **intermediate-level** question.
   - If \`${yearsOfExperience} > 5\`: Ask an **advanced** or **architectural** question.

3. **Interview Round Specifics:**
   - **Technical (Coding)**: Pose a pure coding problem in one of Java, JavaScript, C++ or Python on based on the candidate's skills. *(Time Limit: 3 minutes)*
   - **Aptitude**: Pose an aptitude question. *(Time Limit: 1 minute)*
   - **System Design**: Pose a question focusing on architecture, scalability, and best practices. *(Time Limit: 3 minutes)*
   - **Behavioral**: Pose a situational or STAR-based question. *(Time Limit: 1 minute)*

4. **Question Generation Logic:**
   - If this is the candidate's **first question**, generate a new question based solely on the candidate's details.
   - If a **previous answer** exists, analyze it and generate a relevant follow-up question.

5. **Clarity, Structure, and Relevance:**
   - Ensure the question is clear, concise, and structured.
   - Do not include any extraneous text or instructions beyond the question itself.

**Example Questions:**
- "Can you explain the difference between React state and props with an example?"
- "How would you design a REST API for a social media platform? What database structure would you use?"
- "What are the trade-offs between using LSTMs vs. Transformers for NLP tasks?"
- "Design a scalable URL shortener like Bitly. What technologies and database choices would you use?"

Generate the appropriate interview question based on these instructions.
  `;
};

const getBasePromptForQuestionFeedback = (
  candidateDetails: candidateDetailsType,
  questionAnswerSets: QuestionAnswerType[]
) => {
  return `
You are an expert interview feedback generator. You are provided with a candidate's detailed profile and a series of interview question sets along with the candidate's answers. Your task is to analyze the candidate's responses and generate actionable feedback.

For wrong questions provide an array in the following structure.

**Input Data Structure:**

- **Candidate Details:**  ${JSON.stringify(candidateDetails)}

- **Question Sets:**  ${JSON.stringify(questionAnswerSets)}

**Example Output Format:**
[
  {
    "question": "Question 1",
    "feedback": "Provide feedback for question 1"
    "score": "Provide score for question 1 in Number between 0-10 considering the candidate's performance, years of experience, job role and skills",
    "correctAnswer": "Provide the correct answer for question 1 in brief"
  },
  {
    "question": "Question 2",
    "feedback": "Provide feedback for question 2"
    "score": "Provide score for question 2 in Number between 0-10 considering the candidate's performance, years of experience, job role and skills",
    "correctAnswer": "Provide the correct answer for question 2 in brief"
  },
]
  `;
};

export async function generateNextQuestion(
  candidateDetails: candidateDetailsType
): Promise<string | null> {
  try {
    const basePrompt = getBasePromptForNextQuestion(candidateDetails);
    const result = await model.generateContent(basePrompt + prompt);
    const text = result.response.text();
    return text;
  } catch (error) {
    if (
      error instanceof Error &&
      (error.message.includes("429") || error.message.includes("403"))
    ) {
      console.error("API Quota Exceeded or API Key Expired:", error.message);
    } else {
      console.error("Error generating content:", error);
    }
    return null;
  }
}

export async function generateFeedback(
  candidateDetails: candidateDetailsType,
  questionAnswerSets: QuestionAnswerType[]
): Promise<string | null> {
  try {
    const basePrompt = getBasePromptForQuestionFeedback(
      candidateDetails,
      questionAnswerSets
    );
    const result = await model.generateContent(basePrompt + prompt);
    const text = result.response.text();
    return text;
  } catch (error) {
    if (
      error instanceof Error &&
      (error.message.includes("429") || error.message.includes("403"))
    ) {
      console.error("API Quota Exceeded or API Key Expired:", error.message);
    } else {
      console.error("Error generating content:", error);
    }
    return null;
  }
}
