import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  candidateEmail: {
    type: String,
    required: true,
    unique: true,
  },
  sessionId: {
    type: String,
    required: true,
    unique: true,
  },
  candidateName: {
    type: String || null,
    default: null,
  },
  jobRole: {
    type: String,
    required: true,
  },
  skills: {
    type: [String],
    required: true,
  },
  yearsOfExperience: {
    type: Number,
    required: true,
  },
  questions: {
    type: [
      {
        question: String,
        answer: String,
        timeLimit: Number,
        round: String,
        startTime: Number,
        endTime: Number,
        faceExpressions: [
          {
            expressionState: String,
            timeStamp: Number,
          },
        ],
        gazeTracking: [
          {
            timeStamp: Number,
            x: Number,
            y: Number,
          },
        ],
      },
    ],
    required: true,
  },
  startTime: {
    type: Number,
    required: true,
  },
  endTime: {
    type: Number,
    required: true,
  },
});

export const SessionModel = mongoose.model("Sample", sessionSchema);