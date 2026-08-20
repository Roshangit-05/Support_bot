import React, { useState } from 'react';
import { X, UserCheck, ShieldAlert, Clock, CheckCircle2, AlertTriangle, Send } from 'lucide-react';
import { EscalationTicket } from '../types';

interface EscalationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitEscalation: (ticketData: Partial<EscalationTicket>) => void;
  activeOrderId?: string;
  initialSummary?: string;
}

export const EscalationModal: React.FC<EscalationModalProps> = ({
  isOpen,
  onClose,
  onSubmitEscalation,
  activeOrderId = '',
  initialSummary = ''
}) => {
  const [customerName, setCustomerName] = useState('Alex Chen');
  const [customerEmail, setCustomerEmail] = useState('alex.chen@example.com');
  const [orderId, setOrderId] = useState(activeOrderId || '');
  const [category, setCategory] = useState<EscalationTicket['category']>('Technical Support');
  const [priority, setPriority] = useState<EscalationTicket['priority']>('High');
  const [summary, setSummary] = useState(initialSummary || 'AI FLAS troubleshooting attempted; customer requests Tier-2 human specialist support.');
  const [flasNotes, setFlasNotes] = useState('Device power cycle and reset completed without resolution. Hardware RMA or carrier trace required.');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      onSubmitEscalation({
        customerName,
        customerEmail,
        orderId: orderId || 'N/A',
        category,
        priority,
        summary,
        flasNotes,
        troubleshootingAttempted: [
          'FLAS diagnostic empathy & issue listening',
          'Clarifying questions regarding symptoms',
          'Standard power cycle & reset protocol'
        ]
      });
      setIsSubmitting(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-900 dark:text-slate-100 text-base">
                Escalate to Human Support Specialist
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Tier-2 Agent Queue • Estimated Wait: 2-4 minutes
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          
          <div className="p-3 bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200/80 dark:border-purple-800/40 rounded-xl text-purple-900 dark:text-purple-200 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">FLAS Escalation Guarantee</p>
              <p className="text-[11px] opacity-90 mt-0.5">
                All previous troubleshooting steps and chat context are bundled so you will not need to repeat yourself to our specialist.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Your Full Name
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Order ID (Optional)
              </label>
              <input
                type="text"
                value={orderId}
                placeholder="e.g. ORD-8829"
                onChange={(e) => setOrderId(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-purple-500 focus:outline-hidden cursor-pointer"
              >
                <option value="Technical Support">Technical Support</option>
                <option value="Returns">Returns & Refunds</option>
                <option value="Shipping & Delivery">Shipping & Delivery</option>
                <option value="Billing">Billing & Charges</option>
                <option value="Account Security">Account Security</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-purple-500 focus:outline-hidden cursor-pointer"
              >
                <option value="Normal">Normal (15m callback)</option>
                <option value="High">High (5m priority)</option>
                <option value="Urgent">Urgent (Immediate)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Issue Summary
            </label>
            <textarea
              rows={2}
              required
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-purple-500 focus:outline-hidden resize-none"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              FLAS Diagnostic Context / Steps Tried
            </label>
            <textarea
              rows={2}
              value={flasNotes}
              onChange={(e) => setFlasNotes(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-purple-500 focus:outline-hidden resize-none text-[11px]"
            />
          </div>

          {/* Modal Footer */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Assigned to Tier-2 Queue</span>
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-1.5 text-xs font-medium bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-xs disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Creating Ticket...' : 'Submit Escalation'}</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
