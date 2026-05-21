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
    <Card className="surface-panel h-full overflow-hidden">
      <div className="border-b border-border/60 bg-gradient-to-r from-primary/10 to-transparent px-6 py-5 sm:px-7">
        <h1 className="font-display text-2xl font-semibold text-foreground">
          Interview Insights
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Average score trend across your recent sessions.
        </p>
      </div>
      <CardContent className="pt-6">
        <ChartContainer config={chartConfig}>
          <BarChart data={data}>
            <CartesianGrid vertical={false} stroke="hsl(var(--border))" />
            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              stroke="hsl(var(--muted-foreground))"
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
            <Bar dataKey="averageScore" fill="hsl(var(--primary))" radius={6} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 border-t border-border/60 px-6 py-5 text-sm sm:px-7">
        <div className="flex gap-2 font-medium leading-none text-primary">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing average interview scores
        </div>
      </CardFooter>
    </Card>
  );
}

export default DataVisualization;
