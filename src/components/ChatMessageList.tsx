import React from 'react';
import Markdown from 'react-markdown';
import { Message, OrderInfo } from '../types';
import { FLASExplanationBadge } from './FLASExplanationBadge';
import { OrderReferenceCard } from './OrderReferenceCard';
import { InteractiveTroubleshootingList } from './InteractiveTroubleshootingList';
import { Bot, User, UserCheck, Sparkles, Copy, Check, ShieldAlert } from 'lucide-react';

interface ChatMessageListProps {
  messages: Message[];
  isLoading: boolean;
  onSelectSuggestion: (text: string) => void;
  onRequestEscalation: (reason?: string) => void;
  chatEndRef: React.RefObject<HTMLDivElement | null>;
}

export const ChatMessageList: React.FC<ChatMessageListProps> = ({
  messages,
  isLoading,
  onSelectSuggestion,
  onRequestEscalation,
  chatEndRef
}) => {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 max-w-4xl w-full mx-auto">
      {messages.map((msg, index) => {
        const isAssistant = msg.sender === 'assistant';
        const isSystem = msg.sender === 'system';
        const isLastMessage = index === messages.length - 1;

        if (isSystem) {
          return (
            <div key={msg.id} className="flex items-center justify-center my-2">
              <div className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 shadow-2xs">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
                <span>{msg.text}</span>
              </div>
            </div>
          );
        }

        return (
          <div
            key={msg.id}
            className={`flex gap-3 items-start ${isAssistant ? 'justify-start' : 'justify-end'}`}
          >
            {isAssistant && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div className={`flex flex-col max-w-[88%] sm:max-w-[80%] ${isAssistant ? 'items-start' : 'items-end'}`}>
              {/* FLAS Stage Header for Assistant */}
              {isAssistant && msg.flasStage && (
                <FLASExplanationBadge stage={msg.flasStage} />
              )}

              {/* Message Bubble */}
              <div
                className={`relative px-4 py-3.5 rounded-2xl text-sm leading-relaxed ${
                  isAssistant
                    ? 'bg-white dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700/80 shadow-xs rounded-tl-sm'
                    : 'bg-indigo-600 text-white rounded-tr-sm shadow-xs'
                }`}
              >
                <div className="prose prose-sm dark:prose-invert max-w-none break-words [&>p]:mb-2 [&>p:last-child]:mb-0 [&>ul]:my-2 [&>ol]:my-2 [&>ul]:list-disc [&>ol]:list-decimal [&>ul]:pl-5 [&>ol]:pl-5">
                  <Markdown>{msg.text}</Markdown>
                </div>

                {/* Embedded Order Reference if any */}
                {msg.orderReference && (
                  <OrderReferenceCard
                    order={msg.orderReference}
                    onSelectAction={onSelectSuggestion}
                  />
                )}

                {/* Embedded Step-by-Step Interactive Troubleshooting if present */}
                {msg.troubleshootingSteps && msg.troubleshootingSteps.length > 0 && (
                  <InteractiveTroubleshootingList
                    steps={msg.troubleshootingSteps}
                    onReportResult={onSelectSuggestion}
                    onRequestEscalation={() => onRequestEscalation("Troubleshooting attempted via checklist")}
                  />
                )}

                {/* Escalation Offer Callout Box */}
                {msg.isEscalationOffer && (
                  <div className="mt-3 p-3 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/50 rounded-xl text-xs space-y-2">
                    <div className="flex items-center gap-1.5 font-semibold text-purple-900 dark:text-purple-200">
                      <UserCheck className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      <span>Ready for Human Support Escalation</span>
                    </div>
                    <p className="text-purple-800 dark:text-purple-300">
                      Our Tier-2 specialist queue is available. We can package your order details, diagnostics, and chat history for a fast handoff.
                    </p>
                    <button
                      onClick={() => onRequestEscalation("Customer requested human escalation after AI consultation")}
                      className="w-full sm:w-auto px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Connect with Human Agent</span>
                    </button>
                  </div>
                )}

                {/* Copy Button & Timestamp */}
                <div className={`flex items-center justify-between gap-3 mt-2 text-[10px] ${isAssistant ? 'text-slate-400' : 'text-indigo-200'}`}>
                  <span>{msg.timestamp}</span>
                  {isAssistant && (
                    <button
                      onClick={() => copyToClipboard(msg.id, msg.text)}
                      className="hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded transition-colors"
                      title="Copy message"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-3 h-3 text-emerald-500" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Suggested Follow-up Quick Replies (only on the latest assistant message) */}
              {isAssistant && isLastMessage && msg.suggestedReplies && msg.suggestedReplies.length > 0 && !isLoading && (
                <div className="flex flex-wrap gap-1.5 mt-2.5 max-w-full">
                  {msg.suggestedReplies.map((suggestion, sIdx) => (
                    <button
                      key={sIdx}
                      onClick={() => onSelectSuggestion(suggestion)}
                      className="text-xs px-2.5 py-1 rounded-full bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300 dark:bg-slate-800 dark:hover:bg-indigo-950/50 dark:hover:text-indigo-300 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 transition-colors text-left"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {!isAssistant && (
              <div className="w-8 h-8 rounded-full bg-slate-800 dark:bg-slate-700 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        );
      })}

      {/* Loading state indicator */}
      {isLoading && (
        <div className="flex gap-3 items-start">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center shrink-0 shadow-xs animate-pulse">
            <Bot className="w-4 h-4" />
          </div>
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl rounded-tl-sm px-4 py-3 shadow-xs">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="inline-block w-2 h-2 rounded-full bg-indigo-600 animate-ping" />
              <span>Analyzing with FLAS framework & verifying policies...</span>
            </div>
          </div>
        </div>
      )}

      <div ref={chatEndRef} />
    </div>
  );
};
