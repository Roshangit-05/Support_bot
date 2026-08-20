import { OrderInfo, PolicyTopic, TroubleshootingGuide } from '../types';

export const VERIFIED_ORDERS: Record<string, OrderInfo> = {
  'ORD-8829': {
    id: 'ORD-8829',
    customerName: 'Alex Chen',
    customerEmail: 'alex.chen@example.com',
    item: 'AeroSound Pro Noise-Cancelling Headphones (Midnight Black)',
    placedDate: '2026-08-17',
    status: 'In Transit',
    carrier: 'FedEx Express',
    trackingNumber: 'FX-9928172648',
    estimatedDelivery: '2026-08-21 by 7:00 PM',
    paidAmount: 179.00,
    returnStatus: 'Return eligible for 30 days after delivery is confirmed',
    serialNumber: 'AS-PRO-884920'
  },
  'ORD-7411': {
    id: 'ORD-7411',
    customerName: 'Sarah Miller',
    customerEmail: 'sarah.m@example.com',
    item: 'UltraView 4K Smart HDR Webcam with Dual Mics',
    placedDate: '2026-08-08',
    status: 'Delivered',
    carrier: 'UPS Ground',
    trackingNumber: 'UPS-448201923',
    estimatedDelivery: 'Delivered on Aug 12, 2026',
    deliveredDate: '2026-08-12',
    paidAmount: 89.50,
    returnStatus: 'Eligible for return (22 days remaining in 30-day window)',
    serialNumber: 'UV-4K-10294'
  },
  'ORD-6190': {
    id: 'ORD-6190',
    customerName: 'Jordan Taylor',
    customerEmail: 'jordan.t@example.com',
    item: 'ErgoFlow Mechanical Keyboard & Gel Palm Rest',
    placedDate: '2026-07-05',
    status: 'Delivered',
    carrier: 'DHL Priority',
    trackingNumber: 'DHL-883019241',
    estimatedDelivery: 'Delivered on Jul 10, 2026',
    deliveredDate: '2026-07-10',
    paidAmount: 129.00,
    returnStatus: 'Return window closed (41 days since delivery). Standard 1-Year Warranty active until July 2027.',
    serialNumber: 'EF-KB-7731'
  },
  'ORD-5520': {
    id: 'ORD-5520',
    customerName: 'Elena Rostova',
    customerEmail: 'elena.rostova@example.com',
    item: 'PulseTrack Pro Waterproof Fitness Smartwatch',
    placedDate: '2026-08-19',
    status: 'Processing',
    carrier: 'Preparing for Dispatch',
    trackingNumber: 'Pending fulfillment',
    estimatedDelivery: 'Est. dispatch Aug 21, delivery Aug 24-26',
    paidAmount: 149.99,
    returnStatus: 'Order can be cancelled or modified prior to warehouse dispatch',
    serialNumber: 'PT-WATCH-9901'
  }
};

export const OFFICIAL_POLICIES: PolicyTopic[] = [
  {
    id: 'returns-refunds',
    title: 'Returns & Refund Policy',
    category: 'Returns',
    summary: '30-day return window from delivery date in original packaging with free labels for defective items.',
    details: [
      'Customers have 30 calendar days from the verified delivery date to initiate a return.',
      'Items must be undamaged, include all original packaging, cables, manuals, and accessories.',
      'Defective or incorrect items receive a 100% free prepaid return shipping label and zero restocking fee.',
      'Elective returns (buyer preference/remorse) have a standard $4.99 label fee deducted from the final refund amount.',
      'Refunds are processed to the original payment method within 3 to 5 business days after warehouse quality inspection.'
    ],
    faq: [
      {
        question: 'How long does a refund take to appear on my credit card?',
        answer: 'Once our warehouse receives and inspects the item (typically 2-3 business days), your bank will post the credit in 3-5 business days.'
      },
      {
        question: 'Can I return an item without original packaging?',
        answer: 'Returns missing original packaging or accessories may be subject to a 15% restocking fee or rejected if components are missing.'
      }
    ]
  },
  {
    id: 'shipping-delivery',
    title: 'Shipping, Tracking & Delivery',
    category: 'Shipping',
    summary: 'Standard (3-5 days), Express (1-2 days), and International delivery with tracked carriers.',
    details: [
      'Standard Shipping: 3-5 business days ($5.99, or FREE on orders over $50).',
      'Express Delivery: 1-2 business days ($14.99).',
      'Fulfillment cutoff: Orders placed before 2:00 PM EST ship same business day; others ship next business day.',
      'Carriers: FedEx, UPS, USPS, and DHL Express with live tracking numbers provided via email upon dispatch.',
      'Lost or Stolen Packages: If tracking states delivered but you have not received it within 24 hours, contact support for carrier trace investigation.'
    ],
    faq: [
      {
        question: 'Can I change my delivery address after placing an order?',
        answer: 'Address changes are only possible while the order status is "Processing". Once dispatched with a carrier, address redirection must be requested via carrier portal.'
      }
    ]
  },
  {
    id: 'warranty-repairs',
    title: '1-Year Limited Warranty & Repairs',
    category: 'Warranty',
    summary: 'Comprehensive 12-month coverage for manufacturing defects and hardware malfunctions.',
    details: [
      'All hardware products include an automatic 1-Year Limited Manufacturer Warranty from the original purchase date.',
      'Covered: Internal hardware failures, audio driver defects, faulty battery performance (>20% below spec), wireless connectivity defects.',
      'Not Covered: Physical abuse, drops, unauthorized third-party teardowns, liquid submersion (unless rated IP68+).',
      'Repairs/Replacements: Defective items within warranty are repaired or replaced with a brand-new or certified unit within 7 business days of receipt.'
    ],
    faq: [
      {
        question: 'Do I need my receipt for warranty service?',
        answer: 'You only need your Order Number or registered product Serial Number to initiate a warranty claim.'
      }
    ]
  },
  {
    id: 'account-security',
    title: 'Account Security & Billing',
    category: 'Accounts',
    summary: 'Secure login, two-factor authentication, and safe encrypted billing management.',
    details: [
      'Password resets send a secure, 15-minute expiring link to the verified email address.',
      'Two-Factor Authentication (2FA) is supported via Google Authenticator, Authy, or SMS token.',
      'Support agents NEVER ask for passwords, full credit card CVV numbers, or 2FA codes.',
      'Invoices and receipts can be downloaded anytime from the customer Account Billing portal.'
    ],
    faq: [
      {
        question: 'How do I update my payment method for recurring plans?',
        answer: 'Navigate to Account Settings > Payment Methods to add or set default credit cards and PayPal accounts.'
      }
    ]
  }
];

export const TROUBLESHOOTING_GUIDES: TroubleshootingGuide[] = [
  {
    id: 'headphones-no-audio',
    title: 'AeroSound Headphones: No Audio or Bluetooth Dropping',
    category: 'Audio & Wireless',
    deviceOrIssue: 'AeroSound Pro Noise-Cancelling Headphones',
    steps: [
      {
        stepNumber: 1,
        instruction: 'Power Cycle & Bluetooth Reset',
        detail: 'Turn off the headphones by holding the Power button for 3 seconds. Forget the device from your phone/computer Bluetooth settings.',
        expectedOutcome: 'LED indicator turns off completely.'
      },
      {
        stepNumber: 2,
        instruction: 'Hard Factory Reset',
        detail: 'Hold both Power and Volume Down buttons simultaneously for 8 seconds until the LED flashes red and white 3 times.',
        expectedOutcome: 'Audio prompts "Ready to pair" and enters pairing mode.'
      },
      {
        stepNumber: 3,
        instruction: 'Firmware & Connection Test',
        detail: 'Reconnect via Bluetooth. Test audio playback with a reliable source (e.g. YouTube or Spotify). Check if volume limit is engaged in system sound settings.',
        expectedOutcome: 'Crisp stereo audio plays with active noise cancellation working.'
      },
      {
        stepNumber: 4,
        instruction: 'Evaluate for Replacement',
        detail: 'If audio remains silent or crackles continuously after hard reset across multiple devices, escalate for warranty replacement.',
        expectedOutcome: 'Escalate to human hardware specialist for instant RMA.'
      }
    ]
  },
  {
    id: 'webcam-not-detected',
    title: 'UltraView 4K Webcam: Camera Not Detected or Black Screen',
    category: 'Video & Hardware',
    deviceOrIssue: 'UltraView 4K Smart Webcam',
    steps: [
      {
        stepNumber: 1,
        instruction: 'Check Physical Privacy Shutter & USB Port',
        detail: 'Verify physical lens privacy slider is open. Plug directly into a USB 3.0/3.1 port on the motherboard or laptop (avoid unpowered USB hubs).',
        expectedOutcome: 'White status LED turns on solid.'
      },
      {
        stepNumber: 2,
        instruction: 'OS Privacy Permissions',
        detail: 'On Windows: Settings > Privacy & Security > Camera > enable "Allow apps to access your camera". On macOS: System Settings > Privacy & Security > Camera.',
        expectedOutcome: 'Target application (Zoom, Teams, Meet) has green camera access permission.'
      },
      {
        stepNumber: 3,
        instruction: 'Driver & Device Manager Check',
        detail: 'Open Device Manager > Cameras / Imaging devices. Right-click UltraView 4K > "Update driver" or "Uninstall device", then unplug and re-insert USB cable.',
        expectedOutcome: 'Camera re-enumerates properly with standard UVC driver.'
      }
    ]
  },
  {
    id: 'lost-package-in-transit',
    title: 'Package Tracking: Marked Delivered but Not Received',
    category: 'Shipping & Delivery',
    deviceOrIssue: 'All Orders / Carrier Delivery',
    steps: [
      {
        stepNumber: 1,
        instruction: 'Verify Shipping Address on Order',
        detail: 'Confirm that the delivery address entered on the order confirmation is 100% accurate including unit/apartment numbers.',
        expectedOutcome: 'Correct address confirmed.'
      },
      {
        stepNumber: 2,
        instruction: 'Check Surrounding Areas & Neighbors',
        detail: 'Carriers frequently place packages behind planters, side porches, building mailrooms, or with front desk managers. Check with immediate household members.',
        expectedOutcome: 'Package located or confirmed missing.'
      },
      {
        stepNumber: 3,
        instruction: 'Carrier 24-Hour Buffer',
        detail: 'Carriers occasionally scan packages as "Delivered" when entering delivery trucks hours before actual doorstep drop-off.',
        expectedOutcome: 'If 24 hours have passed since the delivered timestamp, initiate official carrier search trace and escalation.'
      }
    ]
  }
];

export const INITIAL_GREETING_MESSAGE = {
  id: 'msg-welcome',
  sender: 'assistant' as const,
  text: `Hello! I'm your **Customer Support Assistant**. 👋

I'm here to help you resolve questions about **products, services, orders, accounts, returns, and technical troubleshooting**.

Here is how I can help today:
* **Order & Tracking status** (e.g. *#ORD-8829*, *#ORD-7411*)
* **Returns & Refunds** guidance based on verified 30-day policy
* **Step-by-step diagnostic & troubleshooting** using the **FLAS framework**
* **Warranty claims & account security**
* **Instant human agent escalation** if we cannot solve your issue together

How may I assist you today?`,
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  flasStage: 'Listen' as const,
  suggestedReplies: [
    'Track my order #ORD-8829',
    'How do I start a return for #ORD-7411?',
    'My headphones have no audio sound',
    'What is your warranty policy?'
  ]
};
