// NEXORA — legal / policy content. EDIT the text here to match your real terms.
// Placeholders in [BRACKETS] must be replaced before going live (Razorpay and
// other gateways check these pages during onboarding).

export const LEGAL_CONTACT = {
  brand: "NEXORA",
  legalEntity: "[YOUR REGISTERED BUSINESS NAME]",
  email: "[support@yourdomain.com]",
  phone: "+91 [YOUR SUPPORT NUMBER]",
  address: "[YOUR REGISTERED BUSINESS ADDRESS, CITY, STATE, PIN]",
  lastUpdated: "08 Sep 2026",
};

export type PolicySection = { heading: string; body: string[] };
export type Policy = {
  slug: string;
  title: string;
  intro: string;
  sections: PolicySection[];
};

export const POLICIES: Record<string, Policy> = {
  privacy: {
    slug: "privacy",
    title: "Privacy Policy",
    intro:
      "This Privacy Policy explains how NEXORA collects, uses, and protects your personal information when you shop with us. [EDIT to reflect your actual practices.]",
    sections: [
      {
        heading: "Information we collect",
        body: [
          "Account details you provide: name, email address, and password (stored only as a secure hash).",
          "Order details: shipping address, phone number, and items purchased.",
          "Payment information is processed by our payment gateway (Razorpay). We do not store your card or UPI details on our servers.",
          "Basic technical data such as device and browser information for security and to improve the site.",
        ],
      },
      {
        heading: "How we use your information",
        body: [
          "To process and deliver your orders and provide order updates.",
          "To manage your account, cart, wishlist, and order history.",
          "To respond to support requests and, where you have opted in, to send offers.",
          "To detect, prevent, and address fraud or security issues.",
        ],
      },
      {
        heading: "Sharing",
        body: [
          "We share information only with service providers who help us operate the store — payment (Razorpay), image hosting (Cloudinary), and delivery partners — and only as needed to fulfil your order.",
          "We do not sell your personal information.",
        ],
      },
      {
        heading: "Your rights",
        body: [
          "You can access, correct, or request deletion of your account data by contacting us.",
          "You may unsubscribe from marketing messages at any time.",
        ],
      },
      {
        heading: "Contact",
        body: [
          "For any privacy question, email us at the address in the footer of this page.",
        ],
      },
    ],
  },
  terms: {
    slug: "terms",
    title: "Terms of Service",
    intro:
      "By using the NEXORA website and placing an order, you agree to these terms. [EDIT to reflect your actual terms.]",
    sections: [
      {
        heading: "Use of the site",
        body: [
          "You agree to provide accurate information and to use the site lawfully.",
          "Prices, product availability, and offers may change without notice.",
        ],
      },
      {
        heading: "Orders and pricing",
        body: [
          "All prices are listed in Indian Rupees (INR) and are inclusive of applicable taxes unless stated otherwise.",
          "We reserve the right to cancel an order in case of pricing errors, stock issues, or suspected fraud; any amount paid will be refunded.",
        ],
      },
      {
        heading: "Payments",
        body: [
          "Payments are processed securely via Razorpay. Cash on Delivery may be available for eligible orders.",
        ],
      },
      {
        heading: "Intellectual property",
        body: [
          "All content on this site — including logos, imagery, and text — belongs to NEXORA and may not be used without permission.",
        ],
      },
      {
        heading: "Limitation of liability",
        body: [
          "To the extent permitted by law, NEXORA is not liable for indirect or incidental damages arising from use of the site.",
        ],
      },
    ],
  },
  refund: {
    slug: "refund",
    title: "Refund & Return Policy",
    intro:
      "We want you to love what you ordered. If something isn't right, here's how returns and refunds work. [EDIT to match your real policy.]",
    sections: [
      {
        heading: "Returns",
        body: [
          "You may request a return within 7 days of delivery.",
          "Items must be unworn, unwashed, and returned with original tags and packaging.",
          "Certain items may be marked final sale and are not returnable — this is noted on the product page.",
        ],
      },
      {
        heading: "How to start a return",
        body: [
          "Go to your Orders page, or contact support with your Order ID.",
          "Once approved, we'll arrange a pickup or share return instructions.",
        ],
      },
      {
        heading: "Refunds",
        body: [
          "After we receive and inspect the returned item, your refund is issued to the original payment method within 5–7 working days.",
          "For Cash on Delivery orders, refunds are issued to a bank account or UPI ID you provide.",
        ],
      },
      {
        heading: "Exchanges",
        body: [
          "Need a different size or colour? Request an exchange from your Orders page, subject to availability.",
        ],
      },
      {
        heading: "Shipping",
        body: [
          "We offer free doorstep delivery across India. Orders are dispatched in 1–2 working days and typically arrive within 3–7 working days.",
        ],
      },
    ],
  },
};
