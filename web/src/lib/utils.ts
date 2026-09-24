import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Standard shadcn `cn` helper: merge conditional class names, de-duping
// conflicting Tailwind utilities.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
