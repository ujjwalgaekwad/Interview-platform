"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { InterviewSessionData } from "@/types/InterviewData";

// Updated colors to use Tailwind's purple-500
const chartConfig: ChartConfig = {
  desktop: {
    label: "Desktop",
    color: "#3b82f6", // Tailwind `purple-500`
  },
};

function DataVisualization({ analysis }: { analysis: InterviewSessionData[] }) {

  const data = analysis.map((item, index) => {
    const totalScore = item.questions.reduce((acc, question) => acc + question.score, 0);
    const averageScore = totalScore / item.questions.length;
    return { name: `Interview ${index + 1}`, averageScore };
  });

  return (
    <Card className="h-50 w-9/12 mx-auto text-center bg-zinc-200/80 dark:bg-[#212121]">
      <h1 className="text-3xl font-bold my-4 mx-2 rounded-xl py-3 h-15 text-center">
        Interview Insights
      </h1>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart data={data}>
            <CartesianGrid vertical={false} stroke="#ddd" />
            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              stroke="#3b82f6"
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
            <Bar dataKey="averageScore" fill="#3b82f6" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none text-blue-500">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-gray-500">
          Showing average interview scores
        </div>
      </CardFooter>
    </Card>
  );
}

export default DataVisualization;
