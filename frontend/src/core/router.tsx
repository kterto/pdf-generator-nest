import { createBrowserRouter } from "react-router-dom";
import OnBoardingPage from "../presentation/pages/OnBoardingPage";
import LoginPage from "../presentation/pages/LoginPage";
import SignUpPage from "../presentation/pages/SignUpPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <OnBoardingPage />,
  },
  { path: "/login", element: <LoginPage /> },
  { path: "/sign-up", element: <SignUpPage /> },
]);

export default router;
