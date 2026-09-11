"use client";

import { useEffect, useRef, useState } from "react";
import { FAQS, SUPPORT, SUPPORT_GREETING } from "@/data/support";
import { inr } from "@/lib/format";

type Msg = { id: number; from: "bot" | "user"; text?: string; kind?: "stock" };

let uid = 0;

function whatsappLink(text: string) {
  return `https://wa.me/${SUPPORT.whatsappNumber}?text=${encodeURIComponent(text)}`;
}

// Keyword match against the editable FAQ list. Returns the best-scoring entry.
function matchFaq(input: string) {
  const q = input.toLowerCase();
  let best: { score: number; answer: string } | null = null;
  for (const f of FAQS) {
    const score = f.keywords.reduce((s, k) => (q.includes(k) ? s + 1 : s), 0);
    if (score > 0 && (!best || score > best.score))
      best = { score, answer: f.answer };
  }
  return best?.answer ?? null;
}

const ORDER_WORDS = ["order", "track", "status", "where is", "delivery status"];
const STOCK_WORDS = ["stock", "available", "availability", "in stock", "size"];

export function SupportWidget() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [awaitingOrder, setAwaitingOrder] = useState(false);
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const bot = (text: string) =>
    setMsgs((m) => [...m, { id: uid++, from: "bot", text }]);
  const user = (text: string) =>
    setMsgs((m) => [...m, { id: uid++, from: "user", text }]);
  const botNode = (kind: "stock") =>
    setMsgs((m) => [...m, { id: uid++, from: "bot", kind }]);

  // Greet on first open.
  useEffect(() => {
    if (open && msgs.length === 0) bot(SUPPORT_GREETING);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 99999, behavior: "smooth" });
  }, [msgs, open]);

  async function lookupOrder(idText: string) {
    setBusy(true);
    try {
      const res = await fetch(
        `/api/support/order?id=${encodeURIComponent(idText)}`,
      );
      const d = await res.json();
      if (!res.ok) bot(d.error || "Please enter a valid Order ID.");
      else if (!d.found)
        bot(
          "I couldn't find that order. Double-check the Order ID (it's on your confirmation page), or sign in and check the Orders page.",
        );
      else
        bot(
          `Order #${d.code}: status is “${d.status.toUpperCase()}”. ${d.itemCount} item(s), total ${inr(
            d.total,
          )}, placed ${new Date(d.createdAt).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}.`,
        );
    } catch {
      bot("Something went wrong looking that up. Please try again.");
    } finally {
      setBusy(false);
      setAwaitingOrder(false);
    }
  }

  function handleFreeText(text: string) {
    const q = text.toLowerCase();
    if (awaitingOrder) return lookupOrder(text);

    if (ORDER_WORDS.some((w) => q.includes(w))) {
      setAwaitingOrder(true);
      bot("Sure — what's your Order ID? (e.g. the code on your confirmation page)");
      return;
    }
    if (STOCK_WORDS.some((w) => q.includes(w))) {
      bot("Let's check availability. Pick a product and size:");
      botNode("stock");
      return;
    }
    const faq = matchFaq(text);
    if (faq) {
      bot(faq);
      return;
    }
    // Fallback → WhatsApp.
    setMsgs((m) => [
      ...m,
      {
        id: uid++,
        from: "bot",
        text: "__FALLBACK__",
      },
    ]);
  }

  function send() {
    const text = input.trim();
    if (!text || busy) return;
    user(text);
    setInput("");
    handleFreeText(text);
  }

  return (
    <>
      {/* Bubble */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Customer support"
        className="fixed bottom-5 right-5 z-50 w-14 h-14 rounded-pill bg-ink text-white shadow-drawer grid place-items-center hover:bg-black transition-colors"
      >
        {open ? "✕" : "💬"}
      </button>

      {open && (
        <div className="fixed bottom-24 right-5 z-50 w-[min(92vw,360px)] h-[520px] bg-white border border-grey-200 shadow-drawer flex flex-col">
          {/* Header */}
          <div className="bg-ink text-white px-4 py-3">
            <p className="font-display text-sm tracking-button">NEXORA Support</p>
            <p className="text-[11px] text-grey-400">
              Order status · Size & stock · FAQs
            </p>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-2">
            {msgs.map((m) =>
              m.kind === "stock" ? (
                <StockTool key={m.id} onResult={bot} />
              ) : m.text === "__FALLBACK__" ? (
                <Bubble key={m.id} from="bot">
                  I&apos;m not sure about that one. Chat with our team on{" "}
                  <a
                    href={whatsappLink("Hi NEXORA, I need help with…")}
                    target="_blank"
                    rel="noreferrer"
                    className="underline font-bold"
                  >
                    WhatsApp
                  </a>
                  .
                </Bubble>
              ) : (
                <Bubble key={m.id} from={m.from}>
                  {m.text}
                </Bubble>
              ),
            )}
            {busy && <Bubble from="bot">…</Bubble>}
          </div>

          {/* Quick actions */}
          <div className="px-3 pb-2 flex flex-wrap gap-1.5">
            <Chip
              onClick={() => {
                user("Track my order");
                setAwaitingOrder(true);
                bot("Sure — what's your Order ID?");
              }}
            >
              Track order
            </Chip>
            <Chip
              onClick={() => {
                user("Check size & stock");
                bot("Pick a product and size:");
                botNode("stock");
              }}
            >
              Size & stock
            </Chip>
            <Chip
              onClick={() => {
                user("FAQs");
                bot(
                  "I can help with: returns, shipping, size guide, payments. Ask away, or type a keyword.",
                );
              }}
            >
              FAQs
            </Chip>
          </div>

          {/* Input */}
          <div className="border-t border-grey-200 p-2 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder={
                awaitingOrder ? "Enter your Order ID…" : "Type a message…"
              }
              className="flex-1 border border-grey-300 px-3 py-2 text-sm outline-none focus:border-ink"
            />
            <button
              onClick={send}
              disabled={busy}
              className="font-display text-xs tracking-button bg-ink text-white px-4 rounded-button disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function Bubble({
  from,
  children,
}: {
  from: "bot" | "user";
  children: React.ReactNode;
}) {
  return (
    <div className={`flex ${from === "user" ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] px-3 py-2 text-sm leading-snug whitespace-pre-line ${
          from === "user"
            ? "bg-ink text-white"
            : "bg-grey-50 border border-grey-200 text-ink"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

function Chip({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="text-[11px] font-display tracking-button border border-grey-300 px-2.5 py-1 rounded-button hover:border-ink"
    >
      {children}
    </button>
  );
}

// Inline product+size selector that queries the Variant table.
function StockTool({ onResult }: { onResult: (text: string) => void }) {
  const [products, setProducts] = useState<
    { id: string; name: string; sizes: string[] }[]
  >([]);
  const [productId, setProductId] = useState("");
  const [size, setSize] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    fetch("/api/support/products")
      .then((r) => r.json())
      .then((d) => setProducts(d.products ?? []))
      .catch(() => {});
  }, []);

  const sizes = products.find((p) => p.id === productId)?.sizes ?? [];

  async function check() {
    if (!productId) return;
    setBusy(true);
    try {
      const res = await fetch(
        `/api/support/stock?productId=${productId}${size ? `&size=${size}` : ""}`,
      );
      const d = await res.json();
      if (!d.found) {
        onResult("Couldn't find that product.");
      } else {
        const rows = d.variants as { color: string; size: string; stock: number }[];
        if (rows.length === 0) onResult(`No ${size} variants for ${d.product}.`);
        else {
          const lines = rows
            .map(
              (v) =>
                `• ${v.color} / ${v.size}: ${v.stock > 0 ? `${v.stock} in stock` : "sold out"}`,
            )
            .join("\n");
          onResult(`${d.product} availability:\n${lines}`);
        }
      }
      setDone(true);
    } catch {
      onResult("Couldn't check stock right now.");
    } finally {
      setBusy(false);
    }
  }

  if (done) return null;

  return (
    <div className="bg-grey-50 border border-grey-200 p-2.5 space-y-2">
      <select
        value={productId}
        onChange={(e) => {
          setProductId(e.target.value);
          setSize("");
        }}
        className="w-full border border-grey-300 bg-white px-2 py-1.5 text-xs outline-none focus:border-ink"
      >
        <option value="">Select a product…</option>
        {products.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>
      <select
        value={size}
        onChange={(e) => setSize(e.target.value)}
        disabled={!productId}
        className="w-full border border-grey-300 bg-white px-2 py-1.5 text-xs outline-none focus:border-ink disabled:opacity-50"
      >
        <option value="">Any size</option>
        {sizes.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      <button
        onClick={check}
        disabled={!productId || busy}
        className="w-full font-display text-xs tracking-button bg-ink text-white py-2 rounded-button disabled:opacity-50"
      >
        {busy ? "Checking…" : "Check availability"}
      </button>
    </div>
  );
}
