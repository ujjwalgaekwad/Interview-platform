import useProfileStore from "@/store/profileStore";
import { syncRootTheme, toggleThemeModeAtRootElem } from "@/utils/themeMethods"
import { useEffect } from "react";
import { IoMdSunny, IoMdMoon } from "react-icons/io";

function ThemeToggler() {

  const { setTheme, profile } = useProfileStore()

  const themeHandler = () => {
    if (profile.theme === "dark") {
      setTheme("light")
      toggleThemeModeAtRootElem("light")
    } else {
      setTheme("dark")
      toggleThemeModeAtRootElem("dark")
    }
  }

  useEffect(() => {
    if (profile.theme === "dark") {
      syncRootTheme("dark")
    }
  }, [profile.theme])

  return (
    <button onClick={themeHandler}>
      {profile.theme === "dark" ? <IoMdSunny size={18} /> : <IoMdMoon size={18} />}
    </button>
  )
}

export default ThemeToggler