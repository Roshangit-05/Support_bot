import React, { useState } from 'react';
import { X, BookOpen, ShieldCheck, Truck, RotateCcw, Lock, ChevronDown, HelpCircle, ArrowRight } from 'lucide-react';
import { OFFICIAL_POLICIES } from '../data/mockData';
import { PolicyTopic } from '../types';

interface PolicyGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAskAboutPolicy: (policyTitle: string) => void;
}

export const PolicyGuideModal: React.FC<PolicyGuideModalProps> = ({
  isOpen,
  onClose,
  onAskAboutPolicy
}) => {
  const [activeTab, setActiveTab] = useState(OFFICIAL_POLICIES[0].id);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const currentPolicy = OFFICIAL_POLICIES.find(p => p.id === activeTab) || OFFICIAL_POLICIES[0];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Returns':
        return <RotateCcw className="w-4 h-4 text-emerald-500" />;
      case 'Shipping':
        return <Truck className="w-4 h-4 text-blue-500" />;
      case 'Warranty':
        return <ShieldCheck className="w-4 h-4 text-amber-500" />;
      case 'Accounts':
        return <Lock className="w-4 h-4 text-purple-500" />;
      default:
        return <BookOpen className="w-4 h-4 text-indigo-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-900 dark:text-slate-100 text-base">
                Official Company Support Policies
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Verified guidelines enforced by the AI Assistant & human support
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

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto bg-slate-50/50 dark:bg-slate-900/50 p-1">
          {OFFICIAL_POLICIES.map(policy => {
            const isActive = policy.id === activeTab;
            return (
              <button
                key={policy.id}
                onClick={() => {
                  setActiveTab(policy.id);
                  setOpenFaqIndex(null);
                }}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-2xs font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                {getCategoryIcon(policy.category)}
                <span>{policy.title.split(' ')[0]} Policy</span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div>
            <div className="flex items-center gap-2">
              {getCategoryIcon(currentPolicy.category)}
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {currentPolicy.title}
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 font-medium bg-slate-100/70 dark:bg-slate-800/70 p-2.5 rounded-lg border border-slate-200/60 dark:border-slate-700/60">
              {currentPolicy.summary}
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Key Policy Rules
            </h4>
            <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
              {currentPolicy.details.map((detail, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-white dark:bg-slate-800/40 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Frequently Asked Questions
            </h4>
            <div className="space-y-2">
              {currentPolicy.faq.map((faq, fIdx) => {
                const isOpen = openFaqIndex === fIdx;
                return (
                  <div
                    key={fIdx}
                    className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : fIdx)}
                      className="w-full flex items-center justify-between p-3 text-left text-xs font-semibold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <HelpCircle className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                        <span>{faq.question}</span>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isOpen && (
                      <div className="p-3 text-xs text-slate-600 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-900/40 border-t border-slate-100 dark:border-slate-800 leading-relaxed">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900">
          <button
            onClick={() => {
              onAskAboutPolicy(`Can you explain the details and rules of the ${currentPolicy.title}?`);
              onClose();
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-xs"
          >
            <span>Ask Assistant about this policy</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
