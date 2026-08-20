import React from 'react';
import { OrderInfo } from '../types';
import { Package, Truck, Calendar, DollarSign, ShieldCheck, ArrowRight, RotateCcw } from 'lucide-react';

interface OrderReferenceCardProps {
  order: OrderInfo;
  onSelectAction?: (actionText: string) => void;
}

export const OrderReferenceCard: React.FC<OrderReferenceCardProps> = ({ order, onSelectAction }) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'In Transit':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200';
      case 'Delivered':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200';
      case 'Processing':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-amber-200';
      case 'Cancelled':
      case 'Returned':
        return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800/90 rounded-xl border border-slate-200 dark:border-slate-700 p-4 my-3 shadow-xs max-w-xl">
      <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-700/60">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-slate-900 dark:text-slate-100">Order #{order.id}</span>
              <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${getStatusBadge(order.status)}`}>
                {order.status}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Customer: {order.customerName}</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">${order.paidAmount.toFixed(2)}</span>
          <p className="text-[11px] text-slate-400">Paid Total</p>
        </div>
      </div>

      <div className="py-2.5 space-y-2 text-xs text-slate-600 dark:text-slate-300">
        <div className="font-medium text-slate-800 dark:text-slate-200">
          📦 {order.item}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
            <Truck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Carrier: <strong className="text-slate-700 dark:text-slate-200">{order.carrier}</strong></span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>ETA: <strong className="text-slate-700 dark:text-slate-200">{order.estimatedDelivery}</strong></span>
          </div>
        </div>

        {order.trackingNumber && order.trackingNumber !== 'Pending fulfillment' && (
          <div className="text-[11px] bg-slate-50 dark:bg-slate-900/60 p-2 rounded border border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400">
            Tracking ID: <code className="font-mono text-indigo-600 dark:text-indigo-400 select-all">{order.trackingNumber}</code>
          </div>
        )}

        <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 dark:text-emerald-400 pt-0.5">
          <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
          <span>{order.returnStatus}</span>
        </div>
      </div>

      {onSelectAction && (
        <div className="flex flex-wrap gap-2 pt-2.5 border-t border-slate-100 dark:border-slate-700/60">
          <button
            onClick={() => onSelectAction(`I have a question about return policy for order #${order.id}`)}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            Return Item
          </button>
          <button
            onClick={() => onSelectAction(`Can you give me the latest tracking update for order #${order.id}?`)}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded transition-colors"
          >
            <Truck className="w-3 h-3" />
            Track Package
          </button>
        </div>
      )}
    </div>
  );
};
