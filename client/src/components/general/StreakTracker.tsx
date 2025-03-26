import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const MAX_STREAK = 10; // Maximum streak count for a full circle

const StreakCircle: React.FC = () => {
    const [streak, setStreak] = useState<number>(0);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    // Function to check if the user has already logged in today
    const hasLoggedToday = (lastDate: Date | null): boolean => {
        if (!lastDate) return false;
        return new Date().toDateString() === lastDate.toDateString();
    };

    // Load streak from LocalStorage
    useEffect(() => {
        const savedStreak = localStorage.getItem("streak");
        const savedDate = localStorage.getItem("lastUpdated");

        if (savedStreak && savedDate) {
            const lastDate = new Date(savedDate);
            const today = new Date();

            if (hasLoggedToday(lastDate)) {
                setStreak(parseInt(savedStreak, 10)); // Maintain streak if already logged today
            } else if (
                today.getDate() - lastDate.getDate() === 1 &&
                today.getMonth() === lastDate.getMonth() &&
                today.getFullYear() === lastDate.getFullYear()
            ) {
                setStreak(parseInt(savedStreak, 10) + 1); // Increment streak for consecutive days
                localStorage.setItem("streak", (parseInt(savedStreak, 10) + 1).toString());
                localStorage.setItem("lastUpdated", today.toISOString());
            } else {
                setStreak(1); // Reset streak if a day is missed
                localStorage.setItem("streak", "1");
                localStorage.setItem("lastUpdated", today.toISOString());
            }
        } else {
            setStreak(1); // Start streak if no previous data
            localStorage.setItem("streak", "1");
            localStorage.setItem("lastUpdated", new Date().toISOString());
        }
        setLastUpdated(new Date());
    }, []);

    return (
        <Card className="w-7/12 max-w-sm mx-auto p-4 text-center dark:bg-[#212121] ml-2">
            <CardHeader>
                <CardTitle>Streak Tracker</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="relative flex justify-center items-center w-40 h-40 mx-auto">
                    {/* SVG Circular Progress */}
                    <svg className="absolute w-full h-full rotate-[-90deg]" viewBox="0 0 100 100">
                        {/* Background Circle */}
                        <circle cx="50" cy="50" r="40" strokeWidth="10" fill="none" className="stroke-gray-300" />
                        {/* Streak Progress Circle */}
                        <circle
                            cx="50"
                            cy="50"
                            r="40"
                            strokeWidth="10"
                            fill="none"
                            stroke="currentColor"
                            strokeDasharray="251.2"
                            strokeDashoffset={251.2 - (streak / MAX_STREAK) * 251.2}
                            strokeLinecap="round"
                            className="stroke-[#f59e0b] transition-all duration-500 ease-in-out"
                        />
                    </svg>

                    {/* Streak Count in the Center */}
                    <span className="absolute text-3xl font-bold text-[#f59e0b] ">{streak}</span>
                </div>
            </CardContent>
        </Card>
    );
};

export default StreakCircle;
