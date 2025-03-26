import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const data = [
    { name: "Correct Answers", value: 50, color: "#4CAF50" },
    { name: "Wrong Answers", value: 30, color: "#F44336" },
    { name: "Unanswered Questions", value: 20, color: "#FFC107" },
];

const AnalyticsPage: React.FC = () => {
    return (
        <div className="p-6">
            <div className="flex justify-center">
                <PieChart width={400} height={400}>
                    <Pie
                        data={data}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={150}
                        fill="#8884d8"
                        label
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </div>
        </div>
    );
};

export default AnalyticsPage;
