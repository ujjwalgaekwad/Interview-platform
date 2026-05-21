import Header from "@/components/general/Header"
import { Toaster } from "@/components/ui/toaster"
import { Outlet, useLocation } from "react-router-dom"

function RootLayout() {

  const location = useLocation()

  const showHeader = !(location.pathname.includes("/interview")) && !(location.pathname.includes("/auth"))

  return (
    <main className={`app-shell ${showHeader ? "pt-16" : ""}`}>
      {showHeader && <Header />}
      <Outlet />
      <Toaster />
    </main>
  )
}

export default RootLayout