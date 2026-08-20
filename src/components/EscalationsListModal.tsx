import React from 'react';
import { X, UserCheck, Clock, ShieldCheck, CheckCircle2, AlertCircle, Headphones } from 'lucide-react';
import { EscalationTicket } from '../types';

interface EscalationsListModalProps {
  isOpen: boolean;
  onClose: () => void;
  tickets: EscalationTicket[];
  onOpenNewEscalation: () => void;
}

export const EscalationsListModal: React.FC<EscalationsListModalProps> = ({
  isOpen,
  onClose,
  tickets,
  onOpenNewEscalation
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-900 dark:text-slate-100 text-base">
                Human Support Escalation Queue
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Track status of tickets routed to Tier-2 specialist agents
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

        {/* Tickets List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {tickets.length === 0 ? (
            <div className="text-center py-10 space-y-3">
              <div className="w-12 h-12 rounded-full bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto">
                <Headphones className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  No Active Escalations
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
                  Our AI Assistant resolves over 90% of issues directly using the FLAS framework. If you need human assistance, you can submit a ticket anytime.
                </p>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onOpenNewEscalation();
                }}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-xs"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Create Human Escalation Ticket</span>
              </button>
            </div>
          ) : (
            tickets.map(ticket => (
              <div
                key={ticket.id}
                className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl p-4 space-y-2.5 shadow-2xs"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                        {ticket.id}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 font-medium">
                        {ticket.status}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 font-medium">
                        Priority: {ticket.priority}
                      </span>
                    </div>
                    <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1">
                      {ticket.category} • Order: {ticket.orderId}
                    </h4>
                  </div>
                  <div className="text-right text-xs">
                    <span className="text-purple-600 dark:text-purple-400 font-semibold flex items-center gap-1 justify-end">
                      <Clock className="w-3.5 h-3.5" />
                      <span>~{ticket.estimatedWaitMinutes} min wait</span>
                    </span>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {new Date(ticket.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 leading-relaxed">
                  <strong>Issue:</strong> {ticket.summary}
                </p>

                {ticket.flasNotes && (
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    <span className="font-medium text-slate-700 dark:text-slate-300">FLAS Diagnostic: </span>
                    {ticket.flasNotes}
                  </div>
                )}

                <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>Assigned Agent: <strong className="text-slate-700 dark:text-slate-200">{ticket.assignedAgent || 'Tier-2 Specialist'}</strong></span>
                  <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>In Queue</span>
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900">
          <button
            onClick={() => {
              onClose();
              onOpenNewEscalation();
            }}
            className="text-xs font-medium text-purple-600 dark:text-purple-400 hover:underline"
          >
            + Create another ticket
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
