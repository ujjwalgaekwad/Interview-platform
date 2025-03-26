"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
    { month: "January", desktop: 186, mobile: 80 },
    { month: "February", desktop: 305, mobile: 200 },
    { month: "March", desktop: 237, mobile: 120 },
    { month: "April", desktop: 73, mobile: 190 },
    { month: "May", desktop: 209, mobile: 130 },
    { month: "June", desktop: 214, mobile: 140 },
];

// Updated colors to use Tailwind's purple-500
const chartConfig: ChartConfig = {
    desktop: {
        label: "Desktop",
        color: "#3b82f6", // Tailwind `purple-500`
    },
    mobile: {
        label: "Mobile",
        color: "#3b82f6", // Tailwind `purple-400` for variation
    },
};

function DataVisualization() {
    return (
        <Card className="h-50 w-9/12 dark:bg-[#212121]">
            <CardHeader className="text-blue-500">
                <CardTitle>📊 Bar Chart - Multiple</CardTitle>
                <CardDescription>January - June 2024</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart accessibilityLayer data={chartData}>
                        <CartesianGrid vertical={false} stroke="#ddd" />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 3)}
                            stroke="#3b82f6"
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="dashed" />}
                        />
                        <Bar dataKey="desktop" fill="#3b82f6" radius={4} />
                        <Bar dataKey="mobile" fill="#bfdbfe" radius={4} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 font-medium leading-none text-blue-500">
                    Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
                </div>
                <div className="leading-none text-gray-500">
                    Showing total visitors for the last 6 months
                </div>
            </CardFooter>
        </Card>
    );
}

export default DataVisualization;
