import { useState } from "react";
import { useForm } from "react-hook-form";
import { Listbox } from "@headlessui/react";
import {
  Check,
  ChevronDown,
  Loader2,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import type { OccurrenceStatus } from "../../domain/types";
// import { supabase, OccurrenceStatus } from '../lib/supabase';
// import { useAuth } from '../contexts/AuthContext';

interface CreateOccurrenceFormData {
  description: string;
}

const statusOptions: {
  value: OccurrenceStatus;
  label: string;
  color: string;
}[] = [
  { value: "open", label: "Open", color: "bg-green-500" },
  { value: "closed", label: "Closed", color: "bg-slate-500" },
  { value: "abandoned", label: "Abandoned", color: "bg-red-500" },
];

export function CreateOccurrenceTab() {
  // const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [selectedStatus, setSelectedStatus] =
    useState<OccurrenceStatus>("open");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateOccurrenceFormData>();

  const onSubmit = async (data: CreateOccurrenceFormData) => {
    // if (!user) return;
    // setLoading(true);
    // setError(null);
    // setSuccess(false);
    // try {
    //   const { error: insertError } = await supabase
    //     .from('occurrences')
    //     .insert({
    //       user_id: user.id,
    //       description: data.description,
    //       status: selectedStatus,
    //     });
    //   if (insertError) throw insertError;
    //   setSuccess(true);
    //   reset();
    //   setSelectedStatus('open');
    //   setTimeout(() => setSuccess(false), 3000);
    // } catch (err) {
    //   setError(err instanceof Error ? err.message : 'Failed to create occurrence');
    // } finally {
    //   setLoading(false);
    // }
  };

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

      {success && (
        <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-4 flex items-start gap-3">
          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
          <p className="text-green-500 text-sm">
            Occurrence created successfully!
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Description
          </label>
          <textarea
            {...register("description", {
              required: "Description is required",
            })}
            rows={4}
            className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
            placeholder="Describe the occurrence..."
            disabled={loading}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-500">
              {errors.description.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Status
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

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:from-slate-600 disabled:to-slate-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 shadow-lg shadow-blue-500/50 hover:shadow-xl disabled:shadow-none transform hover:-translate-y-0.5 disabled:transform-none"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Creating...
            </>
          ) : (
            "Create Occurrence"
          )}
        </button>
      </form>
    </div>
  );
}
