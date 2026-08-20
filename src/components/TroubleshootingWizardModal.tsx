import React, { useState } from 'react';
import { X, Wrench, CheckCircle2, ChevronRight, ArrowLeft, RotateCcw, AlertTriangle, UserCheck } from 'lucide-react';
import { TROUBLESHOOTING_GUIDES } from '../data/mockData';
import { TroubleshootingGuide } from '../types';

interface TroubleshootingWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchInChat: (guideTitle: string, query: string) => void;
  onRequestEscalation: (reason: string) => void;
}

export const TroubleshootingWizardModal: React.FC<TroubleshootingWizardModalProps> = ({
  isOpen,
  onClose,
  onLaunchInChat,
  onRequestEscalation
}) => {
  const [selectedGuide, setSelectedGuide] = useState<TroubleshootingGuide | null>(null);
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [stepOutcomes, setStepOutcomes] = useState<Record<number, 'success' | 'failed' | null>>({});

  if (!isOpen) return null;

  const handleSelectGuide = (guide: TroubleshootingGuide) => {
    setSelectedGuide(guide);
    setCurrentStepIdx(0);
    setStepOutcomes({});
  };

  const handleBackToList = () => {
    setSelectedGuide(null);
    setCurrentStepIdx(0);
    setStepOutcomes({});
  };

  const currentStep = selectedGuide ? selectedGuide.steps[currentStepIdx] : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-900 dark:text-slate-100 text-base">
                Interactive Diagnostic Wizard (FLAS Engine)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Step-by-step problem isolation before recommending human escalation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {!selectedGuide ? (
            <div className="space-y-3">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                Select an issue category below to start a guided diagnostic flow:
              </p>
              {TROUBLESHOOTING_GUIDES.map(guide => (
                <div
                  key={guide.id}
                  onClick={() => handleSelectGuide(guide)}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all cursor-pointer flex items-center justify-between gap-3 group"
                >
                  <div>
                    <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                      {guide.category}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-0.5 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {guide.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {guide.steps.length} diagnostic steps • Applies to {guide.deviceOrIssue}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all shrink-0" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <button
                onClick={handleBackToList}
                className="inline-flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Guides</span>
              </button>

              <div>
                <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase">
                  {selectedGuide.category}
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  {selectedGuide.title}
                </h3>
              </div>

              {/* Progress Steps Indicators */}
              <div className="flex items-center gap-1.5 py-1">
                {selectedGuide.steps.map((step, idx) => (
                  <div
                    key={idx}
                    onClick={() => setCurrentStepIdx(idx)}
                    className={`flex-1 h-2 rounded-full cursor-pointer transition-all ${
                      idx === currentStepIdx
                        ? 'bg-indigo-600 ring-2 ring-indigo-600/30'
                        : stepOutcomes[idx] === 'success'
                        ? 'bg-emerald-500'
                        : stepOutcomes[idx] === 'failed'
                        ? 'bg-rose-400'
                        : 'bg-slate-200 dark:bg-slate-700'
                    }`}
                  />
                ))}
              </div>

              {/* Current Active Step */}
              {currentStep && (
                <div className="bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded">
                      Step {currentStep.stepNumber} of {selectedGuide.steps.length}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      FLAS Step Resolution
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {currentStep.instruction}
                    </h4>
                    <p className="text-xs text-slate-700 dark:text-slate-300 mt-2 leading-relaxed bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200/80 dark:border-slate-800">
                      {currentStep.detail}
                    </p>
                  </div>

                  <div className="text-xs text-emerald-800 dark:text-emerald-300 bg-emerald-50/80 dark:bg-emerald-950/40 p-2.5 rounded-lg border border-emerald-200/60 dark:border-emerald-800/40">
                    <strong>Expected Result:</strong> {currentStep.expectedOutcome}
                  </div>

                  {/* Outcome Actions */}
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setStepOutcomes(prev => ({ ...prev, [currentStepIdx]: 'success' }));
                          if (currentStepIdx < selectedGuide.steps.length - 1) {
                            setCurrentStepIdx(currentStepIdx + 1);
                          }
                        }}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Step Succeeded</span>
                      </button>

                      <button
                        onClick={() => {
                          setStepOutcomes(prev => ({ ...prev, [currentStepIdx]: 'failed' }));
                          if (currentStepIdx < selectedGuide.steps.length - 1) {
                            setCurrentStepIdx(currentStepIdx + 1);
                          }
                        }}
                        className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-xs font-medium rounded-lg transition-colors"
                      >
                        <span>Step Failed</span>
                      </button>
                    </div>

                    {currentStepIdx === selectedGuide.steps.length - 1 && (
                      <button
                        onClick={() => {
                          onRequestEscalation(`Diagnostic wizard completed for ${selectedGuide.title}`);
                          onClose();
                        }}
                        className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 ml-auto"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Escalate to Human Agent</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900">
          {selectedGuide && (
            <button
              onClick={() => {
                onLaunchInChat(selectedGuide.title, `I am having trouble with ${selectedGuide.deviceOrIssue}. Please guide me step-by-step through resolving this.`);
                onClose();
              }}
              className="px-3 py-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 rounded-lg transition-colors"
            >
              Transfer Guide to Chat
            </button>
          )}
          <button
            onClick={onClose}
            className="ml-auto px-4 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
