import React, { useState, useEffect, useRef } from 'react';
import { Message, OrderInfo, EscalationTicket } from './types';
import { INITIAL_GREETING_MESSAGE, VERIFIED_ORDERS } from './data/mockData';
import { ChatHeader } from './components/ChatHeader';
import { ChatMessageList } from './components/ChatMessageList';
import { ChatInput } from './components/ChatInput';
import { OrderLookupModal } from './components/OrderLookupModal';
import { PolicyGuideModal } from './components/PolicyGuideModal';
import { TroubleshootingWizardModal } from './components/TroubleshootingWizardModal';
import { EscalationModal } from './components/EscalationModal';
import { EscalationsListModal } from './components/EscalationsListModal';
import { Sparkles, ThumbsUp, ThumbsDown, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_GREETING_MESSAGE]);
  const [activeOrderId, setActiveOrderId] = useState<string>('ORD-8829');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Modals state
  const [isOrderLookupOpen, setIsOrderLookupOpen] = useState<boolean>(false);
  const [isPoliciesOpen, setIsPoliciesOpen] = useState<boolean>(false);
  const [isTroubleshootingOpen, setIsTroubleshootingOpen] = useState<boolean>(false);
  const [isEscalationModalOpen, setIsEscalationModalOpen] = useState<boolean>(false);
  const [isEscalationsListOpen, setIsEscalationsListOpen] = useState<boolean>(false);
  const [escalationSummary, setEscalationSummary] = useState<string>('');
  
  // Escalations tickets state
  const [escalations, setEscalations] = useState<EscalationTicket[]>([]);
  const [csatSubmitted, setCsatSubmitted] = useState<boolean | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Handle sending a message
  const handleSendMessage = async (text: string) => {
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages,
          activeOrderId: activeOrderId || undefined
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();

      const assistantMsg: Message = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: data.text || 'I am here to help you resolve your issue. Could you please provide additional details?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        flasStage: data.flasStage || 'Solve',
        troubleshootingSteps: data.troubleshootingSteps || [],
        suggestedReplies: data.suggestedReplies || [],
        orderReference: data.orderReference,
        isEscalationOffer: data.isEscalationOffer
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      const fallbackMsg: Message = {
        id: `assistant-fallback-${Date.now()}`,
        sender: 'assistant',
        text: "I apologize, but I encountered a temporary connection issue. Please feel free to retry your question, or look up verified policies in our Policy Center above.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        flasStage: 'Solve',
        suggestedReplies: ['Try again', 'View Policy Guide', 'Escalate to Human Agent']
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Open escalation modal with prefilled summary
  const handleRequestEscalation = (reason?: string) => {
    setEscalationSummary(reason || 'Customer requested human escalation after FLAS troubleshooting.');
    setIsEscalationModalOpen(true);
  };

  // Handle escalation ticket submission
  const handleSubmitEscalation = async (ticketData: Partial<EscalationTicket>) => {
    try {
      const res = await fetch('/api/escalate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ticketData)
      });
      const data = await res.json();
      if (data.ticket) {
        setEscalations(prev => [data.ticket, ...prev]);

        // Add a system notification message into the chat
        const sysMsg: Message = {
          id: `sys-${Date.now()}`,
          sender: 'system',
          text: `Escalation Ticket #${data.ticket.id} created successfully! Assigned to Tier-2 Specialist (Est. wait: ${data.ticket.estimatedWaitMinutes} mins).`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        const assistFollowup: Message = {
          id: `assist-${Date.now()}`,
          sender: 'assistant',
          text: `I have queued your escalation ticket **#${data.ticket.id}** with our Senior Specialist Team.

* **Priority:** ${data.ticket.priority}
* **Assigned Specialist:** ${data.ticket.assignedAgent}
* **Estimated Wait Time:** ~${data.ticket.estimatedWaitMinutes} minutes

A human specialist will reach out to **${data.ticket.customerEmail}**. In the meantime, is there anything else I can help you with?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          flasStage: 'Escalate',
          suggestedReplies: ['View Escalation Queue', 'Check another order', 'Return to main menu']
        };

        setMessages(prev => [...prev, sysMsg, assistFollowup]);
      }
    } catch (err) {
      console.error('Failed to submit escalation:', err);
    }
  };

  // Reset conversation
  const handleResetChat = () => {
    setMessages([
      {
        ...INITIAL_GREETING_MESSAGE,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setCsatSubmitted(null);
  };

  // Handle order selection from lookup modal
  const handleSelectOrderForChat = (order: OrderInfo, prompt: string) => {
    setActiveOrderId(order.id);
    handleSendMessage(prompt);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans antialiased overflow-hidden">
      
      {/* Top Application Header */}
      <ChatHeader
        activeOrderId={activeOrderId}
        onSelectOrderId={(id) => {
          setActiveOrderId(id);
          if (id) {
            const ord = VERIFIED_ORDERS[id];
            if (ord) {
              setMessages(prev => [
                ...prev,
                {
                  id: `sys-${Date.now()}`,
                  sender: 'system',
                  text: `Switched active order context to #${ord.id} (${ord.customerName} - ${ord.item})`,
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }
              ]);
            }
          }
        }}
        onOpenOrderLookup={() => setIsOrderLookupOpen(true)}
        onOpenPolicies={() => setIsPoliciesOpen(true)}
        onOpenTroubleshooting={() => setIsTroubleshootingOpen(true)}
        onOpenEscalations={() => setIsEscalationsListOpen(true)}
        onResetChat={handleResetChat}
        escalationCount={escalations.length}
      />

      {/* Main Chat Stream Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <ChatMessageList
          messages={messages}
          isLoading={isLoading}
          onSelectSuggestion={handleSendMessage}
          onRequestEscalation={handleRequestEscalation}
          chatEndRef={chatEndRef}
        />

        {/* CSAT Quick Rating Bar at bottom of chat */}
        {messages.length > 2 && csatSubmitted === null && (
          <div className="bg-white/80 dark:bg-slate-900/80 border-t border-slate-200/80 dark:border-slate-800/80 px-4 py-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 max-w-4xl w-full mx-auto backdrop-blur-xs">
            <span className="flex items-center gap-1.5 text-[11px]">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Was this response helpful?</span>
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCsatSubmitted(true)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 dark:bg-slate-800 dark:hover:bg-emerald-950/60 dark:hover:text-emerald-300 transition-colors text-[11px] font-medium"
              >
                <ThumbsUp className="w-3 h-3" />
                <span>Yes, resolved</span>
              </button>
              <button
                onClick={() => {
                  setCsatSubmitted(false);
                  handleRequestEscalation("Customer indicated issue was not resolved via feedback prompt");
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 hover:bg-rose-50 hover:text-rose-700 dark:bg-slate-800 dark:hover:bg-rose-950/60 dark:hover:text-rose-300 transition-colors text-[11px] font-medium"
              >
                <ThumbsDown className="w-3 h-3" />
                <span>Need Human Help</span>
              </button>
            </div>
          </div>
        )}

        {csatSubmitted === true && (
          <div className="bg-emerald-50 dark:bg-emerald-950/40 border-t border-emerald-200 dark:border-emerald-800/50 px-4 py-1.5 text-center text-xs text-emerald-800 dark:text-emerald-300 flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Thank you for your feedback! Glad we could resolve your question.</span>
          </div>
        )}

        {/* Input Bar */}
        <ChatInput
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          onOpenOrderLookup={() => setIsOrderLookupOpen(true)}
        />
      </main>

      {/* Modals & Diagnostic Drawers */}
      <OrderLookupModal
        isOpen={isOrderLookupOpen}
        onClose={() => setIsOrderLookupOpen(false)}
        onSelectOrderForChat={handleSelectOrderForChat}
      />

      <PolicyGuideModal
        isOpen={isPoliciesOpen}
        onClose={() => setIsPoliciesOpen(false)}
        onAskAboutPolicy={(policyTitle) => handleSendMessage(policyTitle)}
      />

      <TroubleshootingWizardModal
        isOpen={isTroubleshootingOpen}
        onClose={() => setIsTroubleshootingOpen(false)}
        onLaunchInChat={(guideTitle, query) => handleSendMessage(query)}
        onRequestEscalation={handleRequestEscalation}
      />

      <EscalationModal
        isOpen={isEscalationModalOpen}
        onClose={() => setIsEscalationModalOpen(false)}
        onSubmitEscalation={handleSubmitEscalation}
        activeOrderId={activeOrderId}
        initialSummary={escalationSummary}
      />

      <EscalationsListModal
        isOpen={isEscalationsListOpen}
        onClose={() => setIsEscalationsListOpen(false)}
        tickets={escalations}
        onOpenNewEscalation={() => setIsEscalationModalOpen(true)}
      />

    </div>
  );
}
