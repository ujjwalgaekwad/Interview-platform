import { useAuth, UserButton } from "@clerk/clerk-react"
import { Link, NavLink } from "react-router-dom"
import ThemeToggler from "./ThemeToggler"
import { Loader2 } from "lucide-react";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/aboutus", label: "About Us" },
];

function Header() {
  const { isLoaded, isSignedIn } = useAuth();

  return (
    <>
      <nav className="fixed h-16 z-50 bg-zinc-100 dark:bg-zinc-900 border-b-2 border-gray-200 dark:border-gray-800 px-32 top-0 left-0 w-full flex justify-between items-center p-4">
        <Link to="/">
          <img className="h-14 w-14" src="/Logo.png" alt="logo" />
        </Link>
        <ul className="flex gap-4">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `font-semibold ${isActive ? "text-zinc-950 dark:text-zinc-100" : "text-gray-600 dark:text-zinc-500"}`
              }
            >
              {label}
            </NavLink>
          ))}
        </ul>
        <div className="flex gap-4">
          <ThemeToggler />
          {(isLoaded && isSignedIn) ? <UserButton /> : (isLoaded ? <Link className="bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-zinc-800 dark:hover:text-zinc-200 px-3 py-1 rounded-sm transition-colors" to="/auth/signin">Sign in</Link> : <Loader2 className="w-5 h-5 animate-spin" />)}
        </div>
      </nav>
      <div className="h-16"></div>
    </>
  )
}

export default Header