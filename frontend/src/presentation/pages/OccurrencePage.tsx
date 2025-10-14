import { useState } from "react";
import { Tab } from "@headlessui/react";
import { LogOut, FileText, PlusCircle } from "lucide-react";

import { CreateOccurrenceTab } from "../components/CreateOccurrenceTab";
import { PDFReportTab } from "../components/PDFReportTab";

export function OccurrencePage() {
  // const { signOut, profile } = useAuth();
  const [selectedTab, setSelectedTab] = useState(0);

  const handleSignOut = async () => {
    try {
      // await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/50">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">
                Occurrence Manager
              </h1>
              {/* {profile && <p className="text-sm text-slate-400">Welcome, {profile.name}</p>} */}
              <p className="text-sm text-slate-400">Welcome, Kainã</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white rounded-lg transition-all duration-200"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-700 overflow-hidden">
          <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
            <Tab.List className="flex border-b border-slate-700">
              <Tab
                className={({ selected }) =>
                  `flex-1 px-6 py-4 text-sm font-medium transition-all duration-200 focus:outline-none ${
                    selected
                      ? "bg-slate-900/50 text-white border-b-2 border-blue-500"
                      : "text-slate-400 hover:text-slate-300 hover:bg-slate-900/30"
                  }`
                }
              >
                <span className="flex items-center justify-center gap-2">
                  <PlusCircle className="h-4 w-4" />
                  Create Occurrence
                </span>
              </Tab>
              <Tab
                className={({ selected }) =>
                  `flex-1 px-6 py-4 text-sm font-medium transition-all duration-200 focus:outline-none ${
                    selected
                      ? "bg-slate-900/50 text-white border-b-2 border-blue-500"
                      : "text-slate-400 hover:text-slate-300 hover:bg-slate-900/30"
                  }`
                }
              >
                <span className="flex items-center justify-center gap-2">
                  <FileText className="h-4 w-4" />
                  PDF Report
                </span>
              </Tab>
            </Tab.List>

            <Tab.Panels className="p-6">
              <Tab.Panel>
                <CreateOccurrenceTab />
              </Tab.Panel>
              <Tab.Panel>
                <PDFReportTab />
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </main>
    </div>
  );
}
