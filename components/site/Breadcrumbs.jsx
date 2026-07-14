import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import JsonLd from "./JsonLd";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.hightablenews.com";

/**
 * items: [{ label, href }] — href omitted on the last (current) item.
 * Renders both the visible trail and its BreadcrumbList JSON-LD twin.
 */
export default function Breadcrumbs({ items = [] }) {
  const full = [{ label: "Home", href: "/" }, ...items];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: full.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      item: item.href ? `${SITE_URL}${item.href}` : undefined,
    })),
  };

  return (
    <nav aria-label="Breadcrumb" className="max-w-6xl mx-auto px-4 pt-4">
      <JsonLd data={jsonLd} />
      <ol className="flex flex-wrap items-center gap-1.5 text-[12.5px] text-ink-500">
        {full.map((item, i) => {
          const isLast = i === full.length - 1;
          return (
            <li key={`${item.label}-${i}`} className="flex items-center gap-1.5">
              {i === 0 ? (
                <Link href="/" className="flex items-center gap-1 hover:text-primary transition-colors">
                  <Home size={12.5} />
                  <span>{item.label}</span>
                </Link>
              ) : isLast ? (
                <span className="font-medium text-ink-700 truncate max-w-[240px]">{item.label}</span>
              ) : (
                <Link href={item.href} className="hover:text-primary transition-colors truncate max-w-[200px]">
                  {item.label}
                </Link>
              )}
              {!isLast && <ChevronRight size={12} className="text-ink-300" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
