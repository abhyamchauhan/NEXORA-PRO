export type Shipping = {
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
};

type Result = { ok: true; data: Shipping } | { ok: false; error: string };

const PHONE_RE = /^[6-9]\d{9}$/; // Indian mobile
const PIN_RE = /^\d{6}$/;

export function parseShipping(raw: unknown): Result {
  const b = (raw ?? {}) as Record<string, unknown>;
  const s = (k: string) => (typeof b[k] === "string" ? (b[k] as string).trim() : "");

  const data: Shipping = {
    name: s("name"),
    phone: s("phone"),
    address: s("address"),
    city: s("city"),
    state: s("state"),
    pincode: s("pincode"),
  };

  if (data.name.length < 2) return { ok: false, error: "Enter a valid name." };
  if (!PHONE_RE.test(data.phone))
    return { ok: false, error: "Enter a valid 10-digit mobile number." };
  if (data.address.length < 5)
    return { ok: false, error: "Enter your full address." };
  if (!data.city) return { ok: false, error: "Enter your city." };
  if (!data.state) return { ok: false, error: "Enter your state." };
  if (!PIN_RE.test(data.pincode))
    return { ok: false, error: "Enter a valid 6-digit PIN code." };

  return { ok: true, data };
}
