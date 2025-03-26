import http from "http";
import express from "express";
import cors from "cors";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.ACCESS_CONTROL_ORIGIN, // Replace with your frontend URL
    methods: ["GET", "POST"],
  },
});

const corsOptions = {
  origin: process.env.ACCESS_CONTROL_ORIGIN,
  credentials: true,
  optionsSuccessStatus: 200,
};

// CORS middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.options("*", cors());

// Define data structures
type FaceExpression = {
  expressionState: string;
  timeStamp: number;
};

type GazeTracking = {
  timeStamp: number;
  x: number;
  y: number;
};

type RoundType = "aptitude" | "technical" | "behavioral" | "system-design";

type QuestionSchema = {
  question: string;
  answer: string;
  timeLimit: number;
  round: RoundType;
  startTime: number;
  endTime: number | null;
  faceExpressions: FaceExpression[];
  gazeTracking: GazeTracking[];
  questionAnswerIndex: number;
};

type InterviewSession = {
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

const runningInterviewSession: Map<string, InterviewSession> = new Map();

// Centralized error handler
const handleSocketError = (socket: any, error: any) => {
  console.error(`Socket ${socket.id} error:`, error);
  socket.emit("operation-error", {
    code: error.code || "GENERIC_ERROR",
    message: error.message,
  });
};

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Notify user that they are connected
  socket.emit("user-connected", { socketId: socket.id });

  // Initialize new session
  socket.on("initial-setup", (data) => {
    try {
      const session: InterviewSession = {
        sessionId: socket.id,
        candidate: data || {
          id: "",
          name: "",
          jobRole: "",
          skills: [],
          yearsOfExperience: 0,
        },
        questions: [],
        startTime: Date.now(),
        endTime: null,
        currentQuestionIndex: 0,
        status: "pending",
      };

      console.log(`New Session:`, session);
      runningInterviewSession.set(socket.id, session);
    } catch (error) {
      handleSocketError(socket, error);
    }
  });

  const processAnalyticsData = () => {
    try {
      
    } catch (error) {
      throw error
    }
  }

  // Add new question
  socket.on("initialize-new-question", (data) => {
    try {
      if (runningInterviewSession.has(socket.id)) {
        const session = runningInterviewSession.get(socket.id);
        if (!session) {
          throw new Error("Session not found");
        }

        // End previous question
        if (session.questions.length > 0) {
          session.questions[session.questions.length - 1].endTime = Date.now();
        }

        const newQuestion: QuestionSchema = {
          question: data.question || "",
          answer: data.answer || "",
          timeLimit: data.timeLimit || 60,
          round: data.round || "aptitude",
          startTime: Date.now(),
          endTime: null,
          faceExpressions: [],
          gazeTracking: [],
          questionAnswerIndex: session.questions.length,
        };

        session.questions.push(newQuestion);
        runningInterviewSession.set(socket.id, session);
        console.log(`Updated Session:`, session);
      }
    } catch (error) {
      handleSocketError(socket, error);
    }
  });

  // Update question data
  socket.on("update-question-data", (data) => {
    try {
      if (runningInterviewSession.has(socket.id)) {
        const session = runningInterviewSession.get(socket.id);
        if (!session) {
          throw new Error("Session not found");
        }
        const question = session.questions[data.questionAnswerIndex];

        if (question) {
          Object.assign(question, data);
        } else {
          console.warn(`Invalid question index: ${data.questionAnswerIndex}`);
        }

        console.log(`Updated Question Data:`, session.questions);
      }
    } catch (error) {
      handleSocketError(socket, error);
    }
  });

  // Store face expression data
  socket.on(
    "face-expression-data",
    ({ expressionData, timeStamp, questionAnswerIndex }) => {
      try {
        if (runningInterviewSession.has(socket.id)) {
          const session = runningInterviewSession.get(socket.id);
          if (!session) {
            throw new Error("Session not found");
          }
          const question = session.questions[questionAnswerIndex];

          if (question) {
            question.faceExpressions.push({
              timeStamp,
              ...expressionData,
            });
          } else {
            console.warn(`Invalid question index: ${questionAnswerIndex}`);
          }
        }
      } catch (error) {
        handleSocketError(socket, error);
      }
    }
  );

  // Handle interview completion
  socket.on("interview-complete", () => {
    try {
      if (runningInterviewSession.has(socket.id)) {
        const session = runningInterviewSession.get(socket.id);
        if (!session) {
          throw new Error("Session not found");
        }
        session.endTime = Date.now();
        session.status = "completed";

        socket.emit("interview-analytics", processAnalyticsData);
      }
    } catch (error) {
      handleSocketError(socket, error);
    }
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    try {
      console.log(`User disconnected: ${socket.id}`);
      runningInterviewSession.delete(socket.id);
    } catch (error) {
      handleSocketError(socket, error);
    }
  });
});

// Import routes
import sessionRouter from "../routes/session.routes";
import userRouter from "../routes/user.routes";
app.use("/api/v1/sessions", sessionRouter);
app.use("/api/v1/user", userRouter);

// Export server and app
export { app, server, runningInterviewSession };
