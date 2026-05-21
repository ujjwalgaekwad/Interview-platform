import CodeEditor from "@/components/general/CodeEditor";
import Timer from "@/components/interview/Timer";
import Webcam from "@/components/interview/Webcam";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { useAutoSpeechRecognizer } from "@/hooks/useAutoSpeechRecognizer";
import useSocket from "@/socket/useSocket";
import useInterviewStore from "@/store/interviewStore";
import {
  type InterviewEvaluation,
  candidateDetailsType,
  generateFeedback,
  generateNextQuestion,
} from "@/utils/handleQuestionAnswer";
import selectRoundAndTimeLimit from "@/utils/selectRoundAndTimeLimit";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Avatar3D from "@/components/general/Avatar3D"
import Avatar3DVariant from "@/components/general/Avatar3DVariant"
import axios from "axios";
import useProfileStore from "@/store/profileStore";
import { Card, CardContent } from "@/components/ui/card";

function InterviewPage() {

  const socket = useSocket()
  const { profile } = useProfileStore()
  const { candidate, questionAnswerSets, addQuestionAnswerSet, updateAnswer, addCodeAttempt } = useInterviewStore()

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [resettingQuestion, setResettingQuestion] = useState(true);

  const navigate = useNavigate()
  const { transcript } = useAutoSpeechRecognizer(currentQuestionIndex);

  // helper function for generating next question using gemini API
  const getQuestion = async (transcribedText: string, currentQuestionIndex: number) => {
    if (!candidate) return;

    const roundAndTimeLimit = selectRoundAndTimeLimit(currentQuestionIndex);

    const data = {
      yearsOfExperience: candidate.yearsOfExperience,
      candidateName: candidate.name,
      jobRole: candidate.jobRole,
      skills: candidate.skills,
      round: roundAndTimeLimit.round,
      timeLimit: roundAndTimeLimit.timeLimit,
      previousAnswer: transcribedText,
      college: profile.college,
      achievements: profile.achievements,
      currentJobRole: profile?.currentJobRole || null,
      higherEducation: profile.higherEducation
    };

    // Timeout after 10 seconds if API is slow
    const timeoutPromise = new Promise<string | null>((resolve) =>
      setTimeout(() => resolve(null), 10000)
    );

    const aiPromise = generateNextQuestion(data);

    const text = await Promise.race([aiPromise, timeoutPromise]); // Whichever finishes first

    if (!text) {
      console.warn("⏳ AI API Timed Out!");
      toast({ title: "AI took too long. Try again." });
      return null;
    }

    return text;
  }

  const handleInterviewEnd = async () => {

    if (!candidate || !questionAnswerSets) return

    const userData: candidateDetailsType = {
      candidateName: candidate.name,
      jobRole: candidate.jobRole,
      skills: candidate.skills,
      yearsOfExperience: candidate.yearsOfExperience,
    }

    try {
      setResettingQuestion(true)
      const feedback: InterviewEvaluation[] | null = await generateFeedback(userData, questionAnswerSets)

      if (!feedback) {
        toast({ title: "Something went wrong while evaluating the question", variant: "destructive" })
        navigate("/dashboard")
        return
      }

      socket.emit("interview-evaluation", feedback)
      socket.emit("interview-complete", {})
    } catch (error) {
      toast({ title: "Something went wrong while evaluating the question", variant: "destructive" })
      navigate("/dashboard")
      console.log(error)
    } finally {
      setResettingQuestion(false)
    }
  }

  // main function to reset the question
  const handleResetQuestion = async () => {
    if (!questionAnswerSets) return;

    // Block multiple resets
    if (resettingQuestion) return;
    if (Date.now() - questionAnswerSets[currentQuestionIndex].startTime < 10000) {
      toast({ title: "Please wait for the previous question to finish" })
      return
    }
    setResettingQuestion(true);

    try {

      if (selectRoundAndTimeLimit(currentQuestionIndex).round === "technical") {
        socket.emit("update-question-data", {
          questionAnswerIndex: currentQuestionIndex,
          answer: transcript,
          code: questionAnswerSets[currentQuestionIndex].code,
        });
      } else {
        socket.emit("update-question-data", {
          questionAnswerIndex: currentQuestionIndex,
          answer: transcript,
        });
      }

      updateAnswer(transcript, currentQuestionIndex);

      if (selectRoundAndTimeLimit(currentQuestionIndex + 1).round === "end") {
        toast({ title: "You have reached the end of the interview" });
        handleInterviewEnd()
        return;
      }

      const newGeneratedQuestion = await getQuestion(transcript, currentQuestionIndex + 1);

      if (!newGeneratedQuestion) {
        toast({ title: "Something went wrong while generating question", variant: "destructive" });
        navigate("/dashboard")
        return;
      }

      addQuestionAnswerSet({
        question: newGeneratedQuestion,
        answer: "",
        startTime: Date.now(),
        round: selectRoundAndTimeLimit(currentQuestionIndex + 1).round,
        timeLimit: selectRoundAndTimeLimit(currentQuestionIndex + 1).timeLimit,
      });

      setCurrentQuestionIndex((prev) => prev + 1);

      socket.emit("initialize-new-question", {
        question: newGeneratedQuestion,
        answer: "",
        startTime: Date.now(),
        timeLimit: selectRoundAndTimeLimit(currentQuestionIndex + 1).timeLimit,
        round: selectRoundAndTimeLimit(currentQuestionIndex + 1).round,
      });

      setResettingQuestion(false);
    } catch (error) {
      toast({
        title: "Something went wrong while getting a new question",
        variant: "destructive"
      })
      console.log(error)
      setResettingQuestion(false);
      navigate("/dashboard")
    }
  };

  // useEffect for initial setup
  useEffect(() => {
    const initialSetup = async () => {
      if (!questionAnswerSets && candidate) {
        const text = await getQuestion("", currentQuestionIndex)
        if (!text) {
          navigate("/dashboard")
          return
        }
        addQuestionAnswerSet({ question: text, answer: "", startTime: Date.now(), round: "technical", timeLimit: 180 });
        socket.emit("initial-setup", candidate)
        socket.emit("initialize-new-question", { question: text, round: "technical", timeLimit: 180 })
        setResettingQuestion(false)
      }
    }
    initialSetup()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addQuestionAnswerSet, candidate, socket])

  // socket event handlers
  useEffect(() => {

    if (!candidate) {
      navigate("/dashboard")
      return;
    }

    const handleConnect = () => {
      toast({title: "Interview started"})
    };

    const handleInterviewAnalyticsData = async () => {
      try {

        const res = await axios.post(`${import.meta.env.VITE_SERVER_URI}/api/v1/sessions`, {
          socketId: socket.id,
          userId: candidate.id
        })

        if (res.status !== 200) {
          toast({ title: "Something went wrong while analyzing the question", variant: "destructive" })
          return
        }

        navigate(`/interview/${socket.id}/feedback`)
      } catch (error) {
        console.log(error)
        toast({ title: "Something went wrong while analyzing the question", variant: "destructive" })
      } finally {
        setResettingQuestion(false)
      }
    }

    const handleDisconnect = () => {
      toast({ title: "You have been disconnected" });
    };

    const handleConnectError = (error: unknown) => {
      if (error instanceof Error) {
        console.error("Connection Error:", error.message);
      } else {
        console.error("Connection Error:", error);
      }
    };

    const handleOperationError = ({ code, message }: { code: string, message: string }) => {
      toast({
        title: `${code}: ${message}`,
        variant: "destructive"
      })
    }

    socket.on("connect", handleConnect);
    socket.on("operation-error", handleOperationError);
    socket.on("interview-analytics", handleInterviewAnalyticsData);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("operation-error", handleOperationError);
      socket.off("interview-analytics", handleInterviewAnalyticsData);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [candidate, navigate]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      return "Are you sure you want to leave? Your progress will be lost.";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <div className="page-section">
      <div className="flex items-center justify-between border-b border-border/70 bg-background/90 px-4 py-3 backdrop-blur-sm sm:px-6 lg:px-8">
        <h3 className="font-display text-lg font-semibold text-foreground sm:text-xl">Interview Analysis</h3>
        <div className="flex items-center space-x-2 select-none">
          <Timer loadingNextQuestion={resettingQuestion} currentQuestionIndex={currentQuestionIndex} onReset={handleResetQuestion} />
          <Button disabled={resettingQuestion} variant="secondary" onClick={handleResetQuestion}>
            {selectRoundAndTimeLimit(currentQuestionIndex + 1).round === "end" ? "End Interview" : "Next question"}
          </Button>
          <Dialog>
            <DialogTrigger>
              <span className="inline-flex items-center rounded-full border border-border/70 bg-destructive px-4 py-2 text-sm font-semibold text-destructive-foreground">
                Leave
              </span>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you sure to leave?</DialogTitle>
                <DialogDescription>
                  You are about to leave the interview. And your all data will be lost.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="sm:justify-start">
                <Button type="button" variant="destructive" onClick={() => navigate("/dashboard")}>
                  Leave
                </Button>
                <DialogClose className="flex h-full items-center justify-center rounded-md border border-border/70 bg-background px-3" asChild>
                  <span className="text-sm text-foreground">Close</span>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {selectRoundAndTimeLimit(currentQuestionIndex).round === "technical" ? (
        <div className="grid grid-cols-9 gap-4 p-4 lg:p-6">
          <div className="col-span-9 h-auto lg:col-span-7 lg:h-[80vh]">
            <Card className="mb-4 overflow-hidden border-border/70">
              <CardContent className="min-h-16 overflow-auto bg-muted/35 px-4 py-3 sm:px-6">
                {resettingQuestion ? (
                  <div className="flex flex-col space-y-1">
                    <div className="h-4 w-full animate-pulse rounded-full bg-muted" />
                    <div className="h-4 w-9/12 animate-pulse rounded-full bg-muted" />
                  </div>
                ) : (
                  <p>{questionAnswerSets && questionAnswerSets[currentQuestionIndex]?.question || "No question found"}</p>
                )}
              </CardContent>
            </Card>
            <CodeEditor
              addCompileAttempt={({ code, language }: { code: string; language: string }) => {
                addCodeAttempt(code, language, currentQuestionIndex)
              }}
            />
          </div>
          <div className="col-span-9 space-y-4 p-0 lg:col-span-2 lg:space-y-2 lg:p-2">
            <Avatar3D text={questionAnswerSets && questionAnswerSets[currentQuestionIndex].question || "No question found"} />
            <Webcam height={300} width={400} videoHeight={350} videoWidth={450} questionAnswerIndex={currentQuestionIndex} />
            {transcript && (
              <div className="mt-2 rounded-2xl border border-border/70 bg-card/80 p-3 text-sm italic text-muted-foreground">
                {[...transcript
                  .split(/\r?\n/)
                  .filter((line) => line.trim() !== "")
                  .reverse()]
                  .slice(0, 2)
                  .reverse()
                  .map((line, index) => (
                    <p key={index}>{line}</p>
                  ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="min-h-[80vh] space-y-4 p-4 lg:p-6">
          <Card className="mb-4 overflow-hidden border-border/70">
            <CardContent className="min-h-16 overflow-auto bg-muted/35 px-4 py-3 sm:px-6">
              {resettingQuestion ? (
                <div className="flex flex-col space-y-1">
                  <div className="h-4 w-full animate-pulse rounded-full bg-muted" />
                  <div className="h-4 w-9/12 animate-pulse rounded-full bg-muted" />
                </div>
              ) : (
                <p>{questionAnswerSets && questionAnswerSets[currentQuestionIndex]?.question || "No question found"}</p>
              )}
            </CardContent>
          </Card>

          <div className="flex flex-col items-center justify-center gap-4 lg:flex-row">
            <Avatar3DVariant
              text={questionAnswerSets && questionAnswerSets[currentQuestionIndex].question || "No question found"}
            />
            <Webcam height={480} width={480} videoHeight={580} videoWidth={580} questionAnswerIndex={currentQuestionIndex} />
          </div>

          {transcript && (
            <div className="mt-4 flex justify-center rounded-2xl border border-border/70 bg-card/80 p-3 text-sm italic text-muted-foreground">
              {[...transcript
                .split(/\r?\n/)
                .filter((line) => line.trim() !== "")
                .reverse()]
                .slice(0, 2)
                .reverse()
                .map((line, index) => (
                  <p className="w-full max-w-2xl" key={index}>
                    {line}
                  </p>
                ))}
            </div>
          )}
        </div>
      )}

      {resettingQuestion && (
        <div className="fixed top-16 left-0 h-[0.3rem] w-full overflow-hidden loading-bar-container">
          <div className="loading-bar h-[0.3rem] w-full bg-gradient-to-r from-primary to-cyan-500" />
        </div>
      )}
    </div>
  );
}

export default InterviewPage;