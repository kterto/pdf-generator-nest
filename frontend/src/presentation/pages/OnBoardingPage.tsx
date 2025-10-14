import { LogIn, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function OnboardingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="h-20 w-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/50">
              <svg
                className="h-10 w-10 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Occurrence Manager
          </h1>
          <p className="text-slate-400 text-lg">
            Track and manage your occurrences efficiently
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => navigate("/login")}
            className="w-full bg-white hover:bg-slate-50 text-slate-900 font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <LogIn className="h-5 w-5" />
            Sign In
          </button>

          <button
            onClick={() => navigate("/signup")}
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-all duration-200 shadow-lg shadow-blue-500/50 hover:shadow-xl hover:shadow-blue-500/60 transform hover:-translate-y-0.5"
          >
            <UserPlus className="h-5 w-5" />
            Create Account
          </button>
        </div>

        <div className="text-center pt-4">
          <p className="text-slate-500 text-sm">
            Manage your occurrences with ease and generate reports
          </p>
        </div>
      </div>
    </div>
  );
}
