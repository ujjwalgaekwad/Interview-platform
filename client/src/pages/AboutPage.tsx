import Container from "@/components/general/Container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FaTwitter, FaLinkedin, FaGithub, FaEnvelope, FaPhone, FaMapMarkerAlt, FaInfoCircle } from "react-icons/fa";

export default function AboutPage() {
  return (
    <Container className="page-section space-y-6 py-10 sm:py-14">
      <Card className="surface-panel overflow-hidden">
        <CardHeader className="space-y-4 border-b border-border/60 bg-gradient-to-r from-primary/10 via-background to-background">
          <span className="section-kicker w-fit">
            <FaInfoCircle className="h-3.5 w-3.5" />
            About us
          </span>
          <CardTitle className="text-3xl sm:text-4xl">A focused platform for interview practice and review.</CardTitle>
          <CardDescription className="max-w-3xl text-base leading-8 text-muted-foreground">
            EdHire combines interview simulation, code evaluation, analytics, and feedback in a single workspace so teams and candidates can work from the same playbook.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 p-6 sm:p-8 lg:grid-cols-3">
          {aboutHighlights.map((item) => (
            <div key={item.title} className="rounded-2xl border border-border/70 bg-muted/40 p-5">
              <p className="font-display text-lg font-semibold text-foreground">{item.title}</p>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <Card className="surface-panel">
          <CardHeader>
            <CardTitle className="text-2xl">What the platform covers</CardTitle>
            <CardDescription>Everything is designed to move from setup to feedback with the same visual rhythm.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-7 text-muted-foreground">
            <p>
              The product gives candidates a practice environment that feels modern and deliberate, while still surfacing the data interviewers and learners actually need.
            </p>
            <p>
              Video analysis, coding tasks, interview transcripts, and scoring all feed into one consistent experience that stays readable in both light and dark mode.
            </p>
          </CardContent>
        </Card>

        <Card className="surface-panel">
          <CardHeader>
            <CardTitle className="text-2xl">Contact</CardTitle>
            <CardDescription>For platform support, product questions, or partnership conversations.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <FaEnvelope className="mt-1 text-primary" />
                <span><span className="font-semibold text-foreground">Email:</span> EdHire@gmail.com</span>
              </li>
              <li className="flex items-start gap-3">
                <FaPhone className="mt-1 text-emerald-500" />
                <span><span className="font-semibold text-foreground">Phone:</span> +91 99999999</span>
              </li>
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="mt-1 text-rose-500" />
                <span><span className="font-semibold text-foreground">Address:</span> Ahmedabad, Gujarat</span>
              </li>
            </ul>

            <div className="mt-6 flex items-center gap-4">
              {socialLinks.map((item) => (
                <a key={item.label} href="#" target="_blank" rel="noopener noreferrer" className={`inline-flex h-11 w-11 items-center justify-center rounded-full border border-border/70 bg-background/80 text-xl transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-accent ${item.color}`} aria-label={item.label}>
                  <item.icon />
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}

const aboutHighlights = [
  {
    title: "Interview flow",
    description: "Guided setup, live practice, and feedback screens that feel intentional from the first click.",
  },
  {
    title: "Code practice",
    description: "A built-in coding surface that keeps the candidate inside the interview context.",
  },
  {
    title: "Analytics",
    description: "Clear session data, streaks, and charting that make the next action obvious.",
  },
];

const socialLinks = [
  { label: "Twitter", icon: FaTwitter, color: "text-sky-500" },
  { label: "LinkedIn", icon: FaLinkedin, color: "text-blue-600" },
  { label: "GitHub", icon: FaGithub, color: "text-zinc-700 dark:text-zinc-300" },
];