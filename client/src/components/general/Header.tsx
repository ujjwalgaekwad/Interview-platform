import { useAuth, UserButton } from "@clerk/clerk-react"
import { Link, NavLink } from "react-router-dom"
import ThemeToggler from "./ThemeToggler"
import { Loader } from "lucide-react";

function Header() {
  const { isLoaded } = useAuth();

  if (!isLoaded) {
    return <Loader className="w-5 h-5 animate-spin" />
  }

  return (
    <>
      <nav className="fixed h-16 border dark:bg-gray-900 border-gray-200 dark:border-gray-800 px-32 top-0 left-0 w-full flex justify-between p-4">
        <div className="flex items-center gap-5">
          <Link to="/">
            <img src="/logo.svg" alt="logo" />
          </Link>
          <ul className="flex gap-4">
            <NavLink to="/" className={({ isActive }) => (`font-semibold ${isActive ? "text-zinc-950 dark:text-zinc-100" : "text-gray-400 dark:text-zinc-400"}`)}>Home</NavLink>
            <NavLink to="/dashboard" className={({ isActive }) => (`font-semibold ${isActive ? "text-zinc-950 dark:text-zinc-100" : "text-gray-400 dark:text-zinc-400"}`)}>Dashboard</NavLink>
          </ul>
        </div>  
        <div className="flex gap-4">
          <ThemeToggler />
          <UserButton />
        </div>
      </nav>
      <div className="h-16"></div>
    </>
  )
}

export default Header