import ReactDOM from 'react-dom/client'
import './index.css'
import { ClerkProvider } from '@clerk/clerk-react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import NotFoundPage from './pages/NotFoundPage'
import LandingPage from './pages/LandingPage'
import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage'
import AuthLayout from './layouts/AuthLayout'
import AppLayout from './layouts/AppLayout'
import DashboardPage from './pages/DashboardPage'
import RootLayout from './layouts/RootLayout'
import InterviewPage from './pages/InterviewPage'
import InterviewLayout from './layouts/InterviewLayout'
import InterviewForm from './components/interview/InterviewForm'
import AnalyticsPage from './pages/AnalyticsPage'
import AboutPage from './pages/Aboutpage'

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

// router
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      // public routes
      {
        path: "",
        element: <LandingPage />,
      },

      // protected routes
      {
        path: "dashboard",
        element: <AppLayout />,
        children: [
          {
            path: "",
            element: <DashboardPage />,
          },
          {
            path: "user/form",
            element: <InterviewForm />,
          },
        ]
      },
      {
        path: "aboutus",
        element: <AppLayout />,
        children: [
          {
            path: "",
            element: <AboutPage />,
          },
          {
            path: "form",
            element: <InterviewForm />,
          },
        ]
      },
      {
        path: "interview",
        element: <InterviewLayout />,
        children: [
          {
            path: ":id",
            element: <InterviewPage />,
          },
          {
            path: ":id/feedback",
            element: <AnalyticsPage />,
          },
          {
            path: "sessions/:id",
            element: <AnalyticsPage />,
          },
        ]
      },
      // auth routes
      {
        path: "auth",
        element: <AuthLayout />,
        children: [
          {
            path: "signin",
            element: <SignInPage />,
          },
          {
            path: "signup",
            element: <SignUpPage />,
          },
        ],
      },
      {
        path: "*",
        element: <NotFoundPage />,
      }
    ]
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  // {/* auth setup */ }
  < ClerkProvider
    publishableKey={PUBLISHABLE_KEY}
    afterSignOutUrl="/"
    signInForceRedirectUrl="/dashboard"
    signUpForceRedirectUrl="/dashboard"
    signInUrl="/auth/signin"
    signUpUrl="/auth/signup"
  >
    <RouterProvider router={router} />
  </ ClerkProvider>
  // </React.StrictMode>,
)