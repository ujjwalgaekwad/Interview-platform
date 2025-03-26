import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/clerk-react";
import { Outlet } from "react-router-dom";

function AppLayout() {
  return (
    <>
      {/* Redirect to sign-in only if the user is signed out */}
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>

      {/* Render the app only if signed in */}
      <SignedIn>
        <Outlet />
      </SignedIn>
    </>
  );
}

export default AppLayout;
