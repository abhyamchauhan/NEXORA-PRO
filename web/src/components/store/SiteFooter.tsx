import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="bg-black text-white mt-20">
      <div className="max-w-container mx-auto px-6 py-14 grid gap-10 sm:grid-cols-4">
        <div className="sm:col-span-1">
          <p className="font-display text-2xl">NEXORA</p>
          <p className="text-grey-400 text-sm mt-3 max-w-xs">
            Premium streetwear, engineered clean. Men · Women · Kids.
          </p>
        </div>
        <FooterCol
          title="Shop"
          links={[
            { href: "/shop?category=men", label: "Men" },
            { href: "/shop?category=women", label: "Women" },
            { href: "/shop?category=kids", label: "Kids" },
            { href: "/shop", label: "All products" },
          ]}
        />
        <FooterCol
          title="Help"
          links={[
            { href: "/refund-policy", label: "Returns & refunds" },
            { href: "/refund-policy", label: "Shipping" },
            { href: "/privacy", label: "Privacy Policy" },
            { href: "/terms", label: "Terms of Service" },
          ]}
        />
        <FooterCol
          title="Account"
          links={[
            { href: "/account", label: "My account" },
            { href: "/orders", label: "Orders" },
            { href: "/cart", label: "Bag" },
          ]}
        />
      </div>
      <div className="border-t border-graphite">
        <div className="max-w-container mx-auto px-6 py-5 text-xs text-grey-500 flex flex-wrap justify-between gap-2">
          <span>© {new Date().getFullYear()} NEXORA. All rights reserved.</span>
          <span>Made in India · Prices in INR</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <p className="font-display text-xs tracking-label text-grey-500 mb-4">
        {title}
      </p>
      <ul className="space-y-2 text-sm">
        {links.map((l) => (
          <li key={l.label}>
            <Link href={l.href} className="text-grey-300 hover:text-white">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
