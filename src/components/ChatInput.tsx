import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, CornerDownLeft, RotateCcw, HelpCircle, Package, RefreshCw } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  onOpenOrderLookup: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isLoading,
  onOpenOrderLookup
}) => {
  const [inputText, setInputText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [inputText]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = inputText.trim();
    if (!trimmed || isLoading) return;
    onSendMessage(trimmed);
    setInputText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const quickPrompts = [
    { label: '📦 Track Order #ORD-8829', query: 'Can you track my order #ORD-8829 and give me the delivery ETA?' },
    { label: '🔄 Return for #ORD-7411', query: 'I would like to start a return for order #ORD-7411.' },
    { label: '🎧 Fix Bluetooth audio', query: 'My AeroSound headphones are turning on but not playing any audio sound.' },
    { label: '🛡️ Check warranty coverage', query: 'What is covered under the 1-year limited warranty policy?' },
    { label: '👤 Speak with a human agent', query: 'I would like to escalate my issue and speak with a human support agent.' },
  ];

  return (
    <div className="bg-white/95 dark:bg-slate-900/95 border-t border-slate-200 dark:border-slate-800 p-4 sticky bottom-0 z-20">
      <div className="max-w-4xl mx-auto space-y-2.5">
        
        {/* Quick Suggestion Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          <span className="text-slate-400 text-[11px] shrink-0 font-medium mr-1">Quick Inquiries:</span>
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => onSendMessage(p.query)}
              disabled={isLoading}
              className="shrink-0 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950/60 dark:hover:text-indigo-300 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer disabled:opacity-50 text-[11px]"
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Input Form Box */}
        <form onSubmit={handleSubmit} className="relative flex items-end gap-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-2xl p-2 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent transition-all shadow-2xs">
          <textarea
            ref={textareaRef}
            rows={1}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your question about orders, returns, warranty, or troubleshooting..."
            disabled={isLoading}
            className="flex-1 bg-transparent border-0 resize-none text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden px-2 py-1.5 max-h-28"
          />

          <div className="flex items-center gap-1.5 pb-0.5">
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="w-9 h-9 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white flex items-center justify-center transition-colors shrink-0 shadow-xs cursor-pointer disabled:cursor-not-allowed"
              title="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Footer Rule Clarification & Badge */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 px-1">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>FLAS Framework Active (Feel • Listen • Ask • Solve)</span>
          </div>
          <span>Never invents policies or statuses • Real human escalation available</span>
        </div>

      </div>
    </div>
  );
};
