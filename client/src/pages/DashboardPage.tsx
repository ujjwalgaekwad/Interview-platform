import Container from "@/components/general/Container";
import DataVisualization from "@/components/general/DataVisualization";
import StreakTracker from "@/components/dashboard/StreakTracker";
import SessionInfoForm from "@/components/interview/SessionInfoForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InterviewSessionData, JobRoleType } from "@/types/InterviewData";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";
import axios, { AxiosError } from "axios";
import useProfileStore from "@/store/profileStore";
import { formatTimeInShortWords, getDateAndDay } from "@/utils/formatTime";
import { Plus } from "lucide-react";

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

  if (isPending) {
    return <div className="h-full w-screen overflow-x-hidden py-12">
      <div className="w-1/2 mx-auto my-2 py-2 rounded-xl bg-gradient-to-r to-blue-700 from-purple-800 dark:to-blue-700 dark:from-purple-800 flex justify-center items-center">
        <p className="text-zinc-300 dark:text-zinc-300 font-semibold">Loading...</p>
      </div>
    </div>
  }

  return (
    <div className="h-full w-screen overflow-x-hidden select-none py-12 space-y-6">
      <div className="w-1/2 mx-auto my-2 py-2 rounded-xl bg-gradient-to-r to-blue-700 from-purple-800 flex justify-center items-center">
        <p className="text-zinc-300 font-semibold">{getGreeting()} {user?.firstName}, Welcome Back to your Dashboard</p>
      </div>
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {roles.map((role, index) => (
            <SessionInfoForm
              key={index}
              skills={role.skills}
              jobRole={role.jobRole}
            >
              <Card
                className="dark:bg-zinc-800 dark:text-neutral-300 p-6 cursor-pointer transition duration-300 shadow-md hover:scale-[103%] hover:shadow-lg bg-white hover:bg-neutral-100 dark:hover:bg-zinc-700/70"
              >
                <CardHeader className="py-1 px-0">
                  <CardTitle className="text-2xl font-medium">{role.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{role.description}</p>
                </CardContent>
              </Card>
            </SessionInfoForm>
          ))}
          <SessionInfoForm>
            <Card
              className="dark:bg-zinc-800 dark:text-neutral-300 py-10 flex items-center justify-center cursor-pointer transition duration-300 hover:scale-[103%] shadow-md hover:shadow-lg hover:bg-neutral-100 dark:hover:bg-zinc-700/70"
            >
              <CardContent className="flex p-0 items-center justify-center h-full">
                <Plus size={32} className="text-neutral-300" />
              </CardContent>
            </Card>
          </SessionInfoForm>
        </div>

        <h1 className="text-3xl font-bold mb-4 mt-16 rounded-xl py-1 h-15 w-fit text-left transition duration-300">
          Interview Sessions
        </h1>
        <div className="overflow-x-auto rounded-lg border">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
            <thead className="bg-zinc-100 dark:bg-zinc-900">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Job Role
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Skills
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Candidate
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Experience
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Questions
                </th>
              </tr>
            </thead>
            <tbody className="bg-zinc-200/70 dark:bg-zinc-800/70 divide-y divide-gray-200 dark:divide-gray-800">
              {interviewSessions && interviewSessions.sort((a, b) => new Date(b.endTime).getTime() - new Date(a.endTime).getTime()).map((item) => (
                <tr onClick={() => navigate(`/interview/sessions/${item._id}`)} key={item._id} className="hover:bg-gray-100/80 dark:hover:bg-zinc-900">
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {item.jobRole}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                    {item.skills.join(', ')}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                    {item.candidate}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                    {formatTimeInShortWords(item.endTime - item.startTime)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                    {getDateAndDay(item.endTime)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                    {item.yearsOfExperience} years
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                    {item.questions.length} questions
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h1 className="text-3xl font-bold mb-4 mt-16 rounded-xl py-1 h-15 w-fit text-left transition duration-300">
          Daily stats
        </h1>
        <div className="flex justify-between">
          {interviewSessions && <DataVisualization analysis={interviewSessions} />}
          {(interviewSessions && interviewSessions.length) ? <StreakTracker interviewSessions={interviewSessions} /> : <div className="space-y-2 pt-4">
            <div className="w-7/12 max-w-sm mx-auto p-4 text-center bg-zinc-200/80 dark:bg-zinc-800 ml-2"></div>
          </div>
          }
        </div>
      </Container>
    </div>
  );
}

export default DashboardPage;
