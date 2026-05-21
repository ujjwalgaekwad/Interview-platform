import Container from "@/components/general/Container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FaVideo, FaCode, FaChartBar, FaUsers, FaComments } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[60vh] sm:h-[48vh] md:h-[56vh] lg:h-[64vh] bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.10),transparent_40%),radial-gradient(circle_at_top_right,rgba(124,58,237,0.08),transparent_38%)]" />
      <Container className="relative z-10 pt-6 pb-10 sm:pt-8 sm:pb-14 lg:pt-10 lg:pb-16">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-6">
            <span className="section-kicker">
              <Sparkles className="h-4 w-4 text-primary" />
              AI interview platform
            </span>
            <div className="space-y-4">
              <h1 className="section-heading max-w-3xl font-display font-bold text-foreground">
                Build interview confidence with one intelligent workspace.
              </h1>
              <p className="section-copy max-w-2xl">
                Practice live video rounds, code challenges, analytics, and instant feedback in a single polished flow that feels built for real hiring.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button size="lg" onClick={() => navigate("/auth/signin")}>
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/aboutus">See the platform</Link>
              </Button>
            </div>
          </div>

          <Card className="overflow-hidden">
            <CardHeader className="space-y-3 border-b border-border/60 bg-muted/25">
              <span className="section-kicker w-fit">
                <Sparkles className="h-4 w-4 text-primary" />
                Live product snapshot
              </span>
              <CardTitle className="font-display text-3xl">Prepared for focused interview sessions.</CardTitle>
              <CardDescription className="max-w-xl text-sm leading-7 text-muted-foreground">
                Everything from camera checks to scoring lives inside a single flow, so candidates stay in the work instead of the wiring.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 p-6 sm:p-8">
              {workflow.map((step) => (
                <div key={step.title} className="rounded-2xl border border-border/70 bg-background/70 p-4">
                  <p className="text-sm font-semibold text-foreground">{step.title}</p>
                  <p className="mt-1 text-sm leading-7 text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <section className="mt-10 space-y-8 sm:mt-12">
          <div className="max-w-2xl space-y-3">
            <span className="section-kicker">Platform capabilities</span>
            <h2 className="section-heading font-display font-semibold text-foreground">Designed to feel premium, not patched together.</h2>
            <p className="section-copy">
              Each capability below is aligned with the same spacing, elevation, and accent system, so the product reads as one application rather than isolated screens.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title} className="h-full">
                <CardHeader className="space-y-4">
                  <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-border/70 bg-gradient-to-br ${feature.tint}`}>
                    <feature.icon className="text-2xl text-white" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription className="text-sm leading-7 text-muted-foreground">{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>
      </Container>
    </div>
  );
}

const workflow = [
  {
    title: "Prepare once",
    description: "Set the role, skills, and experience level in a guided flow that keeps the setup fast and consistent.",
  },
  {
    title: "Interview with focus",
    description: "Run live rounds with webcam, code, and timer surfaces that stay readable under pressure.",
  },
  {
    title: "Review the signal",
    description: "Turn every session into structured feedback, trend lines, and a clear next-step plan.",
  },
];

const features = [
  {
    title: "Live Video & Facial Analysis",
    description: "Practice with real-time video and AI-based facial expression analysis.",
    icon: FaVideo,
    tint: "from-blue-500 to-cyan-500",
  },
  {
    title: "Built-in Code Editor",
    description: "Solve coding problems with an interactive code editor.",
    icon: FaCode,
    tint: "from-emerald-500 to-teal-500",
  },
  {
    title: "Data Visualization",
    description: "Get insights into your performance with AI-powered analysis.",
    icon: FaChartBar,
    tint: "from-amber-500 to-orange-500",
  },
  {
    title: "Mock Interviews",
    description: "Simulate real interview scenarios with AI-driven responses.",
    icon: FaUsers,
    tint: "from-violet-500 to-fuchsia-500",
  },
  {
    title: "AI Feedback",
    description: "Receive instant AI-generated feedback on your answers.",
    icon: FaComments,
    tint: "from-rose-500 to-red-500",
  },
];
