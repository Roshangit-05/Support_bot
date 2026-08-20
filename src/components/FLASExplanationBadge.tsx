import React from 'react';
import { HeartHandshake, Headphones, HelpCircle, CheckCircle2, UserCheck, Sparkles } from 'lucide-react';

interface FLASExplanationBadgeProps {
  stage?: 'Feel' | 'Listen' | 'Ask' | 'Solve' | 'Escalate';
  compact?: boolean;
}

export const FLASExplanationBadge: React.FC<FLASExplanationBadgeProps> = ({ stage, compact = false }) => {
  if (!stage) return null;

  const stageConfig = {
    Feel: {
      label: 'FLAS: Feel & Empathize',
      desc: 'Acknowledging feelings and validating customer experience',
      icon: HeartHandshake,
      color: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/50'
    },
    Listen: {
      label: 'FLAS: Listen & Learn',
      desc: 'Confirming core issue and key details',
      icon: Headphones,
      color: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/50'
    },
    Ask: {
      label: 'FLAS: Ask & Analyze',
      desc: 'Asking targeted clarifying questions for root-cause diagnosis',
      icon: HelpCircle,
      color: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/50'
    },
    Solve: {
      label: 'FLAS: Solve & Support',
      desc: 'Providing step-by-step troubleshooting & verified resolutions',
      icon: CheckCircle2,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/50'
    },
    Escalate: {
      label: 'Human Support Escalation',
      desc: 'Transitioning complex issue to Tier-2 human specialist',
      icon: UserCheck,
      color: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800/50'
    }
  };

  const config = stageConfig[stage] || stageConfig.Solve;
  const Icon = config.icon;

  if (compact) {
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${config.color}`}>
        <Icon className="w-3 h-3" />
        <span>{stage}</span>
      </span>
    );
  }

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${config.color} mb-2 shadow-xs`}>
      <Icon className="w-3.5 h-3.5 shrink-0" />
      <span className="font-semibold">{config.label}</span>
      <span className="opacity-70 text-[11px] hidden sm:inline">— {config.desc}</span>
    </div>
  );
};
