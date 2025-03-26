import Header from "@/components/general/Header"
import { Toaster } from "@/components/ui/toaster"
import { Outlet, useLocation } from "react-router-dom"

function RootLayout() {

  const location = useLocation()

  const showHeader = !(location.pathname.includes("/interview"))

  return (
    <main className="w-screen min-h-screen overflow-x-hidden bg-zinc-100 dark:bg-zinc-900">
      {showHeader && <Header />}
      <Outlet />
      <Toaster />
    </main>
  )
}

export default RootLayout