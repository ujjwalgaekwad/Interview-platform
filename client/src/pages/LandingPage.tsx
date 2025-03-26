import Container from "@/components/general/Container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { useUser } from "@clerk/clerk-react";
import { FaVideo, FaCode, FaChartBar, FaUsers, FaComments } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const { } = useUser();
  const navigate = useNavigate();
  return (
    <div className="w-full min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-all duration-500 overflow-x-hidden">
      <Container>
        <div className="w-full">
          <header className="text-center py-20 w-full max-w-3xl mx-auto px-4">
            <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              AI Interview Platform
            </h1>
            <p className="mt-4 text-xl text-gray-700 dark:text-gray-300">
              Enhance your interview preparation with AI-powered features.
            </p>
            <Button onClick={() => navigate("/auth/signin")} className="mt-6 px-6 py-3 text-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-500 hover:to-blue-500 transition-all duration-300 text-white">
              Get Started
            </Button>
          </header>
          <section className="flex flex-wrap justify-center gap-6 mt-8 max-w-5xl mx-auto px-4">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 text-center flex-1 min-w-[280px] max-w-[350px] bg-white dark:bg-gray-800">
                <feature.icon className={`text-4xl mx-auto mb-4 ${feature.color}`} />
                <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </section>
        </div>
      </Container>
    </div>
  );
}

const features = [
  {
    title: "Live Video & Facial Analysis",
    description: "Practice with real-time video and AI-based facial expression analysis.",
    icon: FaVideo,
    color: "text-blue-600 dark:text-blue-400",
  },
  {
    title: "Built-in Code Editor",
    description: "Solve coding problems with an interactive code editor.",
    icon: FaCode,
    color: "text-green-600 dark:text-green-400",
  },
  {
    title: "Data Visualization",
    description: "Get insights into your performance with AI-powered analysis.",
    icon: FaChartBar,
    color: "text-yellow-600 dark:text-yellow-400",
  },
  {
    title: "Mock Interviews",
    description: "Simulate real interview scenarios with AI-driven responses.",
    icon: FaUsers,
    color: "text-purple-600 dark:text-purple-400",
  },
  {
    title: "AI Feedback",
    description: "Receive instant AI-generated feedback on your answers.",
    icon: FaComments,
    color: "text-red-600 dark:text-red-400",
  },
];
