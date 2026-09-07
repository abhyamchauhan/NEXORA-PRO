// NEXORA — support content. EDIT THIS FILE to update the chatbot's answers.
// Replace the WhatsApp number and the placeholder policies with your real ones.
// The bot matches a customer's message against each entry's `keywords`.

export const SUPPORT = {
  // WhatsApp fallback — digits only, with country code, NO "+" or spaces.
  whatsappNumber: "8595417996",
  brand: "NEXORA",
};

export type FaqEntry = {
  id: string;
  title: string;
  keywords: string[];
  answer: string;
};

export const FAQS: FaqEntry[] = [
  {
    id: "returns",
    title: "Returns & exchanges",
    keywords: ["return", "returns", "exchange", "refund", "replace", "wrong size"],
    answer:
      "Easy 7-day returns. If something isn't right, request a return within 7 days of delivery from your Orders page. Items must be unworn with tags on. Refunds hit the original payment method in 5–7 working days. [EDIT: replace with your real return policy.]",
  },
  {
    id: "shipping",
    title: "Shipping & delivery",
    keywords: ["shipping", "delivery", "deliver", "dispatch", "how long", "days", "track"],
    answer:
      "Free doorstep delivery across India. Orders are dispatched in 1–2 working days and usually arrive within 3–7 working days depending on your PIN code. You'll get a tracking link by SMS/email. [EDIT: replace with your real shipping policy.]",
  },
  {
    id: "sizes",
    title: "Size guide",
    keywords: ["size", "sizing", "fit", "measurement", "chart", "small", "large", "size guide"],
    answer:
      "Our fits are boxy and true-to-size; size down for a slimmer fit. Rough chest guide — S: 38\", M: 40\", L: 42\", XL: 44\", XXL: 46\". For exact garment measurements, check the product page. [EDIT: replace with your real size guide.]",
  },
  {
    id: "payments",
    title: "Payment methods",
    keywords: ["payment", "pay", "upi", "card", "cod", "cash on delivery", "razorpay", "netbanking"],
    answer:
      "We accept UPI, credit/debit cards and netbanking via Razorpay, plus Cash on Delivery. All online payments are secure — we never store your card details. [EDIT: replace with your real payment details.]",
  },
  {
    id: "orders",
    title: "Order & account help",
    keywords: ["cancel", "change order", "modify", "account", "login", "password"],
    answer:
      "Need to cancel or change an order? If it hasn't shipped, message us on WhatsApp with your Order ID and we'll help. You can see all your orders on the Orders page after signing in.",
  },
];

// Greeting + the quick actions shown when the widget opens.
export const SUPPORT_GREETING =
  "Hi 👋 I'm the NEXORA assistant. I can check your order status, look up size & stock, or answer common questions.";
