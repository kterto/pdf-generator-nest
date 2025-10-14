import { useState } from "react";
import { useForm } from "react-hook-form";
import { Listbox } from "@headlessui/react";
import {
  Check,
  ChevronDown,
  Loader2,
  AlertCircle,
  Download,
} from "lucide-react";
import type { Occurrence, OccurrenceStatus } from "../../domain/types";

interface PDFReportFormData {
  startDate: string;
  endDate: string;
  onlyOwnOccurrences: boolean;
}

const statusOptions: {
  value: OccurrenceStatus | "all";
  label: string;
  color: string;
}[] = [
  { value: "all", label: "All Statuses", color: "bg-slate-500" },
  { value: "open", label: "Open", color: "bg-green-500" },
  { value: "closed", label: "Closed", color: "bg-slate-500" },
  { value: "abandoned", label: "Abandoned", color: "bg-red-500" },
];

export function PDFReportTab() {
  // const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<
    OccurrenceStatus | "all"
  >("all");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PDFReportFormData>({
    defaultValues: {
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      endDate: new Date().toISOString().split("T")[0],
      onlyOwnOccurrences: false,
    },
  });

  const onSubmit = async (data: PDFReportFormData) => {
    // if (!user) return;
    // setLoading(true);
    // setError(null);
    // try {
    //   let query = supabase
    //     .from('occurrences')
    //     .select('*')
    //     .gte('created_at', new Date(data.startDate).toISOString())
    //     .lte('created_at', new Date(data.endDate + 'T23:59:59').toISOString());
    //   if (selectedStatus !== 'all') {
    //     query = query.eq('status', selectedStatus);
    //   }
    //   if (data.onlyOwnOccurrences) {
    //     query = query.eq('user_id', user.id);
    //   }
    //   const { data: occurrences, error: fetchError } = await query.order('created_at', { ascending: false });
    //   if (fetchError) throw fetchError;
    //   generatePDFReport(occurrences || [], data);
    // } catch (err) {
    //   setError(err instanceof Error ? err.message : 'Failed to generate report');
    // } finally {
    //   setLoading(false);
    // }
  };

  //   const generatePDFReport = (
  //     occurrences: Occurrence[],
  //     filters: PDFReportFormData
  //   ) => {
  //     const reportContent = `
  // OCCURRENCE REPORT
  // =====================================

  // Report Generated: ${new Date().toLocaleString()}
  // Date Range: ${new Date(filters.startDate).toLocaleDateString()} - ${new Date(
  //       filters.endDate
  //     ).toLocaleDateString()}
  // Status Filter: ${
  //       selectedStatus === "all"
  //         ? "All Statuses"
  //         : selectedStatus.charAt(0).toUpperCase() + selectedStatus.slice(1)
  //     }
  // Own Occurrences Only: ${filters.onlyOwnOccurrences ? "Yes" : "No"}
  // Total Occurrences: ${occurrences.length}

  // =====================================

  // ${occurrences
  //   .map(
  //     (occ, index) => `
  // ${index + 1}. Occurrence ID: ${occ.id}
  //    Status: ${occ.status.toUpperCase()}
  //    Created: ${new Date(occ.created_at).toLocaleString()}
  //    Description: ${occ.description}
  //    -----------------------------------
  // `
  //   )
  //   .join("\n")}

  // End of Report
  // =====================================
  //     `.trim();

  //     const blob = new Blob([reportContent], { type: "text/plain" });
  //     const url = URL.createObjectURL(blob);
  //     const a = document.createElement("a");
  //     a.href = url;
  //     a.download = `occurrence-report-${
  //       new Date().toISOString().split("T")[0]
  //     }.txt`;
  //     document.body.appendChild(a);
  //     a.click();
  //     document.body.removeChild(a);
  //     URL.revokeObjectURL(url);
  //   };

  const selectedOption = statusOptions.find(
    (opt) => opt.value === selectedStatus
  )!;

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Start Date
            </label>
            <input
              {...register("startDate", { required: "Start date is required" })}
              type="date"
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              disabled={loading}
            />
            {errors.startDate && (
              <p className="mt-1 text-sm text-red-500">
                {errors.startDate.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              End Date
            </label>
            <input
              {...register("endDate", { required: "End date is required" })}
              type="date"
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              disabled={loading}
            />
            {errors.endDate && (
              <p className="mt-1 text-sm text-red-500">
                {errors.endDate.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Status Filter
          </label>
          <Listbox
            value={selectedStatus}
            onChange={setSelectedStatus}
            disabled={loading}
          >
            <div className="relative">
              <Listbox.Button className="relative w-full cursor-pointer bg-slate-900/50 border border-slate-600 rounded-lg py-3 pl-4 pr-10 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                <span className="flex items-center gap-3">
                  <span
                    className={`h-2 w-2 rounded-full ${selectedOption.color}`}
                  />
                  <span className="text-white">{selectedOption.label}</span>
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <ChevronDown className="h-5 w-5 text-slate-400" />
                </span>
              </Listbox.Button>

              <Listbox.Options className="absolute z-10 mt-2 w-full bg-slate-800 border border-slate-600 rounded-lg shadow-xl max-h-60 overflow-auto focus:outline-none">
                {statusOptions.map((option) => (
                  <Listbox.Option
                    key={option.value}
                    value={option.value}
                    className={({ active }) =>
                      `relative cursor-pointer select-none py-3 pl-10 pr-4 transition-colors ${
                        active ? "bg-slate-700 text-white" : "text-slate-300"
                      }`
                    }
                  >
                    {({ selected }) => (
                      <>
                        <span className="flex items-center gap-3">
                          <span
                            className={`h-2 w-2 rounded-full ${option.color}`}
                          />
                          <span
                            className={
                              selected ? "font-semibold" : "font-normal"
                            }
                          >
                            {option.label}
                          </span>
                        </span>
                        {selected && (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-500">
                            <Check className="h-4 w-4" />
                          </span>
                        )}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </div>
          </Listbox>
        </div>

        <div className="flex items-center gap-3 p-4 bg-slate-900/50 border border-slate-600 rounded-lg">
          <input
            {...register("onlyOwnOccurrences")}
            type="checkbox"
            id="onlyOwn"
            className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 transition-colors cursor-pointer"
            disabled={loading}
          />
          <label
            htmlFor="onlyOwn"
            className="text-slate-300 text-sm cursor-pointer select-none"
          >
            Only include occurrences I created
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:from-slate-600 disabled:to-slate-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 shadow-lg shadow-blue-500/50 hover:shadow-xl disabled:shadow-none transform hover:-translate-y-0.5 disabled:transform-none"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Generating Report...
            </>
          ) : (
            <>
              <Download className="h-5 w-5" />
              Generate Report
            </>
          )}
        </button>
      </form>
    </div>
  );
}
