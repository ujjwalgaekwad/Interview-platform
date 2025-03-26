import ThemeToggler from "@/components/general/ThemeToggler";
import { SocketProvider } from "@/socket/SocketContext";
import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/clerk-react";
import { Outlet } from "react-router-dom";
import { Root as VisuallyHidden } from "@radix-ui/react-visually-hidden"

function InterviewLayout() {
  return (
    <>
      {/* Redirect to sign-in only if the user is signed out */}
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>

      {/* Render the app only if signed in */}
      <SignedIn>
        <VisuallyHidden >
          <ThemeToggler />
        </VisuallyHidden>
        <SocketProvider>
          <Outlet />
        </SocketProvider>
      </SignedIn >
    </>
  );
}

export default InterviewLayout;
