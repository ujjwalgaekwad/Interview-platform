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
        <Card className="surface-panel w-full max-w-sm select-none text-center">
            <CardHeader className="border-b border-border/60 bg-gradient-to-r from-primary/10 to-transparent">
                <CardTitle className="text-2xl">Streak Track</CardTitle>
            </CardHeader>
            <div className="space-x-2 pb-2 pt-5">
                {getStreak() >= MAX_STREAK && Array.from({ length: Math.floor(getStreak() / 10) }, (_, index) => (
                    <span key={index} className="text-3xl font-bold rounded-xl py-3  w-full text-center">
                        🔥
                    </span>
                ))
                }
                <span className="text-3xl font-bold rounded-xl py-3 opacity-40 w-full text-center">
                    🔥
                </span>
            </div>

            <VisuallyHidden>
                <CardHeader>
                    <CardTitle>Streak Tracker</CardTitle>
                </CardHeader>
            </VisuallyHidden>
            <CardContent className="pb-6">
                <div className="relative flex justify-center items-center w-40 h-40 pt-6 pb-4 mx-auto">
                    {/* SVG Circular Progress */}
                    <svg className="absolute w-full h-full rotate-[-90deg]" viewBox="0 0 100 100">
                        {/* Background Circle */}
                        <circle cx="50" cy="50" r="40" strokeWidth="10" fill="none" className="stroke-border" />
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
                            className="stroke-amber-500 transition-all duration-500 ease-in-out"
                        />
                    </svg>

                    {/* Streak Count in the Center */}
                    <span className="absolute font-display text-3xl font-bold text-amber-500">{getStreak()}</span>
                </div>

                <div className="space-y-2 py-6 text-sm text-muted-foreground">
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
