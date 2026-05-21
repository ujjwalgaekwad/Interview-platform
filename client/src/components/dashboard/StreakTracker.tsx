import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InterviewSessionData } from "@/types/InterviewData";
import { getDateAndDay } from "@/utils/formatTime";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

const MAX_STREAK = 10; // Maximum streak count for a full circle

const StreakCircle = ({ interviewSessions }: { interviewSessions: InterviewSessionData[] }) => {

    const getStreak = () => {
        if (!interviewSessions || interviewSessions.length === 0) {
            return 0;
        }

        // Sort sessions by date
        const sortedSessions = [...interviewSessions].sort(
            (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
        );

        let currentStreak = 0;
        let lastDate = null;

        for (const session of sortedSessions) {
            const sessionDate = new Date(session.startTime);
            sessionDate.setHours(0, 0, 0, 0); // Normalize to remove time differences

            if (!lastDate || sessionDate.getTime() !== lastDate.getTime()) {
                // If it's the next day, increase streak
                if (lastDate && sessionDate.getTime() === lastDate.getTime() + 86400000) {
                    currentStreak++;
                } else {
                    currentStreak = 1; // Reset streak if not consecutive
                }
                lastDate = sessionDate;
            }
        }

        return currentStreak;
    };

    return (
        <Card className="w-7/12 max-w-sm mx-auto p-4 select-none text-center bg-zinc-200 dark:bg-zinc-800 ml-2">
            <h1 className="text-3xl font-bold rounded-xl py-3  w-full text-center">
                Streak Track
            </h1>
            <div className="space-x-2 pt-4 pb-6">
                {getStreak() >= MAX_STREAK && Array.from({ length: Math.floor(getStreak() / 10) }, (_, index) => (
                    <span key={index} className="text-3xl font-bold rounded-xl py-3  w-full text-center">
                        🔥
                    </span>
                ))
                }
                <span className="text-3xl font-bold rounded-xl py-3 opacity-50 w-full text-center">
                    🔥
                </span>
            </div>

            <VisuallyHidden>
                <CardHeader>
                    <CardTitle>Streak Tracker</CardTitle>
                </CardHeader>
            </VisuallyHidden>
            <CardContent>
                <div className="relative flex justify-center items-center w-40 h-40 pt-6 pb-4 mx-auto">
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
                            strokeDashoffset={251.2 - (getStreak() / MAX_STREAK) * 251.2}
                            strokeLinecap="round"
                            className="stroke-[#f59e0b] transition-all duration-500 ease-in-out"
                        />
                    </svg>

                    {/* Streak Count in the Center */}
                    <span className="absolute text-3xl font-bold text-[#f59e0b] ">{getStreak()}</span>
                </div>

                <div className="py-6 space-y-2">
                    {interviewSessions &&
                        [...interviewSessions]
                            .sort((a, b) => +new Date(b.startTime) - +new Date(a.startTime)) // Sort in descending order
                            .reduce<string[]>((uniqueDates, session) => {
                                const sessionDate = new Date(session.startTime).toDateString(); // Normalize to remove time
                                if (!uniqueDates.includes(sessionDate)) {
                                    uniqueDates.push(sessionDate); // Store only unique dates
                                }
                                return uniqueDates;
                            }, [])
                            .map((date, index) => {
                                const dateObject = new Date(date);
                                const timestamp = dateObject.getTime();
                                return <p key={index}>{getDateAndDay(timestamp)}</p>;
                            })}
                </div>

            </CardContent>
        </Card>
    );
};

export default StreakCircle;
