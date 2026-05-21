import { SignIn } from "@clerk/clerk-react"

function SignInPage() {
  return (
    <div className="flex justify-center">
      <SignIn
        appearance={{
          elements: {
            card: "shadow-none border border-border/70 bg-card/95",
            rootBox: "mx-auto",
          },
        }}
      />
    </div>
  )
}

export default SignInPage