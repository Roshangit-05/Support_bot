export interface Message {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  flasStage?: 'Feel' | 'Listen' | 'Ask' | 'Solve' | 'Escalate';
  troubleshootingSteps?: string[];
  suggestedReplies?: string[];
  orderReference?: OrderInfo;
  isEscalationOffer?: boolean;
  ticketId?: string;
}

export interface OrderInfo {
  id: string;
  customerName: string;
  customerEmail: string;
  item: string;
  itemImage?: string;
  placedDate: string;
  status: 'Processing' | 'In Transit' | 'Delivered' | 'Cancelled' | 'Returned';
  carrier: string;
  trackingNumber: string;
  estimatedDelivery: string;
  deliveredDate?: string;
  paidAmount: number;
  returnStatus: string;
  serialNumber?: string;
}

export interface EscalationTicket {
  id: string;
  orderId?: string;
  customerName: string;
  customerEmail: string;
  category: 'Returns' | 'Technical Support' | 'Billing' | 'Shipping & Delivery' | 'Account Security' | 'Other';
  priority: 'Normal' | 'High' | 'Urgent';
  summary: string;
  flasNotes: string;
  troubleshootingAttempted: string[];
  status: 'Queued' | 'Assigned' | 'Resolved';
  createdAt: string;
  estimatedWaitMinutes: number;
  assignedAgent?: string;
}

export interface PolicyTopic {
  id: string;
  title: string;
  category: string;
  summary: string;
  details: string[];
  faq: { question: string; answer: string }[];
}

export interface TroubleshootingGuide {
  id: string;
  title: string;
  category: string;
  deviceOrIssue: string;
  steps: {
    stepNumber: number;
    instruction: string;
    detail: string;
    expectedOutcome: string;
  }[];
}
