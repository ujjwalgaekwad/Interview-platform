import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface TimelineChartProps {
  // Each key is an expression like 'neutral', 'happy', etc.
  // Each value is a tuple of [startTime, endTime]
  expressions: Record<string, [number, number]>;
}

const TimelineChart: React.FC<TimelineChartProps> = ({ expressions }) => {
  const minTime = Math.min(...Object.values(expressions).map(([start]) => start));

  // Function to format seconds into hh:mm:ss
  const formatTime = (timeInSeconds: number) => {
    const date = new Date(timeInSeconds * 1000); // Convert seconds to milliseconds
    return date.toISOString().substr(11, 8); // Extract hh:mm:ss
  };

  const data = Object.entries(expressions).map(([expression, [start, end]]) => ({
    expression,
    startGap: start - minTime, // Normalize to start from 0
    duration: Math.max(end - start, 0.5), // Ensure visibility
    formattedStart: formatTime(start - minTime), // Human-readable start time
    formattedEnd: formatTime(end - minTime), // Human-readable end time
  }));

  return (
    <Card className='bg-transparent'>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold dark:text-gray-200 text-gray-800">
          Face Expression Timeline
        </CardTitle>
        <CardDescription className="text-gray-500">
          Timeline of Face Expressions
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-16">
        <ResponsiveContainer width="100%" height={data.length * 60}>
          <BarChart data={data} layout="vertical" margin={{ left: 100, right: 30 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              type="number"
              domain={[0, Math.max(...data.map(d => d.startGap + d.duration))]}
              tickFormatter={(tick) => formatTime(tick)}
              label={{ value: 'Time (hh:mm:ss)', position: 'insideBottom', offset: -5 }}
            />
            <YAxis type="category" dataKey="expression" />
            <Tooltip formatter={(value, name) => [`${value} sec`, name]} />
            <Bar dataKey="startGap" stackId="a" fill="transparent" />
            <Bar dataKey="duration" stackId="a" fill="hsl(var(--color-primary))" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default TimelineChart;
