import React, { useState } from 'react';
import { Check, X, AlertCircle, Sparkles, UserCheck } from 'lucide-react';

interface InteractiveTroubleshootingListProps {
  steps: string[];
  onReportResult: (resultText: string) => void;
  onRequestEscalation: () => void;
}

export const InteractiveTroubleshootingList: React.FC<InteractiveTroubleshootingListProps> = ({
  steps,
  onReportResult,
  onRequestEscalation
}) => {
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});

  const toggleStep = (idx: number) => {
    setCompletedSteps(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const allCompleted = steps.length > 0 && steps.every((_, idx) => completedSteps[idx]);
  const completedCount = Object.values(completedSteps).filter(Boolean).length;

  return (
    <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl p-4 my-3 max-w-xl">
      <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-slate-200/80 dark:border-slate-700/60">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Interactive Troubleshooting Checklist</span>
        </div>
        <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
          {completedCount} of {steps.length} completed
        </span>
      </div>

      <div className="space-y-2">
        {steps.map((step, idx) => {
          const isDone = !!completedSteps[idx];
          return (
            <div
              key={idx}
              onClick={() => toggleStep(idx)}
              className={`flex items-start gap-2.5 p-2 rounded-lg text-xs cursor-pointer transition-colors ${
                isDone
                  ? 'bg-emerald-50/80 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200 border border-emerald-200/60 dark:border-emerald-800/40'
                  : 'bg-white dark:bg-slate-900/50 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/50 hover:bg-slate-100/60'
              }`}
            >
              <button
                type="button"
                className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center shrink-0 border transition-colors ${
                  isDone
                    ? 'bg-emerald-600 border-emerald-600 text-white'
                    : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                }`}
              >
                {isDone && <Check className="w-3 h-3 stroke-[3]" />}
              </button>
              <div className="flex-1">
                <span className="font-medium mr-1.5 text-slate-500 dark:text-slate-400">Step {idx + 1}:</span>
                <span className={isDone ? 'line-through opacity-85' : ''}>{step}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-3 pt-3 border-t border-slate-200/80 dark:border-slate-700/60 flex flex-wrap items-center justify-between gap-2">
        <button
          onClick={() => onReportResult("I tried all the troubleshooting steps, and the issue is now resolved! Thank you.")}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-lg transition-colors shadow-xs"
        >
          <Check className="w-3.5 h-3.5" />
          <span>It worked! (Resolved)</span>
        </button>

        <button
          onClick={() => onReportResult("I completed all troubleshooting steps, but the problem persists and is still not working.")}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-xs font-medium rounded-lg transition-colors"
        >
          <X className="w-3.5 h-3.5 text-rose-500" />
          <span>Still Not Working</span>
        </button>

        <button
          onClick={onRequestEscalation}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-purple-700 dark:text-purple-300 hover:bg-purple-100/60 dark:hover:bg-purple-950/50 text-xs font-medium rounded-lg transition-colors ml-auto"
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>Escalate to Human Agent</span>
        </button>
      </div>
    </div>
  );
};
