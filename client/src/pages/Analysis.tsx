import { FaceExpression, InterviewSessionData } from "@/types/InterviewData";
import { FaUser, FaPhone, FaLinkedin, FaGraduationCap, FaBriefcase, FaGithub } from "react-icons/fa";
import { Bar, BarChart, CartesianGrid, LabelList, Line, LineChart, XAxis, YAxis } from "recharts"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"
import TimelineChart from "@/components/charts/TimelineChart";
import CopyButton from "@/components/general/CopyButton";
import { formatTimeInShortWords } from "@/utils/formatTime";
import useProfileStore from "@/store/profileStore";

// Update the AnalysisComponent props to use the UserData interface
interface AnalysisComponentProps {
  analyticsData: InterviewSessionData | null
}

const chartConfig = {
  level: {
    label: "Level",
    color: "hsl(var(--chart-1))",
  },
  name: {
    color: "hsl(var(--background))",
  },
} satisfies ChartConfig

const chartConfigForRadar = {
  percentage: {
    label: "percentage",
    color: "hsl(var(--chart-1))",
  },
  expressionState: {
    color: "hsl(var(--background))",
  },
} satisfies ChartConfig

const AnalysisComponent = ({ analyticsData }: AnalysisComponentProps) => {

  const { profile } = useProfileStore()

  const skillLevel = analyticsData?.questions.map(({ score, round }) => (
    {
      name: round,
      level: score
    }
  ))

  const faceExpressionPercentages = (() => {
    if (!analyticsData?.questions) return [];

    const expressionCount: Record<string, number> = {};
    let totalExpressions = 0;

    analyticsData.questions.forEach(({ faceExpressions }) => {
      faceExpressions.forEach(({ expressionState }) => {
        expressionCount[expressionState] = (expressionCount[expressionState] || 0) + 1;
        totalExpressions++;
      });
    });

    return Object.entries(expressionCount).map(([expressionState, count]) => ({
      expressionState,
      percentage: ((count / totalExpressions) * 100).toFixed(2), // Rounded to 2 decimal places
    }));
  })();

  const timeSpentPerRound = analyticsData?.questions.reduce((acc, { startTime, endTime, round }) => {
    const duration = endTime ? endTime - startTime : Date.now() - startTime;

    // If the round already exists, add to the duration; otherwise, initialize it
    acc[round] = (acc[round] || 0) + duration;

    return acc;
  }, {} as Record<string, number>);

  // Convert to an array format for the line chart
  const chartData = Object.entries(timeSpentPerRound || {}).map(([round, duration]) => ({
    round: `Round ${round}`,
    timeSpent: duration / 1000, // Convert from ms to seconds
  }));

  const getMostCommonExpression = (faceExpressions: FaceExpression[]) => {
    const expressionFrequency = faceExpressions.reduce((freq: { [key: string]: number }, { expressionState }) => {
      freq[expressionState] = (freq[expressionState] || 0) + 1;
      return freq;
    }, {});

    const mostCommonExpression = Object.entries(expressionFrequency).reduce<{ expression: string | null; count: number }>(
      (max, [expression, count]) => (count > max.count ? { expression, count } : max),
      { expression: null, count: 0 }
    ).expression;

    return mostCommonExpression ? mostCommonExpression : 'No data available';
  }

  const expressions = analyticsData?.questions.reduce((agg, { faceExpressions }) => {
    faceExpressions.forEach(({ expressionState, timeStamp }) => {
      if (!agg[expressionState]) {
        // Initialize with current timeStamp as both start and end
        agg[expressionState] = [timeStamp, timeStamp];
      } else {
        // Update to keep the earliest and latest timeStamps
        agg[expressionState][0] = Math.min(agg[expressionState][0], timeStamp);
        agg[expressionState][1] = Math.max(agg[expressionState][1], timeStamp);
      }
    });
    return agg;
  }, {} as Record<string, [number, number]>)

  return (
    <div className="p-6 mt-10">
      <h2 className="text-3xl font-bold text-center mb-6 text-blue-600">Interview Analysis</h2>


      {/* User Info Section */}
      <div className="grid grid-cols-1 max-w-4xl mx-auto sm:grid-cols-2 text-zinc-900 dark:text-zinc-100 gap-6">
        <div className="p-4 border rounded-xl shadow-md bg-gray-50 dark:bg-gray-800 flex items-center gap-2">
          <FaUser className="text-blue-500" />
          <span className="font-semibold">Full Name:</span>
          <p className="text-gray-700 dark:text-gray-300">{profile.name}</p>
        </div>

        <div className="p-4 border rounded-xl shadow-md bg-gray-50 dark:bg-gray-800 flex items-center gap-2">
          <FaPhone className="text-blue-500" />
          <span className="font-semibold">Phone:</span>
          <p className="text-gray-700 dark:text-gray-300">{profile.phone}</p>
        </div>

        <div className="p-4 border rounded-xl shadow-md bg-gray-50 dark:bg-gray-800 flex items-center gap-2">
          <FaLinkedin className="text-blue-500" />
          <span className="font-semibold">LinkedIn:</span>
          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
            {profile.linkedin.includes("?") ? profile.linkedin.split("?")[0] : profile.linkedin}
          </a>
        </div>

        <div className="p-4 border rounded-xl shadow-md bg-gray-50 dark:bg-gray-800 flex items-center gap-2">
          <FaGraduationCap className="text-blue-500" />
          <span className="font-semibold">Education:</span>
          <p className="text-gray-700 dark:text-gray-300">{profile.higherEducation}</p>
        </div>

        <div className="p-4 border rounded-xl shadow-md bg-gray-50 dark:bg-gray-800 flex items-center gap-2">
          <FaBriefcase className="text-blue-500" />
          <span className="font-semibold">Job Role:</span>
          <p className="text-gray-700 dark:text-gray-300">{profile.currentJobRole || "Unemployed"}</p>
        </div>

        <div className="p-4 border rounded-xl shadow-md bg-gray-50 dark:bg-gray-800 flex items-center gap-2">
          <FaGithub className="text-blue-500" />
          <span className="font-semibold">Github:</span>
          <a href={profile.github} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
            {profile.github}
          </a>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-2 pt-12 max-w-[90rem] mx-auto">
        {/* Skills Bar Chart */}
        <Card className="bg-transparent">
          <CardHeader>
            <CardTitle>Skill Proficiency</CardTitle>
            <CardDescription>Current Skill Assessment</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <BarChart
                data={skillLevel}
                layout="vertical"
                margin={{
                  right: 16,
                }}
              >
                <CartesianGrid horizontal={true} />
                <YAxis
                  dataKey="name"
                  type="category"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <XAxis dataKey="level" type="number" hide />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" />}
                />
                <Bar
                  dataKey="level"
                  fill="var(--color-level)"
                  radius={4}
                >
                  <LabelList
                    dataKey="level"
                    position="right"
                    offset={8}
                    className="fill-foreground"
                    fontSize={12}
                  />
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Expressions Radar Chart */}
        <Card className="bg-transparent">
          <CardHeader>
            <CardTitle>Expression Analysis</CardTitle>
            <CardDescription>Face expressions during the interview</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={chartConfigForRadar}
              className="mx-auto aspect-square max-h-[250px]"
            >
              <RadarChart data={faceExpressionPercentages}>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <PolarGrid gridType="circle" />
                <PolarAngleAxis dataKey="expressionState" />
                <Radar
                  dataKey="percentage"
                  fill="var(--color-level)"
                  fillOpacity={0.6}
                  dot={{
                    r: 4,
                    fillOpacity: 1,
                  }}
                />
              </RadarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="bg-transparent">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold dark:text-gray-200 text-gray-800">
              Interview Performance Over Time
            </CardTitle>
            <CardDescription className="text-gray-500">
              Time spent per round (January - June 2024)
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-4">
            <ChartContainer config={chartConfig}>
              <LineChart
                accessibilityLayer
                data={chartData}
                margin={{ top: 20, left: 20, right: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-gray-300" />
                <XAxis
                  dataKey="round"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  tickFormatter={(value) => `Round ${value}`}
                  className="text-gray-600 text-sm"
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  className="text-gray-600 text-sm"
                  label={{ value: "Time (s)", angle: -90, position: "insideLeft", dy: -10 }}
                />
                <ChartTooltip
                  cursor={{ stroke: "var(--color-primary)", strokeWidth: 1 }}
                  content={<ChartTooltipContent indicator="line" />}
                />
                <Line
                  dataKey="timeSpent"
                  type="monotone"
                  stroke="hsl(var(--color-primary))"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: "hsl(var(--color-primary))" }}
                  activeDot={{ r: 6, fill: "hsl(var(--color-primary))", strokeWidth: 2 }}
                >
                  <LabelList
                    dataKey="timeSpent"
                    position="top"
                    offset={8}
                    className="fill-gray-800 text-xs font-medium"
                  />
                </Line>
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {expressions && <TimelineChart expressions={expressions} />}
      </div>

      <div className="max-w-5xl py-12 mx-auto text-base">
        <Accordion type="single" defaultValue={analyticsData?.questions[0]?.question} collapsible>
          {analyticsData?.questions.map(({ answer, answerReview, score, correctAnswer, startTime, endTime, round, question, code, faceExpressions }, index) => (
            <AccordionItem key={startTime} value={question}>
              <AccordionTrigger className="text-base">Q{index + 1} - {question} ({round})</AccordionTrigger>
              <AccordionContent className="text-base">
                {score > 5 ?
                  <p className="bg-green-500/60 p-4 rounded">
                    Your answer is correct: {answer}
                  </p>
                  :
                  <>
                    <p className="bg-red-500/60 p-4 rounded">
                      Your answer is wrong: {answer || "You didn't said anything"}
                    </p>
                    <p className="bg-green-500/60 p-4 rounded">
                      Correct answer should be: {correctAnswer}
                    </p>
                  </>
                }
                <p className="bg-zinc-200/70 dark:bg-zinc-800/70 p-4 rounded">Answer Review: {answerReview}</p>
                {code && code.map(({ code, language }, index) => (
                  <div className="bg-zinc-800/70 rounded-md m-4 relative min-h-16">
                    <div className="absolute right-4 top-4 flex space-x-2">
                      <span className="py-1.5 px-2.5 bg-zinc-300/70 dark:bg-zinc-700/70 rounded-sm">Attempt {index + 1 < 9 ? `0${index + 1}` : index + 1}</span>
                      <span className="py-1.5 px-2.5 bg-zinc-300/70 dark:bg-zinc-700/70 rounded-sm">{language}</span>
                      <CopyButton content={code} />
                    </div>
                    <section className="p-4">
                      {code}
                    </section>
                  </div>
                ))}
                <div className="flex justify-evenly items-center border-t-2 border-zinc-300 dark:border-zinc-700 bg-zinc-200/70 dark:bg-zinc-800/70 py-6">
                  <div className="flex flex-col justify-center items-center">
                    <p className="font-semibold text-xl">{formatTimeInShortWords((endTime || Date.now()) - startTime)}</p>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">Time Spent</p>
                  </div>
                  <div className="flex flex-col justify-center items-center">
                    <p className="font-semibold text-xl">{getMostCommonExpression(faceExpressions)}</p>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">Most common face expression</p>
                  </div>
                  <div className="flex flex-col justify-center items-center">
                    <p className="font-semibold text-xl">{score}/10</p>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">Score</p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

    </div >
  );
};

export default AnalysisComponent;