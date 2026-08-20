import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { VERIFIED_ORDERS, OFFICIAL_POLICIES, TROUBLESHOOTING_GUIDES } from "./src/data/mockData.ts";
import { generateKnowledgeBaseResponse } from "./src/utils/fallbackResponder.ts";

// Initialize Express
const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client Lazy Handler
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is not set. Using fallback assistant responses.");
    return null;
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

// In-memory Escalation Tickets Store
const escalationTickets: any[] = [];

// System instruction enforcing user's rules strictly + FLAS framework
const SYSTEM_INSTRUCTION = `
You are a professional customer support assistant for ApexSupport.
Your job is to help customers resolve questions about products, services, orders, accounts, returns, and general support.

### MANDATORY RULES:
1. **Be Polite and Concise**: Communicate warmly, empathetically, and clearly without unnecessary fluff.
2. **Ask Clarifying Questions When Necessary**: If the user's issue lacks critical details (e.g. order number, device model, specific error light/message, operating system), ask a targeted clarifying question before jumping to assumptions.
3. **Never Invent Policies, Order Statuses, or Refund Info**: Only state policies and order statuses provided in the VERIFIED KNOWLEDGE BASE below. If an order number is not in the database, clearly say that the order could not be located in our verified records and request them to verify the order number.
4. **If You Do Not Know the Answer, Clearly Say So**: State honestly what information is unavailable and offer to check or connect with a specialist.
5. **Provide Step-by-Step Troubleshooting When Appropriate**: When resolving technical or delivery issues, provide numbered, actionable, easy-to-follow steps with expected outcomes.
6. **Escalate Complex or Unresolved Issues to Human Support**: If troubleshooting fails, if an exception to policy is needed, or if the customer explicitly requests human agent intervention, offer escalation to our Tier-2 Human Support Team.
7. **Always Try to Solve the Customer's Problem Before Recommending Escalation Using the FLAS Framework**:
   - **F (Feel)**: Acknowledge the customer's feeling or frustration with genuine empathy ("I understand how inconvenient it is when audio stops working...").
   - **L (Listen/Learn)**: Restate/confirm the exact problem clearly.
   - **A (Ask/Analyze)**: Ask relevant clarifying questions or diagnose the root cause.
   - **S (Solve/Support)**: Provide step-by-step solutions first. Only offer human escalation if troubleshooting is unsuccessful or requires administrative overrides.

### VERIFIED KNOWLEDGE BASE:

#### 1. Official Policies:
${JSON.stringify(OFFICIAL_POLICIES, null, 2)}

#### 2. Verified Customer Orders Database:
${JSON.stringify(VERIFIED_ORDERS, null, 2)}

#### 3. Standard Troubleshooting Guides:
${JSON.stringify(TROUBLESHOOTING_GUIDES, null, 2)}

### OUTPUT FORMAT:
You must respond with a JSON object matching this schema:
{
  "text": "Your polite, concise, formatted markdown response to the customer",
  "flasStage": "Feel" | "Listen" | "Ask" | "Solve" | "Escalate",
  "troubleshootingSteps": ["Step 1...", "Step 2..."], // Optional array of steps if providing troubleshooting
  "suggestedReplies": ["Quick reply 1", "Quick reply 2"], // 2-4 short follow-up reply options for the user
  "referencedOrderId": "ORD-XXXX", // If an order was looked up or discussed, include its ID
  "isEscalationOffer": true | false // True if human escalation is appropriate or offered
}
`;

// API Endpoints

// 1. Chat endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { messages, activeOrderId } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid messages array provided." });
    }

    const ai = getGeminiClient();

    // Prepare context prompt
    const conversationHistory = messages.map((m: any) => ({
      role: m.sender === "user" ? "user" : "model",
      parts: [{ text: m.text }]
    }));

    let responseData: any = null;

    if (ai) {
      // Cascade across models in case one experiences temporary 503 high demand spikes
      const modelsToTry = ["gemini-2.5-flash", "gemini-3.7-flash", "gemini-1.5-flash", "gemini-2.5-pro"];

      for (const modelName of modelsToTry) {
        try {
          const geminiResponse = await ai.models.generateContent({
            model: modelName,
            contents: conversationHistory.map(c => ({
              role: c.role === 'user' ? 'user' : 'model',
              parts: c.parts
            })),
            config: {
              systemInstruction: SYSTEM_INSTRUCTION + (activeOrderId ? `\nActive Selected Order Context: ${JSON.stringify(VERIFIED_ORDERS[activeOrderId] || 'Not found')}` : ''),
              responseMimeType: "application/json",
              temperature: 0.3,
            }
          });

          const rawText = geminiResponse.text?.trim() || "{}";
          try {
            const parsed = JSON.parse(rawText);
            responseData = {
              text: parsed.text || "Thank you for reaching out. How else can I assist you with your orders, returns, or technical support?",
              flasStage: parsed.flasStage || "Solve",
              troubleshootingSteps: parsed.troubleshootingSteps || [],
              suggestedReplies: parsed.suggestedReplies && parsed.suggestedReplies.length > 0 ? parsed.suggestedReplies : ["Yes, that solved it", "Need more troubleshooting", "Contact human agent"],
              referencedOrderId: parsed.referencedOrderId || (activeOrderId && VERIFIED_ORDERS[activeOrderId] ? activeOrderId : undefined),
              isEscalationOffer: Boolean(parsed.isEscalationOffer)
            };
            break;
          } catch (parseError) {
            console.warn(`Failed to parse JSON response from ${modelName}, using raw text:`, parseError);
            responseData = {
              text: rawText,
              flasStage: "Solve",
              troubleshootingSteps: [],
              suggestedReplies: ["Check order status", "View return policy", "Ask about warranty", "Speak to human agent"],
              referencedOrderId: activeOrderId,
              isEscalationOffer: false
            };
            break;
          }
        } catch (geminiError: any) {
          console.warn(`Model ${modelName} call failed (${geminiError?.status || geminiError?.message}). Trying next fallback...`);
        }
      }
    }

    // If Gemini was unavailable or all models returned 503 / errors, use knowledge base responder
    if (!responseData || !responseData.text) {
      console.log("Serving response via verified FLAS knowledge base engine.");
      responseData = generateKnowledgeBaseResponse(messages, activeOrderId);
    }

    // Attach order reference details if referencedOrderId exists
    let orderInfo: any = undefined;
    if (responseData.referencedOrderId && VERIFIED_ORDERS[responseData.referencedOrderId]) {
      orderInfo = VERIFIED_ORDERS[responseData.referencedOrderId];
    } else if (activeOrderId && VERIFIED_ORDERS[activeOrderId]) {
      orderInfo = VERIFIED_ORDERS[activeOrderId];
    }

    return res.json({
      ...responseData,
      orderReference: orderInfo
    });
  } catch (error: any) {
    console.error("Error in /api/chat:", error);
    const fallback = generateKnowledgeBaseResponse(req.body?.messages || [], req.body?.activeOrderId);
    return res.json(fallback);
  }
});

// 2. Orders endpoints
app.get("/api/orders", (req, res) => {
  res.json({ orders: Object.values(VERIFIED_ORDERS) });
});

app.get("/api/orders/:orderId", (req, res) => {
  const id = req.params.orderId.toUpperCase();
  const order = VERIFIED_ORDERS[id];
  if (!order) {
    return res.status(404).json({ error: "Order not found in verified database." });
  }
  res.json({ order });
});

// 3. Policies endpoint
app.get("/api/policies", (req, res) => {
  res.json({ policies: OFFICIAL_POLICIES });
});

// 4. Troubleshooting guides endpoint
app.get("/api/troubleshooting", (req, res) => {
  res.json({ guides: TROUBLESHOOTING_GUIDES });
});

// 5. Escalation creation endpoint
app.post("/api/escalate", (req, res) => {
  const { customerName, customerEmail, orderId, category, summary, flasNotes, troubleshootingAttempted } = req.body;
  const ticketId = `TICK-${Math.floor(100000 + Math.random() * 900000)}`;
  
  const newTicket = {
    id: ticketId,
    customerName: customerName || "Valued Customer",
    customerEmail: customerEmail || "customer@example.com",
    orderId: orderId || "N/A",
    category: category || "Technical Support",
    priority: category === "Billing" || category === "Account Security" ? "Urgent" : "High",
    summary: summary || "Customer requested escalation after FLAS troubleshooting.",
    flasNotes: flasNotes || "Awaiting Tier-2 human agent review.",
    troubleshootingAttempted: troubleshootingAttempted || [],
    status: "Queued",
    createdAt: new Date().toISOString(),
    estimatedWaitMinutes: Math.floor(Math.random() * 3) + 2, // 2-4 minutes
    assignedAgent: "Sarah J. (Senior Support Specialist)"
  };

  escalationTickets.unshift(newTicket);
  res.json({ success: true, ticket: newTicket });
});

// 6. Escalation tickets list
app.get("/api/escalations", (req, res) => {
  res.json({ tickets: escalationTickets });
});

// 7. Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// Server setup with Vite middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Support Assistant Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
