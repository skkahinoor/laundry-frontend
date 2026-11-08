import React from 'react';
import {
  Clock,
  Truck,
  Droplets,
  Flame,
  Sparkles,
  CheckCircle2,
  PackageCheck,
} from 'lucide-react';

const STAGES = [
  { id: 'placed', label: 'Placed', shortLabel: 'Placed', icon: Clock },
  { id: 'picked_up', label: 'Picked Up', shortLabel: 'Picked', icon: Truck },
  { id: 'washing', label: 'Washing', shortLabel: 'Wash', icon: Droplets },
  { id: 'ironing', label: 'Iron & QC', shortLabel: 'Iron', icon: Flame },
  { id: 'ready', label: 'Out for Delivery', shortLabel: 'Out/Ready', icon: Sparkles },
  { id: 'delivered', label: 'Delivered', shortLabel: 'Done', icon: PackageCheck },
];

export default function OrderProgressStepper({ stage = 'placed' }) {
  const currentIdx = STAGES.findIndex((s) => s.id === stage);
  const safeIdx = currentIdx >= 0 ? currentIdx : 0;
  const progressPercent = Math.round(((safeIdx + 1) / STAGES.length) * 100);

  return (
    <div className="w-full space-y-3">
      {/* Percentage Bar */}
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-slate-700 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-sky-600 animate-pulse" />
          Live Status: <span className="text-sky-700">{STAGES[safeIdx]?.label}</span>
        </span>
        <span className="font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
          {progressPercent}% Complete
        </span>
      </div>

      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-sky-500 via-blue-600 to-emerald-500 transition-all duration-500 rounded-full"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Stepper Nodes */}
      <div className="grid grid-cols-6 gap-1 pt-1">
        {STAGES.map((stg, idx) => {
          const Icon = stg.icon;
          const isCompleted = idx < safeIdx;
          const isCurrent = idx === safeIdx;
          const isUpcoming = idx > safeIdx;

          return (
            <div key={stg.id} className="flex flex-col items-center text-center">
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all ${
                  isCompleted
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : isCurrent
                    ? 'bg-sky-600 text-white ring-4 ring-sky-100 shadow-md scale-105'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                )}
              </div>
              <span
                className={`text-[8.5px] sm:text-[10px] font-bold mt-1.5 truncate max-w-full ${
                  isCurrent
                    ? 'text-sky-700'
                    : isCompleted
                    ? 'text-emerald-700'
                    : 'text-slate-400'
                }`}
              >
                <span className="sm:hidden">{stg.shortLabel}</span>
                <span className="hidden sm:inline">{stg.label}</span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

