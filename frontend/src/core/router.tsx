import { createBrowserRouter } from "react-router-dom";
import { OnboardingPage } from "../presentation/pages/OnBoardingPage";
import { LoginPage } from "../presentation/pages/LoginPage";
import { SignUpPage } from "../presentation/pages/SignUpPage";
import { OccurrencePage } from "../presentation/pages/OccurrencePage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <OnboardingPage />,
  },
  { path: "/login", element: <LoginPage /> },
  { path: "/signup", element: <SignUpPage /> },
  { path: "/occurrence", element: <OccurrencePage /> },
]);

export default router;
