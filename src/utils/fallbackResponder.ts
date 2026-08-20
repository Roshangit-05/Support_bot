import { VERIFIED_ORDERS, OFFICIAL_POLICIES, TROUBLESHOOTING_GUIDES } from '../data/mockData';

export interface FallbackResponse {
  text: string;
  flasStage: 'Feel' | 'Listen' | 'Ask' | 'Solve' | 'Escalate';
  troubleshootingSteps?: string[];
  suggestedReplies: string[];
  referencedOrderId?: string;
  isEscalationOffer: boolean;
}

export function generateKnowledgeBaseResponse(
  messages: Array<{ sender: string; text: string }>,
  activeOrderId?: string
): FallbackResponse {
  const lastUserMsg = messages[messages.length - 1]?.text?.toLowerCase() || '';

  // 1. Order search / tracking lookup
  const orderMatch = lastUserMsg.match(/ord-\d{4}/i);
  const targetOrderId = orderMatch ? orderMatch[0].toUpperCase() : activeOrderId;

  if (targetOrderId && VERIFIED_ORDERS[targetOrderId] && (lastUserMsg.includes('order') || lastUserMsg.includes('track') || lastUserMsg.includes('status') || lastUserMsg.includes('where') || orderMatch)) {
    const ord = VERIFIED_ORDERS[targetOrderId];
    return {
      text: `I've checked our verified database for order **#${ord.id}** (${ord.customerName}).

* **Item:** ${ord.item}
* **Status:** **${ord.status}**
* **Carrier & Tracking:** ${ord.carrier} (${ord.trackingNumber})
* **Estimated Delivery / Date:** ${ord.estimatedDelivery}
* **Total Paid:** $${ord.paidAmount.toFixed(2)}
* **Return Eligibility:** ${ord.returnStatus}

Is there anything specific regarding this shipment or item I can assist you with?`,
      flasStage: 'Solve',
      troubleshootingSteps: [],
      suggestedReplies: [
        `Return policy for #${ord.id}`,
        `Troubleshoot ${ord.item.split(' ')[0]}`,
        'Track another package',
        'Speak with human support'
      ],
      referencedOrderId: ord.id,
      isEscalationOffer: false
    };
  }

  // If user searched an unknown order number (e.g. ORD-9999)
  if (orderMatch && !VERIFIED_ORDERS[targetOrderId!]) {
    return {
      text: `I searched our verified database for order **#${targetOrderId}**, but could not locate any records matching that order ID.

**Rule Check:** I will never invent order statuses or fake tracking information.
Could you please double-check the order number on your receipt or email confirmation? You can also click **Orders** above to view verified test orders.`,
      flasStage: 'Ask',
      troubleshootingSteps: [],
      suggestedReplies: ['Check order #ORD-8829', 'Check order #ORD-7411', 'View return policies', 'Contact human agent'],
      referencedOrderId: undefined,
      isEscalationOffer: false
    };
  }

  // 2. Returns & Refunds inquiries
  if (lastUserMsg.includes('return') || lastUserMsg.includes('refund') || lastUserMsg.includes('money back') || lastUserMsg.includes('exchange')) {
    if (targetOrderId && VERIFIED_ORDERS[targetOrderId]) {
      const ord = VERIFIED_ORDERS[targetOrderId];
      return {
        text: `Here is the verified return eligibility for your order **#${ord.id}** (${ord.item}):

* **Current Status:** ${ord.returnStatus}
* **Standard Return Window:** 30 calendar days from delivery date.
* **Return Condition:** Must be in original packaging with all accessories.
* **Shipping Label:** Free for defective or incorrect items; $4.99 standard deduction for preference returns.
* **Refund Timeline:** 3–5 business days to original payment method after warehouse inspection.

Would you like help starting a return or troubleshooting any product issue first?`,
        flasStage: 'Solve',
        troubleshootingSteps: [],
        suggestedReplies: [
          `Troubleshoot issue with #${ord.id}`,
          'Request prepaid return label',
          'Check warranty coverage',
          'Escalate to support specialist'
        ],
        referencedOrderId: ord.id,
        isEscalationOffer: false
      };
    }

    return {
      text: `Under our official **30-Day Returns & Refund Policy**:
* You have **30 calendar days** from verified delivery to return products in original condition.
* Defective or damaged items receive a **100% free prepaid return label**.
* Elective returns have a flat **$4.99 label fee** deducted from the final refund.
* Refunds are credited back to your original payment method in **3 to 5 business days** following warehouse inspection.

Please provide your **Order Number (e.g. ORD-7411)** so I can check your exact eligibility date.`,
      flasStage: 'Ask',
      troubleshootingSteps: [],
      suggestedReplies: ['Check order #ORD-7411', 'Check order #ORD-6190', 'Start return without order #', 'Speak to human agent'],
      referencedOrderId: undefined,
      isEscalationOffer: false
    };
  }

  // 3. Audio & Headphones troubleshooting
  if (lastUserMsg.includes('audio') || lastUserMsg.includes('sound') || lastUserMsg.includes('headphone') || lastUserMsg.includes('bluetooth') || lastUserMsg.includes('aerosound') || lastUserMsg.includes('pair')) {
    return {
      text: `I understand how frustrating it is when audio stops working unexpectedly (**FLAS - Feel**). Let's troubleshoot your **AeroSound Pro Headphones** step-by-step (**FLAS - Solve**):

1. **Power Cycle & Disconnect**: Hold the Power button for 3 seconds to turn off, then "Forget Device" in your phone/computer Bluetooth menu.
2. **Factory Hard Reset**: Press and hold both **Power** and **Volume Down** simultaneously for 8 seconds until the LED flashes red and white 3 times.
3. **Re-Pair & Test**: Place next to your host device, re-pair, and play a test track.

Please follow the interactive checklist below and let me know the result!`,
      flasStage: 'Solve',
      troubleshootingSteps: [
        'Power off and remove from Bluetooth list',
        'Hold Power + Volume Down for 8 seconds to trigger factory reset (LED flashes red/white 3x)',
        'Turn on, re-pair with device, and test audio playback volume'
      ],
      suggestedReplies: [
        'Yes, that fixed the audio!',
        'No, still no sound after reset',
        'How do I claim warranty replacement?'
      ],
      referencedOrderId: 'ORD-8829',
      isEscalationOffer: false
    };
  }

  // 4. Webcam / Video troubleshooting
  if (lastUserMsg.includes('webcam') || lastUserMsg.includes('camera') || lastUserMsg.includes('video') || lastUserMsg.includes('ultraview') || lastUserMsg.includes('black screen')) {
    return {
      text: `I can certainly help you fix your **UltraView 4K Webcam** (**FLAS - Listen**). Let's go through step-by-step diagnostic isolation:

1. **Privacy Shutter & Physical Port**: Ensure the physical sliding lens cover is open. Plug directly into a USB 3.0 port on the computer (avoid unpowered USB hubs).
2. **OS Camera Privacy Permissions**: Check Windows (*Settings > Privacy & Security > Camera*) or macOS (*System Settings > Privacy & Security > Camera*) to ensure permission is granted.
3. **Device Manager Refresh**: In Device Manager, right-click UltraView 4K under Cameras, select "Update Driver" or uninstall and reconnect the USB cable.

Are you getting a black screen or is the camera not detected at all?`,
      flasStage: 'Solve',
      troubleshootingSteps: [
        'Check physical lens privacy slider is open',
        'Plug into direct motherboard USB 3.0 port',
        'Enable OS Camera privacy access in system settings',
        'Restart meeting app (Zoom / Meet / Teams)'
      ],
      suggestedReplies: [
        'Camera is working now!',
        'Still showing black screen',
        'Check return policy for #ORD-7411',
        'Escalate to human support'
      ],
      referencedOrderId: 'ORD-7411',
      isEscalationOffer: false
    };
  }

  // 5. Shipping & Lost Package
  if (lastUserMsg.includes('shipping') || lastUserMsg.includes('delivery') || lastUserMsg.includes('lost') || lastUserMsg.includes('carrier') || lastUserMsg.includes('late') || lastUserMsg.includes('not received')) {
    return {
      text: `I understand your concern about delivery timing (**FLAS - Feel**). Here are our verified shipping policies & diagnostic steps:

* **Standard Shipping:** 3–5 business days ($5.99, free over $50).
* **Express Shipping:** 1–2 business days ($14.99).
* **Marked Delivered but Missing?**
  1. Check side porches, mailrooms, and neighbors.
  2. Carriers occasionally scan items delivered up to 24 hours prior to final drop-off.
  3. If 24 hours have elapsed since the delivery timestamp, we will immediately initiate an official carrier trace and issue a replacement.

Would you like me to trace a specific tracking number for you?`,
      flasStage: 'Solve',
      troubleshootingSteps: [
        'Verify shipping address on order confirmation',
        'Check mailroom, porch, or with building manager',
        'Allow 24-hour carrier scan buffer',
        'Initiate replacement trace if missing'
      ],
      suggestedReplies: ['Track order #ORD-8829', 'Track order #ORD-5520', 'Report lost package', 'Contact human agent'],
      referencedOrderId: activeOrderId || 'ORD-8829',
      isEscalationOffer: false
    };
  }

  // 6. Warranty & Hardware protection
  if (lastUserMsg.includes('warranty') || lastUserMsg.includes('broken') || lastUserMsg.includes('repair') || lastUserMsg.includes('replace') || lastUserMsg.includes('defect')) {
    return {
      text: `Our products come with an official **1-Year Limited Manufacturer Warranty**:

* **Coverage:** Hardware malfunctions, driver failures, battery degradation (>20% below spec), and manufacturing defects.
* **Exclusions:** Accidental physical drops, unauthorized disassembly, water submersion (unless IP68 rated).
* **Resolution:** Free repair or certified new replacement unit within 7 business days of receipt.
* **Requirement:** No paper receipt needed—just your **Order ID** or **Serial Number**.

Would you like to initiate a warranty evaluation for an order?`,
      flasStage: 'Solve',
      troubleshootingSteps: [],
      suggestedReplies: ['Warranty check for #ORD-6190', 'Warranty check for #ORD-8829', 'Talk to warranty specialist'],
      referencedOrderId: activeOrderId,
      isEscalationOffer: false
    };
  }

  // 7. Human Escalation Requests
  if (lastUserMsg.includes('human') || lastUserMsg.includes('agent') || lastUserMsg.includes('person') || lastUserMsg.includes('specialist') || lastUserMsg.includes('escalat') || lastUserMsg.includes('talk to someone') || lastUserMsg.includes('representative')) {
    return {
      text: `I would be glad to connect you with our **Tier-2 Human Support Specialist Team**!

Our FLAS protocol will bundle all details we've discussed—including your active order context and troubleshooting attempts—so you won't have to repeat anything to the specialist.

Our current estimated specialist wait time is **~2 to 4 minutes**. Would you like me to create your priority ticket now?`,
      flasStage: 'Escalate',
      troubleshootingSteps: [],
      suggestedReplies: [
        'Yes, connect me with human agent',
        'Let me try one more troubleshooting step',
        'View active escalations queue'
      ],
      referencedOrderId: activeOrderId,
      isEscalationOffer: true
    };
  }

  // 8. Account & Security
  if (lastUserMsg.includes('account') || lastUserMsg.includes('password') || lastUserMsg.includes('login') || lastUserMsg.includes('2fa') || lastUserMsg.includes('billing') || lastUserMsg.includes('invoice')) {
    return {
      text: `For your account protection and security:
* **Password Resets:** A secure 15-minute reset token link can be requested from the login screen.
* **Two-Factor Authentication (2FA):** Supported via Google Authenticator, Authy, or SMS.
* **Security Notice:** Support agents will **never** ask for your password, 2FA code, or full credit card CVV.
* **Invoices:** Receipts can be downloaded from *Account Settings > Invoices*.

How can I assist with your account settings today?`,
      flasStage: 'Solve',
      troubleshootingSteps: [],
      suggestedReplies: ['Update payment method', 'Reset password', 'View past invoices', 'Speak with human agent'],
      referencedOrderId: undefined,
      isEscalationOffer: false
    };
  }

  // 9. Default Clarification / FLAS Greeting
  return {
    text: `Hello! I am your **Customer Support Assistant** at ApexSupport.

To help you quickly and accurately using our **FLAS framework**, could you please clarify what you need assistance with today?

* **Order & Tracking**: Provide an order ID like \`#ORD-8829\` or \`#ORD-7411\`
* **Returns & Refunds**: Inquire about our 30-day verified return policy
* **Technical Troubleshooting**: Step-by-step diagnostics for headphones, webcams, or peripherals
* **Warranty & Accounts**: 1-Year manufacturer warranty claims or login help
* **Human Support**: Instant routing to Tier-2 specialists

What can I solve for you?`,
    flasStage: 'Ask',
    troubleshootingSteps: [],
    suggestedReplies: [
      'Track order #ORD-8829',
      'Start return for #ORD-7411',
      'My headphones have no sound',
      'What is your warranty policy?'
    ],
    referencedOrderId: activeOrderId,
    isEscalationOffer: false
  };
}
