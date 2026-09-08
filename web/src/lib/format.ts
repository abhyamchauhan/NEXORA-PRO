// INR formatting to match the mockup: "Rs. 1,899".
export const inr = (v: number) => "Rs. " + Math.round(v).toLocaleString("en-IN");

export const CATEGORY_LABELS: Record<string, string> = {
  men: "Men",
  women: "Women",
  kids: "Kids",
};

export const PLACEHOLDER_IMG = "/placeholder.svg";

// Clean neutral shown behind transparent product photos when a product has no
// bgColor of its own.
export const DEFAULT_PRODUCT_BG = "#f5f5f5";
