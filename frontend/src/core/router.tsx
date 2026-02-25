import { createBrowserRouter } from "react-router-dom";
import { OnboardingPage } from "../presentation/pages/OnBoardingPage";
import { LoginPage } from "../presentation/pages/LoginPage";
import { SignUpPage } from "../presentation/pages/SignUpPage";
import { OccurrencePage } from "../presentation/pages/OccurrencePage";
import { AuthProvider } from "../domain/AuthContext";

const router = createBrowserRouter([
  {
    path: "/",
    element: <OnboardingPage />,
  },
  {
    path: "/login",
    element: (
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    ),
  },
  {
    path: "/signup",
    element: (
      <AuthProvider>
        <SignUpPage />
      </AuthProvider>
    ),
  },
  {
    path: "/occurrence",
    element: (
      <AuthProvider>
        <OccurrencePage />
      </AuthProvider>
    ),
  },
]);

export default router;
