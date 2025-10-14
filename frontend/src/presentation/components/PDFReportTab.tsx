import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import {
  Check,
  ChevronDown,
  Loader2,
  AlertCircle,
  Download,
} from "lucide-react";
import type { OccurrenceStatus } from "../../domain/types";
import { useAuth } from "../../domain/AuthContext";
import usePDFReportWithQueue from "../../domain/usePDFReportWithQueue";

interface PDFReportFormData {
  startDate: string;
  endDate: string;
  onlyOwnOccurrences: boolean;
  status: OccurrenceStatus;
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
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { startTask } = usePDFReportWithQueue();

  const {
    register,
    handleSubmit,
    control,
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
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      await startTask.mutateAsync(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to generate report"
      );
      startTask.reset();
    } finally {
      setLoading(false);
      startTask.reset();
    }
  };

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
          <Controller
            name="status"
            control={control}
            render={({ field }) => {
              const selectedOption =
                statusOptions.find((opt) => opt.value === field.value) ??
                statusOptions[0];
              return (
                <Listbox
                  value={field.value}
                  onChange={field.onChange}
                  disabled={loading}
                >
                  <div className="relative">
                    <ListboxButton className="relative w-full cursor-pointer bg-slate-900/50 border border-slate-600 rounded-lg py-3 pl-4 pr-10 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                      <span className="flex items-center gap-3">
                        <span
                          className={`h-2 w-2 rounded-full ${selectedOption.color}`}
                        />
                        <span className="text-white">
                          {selectedOption.label}
                        </span>
                      </span>
                      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <ChevronDown className="h-5 w-5 text-slate-400" />
                      </span>
                    </ListboxButton>

                    <ListboxOptions className="absolute z-10 mt-2 w-full bg-slate-800 border border-slate-600 rounded-lg shadow-xl max-h-60 overflow-auto focus:outline-none">
                      {statusOptions.map((option) => (
                        <ListboxOption
                          key={option.value}
                          value={option.value}
                          className={({ active }) =>
                            `relative cursor-pointer select-none py-3 pl-10 pr-4 transition-colors ${
                              active
                                ? "bg-slate-700 text-white"
                                : "text-slate-300"
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
                        </ListboxOption>
                      ))}
                    </ListboxOptions>
                  </div>
                </Listbox>
              );
            }}
          />
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
