/* @ds-bundle: {"format":4,"namespace":"GENRAGEDesignSystem_3c3d93","components":[{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"IconButton","sourcePath":"components/core/IconButton.jsx"},{"name":"PriceTag","sourcePath":"components/core/PriceTag.jsx"},{"name":"RatingStars","sourcePath":"components/core/RatingStars.jsx"},{"name":"QuantityStepper","sourcePath":"components/forms/QuantityStepper.jsx"},{"name":"SizeSelector","sourcePath":"components/forms/SizeSelector.jsx"},{"name":"AnnouncementBar","sourcePath":"components/product/AnnouncementBar.jsx"},{"name":"ProductCard","sourcePath":"components/product/ProductCard.jsx"}],"sourceHashes":{"components/core/Badge.jsx":"0a8fec56c3dc","components/core/Button.jsx":"dbbcbe52d42e","components/core/IconButton.jsx":"24585913a310","components/core/PriceTag.jsx":"04b28d9e9e6e","components/core/RatingStars.jsx":"8e5aba57f63e","components/forms/QuantityStepper.jsx":"5a7d54992e66","components/forms/SizeSelector.jsx":"c7c90651b4d7","components/product/AnnouncementBar.jsx":"740745c68f06","components/product/ProductCard.jsx":"66ae5562741a","ui_kits/storefront/App.jsx":"9146749d9a36","ui_kits/storefront/CartDrawer.jsx":"731842ee3d44","ui_kits/storefront/Footer.jsx":"5bfcf4004623","ui_kits/storefront/Header.jsx":"f02364211d6d","ui_kits/storefront/Hero.jsx":"03ec21215d9f","ui_kits/storefront/ProductDetail.jsx":"3bfbe5875f25","ui_kits/storefront/ProductGrid.jsx":"5ab72f279814","ui_kits/storefront/data.js":"1c642dee0b03"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.GENRAGEDesignSystem_3c3d93 = window.GENRAGEDesignSystem_3c3d93 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** GENRAGE Badge — hard rectangular product flag. Sits on product imagery. */
function Badge({
  children,
  tone = "sale",
  style,
  ...rest
}) {
  const tones = {
    sale: {
      background: "var(--gr-sale,#c5312d)",
      color: "var(--gr-sale-fg,#fff)"
    },
    soldout: {
      background: "var(--gr-white,#fff)",
      color: "var(--gr-grey-500,#6b6b6b)"
    },
    custom: {
      background: "var(--gr-ink,#1c1c1c)",
      color: "var(--gr-white,#fff)"
    },
    success: {
      background: "var(--gr-success-bg,#d4e3cb)",
      color: "var(--gr-rating-deep,#307a07)"
    }
  };
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: "inline-flex",
      alignItems: "center",
      padding: "5px 10px",
      fontFamily: "var(--font-body)",
      fontWeight: 700,
      fontSize: "0.6875rem",
      letterSpacing: "0.04em",
      textTransform: "uppercase",
      lineHeight: 1,
      borderRadius: "var(--radius-none,0px)",
      ...tones[tone],
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * GENRAGE Button — the hard, uppercase CTA.
 * Primary = ink fill / white label. Secondary = outline. Ghost = text-only.
 */
function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  disabled = false,
  type = "button",
  onClick,
  style,
  ...rest
}) {
  const sizes = {
    sm: {
      padding: "8px 16px",
      fontSize: "0.75rem"
    },
    md: {
      padding: "13px 26px",
      fontSize: "0.8125rem"
    },
    lg: {
      padding: "17px 34px",
      fontSize: "0.875rem"
    }
  };
  const base = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    fontFamily: "var(--font-body)",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    lineHeight: 1.2,
    borderRadius: "var(--radius-button, 2px)",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.45 : 1,
    width: fullWidth ? "100%" : "auto",
    transition: "background var(--dur,200ms) ease, opacity var(--dur,200ms) ease, transform var(--dur-fast,120ms) ease",
    border: "1.5px solid transparent",
    ...sizes[size]
  };
  const variants = {
    primary: {
      background: "var(--action-bg, #1c1c1c)",
      color: "var(--action-fg, #fff)",
      borderColor: "var(--action-bg, #1c1c1c)"
    },
    secondary: {
      background: "transparent",
      color: "var(--gr-ink, #1c1c1c)",
      borderColor: "var(--gr-ink, #1c1c1c)"
    },
    ghost: {
      background: "transparent",
      color: "var(--gr-ink, #1c1c1c)",
      borderColor: "transparent",
      padding: "6px 4px"
    },
    inverse: {
      background: "var(--gr-white, #fff)",
      color: "var(--gr-ink, #1c1c1c)",
      borderColor: "var(--gr-white, #fff)"
    }
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    disabled: disabled,
    onClick: onClick,
    style: {
      ...base,
      ...variants[variant],
      ...style
    },
    onMouseDown: e => {
      if (!disabled) e.currentTarget.style.transform = "translateY(1px)";
    },
    onMouseUp: e => {
      e.currentTarget.style.transform = "translateY(0)";
    },
    onMouseLeave: e => {
      e.currentTarget.style.transform = "translateY(0)";
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** GENRAGE IconButton — bordered square or pill for cart/search/account/close. */
function IconButton({
  children,
  label,
  shape = "square",
  variant = "bare",
  size = 40,
  onClick,
  style,
  ...rest
}) {
  const variants = {
    bare: {
      background: "transparent",
      color: "var(--gr-ink,#1c1c1c)",
      border: "none"
    },
    outline: {
      background: "transparent",
      color: "var(--gr-ink,#1c1c1c)",
      border: "1px solid var(--border-strong,#a7a7a7)"
    },
    solid: {
      background: "var(--gr-white,#fff)",
      color: "var(--gr-ink,#1c1c1c)",
      border: "1px solid var(--border-hairline,#ddd)"
    },
    dark: {
      background: "var(--gr-ink,#1c1c1c)",
      color: "var(--gr-white,#fff)",
      border: "none"
    }
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    "aria-label": label,
    onClick: onClick,
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: size,
      height: size,
      borderRadius: shape === "circle" ? "9999px" : "var(--radius-none,0px)",
      cursor: "pointer",
      transition: "opacity var(--dur,200ms) ease, background var(--dur,200ms) ease",
      ...variants[variant],
      ...style
    },
    onMouseEnter: e => e.currentTarget.style.opacity = "0.6",
    onMouseLeave: e => e.currentTarget.style.opacity = "1"
  }, rest), children);
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/core/PriceTag.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Formats paise/number to GENRAGE's `Rs. 999` format (no decimals). */
function rupees(v) {
  const n = typeof v === "number" ? v : parseFloat(v);
  return "Rs. " + Math.round(n).toLocaleString("en-IN");
}

/**
 * GENRAGE PriceTag — current price, optional struck compare-at, optional red
 * "Save X%". Prices are plain rupees (pass whole rupees, not paise).
 */
function PriceTag({
  price,
  compareAt,
  size = "md",
  showSave = true,
  style,
  ...rest
}) {
  const hasSale = compareAt != null && Number(compareAt) > Number(price);
  const pct = hasSale ? Math.round((1 - Number(price) / Number(compareAt)) * 100) : 0;
  const sizes = {
    sm: "0.8125rem",
    md: "0.9375rem",
    lg: "1.125rem"
  };
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: "0.5rem",
      flexWrap: "wrap",
      fontFamily: "var(--font-body)",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 700,
      fontSize: sizes[size],
      color: "var(--gr-ink,#1c1c1c)"
    }
  }, rupees(price)), hasSale && /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 400,
      fontSize: sizes[size],
      color: "var(--gr-grey-500,#6b6b6b)",
      textDecoration: "line-through"
    }
  }, rupees(compareAt)), hasSale && showSave && /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 700,
      fontSize: "0.75rem",
      color: "var(--gr-sale,#c5312d)",
      textTransform: "uppercase",
      letterSpacing: "0.03em"
    }
  }, "Save ", pct, "%"));
}
Object.assign(__ds_scope, { PriceTag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/PriceTag.jsx", error: String((e && e.message) || e) }); }

// components/core/RatingStars.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** GENRAGE RatingStars — green Judge.me-style stars + optional count. */
function RatingStars({
  rating = 0,
  count,
  size = 15,
  showValue = false,
  style,
  ...rest
}) {
  const full = Math.round(rating * 2) / 2;
  const Star = ({
    fill
  }) => /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    width: size,
    height: size,
    "aria-hidden": "true",
    style: {
      display: "block"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 2.5l2.74 5.56 6.13.9-4.44 4.32 1.05 6.1L12 16.98l-5.48 2.88 1.05-6.1L3.13 9.46l6.13-.9L12 2.5Z",
    fill: fill ? "var(--star,#47a730)" : "none",
    stroke: "var(--star,#47a730)",
    strokeWidth: fill ? 0 : 1.5
  }));
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "0.4rem",
      fontFamily: "var(--font-body)",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      gap: "1px"
    }
  }, [0, 1, 2, 3, 4].map(i => /*#__PURE__*/React.createElement(Star, {
    key: i,
    fill: i < full
  }))), showValue && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "0.8125rem",
      fontWeight: 700,
      color: "var(--gr-ink,#1c1c1c)"
    }
  }, rating.toFixed(2)), count != null && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "0.8125rem",
      color: "var(--gr-grey-500,#6b6b6b)"
    }
  }, "(", count, ")"));
}
Object.assign(__ds_scope, { RatingStars });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/RatingStars.jsx", error: String((e && e.message) || e) }); }

// components/forms/QuantityStepper.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** GENRAGE QuantityStepper — square −/＋ control for cart lines. */
function QuantityStepper({
  value,
  defaultValue = 1,
  min = 1,
  max = 99,
  onChange,
  style,
  ...rest
}) {
  const [internal, setInternal] = React.useState(defaultValue);
  const qty = value !== undefined ? value : internal;
  const set = n => {
    const c = Math.max(min, Math.min(max, n));
    if (value === undefined) setInternal(c);
    onChange && onChange(c);
  };
  const btn = {
    width: 38,
    height: 38,
    border: "none",
    background: "transparent",
    fontFamily: "var(--font-body)",
    fontSize: "1.1rem",
    lineHeight: 1,
    cursor: "pointer",
    color: "var(--gr-ink,#1c1c1c)",
    transition: "opacity var(--dur,200ms) ease"
  };
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: "inline-flex",
      alignItems: "center",
      border: "1px solid var(--border-strong,#a7a7a7)",
      borderRadius: "var(--radius-none,0px)",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": "Decrease",
    style: btn,
    onClick: () => set(qty - 1)
  }, "\u2212"), /*#__PURE__*/React.createElement("span", {
    style: {
      minWidth: 34,
      textAlign: "center",
      fontFamily: "var(--font-body)",
      fontWeight: 700,
      fontSize: "0.875rem"
    }
  }, qty), /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": "Increase",
    style: btn,
    onClick: () => set(qty + 1)
  }, "\uFF0B"));
}
Object.assign(__ds_scope, { QuantityStepper });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/QuantityStepper.jsx", error: String((e && e.message) || e) }); }

// components/forms/SizeSelector.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** GENRAGE SizeSelector — square size chips (S–XXL). Controlled or uncontrolled. */
function SizeSelector({
  sizes = ["S", "M", "L", "XL", "XXL"],
  value,
  defaultValue,
  soldOut = [],
  onChange,
  style,
  ...rest
}) {
  const [internal, setInternal] = React.useState(defaultValue ?? null);
  const selected = value !== undefined ? value : internal;
  const pick = s => {
    if (soldOut.includes(s)) return;
    if (value === undefined) setInternal(s);
    onChange && onChange(s);
  };
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: "0.5rem",
      ...style
    }
  }, rest), sizes.map(s => {
    const isSel = selected === s;
    const isOut = soldOut.includes(s);
    return /*#__PURE__*/React.createElement("button", {
      key: s,
      type: "button",
      onClick: () => pick(s),
      disabled: isOut,
      "aria-pressed": isSel,
      style: {
        minWidth: 46,
        height: 44,
        padding: "0 12px",
        fontFamily: "var(--font-body)",
        fontWeight: 700,
        fontSize: "0.8125rem",
        textTransform: "uppercase",
        letterSpacing: "0.03em",
        cursor: isOut ? "not-allowed" : "pointer",
        borderRadius: "var(--radius-none,0px)",
        border: "1px solid " + (isSel ? "var(--gr-ink,#1c1c1c)" : "var(--border-strong,#a7a7a7)"),
        background: isSel ? "var(--gr-ink,#1c1c1c)" : "transparent",
        color: isSel ? "var(--gr-white,#fff)" : isOut ? "var(--gr-grey-400,#a7a7a7)" : "var(--gr-ink,#1c1c1c)",
        textDecoration: isOut ? "line-through" : "none",
        transition: "background var(--dur,200ms) ease, border-color var(--dur,200ms) ease"
      }
    }, s);
  }));
}
Object.assign(__ds_scope, { SizeSelector });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/SizeSelector.jsx", error: String((e && e.message) || e) }); }

// components/product/AnnouncementBar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** GENRAGE AnnouncementBar — the black top strip that rotates hype/trust lines. */
function AnnouncementBar({
  messages = ["FREE DOORSTEP DELIVERY IN INDIA 🇮🇳", "LOVED BY 300,000+ HAPPY CUSTOMERS! ⭐️", "LIMITED TIME OFFER, SHOP NOW! 🎧"],
  interval = 3000,
  style,
  ...rest
}) {
  const [i, setI] = React.useState(0);
  React.useEffect(() => {
    if (messages.length < 2) return;
    const t = setInterval(() => setI(p => (p + 1) % messages.length), interval);
    return () => clearInterval(t);
  }, [messages.length, interval]);
  const arrow = {
    background: "none",
    border: "none",
    color: "inherit",
    cursor: "pointer",
    fontSize: "0.8rem",
    opacity: 0.7,
    padding: "0 4px",
    lineHeight: 1
  };
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "1rem",
      background: "var(--gr-black,#000)",
      color: "var(--gr-white,#fff)",
      padding: "9px 16px",
      fontFamily: "var(--font-display)",
      fontWeight: 600,
      fontSize: "0.72rem",
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("button", {
    style: arrow,
    "aria-label": "Previous",
    onClick: () => setI(p => (p - 1 + messages.length) % messages.length)
  }, "\u2039"), /*#__PURE__*/React.createElement("span", {
    style: {
      textAlign: "center",
      minWidth: 0
    }
  }, messages[i]), /*#__PURE__*/React.createElement("button", {
    style: arrow,
    "aria-label": "Next",
    onClick: () => setI(p => (p + 1) % messages.length)
  }, "\u203A"));
}
Object.assign(__ds_scope, { AnnouncementBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/product/AnnouncementBar.jsx", error: String((e && e.message) || e) }); }

// components/product/ProductCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * GENRAGE ProductCard — the storefront grid tile. Tall 4:5 image (no border,
 * no shadow, no radius), alt image cross-fades on hover, stacked meta below.
 */
function ProductCard({
  title,
  image,
  hoverImage,
  price,
  compareAt,
  rating,
  reviews,
  badge,
  soldOut = false,
  href = "#",
  onQuickAdd,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const hasSale = compareAt != null && Number(compareAt) > Number(price);
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "0.75rem",
      fontFamily: "var(--font-body)",
      ...style
    },
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false)
  }, rest), /*#__PURE__*/React.createElement("a", {
    href: href,
    style: {
      position: "relative",
      display: "block",
      aspectRatio: "4 / 5",
      overflow: "hidden",
      background: "var(--gr-grey-050,#f5f5f5)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 10,
      left: 10,
      display: "flex",
      flexDirection: "column",
      gap: 6,
      zIndex: 2
    }
  }, soldOut && /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    tone: "soldout"
  }, "Sold out"), !soldOut && badge && /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    tone: "custom"
  }, badge), !soldOut && !badge && hasSale && /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    tone: "sale"
  }, "Save ", Math.round((1 - Number(price) / Number(compareAt)) * 100), "%")), /*#__PURE__*/React.createElement("img", {
    src: image,
    alt: title,
    loading: "lazy",
    style: {
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover",
      opacity: hover && hoverImage ? 0 : 1,
      transition: "opacity var(--dur-slow,320ms) ease"
    }
  }), hoverImage && /*#__PURE__*/React.createElement("img", {
    src: hoverImage,
    alt: "",
    "aria-hidden": "true",
    style: {
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover",
      opacity: hover ? 1 : 0,
      transition: "opacity var(--dur-slow,320ms) ease"
    }
  }), onQuickAdd && !soldOut && /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: e => {
      e.preventDefault();
      onQuickAdd();
    },
    style: {
      position: "absolute",
      left: 10,
      right: 10,
      bottom: 10,
      zIndex: 2,
      padding: "11px",
      border: "none",
      cursor: "pointer",
      background: "var(--gr-ink,#1c1c1c)",
      color: "var(--gr-white,#fff)",
      fontFamily: "var(--font-body)",
      fontWeight: 700,
      fontSize: "0.75rem",
      textTransform: "uppercase",
      letterSpacing: "0.05em",
      borderRadius: "var(--radius-button,2px)",
      opacity: hover ? 1 : 0,
      transform: hover ? "translateY(0)" : "translateY(6px)",
      transition: "opacity var(--dur,200ms) ease, transform var(--dur,200ms) ease"
    }
  }, "Quick add")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "0.35rem"
    }
  }, rating != null && /*#__PURE__*/React.createElement(__ds_scope.RatingStars, {
    rating: rating,
    count: reviews
  }), /*#__PURE__*/React.createElement("a", {
    href: href,
    style: {
      fontWeight: 700,
      fontSize: "0.875rem",
      color: "var(--gr-ink,#1c1c1c)",
      lineHeight: 1.3
    }
  }, title), /*#__PURE__*/React.createElement(__ds_scope.PriceTag, {
    price: price,
    compareAt: compareAt
  })));
}
Object.assign(__ds_scope, { ProductCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/product/ProductCard.jsx", error: String((e && e.message) || e) }); }

// ui_kits/storefront/App.jsx
try { (() => {
// GENRAGE storefront — App shell (home ⇄ PDP, cart drawer)
const {
  AnnouncementBar
} = window.GENRAGEDesignSystem_3c3d93;
function App() {
  const [view, setView] = React.useState({
    name: "home"
  });
  const [cart, setCart] = React.useState([]);
  const [cartOpen, setCartOpen] = React.useState(false);
  const add = (p, size, qty = 1) => {
    const key = p.id + "-" + size;
    setCart(c => {
      const found = c.find(it => it.key === key);
      if (found) return c.map(it => it.key === key ? {
        ...it,
        qty: it.qty + qty
      } : it);
      return [...c, {
        key,
        id: p.id,
        title: p.title,
        img: p.img,
        price: p.price,
        size,
        qty
      }];
    });
    setCartOpen(true);
  };
  const setQty = (key, q) => setCart(c => c.map(it => it.key === key ? {
    ...it,
    qty: q
  } : it));
  const remove = key => setCart(c => c.filter(it => it.key !== key));
  const count = cart.reduce((s, it) => s + it.qty, 0);
  const goHome = () => {
    setView({
      name: "home"
    });
    window.scrollTo(0, 0);
  };
  const openPDP = p => {
    setView({
      name: "pdp",
      product: p
    });
    window.scrollTo(0, 0);
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(AnnouncementBar, {
    messages: window.GR_DATA.announcements
  }), /*#__PURE__*/React.createElement(Header, {
    cartCount: count,
    onCart: () => setCartOpen(true),
    onHome: goHome
  }), view.name === "home" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Hero, {
    onShop: () => document.getElementById("grid").scrollIntoView({
      behavior: "smooth"
    })
  }), /*#__PURE__*/React.createElement("div", {
    id: "grid"
  }, /*#__PURE__*/React.createElement(ProductGrid, {
    onOpen: openPDP,
    onAdd: add
  }))), view.name === "pdp" && /*#__PURE__*/React.createElement(ProductDetail, {
    product: view.product,
    onAdd: add,
    onBack: goHome
  }), /*#__PURE__*/React.createElement(Footer, null), /*#__PURE__*/React.createElement(CartDrawer, {
    open: cartOpen,
    items: cart,
    onClose: () => setCartOpen(false),
    onQty: setQty,
    onRemove: remove
  }));
}
ReactDOM.createRoot(document.getElementById("root")).render(/*#__PURE__*/React.createElement(App, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/storefront/App.jsx", error: String((e && e.message) || e) }); }

// ui_kits/storefront/CartDrawer.jsx
try { (() => {
// GENRAGE storefront — Cart drawer
const {
  Button,
  QuantityStepper
} = window.GENRAGEDesignSystem_3c3d93;
function CartDrawer({
  open,
  items,
  onClose,
  onQty,
  onRemove
}) {
  const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0);
  const rupees = n => "Rs. " + Math.round(n).toLocaleString("en-IN");
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: "fixed",
      inset: 0,
      zIndex: 60,
      background: "rgba(0,0,0,.4)",
      opacity: open ? 1 : 0,
      pointerEvents: open ? "auto" : "none",
      transition: "opacity .2s ease"
    }
  }), /*#__PURE__*/React.createElement("aside", {
    style: {
      position: "fixed",
      top: 0,
      right: 0,
      bottom: 0,
      zIndex: 61,
      width: "min(420px, 100vw)",
      background: "#fff",
      boxShadow: "-8px 0 40px rgba(0,0,0,.12)",
      transform: open ? "translateX(0)" : "translateX(100%)",
      transition: "transform .28s cubic-bezier(.22,.61,.36,1)",
      display: "flex",
      flexDirection: "column"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "20px 22px",
      borderBottom: "1px solid #ddd"
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: "-.01em",
      fontSize: 18,
      margin: 0
    }
  }, "Your Cart (", items.length, ")"), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    "aria-label": "Close",
    style: {
      background: "none",
      border: "none",
      cursor: "pointer",
      padding: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    dangerouslySetInnerHTML: {
      __html: '<svg fill="none" width="16" height="16" viewBox="0 0 16 16"><path d="m1 1 14 14M1 15 15 1" stroke="currentColor" stroke-width="2"/></svg>'
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: "auto",
      padding: "6px 22px"
    }
  }, items.length === 0 && /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "var(--font-body)",
      color: "#6b6b6b",
      textAlign: "center",
      marginTop: 60
    }
  }, "Your cart is empty. Go find your rage."), items.map(it => /*#__PURE__*/React.createElement("div", {
    key: it.key,
    style: {
      display: "flex",
      gap: 14,
      padding: "18px 0",
      borderBottom: "1px solid #eee"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: window.GR_IMG(it.img, 200),
    alt: "",
    style: {
      width: 72,
      height: 90,
      objectFit: "cover",
      background: "#f5f5f5",
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "var(--font-body)",
      fontWeight: 700,
      fontSize: 13,
      margin: "0 0 2px"
    }
  }, it.title), /*#__PURE__*/React.createElement("button", {
    onClick: () => onRemove(it.key),
    "aria-label": "Remove",
    style: {
      background: "none",
      border: "none",
      cursor: "pointer",
      color: "#a7a7a7",
      fontSize: 16,
      lineHeight: 1
    }
  }, "\xD7")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "var(--font-body)",
      fontSize: 12,
      color: "#6b6b6b",
      margin: "0 0 10px"
    }
  }, "Size ", it.size), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement(QuantityStepper, {
    value: it.qty,
    onChange: q => onQty(it.key, q)
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-body)",
      fontWeight: 700,
      fontSize: 14
    }
  }, rupees(it.price * it.qty))))))), items.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 22,
      borderTop: "1px solid #ddd"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: 16,
      fontFamily: "var(--font-body)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: ".04em",
      fontSize: 13
    }
  }, "Subtotal"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 700,
      fontSize: 16
    }
  }, rupees(subtotal))), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg",
    fullWidth: true
  }, "Checkout"))));
}
window.CartDrawer = CartDrawer;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/storefront/CartDrawer.jsx", error: String((e && e.message) || e) }); }

// ui_kits/storefront/Footer.jsx
try { (() => {
// GENRAGE storefront — Footer
function Footer() {
  const col = (title, links) => /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "var(--font-display)",
      textTransform: "uppercase",
      letterSpacing: ".1em",
      fontSize: 12,
      margin: 0
    }
  }, title), /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: "none",
      padding: 0,
      margin: 0,
      display: "flex",
      flexDirection: "column",
      gap: 8
    }
  }, links.map(l => /*#__PURE__*/React.createElement("li", {
    key: l
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => e.preventDefault(),
    style: {
      fontFamily: "var(--font-body)",
      fontSize: 13,
      color: "rgba(255,255,255,.7)"
    }
  }, l)))));
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      background: "#000",
      color: "#fff"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1360,
      margin: "0 auto",
      padding: "clamp(40px,6vw,64px) clamp(16px,4vw,48px)",
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
      gap: 40
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: "1 / -1",
      maxWidth: 300
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: "-.01em",
      fontSize: 30,
      marginBottom: 12
    }
  }, "GENRAGE"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "var(--font-body)",
      fontSize: 13,
      color: "rgba(255,255,255,.6)",
      lineHeight: 1.6,
      margin: 0
    }
  }, "Proudly homegrown in India. Streetwear for the 300,000+.")), col("Shop", ["Tops", "Bottoms", "New In", "Sale"]), col("Help", ["Track order", "Returns & exchange", "Size guide", "Contact"]), col("Company", ["About us", "Sustainability", "Careers", "Stores"])), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: "1px solid #262626"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1360,
      margin: "0 auto",
      padding: "18px clamp(16px,4vw,48px)",
      display: "flex",
      flexWrap: "wrap",
      gap: 12,
      justifyContent: "space-between",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "var(--font-display)",
      textTransform: "uppercase",
      letterSpacing: ".08em",
      fontSize: 11,
      color: "rgba(255,255,255,.5)",
      margin: 0
    }
  }, "Proudly Homegrown in India \uD83C\uDDEE\uD83C\uDDF3"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "var(--font-body)",
      fontSize: 12,
      color: "rgba(255,255,255,.5)",
      margin: 0
    }
  }, "\xA9 GENRAGE"))));
}
window.Footer = Footer;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/storefront/Footer.jsx", error: String((e && e.message) || e) }); }

// ui_kits/storefront/Header.jsx
try { (() => {
// GENRAGE storefront — Header (logo, nav, actions)
const {
  IconButton
} = window.GENRAGEDesignSystem_3c3d93;
function Header({
  cartCount,
  onCart,
  onHome
}) {
  const nav = window.GR_DATA.nav;
  const [open, setOpen] = React.useState(null);
  const svg = (d, w = 24) => /*#__PURE__*/React.createElement("span", {
    dangerouslySetInnerHTML: {
      __html: `<svg fill="none" width="${w}" height="${w}" viewBox="0 0 24 24">${d}</svg>`
    }
  });
  const searchI = svg('<path d="M10.364 3a7.364 7.364 0 1 0 0 14.727 7.364 7.364 0 0 0 0-14.727Z" stroke="currentColor" stroke-width="2"/><path d="M15.857 15.858 21 21.001" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>', 22);
  const acctI = svg('<path d="M16.125 8.75c-.184 2.478-2.063 4.5-4.125 4.5s-3.944-2.021-4.125-4.5c-.187-2.578 1.64-4.5 4.125-4.5 2.484 0 4.313 1.969 4.125 4.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M3.017 20.747C3.783 16.5 7.922 14.25 12 14.25s8.217 2.25 8.984 6.497" stroke="currentColor" stroke-width="2"/>', 22);
  const cartI = svg('<path d="M4.75 8.25A.75.75 0 0 0 4 9L3 19.125c0 1.418 1.207 2.625 2.625 2.625h12.75c1.418 0 2.625-1.149 2.625-2.566L20 9a.75.75 0 0 0-.75-.75H4.75Zm2.75 0v-1.5a4.5 4.5 0 0 1 4.5-4.5 4.5 4.5 0 0 1 4.5 4.5v1.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>', 22);
  return /*#__PURE__*/React.createElement("header", {
    style: {
      position: "sticky",
      top: 0,
      zIndex: 40,
      background: "#fff",
      borderBottom: "1px solid #ddd"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1360,
      margin: "0 auto",
      padding: "0 clamp(16px,4vw,48px)",
      height: 68,
      display: "grid",
      gridTemplateColumns: "1fr auto 1fr",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("nav", {
    style: {
      display: "flex",
      gap: 22
    }
  }, nav.map(n => /*#__PURE__*/React.createElement("div", {
    key: n.label,
    style: {
      position: "relative"
    },
    onMouseEnter: () => setOpen(n.label),
    onMouseLeave: () => setOpen(null)
  }, /*#__PURE__*/React.createElement("button", {
    style: {
      background: "none",
      border: "none",
      cursor: "pointer",
      fontFamily: "var(--font-display)",
      fontWeight: 600,
      textTransform: "uppercase",
      letterSpacing: ".04em",
      fontSize: 12,
      color: "#1c1c1c",
      padding: "24px 0"
    }
  }, n.label), open === n.label && n.items.length > 0 && /*#__PURE__*/React.createElement("ul", {
    style: {
      position: "absolute",
      top: "100%",
      left: 0,
      listStyle: "none",
      margin: 0,
      padding: "12px 0",
      background: "#fff",
      border: "1px solid #ddd",
      minWidth: 180,
      boxShadow: "0 5px 30px rgba(0,0,0,.05)"
    }
  }, n.items.map(it => /*#__PURE__*/React.createElement("li", {
    key: it
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => e.preventDefault(),
    style: {
      display: "block",
      padding: "7px 18px",
      fontSize: 13,
      color: "#1c1c1c"
    }
  }, it))))))), /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      onHome();
    },
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: "-.01em",
      fontSize: 26,
      color: "#1c1c1c"
    }
  }, "GENRAGE"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "flex-end",
      alignItems: "center",
      gap: 4
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    label: "Search"
  }, searchI), /*#__PURE__*/React.createElement(IconButton, {
    label: "Account"
  }, acctI), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    label: "Cart",
    onClick: onCart
  }, cartI), cartCount > 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      top: 4,
      right: 2,
      minWidth: 16,
      height: 16,
      padding: "0 4px",
      background: "#c5312d",
      color: "#fff",
      borderRadius: 9999,
      fontSize: 10,
      fontWeight: 700,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, cartCount)))));
}
window.Header = Header;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/storefront/Header.jsx", error: String((e && e.message) || e) }); }

// ui_kits/storefront/Hero.jsx
try { (() => {
// GENRAGE storefront — Hero (full-bleed dark drop banner)
const {
  Button
} = window.GENRAGEDesignSystem_3c3d93;
function Hero({
  onShop
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      position: "relative",
      background: "#000",
      color: "#fff",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      opacity: 0.5,
      backgroundImage: `url(${window.GR_IMG("monarch-dark-grey-boxy-jacket-genrage-1.png", 1400)})`,
      backgroundSize: "cover",
      backgroundPosition: "center 20%",
      filter: "grayscale(0.3)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: "linear-gradient(90deg, rgba(0,0,0,.85) 0%, rgba(0,0,0,.45) 60%, rgba(0,0,0,.2) 100%)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      maxWidth: 1360,
      margin: "0 auto",
      padding: "clamp(48px,9vw,120px) clamp(16px,4vw,48px)"
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "var(--font-display)",
      textTransform: "uppercase",
      letterSpacing: ".14em",
      fontSize: 12,
      opacity: 0.85,
      margin: "0 0 14px"
    }
  }, "Winter Drop \xB7 2026"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: "-.01em",
      lineHeight: 0.95,
      fontSize: "clamp(48px,9vw,104px)",
      margin: "0 0 22px",
      maxWidth: 720
    }
  }, "Wear", /*#__PURE__*/React.createElement("br", null), "Your Rage"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "var(--font-body)",
      fontSize: 16,
      lineHeight: 1.6,
      maxWidth: 440,
      margin: "0 0 30px",
      opacity: 0.9
    }
  }, "Boxy fits, baggy silhouettes, heavyweight cotton. Proudly homegrown in India \u2014 loved by 300,000+ RAGERS."), /*#__PURE__*/React.createElement(Button, {
    variant: "inverse",
    size: "lg",
    onClick: onShop
  }, "Shop the drop")));
}
window.Hero = Hero;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/storefront/Hero.jsx", error: String((e && e.message) || e) }); }

// ui_kits/storefront/ProductDetail.jsx
try { (() => {
// GENRAGE storefront — Product detail (PDP) view
const {
  Button,
  PriceTag,
  RatingStars,
  SizeSelector,
  QuantityStepper,
  Badge
} = window.GENRAGEDesignSystem_3c3d93;
function ProductDetail({
  product,
  onAdd,
  onBack
}) {
  const [size, setSize] = React.useState(null);
  const [qty, setQty] = React.useState(1);
  const [imgIdx, setImgIdx] = React.useState(0);
  const p = product;
  const imgs = [p.img, p.alt];
  const pct = Math.round((1 - p.price / p.was) * 100);
  return /*#__PURE__*/React.createElement("section", {
    style: {
      maxWidth: 1360,
      margin: "0 auto",
      padding: "24px clamp(16px,4vw,48px) 72px"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onBack,
    style: {
      background: "none",
      border: "none",
      cursor: "pointer",
      fontFamily: "var(--font-body)",
      fontWeight: 700,
      fontSize: 13,
      color: "#6b6b6b",
      padding: "8px 0 24px",
      textTransform: "uppercase",
      letterSpacing: ".04em"
    }
  }, "\u2039 Back to shop"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
      gap: "clamp(24px,4vw,56px)",
      alignItems: "start"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      aspectRatio: "4/5",
      background: "#f5f5f5",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 12,
      left: 12,
      zIndex: 2
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "sale"
  }, "Save ", pct, "%")), /*#__PURE__*/React.createElement("img", {
    src: window.GR_IMG(imgs[imgIdx], 900),
    alt: p.title,
    style: {
      width: "100%",
      height: "100%",
      objectFit: "cover"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10
    }
  }, imgs.map((im, i) => /*#__PURE__*/React.createElement("button", {
    key: i,
    onClick: () => setImgIdx(i),
    style: {
      width: 72,
      height: 90,
      padding: 0,
      border: "1px solid " + (i === imgIdx ? "#1c1c1c" : "#ddd"),
      background: "#f5f5f5",
      cursor: "pointer",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: window.GR_IMG(im, 200),
    alt: "",
    style: {
      width: "100%",
      height: "100%",
      objectFit: "cover"
    }
  }))))), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 440
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "var(--font-display)",
      textTransform: "uppercase",
      letterSpacing: ".12em",
      fontSize: 11,
      color: "#6b6b6b",
      margin: "0 0 8px"
    }
  }, p.type, " \xB7 GENRAGE"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: "-.01em",
      fontSize: 30,
      margin: "0 0 12px"
    }
  }, p.title), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement(RatingStars, {
    rating: p.rating,
    count: p.reviews,
    showValue: true
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement(PriceTag, {
    price: p.price,
    compareAt: p.was,
    size: "lg"
  })), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "var(--font-display)",
      textTransform: "uppercase",
      letterSpacing: ".08em",
      fontSize: 11,
      color: "#1c1c1c",
      margin: "0 0 10px",
      fontWeight: 600
    }
  }, "Size ", p.sizes[0].length > 1 && p.sizes[0].match(/\d/) ? "(waist)" : ""), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement(SizeSelector, {
    sizes: p.sizes,
    soldOut: p.sold,
    value: size,
    onChange: setSize
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 12,
      alignItems: "stretch",
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement(QuantityStepper, {
    value: qty,
    onChange: setQty,
    style: {
      height: 48
    }
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg",
    fullWidth: true,
    onClick: () => onAdd(p, size || p.sizes.find(s => !p.sold.includes(s)), qty),
    style: {
      flex: 1
    }
  }, "Add to cart")), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "lg",
    fullWidth: true,
    style: {
      marginBottom: 24
    }
  }, "Buy it now"), /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: "none",
      padding: 0,
      margin: 0,
      display: "flex",
      flexDirection: "column",
      gap: 10,
      fontFamily: "var(--font-body)",
      fontSize: 13,
      color: "#4a4a4a"
    }
  }, /*#__PURE__*/React.createElement("li", null, "\uD83C\uDDEE\uD83C\uDDF3 Free doorstep delivery across India"), /*#__PURE__*/React.createElement("li", null, "\u21BA 7-day easy returns & exchange"), /*#__PURE__*/React.createElement("li", null, "\u2605 Loved by 300,000+ RAGERS")))));
}
window.ProductDetail = ProductDetail;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/storefront/ProductDetail.jsx", error: String((e && e.message) || e) }); }

// ui_kits/storefront/ProductGrid.jsx
try { (() => {
// GENRAGE storefront — ProductGrid ("Just Dropped")
const {
  ProductCard
} = window.GENRAGEDesignSystem_3c3d93;
function ProductGrid({
  onOpen,
  onAdd,
  title = "Just Dropped",
  eyebrow = "New Arrivals"
}) {
  const products = window.GR_DATA.products;
  return /*#__PURE__*/React.createElement("section", {
    style: {
      maxWidth: 1360,
      margin: "0 auto",
      padding: "clamp(40px,6vw,72px) clamp(16px,4vw,48px)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      marginBottom: 40
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "var(--font-display)",
      textTransform: "uppercase",
      letterSpacing: ".14em",
      fontSize: 12,
      color: "#6b6b6b",
      margin: "0 0 8px"
    }
  }, eyebrow), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: "-.01em",
      fontSize: "clamp(28px,5vw,44px)",
      margin: 0
    }
  }, title)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))",
      gap: "clamp(16px,2vw,28px)"
    }
  }, products.map(p => /*#__PURE__*/React.createElement(ProductCard, {
    key: p.id,
    title: p.title,
    image: window.GR_IMG(p.img, 700),
    hoverImage: window.GR_IMG(p.alt, 700),
    price: p.price,
    compareAt: p.was,
    rating: p.rating,
    reviews: p.reviews,
    soldOut: p.sizes.every(s => p.sold.includes(s)),
    href: "#",
    onQuickAdd: () => onAdd(p, p.sizes.find(s => !p.sold.includes(s))),
    style: {
      cursor: "pointer"
    },
    onClick: e => {
      if (e.target.tagName !== "BUTTON") onOpen(p);
    }
  }))));
}
window.ProductGrid = ProductGrid;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/storefront/ProductGrid.jsx", error: String((e && e.message) || e) }); }

// ui_kits/storefront/data.js
try { (() => {
// GENRAGE storefront kit — sample catalog (real products, prices & CDN imagery).
window.GR_DATA = {
  cdn: "https://genrage.com/cdn/shop/files/",
  announcements: ["FREE DOORSTEP DELIVERY IN INDIA 🇮🇳", "LOVED BY 300,000+ HAPPY CUSTOMERS! ⭐️", "LIMITED TIME OFFER, SHOP NOW! 🎧"],
  nav: [{
    label: "TOPS",
    items: ["Tank Top", "Tshirt", "Hoodies", "Jackets", "Full Sleeve", "Baby Tee"]
  }, {
    label: "BOTTOMS",
    items: ["Pants", "Jeans", "Shorts"]
  }, {
    label: "NEW IN",
    items: []
  }, {
    label: "SALE",
    items: []
  }],
  products: [{
    id: "trishul",
    title: "Trishul Black Vest",
    type: "Vest",
    img: "trishul-black-vest-genrage-1.png",
    alt: "trishul-black-vest-genrage-2.png",
    price: 999,
    was: 1499,
    rating: 4.58,
    reviews: 12,
    sizes: ["S", "M", "L", "XL", "XXL"],
    sold: []
  }, {
    id: "vanta",
    title: "Vanta Black Boxy Shirt",
    type: "Shirt",
    img: "vanta-black-boxy-shirt-genrage-1.png",
    alt: "5_109452eb-45a2-4bbd-bfad-1b36cbff9f7c.png",
    price: 1274,
    was: 1499,
    rating: 4.7,
    reviews: 8,
    sizes: ["S", "M", "L", "XL", "XXL"],
    sold: ["XXL"]
  }, {
    id: "vow",
    title: "Vow White Tshirt",
    type: "Tshirt",
    img: "vow-white-tshirt-genrage-1.png",
    alt: "vow-white-tshirt-genrage-2.png",
    price: 649,
    was: 999,
    rating: 4.8,
    reviews: 34,
    sizes: ["S", "M", "L", "XL", "XXL"],
    sold: []
  }, {
    id: "quill",
    title: "Quill Black Tshirt",
    type: "Tshirt",
    img: "quill-black-tshirt-genrage-6.png",
    alt: "quill-black-tshirt-genrage-7.png",
    price: 649,
    was: 999,
    rating: 4.6,
    reviews: 27,
    sizes: ["S", "M", "L", "XL", "XXL"],
    sold: []
  }, {
    id: "basilisk",
    title: "Basilisk Grey Baggy Pants",
    type: "Pants",
    img: "basilisk-grey-baggy-pants-genrage-5.png",
    alt: "basilisk-grey-baggy-pants-genrage-1.png",
    price: 1379,
    was: 1999,
    rating: 4.75,
    reviews: 41,
    sizes: ["28", "30", "32", "34", "36"],
    sold: []
  }, {
    id: "vigil",
    title: "Vigil Black Baggy Pants",
    type: "Pants",
    img: "vigil-black-baggy-pants-genrage-1.png",
    alt: "vigil-black-baggy-pants-genrage-2.png",
    price: 1299,
    was: 1999,
    rating: 4.9,
    reviews: 19,
    sizes: ["28", "30", "32", "34", "36"],
    sold: []
  }, {
    id: "monarch",
    title: "Monarch Dark Grey Boxy Jacket",
    type: "Jacket",
    img: "monarch-dark-grey-boxy-jacket-genrage-1.png",
    alt: "monarch-dark-grey-boxy-jacket-genrage-2.png",
    price: 2189,
    was: 2999,
    rating: 4.85,
    reviews: 15,
    sizes: ["S", "M", "L", "XL"],
    sold: []
  }, {
    id: "lilith",
    title: "Lilith Grey Boxy Jacket",
    type: "Jacket",
    img: "lilith-grey-boxy-jacket-genrage-1.png",
    alt: "lilith-grey-boxy-jacket-genrage-2.png",
    price: 2189,
    was: 2999,
    rating: 4.7,
    reviews: 11,
    sizes: ["S", "M", "L", "XL"],
    sold: []
  }, {
    id: "angel",
    title: "Angel White Vest",
    type: "Vest",
    img: "angel-white-vest-genrage-7.png",
    alt: "angel-white-vest-genrage-8.png",
    price: 999,
    was: 1499,
    rating: 4.9,
    reviews: 21,
    sizes: ["S", "M", "L", "XL", "XXL"],
    sold: ["S", "XXL"]
  }, {
    id: "corpse",
    title: "Corpse Black Vest",
    type: "Vest",
    img: "corpse-black-vest-genrage-1.png",
    alt: "corpse-black-vest-genrage-2.png",
    price: 999,
    was: 1499,
    rating: 4.6,
    reviews: 9,
    sizes: ["S", "M", "L", "XL", "XXL"],
    sold: []
  }, {
    id: "fatal",
    title: "Fatal Black Unisex Shorts",
    type: "Shorts",
    img: "fatal-black-unisex-shorts-genrage-1.png",
    alt: "fatal-black-unisex-shorts-genrage-2.png",
    price: 899,
    was: 1299,
    rating: 4.5,
    reviews: 6,
    sizes: ["S", "M", "L", "XL"],
    sold: []
  }, {
    id: "prowl",
    title: "Prowl Black Tshirt",
    type: "Tshirt",
    img: "prowl-black-tshirt-genrage-4.png",
    alt: "prowl-black-tshirt-genrage-5.png",
    price: 649,
    was: 999,
    rating: 4.7,
    reviews: 18,
    sizes: ["S", "M", "L", "XL", "XXL"],
    sold: []
  }]
};
window.GR_IMG = (file, w = 800) => window.GR_DATA.cdn + file + "?width=" + w;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/storefront/data.js", error: String((e && e.message) || e) }); }

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.PriceTag = __ds_scope.PriceTag;

__ds_ns.RatingStars = __ds_scope.RatingStars;

__ds_ns.QuantityStepper = __ds_scope.QuantityStepper;

__ds_ns.SizeSelector = __ds_scope.SizeSelector;

__ds_ns.AnnouncementBar = __ds_scope.AnnouncementBar;

__ds_ns.ProductCard = __ds_scope.ProductCard;

})();
