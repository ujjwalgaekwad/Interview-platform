import { Response, Request } from "express";
import { runningInterviewSession } from "../src/app";
import { SessionModel } from "../models/session.model";

const createSession = async (req: Request, res: Response) => {
  const { socketId } = req.body;

  if (!socketId) {
    res.status(400).json({
      success: false,
      message: "socketId are required",
    });
    return;
  }

  try {
    const interviewSession = runningInterviewSession.get(socketId);

    if (!interviewSession) {
      res.status(404).json({
        success: false,
        message: "Interview session not found",
      });
      return;
    }

    const response = await SessionModel.create({
      candidateEmail: interviewSession.candidate.email,
      sessionId: interviewSession.sessionId,
      candidateName: interviewSession.candidate.name,
      jobRole: interviewSession.candidate.jobRole,
      skills: interviewSession.candidate.skills,
      yearsOfExperience: interviewSession.candidate.yearsOfExperience,
      questions: interviewSession.questions,
      startTime: interviewSession.startTime,
      endTime: interviewSession.endTime,
    });

    if (!response) {
      res.status(500).json({
        success: false,
        message: "Failed to create session in the database",
      });
    }

    res.status(200).json({
      success: true,
      response,
      message: "Session created successfully",
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        success: false,
        message: "Failed to create session in the database",
        error: error.message,
      });
    } else {
      console.error("Error in sendFeedback:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create session in the database",
        error: "Unknown error",
      });
    }
  }
};

const updateSession = async (req: Request, res: Response) => {
  //
};

const getSession = async (req: Request, res: Response) => {
  //
};

const deleteSession = async (req: Request, res: Response) => {
  //
};

const getAllSessions = async (req: Request, res: Response) => {
  const { email } = req.params;

  if (!email) {
    res.status(400).json({ error: "Email id is required" });
  }

  const response = await SessionModel.findOne({ candidateEmail: email });

  if (!response) {
    res.status(404).json({ error: "Interview data not found" });
    return;
  }

  res.status(200).json({
    success: true,
    response,
  });
};

// API to fetch interview data after completion
const getSessionData = async (req: Request, res: Response) => {
  const { socketId } = req.params;

  if (!socketId) {
    res.status(400).json({ error: "Socket id is required" });
  }

  const response = runningInterviewSession.get(socketId);

  if (!response) {
    res.status(404).json({ error: "Interview data not found" });
    return;
  }

  res.status(200).json({
    success: true,
    response,
  });
};

export {
  createSession,
  updateSession,
  deleteSession,
  getSession,
  getSessionData,
  getAllSessions,
};
