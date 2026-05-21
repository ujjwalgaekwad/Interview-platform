import { SignedOut, useAuth } from "@clerk/clerk-react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { X, Sparkles, ShieldCheck, WandSparkles } from "lucide-react";

function AuthLayout() {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();

  useEffect(() => {
    if (isSignedIn) {
      navigate("/dashboard");
    }
  }, [isSignedIn, navigate]);

  return (
    <section className="min-h-screen overflow-hidden bg-background">
      <Link
        to="/"
        className="fixed right-6 top-6 z-50 inline-flex h-11 w-11 items-center justify-center rounded-full border border-border/70 bg-card/80 text-foreground backdrop-blur-sm"
      >
        <X className="h-5 w-5" />
      </Link>

      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        <aside className="relative hidden overflow-hidden border-r border-border/60 bg-slate-950 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.32),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.22),transparent_28%)]" />
          <div className="relative flex h-full flex-col justify-between p-10 xl:p-14">
            <Link to="/" className="inline-flex items-center gap-3 text-white">
              <img className="h-12 w-12 rounded-2xl border border-white/10 bg-white/10 p-1" src="/Logo.png" alt="EdHire logo" />
              <div>
                <p className="font-display text-lg font-semibold leading-none">EdHire</p>
                <p className="text-xs uppercase tracking-[0.22em] text-white/55">Interview platform</p>
              </div>
            </Link>

            <div className="max-w-xl space-y-6">
              <span className="section-kicker border-white/10 bg-white/5 text-white/70">
                <Sparkles className="h-4 w-4 text-cyan-300" />
                Built for focused preparation
              </span>
              <h1 className="section-heading font-display font-bold text-white">
                A calm, high-trust workspace for practice interviews.
              </h1>
              <p className="max-w-xl text-base leading-8 text-white/72">
                Sign in to a polished environment that keeps the candidate flow consistent across setup, practice, and review.
              </p>

              <div className="grid gap-3 sm:grid-cols-3">
                {authSignals.map((signal) => (
                  <div key={signal.label} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-cyan-300">
                      <signal.icon className="h-5 w-5" />
                    </div>
                    <p className="mt-3 text-sm font-semibold text-white">{signal.label}</p>
                    <p className="mt-1 text-sm text-white/60">{signal.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <main className="flex items-center justify-center px-5 py-10 sm:px-8 lg:px-14">
          <div className="w-full max-w-xl">
            <SignedOut>
              <Outlet />
            </SignedOut>
          </div>
        </main>
      </div>
    </section>
  );
}

const authSignals = [
  {
    label: "Secure entry",
    description: "Focused sign-in and sign-up surfaces with a clear return path.",
    icon: ShieldCheck,
  },
  {
    label: "Instant setup",
    description: "Move into a practice session without fighting the interface.",
    icon: WandSparkles,
  },
  {
    label: "Consistent flow",
    description: "A single visual system from login to analytics and feedback.",
    icon: Sparkles,
  },
];

export default AuthLayout;
