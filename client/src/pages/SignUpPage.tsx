import { SignUp } from "@clerk/clerk-react"

function SignUpPage() {
  return (
    <div className="flex justify-center">
      <SignUp
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

export default SignUpPage