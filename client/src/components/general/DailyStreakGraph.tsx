import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

const data = [
    { date: "2025-02-01", sessions: 1 },
    { date: "2025-02-02", sessions: 2 },
    { date: "2025-02-03", sessions: 0 },
    { date: "2025-02-04", sessions: 3 },
    { date: "2025-02-05", sessions: 1 },
    { date: "2025-02-06", sessions: 4 },
    { date: "2025-02-07", sessions: 2 },
];

const DailyStreakGraph = () => {
    return (
        <div style={{ width: "100%", height: 400, padding: "20px" }}>
            <h2 className="text-2xl font-bold mb-4">Daily Interview Sessions</h2>
            <ResponsiveContainer>
                <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="sessions" stroke="#82ca9d" strokeWidth={2} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default DailyStreakGraph;
