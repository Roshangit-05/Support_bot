import React from 'react';
import { Bot, PackageSearch, BookOpen, Wrench, UserCheck, RotateCcw, ShieldCheck, Sparkles, ChevronDown } from 'lucide-react';
import { VERIFIED_ORDERS } from '../data/mockData';

interface ChatHeaderProps {
  activeOrderId: string;
  onSelectOrderId: (orderId: string) => void;
  onOpenOrderLookup: () => void;
  onOpenPolicies: () => void;
  onOpenTroubleshooting: () => void;
  onOpenEscalations: () => void;
  onResetChat: () => void;
  escalationCount: number;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  activeOrderId,
  onSelectOrderId,
  onOpenOrderLookup,
  onOpenPolicies,
  onOpenTroubleshooting,
  onOpenEscalations,
  onResetChat,
  escalationCount
}) => {
  return (
    <header className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-20 px-4 py-3">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Left: Brand & Status */}
        <div className="flex items-center justify-between w-full md:w-auto gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-violet-600 text-white flex items-center justify-center shadow-xs">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base tracking-tight">
                  ApexSupport
                </h1>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  AI Assistant Online
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                FLAS Support Engine • Policy-Grounded
              </p>
            </div>
          </div>

          {/* Reset button on mobile */}
          <button
            onClick={onResetChat}
            className="md:hidden p-1.5 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Start new conversation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Center: Active Order Picker */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs text-slate-500 dark:text-slate-400 shrink-0 hidden sm:inline">Active Context:</span>
          <select
            value={activeOrderId}
            onChange={(e) => onSelectOrderId(e.target.value)}
            className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 cursor-pointer w-full md:w-auto"
          >
            <option value="">General Support (No Order Selected)</option>
            {Object.values(VERIFIED_ORDERS).map(order => (
              <option key={order.id} value={order.id}>
                #{order.id} - {order.customerName} ({order.item.substring(0, 24)}...)
              </option>
            ))}
          </select>
        </div>

        {/* Right: Quick Tools Bar */}
        <div className="flex items-center gap-1.5 w-full md:w-auto justify-between md:justify-end overflow-x-auto">
          <button
            onClick={onOpenOrderLookup}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors shrink-0"
            title="Look up orders"
          >
            <PackageSearch className="w-3.5 h-3.5 text-indigo-500" />
            <span>Orders</span>
          </button>

          <button
            onClick={onOpenPolicies}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors shrink-0"
            title="View return and warranty policies"
          >
            <BookOpen className="w-3.5 h-3.5 text-blue-500" />
            <span>Policies</span>
          </button>

          <button
            onClick={onOpenTroubleshooting}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors shrink-0"
            title="Device & Shipping troubleshooting wizards"
          >
            <Wrench className="w-3.5 h-3.5 text-amber-500" />
            <span>Diagnostics</span>
          </button>

          <button
            onClick={onOpenEscalations}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-purple-700 dark:text-purple-300 bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/50 dark:hover:bg-purple-900/50 border border-purple-200 dark:border-purple-800/60 rounded-lg transition-colors shrink-0 relative"
            title="Escalations & Human Agent queue"
          >
            <UserCheck className="w-3.5 h-3.5 text-purple-600" />
            <span>Escalations</span>
            {escalationCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-purple-600 text-white text-[10px] flex items-center justify-center font-bold">
                {escalationCount}
              </span>
            )}
          </button>

          <button
            onClick={onResetChat}
            className="hidden md:inline-flex items-center gap-1 p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            title="Restart conversation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
};
