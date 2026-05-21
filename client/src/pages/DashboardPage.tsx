import Container from "@/components/general/Container";
import DataVisualization from "@/components/general/DataVisualization";
import StreakTracker from "@/components/dashboard/StreakTracker";
import SessionInfoForm from "@/components/interview/SessionInfoForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InterviewSessionData, JobRoleType } from "@/types/InterviewData";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";
import axios, { AxiosError } from "axios";
import useProfileStore from "@/store/profileStore";
import { formatTimeInShortWords, getDateAndDay } from "@/utils/formatTime";
import { Loader2, Plus } from "lucide-react";

const roles = [
  {
    title: "Frontend Developer",
    jobRole: "front-end" as JobRoleType,
    skills: ["React", "JavaScript", "HTML", "CSS", "API Handling"],
    description:
      "A Frontend Developer should be proficient in HTML, CSS, JavaScript, and modern frameworks like React.",
  },
  {
    title: "Backend Developer",
    jobRole: "back-end" as JobRoleType,
    skills: ["Node.js", "Express", "MongoDB", "SQL", "Schema Designing", "RESTful APIs"],
    description:
      "A Backend Developer must have expertise in Node.js, Express.js, MongoDB, SQL, and RESTful API development.",
  },
  {
    title: "Full Stack Developer",
    jobRole: "full-stack" as JobRoleType,
    skills: ["React", "Node.js", "Express", "MongoDB", "SQL", "API Handling", "Spring Boot", "Hibernate"],
    description:
      "A Full Stack Developer should be proficient in both frontend and backend technologies, including React, Node.js, Express, databases, and frameworks like Spring Boot and Hibernate.",
  },
];

function DashboardPage() {

  const [interviewSessions, setInterviewSessions] = useState<null | InterviewSessionData[]>(null)
  const [isPending, setIsPending] = useState(true)
  const { profile, setProfile } = useProfileStore()

  const navigate = useNavigate()

  const user = useUser().user

  useEffect(() => {
    async function fetchData() {
      try {
        if (!isPending) setIsPending(true)

        if (!user || !user.primaryEmailAddress?.emailAddress) {
          throw new Error("No user found")
        }

        const email = user.primaryEmailAddress.emailAddress;
        const [sessionRes, userRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_SERVER_URI}/api/v1/sessions/all/${email}`, {
            headers: { "Content-Type": "application/json" },
          }),
          axios.get(`${import.meta.env.VITE_SERVER_URI}/api/v1/users/${email}`, {
            headers: { "Content-Type": "application/json" },
          }),
        ]);

        if (!sessionRes.status || sessionRes.status !== 200) {
          throw new Error("Something went wrong")
        }
        setInterviewSessions(sessionRes.data.response)

        if (!userRes.status || userRes.status !== 201) {
          throw new Error("Something went wrong")
        }
        setProfile({ theme: profile.theme, ...userRes.data.data })

      } catch (error) {
        if (error instanceof AxiosError && error.status === 400) {
          navigate("/dashboard/user/form")
          toast({
            title: "Please fill out the form first",
          })
          return
        }
        toast({
          title: "Something went wrong",
          variant: "destructive"
        })
        console.log(error)
      } finally {
        setIsPending(false)
      }
    }

    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) return "Good Morning";
    if (hour >= 12 && hour < 17) return "Good Afternoon";
    if (hour >= 17 && hour < 21) return "Good Evening";
    return "Good Night";
  };

  const totalSessions = interviewSessions?.length ?? 0;
  const totalQuestions = interviewSessions?.reduce((count, session) => count + session.questions.length, 0) ?? 0;

  if (isPending) {
    return (
      <Container className="page-section py-10">
        <Card className="mx-auto max-w-2xl">
          <CardContent className="flex items-center justify-center gap-3 p-10 text-muted-foreground">
            <LoaderText />
            <p className="font-medium">Loading dashboard...</p>
          </CardContent>
        </Card>
      </Container>
    )
  }

  return (
    <div className="page-section overflow-x-hidden select-none py-10">
      <Container className="space-y-10">
        <Card className="overflow-hidden">
          <div className="bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.12),transparent_25%),linear-gradient(180deg,rgba(255,255,255,0.95),rgba(248,250,252,0.9))] dark:bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.22),transparent_25%),linear-gradient(180deg,rgba(15,23,42,0.96),rgba(15,23,42,0.86))]">
            <CardContent className="flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="space-y-3">
                <span className="section-kicker">Dashboard</span>
                <h1 className="section-heading font-display font-bold text-foreground">{getGreeting()} {user?.firstName}, welcome back.</h1>
                <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
                  Continue a session, launch a new role-based interview, or review your latest signal from the same clean workspace.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[26rem]">
                {[
                  { label: "Sessions", value: totalSessions },
                  { label: "Questions", value: totalQuestions },
                  { label: "Roles", value: roles.length },
                ].map((metric) => (
                  <div key={metric.label} className="rounded-2xl border border-border/70 bg-background/75 p-4 text-left">
                    <p className="text-2xl font-display font-semibold text-foreground">{metric.value}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">{metric.label}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </div>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {roles.map((role, index) => (
            <SessionInfoForm key={index} skills={role.skills} jobRole={role.jobRole}>
              <Card className="h-full cursor-pointer overflow-hidden">
                <CardHeader className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-border/70 bg-background/75 text-primary">
                      <Plus size={20} />
                    </div>
                    <span className="rounded-full border border-border/70 bg-muted/60 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      Role
                    </span>
                  </div>
                  <CardTitle>{role.title}</CardTitle>
                  <CardDescription className="text-sm leading-7 text-muted-foreground">{role.description}</CardDescription>
                </CardHeader>
              </Card>
            </SessionInfoForm>
          ))}

          <SessionInfoForm>
            <Card className="flex min-h-full cursor-pointer items-center justify-center border-dashed">
              <CardContent className="flex flex-col items-center justify-center gap-3 p-8 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-dashed border-border/80 bg-muted/40 text-muted-foreground">
                  <Plus size={28} />
                </div>
                <div>
                  <p className="font-display text-lg font-semibold text-foreground">Create custom session</p>
                  <p className="mt-1 text-sm text-muted-foreground">Add a role, choose skills, and start a practice run.</p>
                </div>
              </CardContent>
            </Card>
          </SessionInfoForm>
        </div>

        <Card className="surface-panel overflow-hidden">
          <CardHeader className="border-b border-border/60 bg-muted/30">
            <CardTitle className="text-2xl">Interview Sessions</CardTitle>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border/60">
              <thead className="bg-muted/50">
                <tr>
                  {tableHeaders.map((header) => (
                    <th key={header} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 bg-background/50">
                {interviewSessions && interviewSessions
                  .sort((a, b) => new Date(b.endTime).getTime() - new Date(a.endTime).getTime())
                  .map((item) => (
                    <tr
                      onClick={() => navigate(`/interview/sessions/${item._id}`)}
                      key={item._id}
                      className="cursor-pointer transition-colors hover:bg-accent/50"
                    >
                      <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-foreground">{item.jobRole}</td>
                      <td className="whitespace-nowrap px-4 py-4 text-sm text-muted-foreground">{item.skills.join(", ")}</td>
                      <td className="whitespace-nowrap px-4 py-4 text-sm text-muted-foreground">{item.candidate}</td>
                      <td className="whitespace-nowrap px-4 py-4 text-sm text-muted-foreground">{formatTimeInShortWords(item.endTime - item.startTime)}</td>
                      <td className="whitespace-nowrap px-4 py-4 text-sm text-muted-foreground">{getDateAndDay(item.endTime)}</td>
                      <td className="whitespace-nowrap px-4 py-4 text-sm text-muted-foreground">{item.yearsOfExperience} years</td>
                      <td className="whitespace-nowrap px-4 py-4 text-sm text-muted-foreground">{item.questions.length} questions</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="grid gap-6 xl:grid-cols-[1.35fr_0.85fr]">
          {interviewSessions && <DataVisualization analysis={interviewSessions} />}
          {interviewSessions && interviewSessions.length ? (
            <StreakTracker interviewSessions={interviewSessions} />
          ) : (
            <Card className="flex items-center justify-center p-8">
              <CardContent className="p-0 text-center text-muted-foreground">
                Start a few sessions to unlock your streak and chart insights.
              </CardContent>
            </Card>
          )}
        </div>
      </Container>
    </div>
  );
}

const tableHeaders = ["Job Role", "Skills", "Candidate", "Duration", "Date", "Experience", "Questions"];

function LoaderText() {
  return <Loader2 className="h-5 w-5 animate-spin text-primary" />;
}

export default DashboardPage;
