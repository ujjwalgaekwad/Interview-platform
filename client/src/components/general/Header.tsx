import { useAuth, UserButton } from "@clerk/clerk-react"
import { Link, NavLink } from "react-router-dom"
import ThemeToggler from "./ThemeToggler"
import { Loader2 } from "lucide-react";
import Container from "./Container";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/aboutus", label: "About Us" },
];

function Header() {
  const { isLoaded, isSignedIn } = useAuth();

  return (
    <>
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-border/70 bg-background/92 backdrop-blur-md">
        <Container className="flex h-16 items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-2.5">
            <img className="h-9 w-9 rounded-xl border border-border/60 bg-white p-1 dark:bg-slate-950" src="/logo.svg" alt="Hireme.ai logo" />
            <div className="hidden sm:block">
              <p className="font-display text-base font-semibold leading-none text-foreground">Hireme.ai</p>
              <p className="text-xs text-muted-foreground">AI interview workspace</p>
            </div>
          </Link>

          <ul className="hidden items-center gap-2 rounded-full border border-border/70 bg-card/80 p-1 md:flex">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 text-sm font-semibold ${isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent hover:text-foreground"}`
                }
              >
                {label}
              </NavLink>
            ))}
          </ul>

          <div className="flex items-center gap-2.5">
            <ThemeToggler />
            {isLoaded ? (
              isSignedIn ? (
                <UserButton />
              ) : (
                <Link className="rounded-full border border-border/70 bg-foreground px-3.5 py-2 text-sm font-semibold text-background hover:bg-foreground/90" to="/auth/signin">
                  Sign in
                </Link>
              )
            ) : (
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            )}
          </div>
        </Container>
      </nav>
    </>
  )
}

export default Header