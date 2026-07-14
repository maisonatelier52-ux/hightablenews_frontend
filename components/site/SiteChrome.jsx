"use client";

import HeaderPreview from "@/components/header-builder/HeaderPreview";
import FooterPreview from "@/components/footer-builder/FooterPreview";
import Skeleton from "@/components/ui/Skeleton";
import { useSiteChrome } from "@/lib/useSiteChrome";
import { useResponsiveDevice } from "@/lib/useResponsiveDevice";

/** Wraps public-facing pages with the header/footer the admin designed in
 *  the Header Builder / Footer Builder. Since that config lives in
 *  localStorage (client-only), this is a client component that fetches on
 *  mount and shows a lightweight skeleton until it's ready. */
export default function SiteChrome({ children }) {
  const { header, footer, loading } = useSiteChrome();
  const device = useResponsiveDevice();

  if (loading) {
    return (
      <div>
        <div className="border-b border-gray-100 px-4 py-4">
          <Skeleton className="h-8 w-48 mx-auto" />
        </div>
        <div className="max-w-6xl mx-auto px-4 py-10">
          <Skeleton className="h-64 w-full mb-6" />
          <Skeleton className="h-6 w-2/3 mb-3" />
          <Skeleton className="h-6 w-1/2" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Mobile & Tablet header — rendered below the desktop (lg, 1024px)
       *  breakpoint and CSS-hidden at lg and above. This is one of exactly
       *  two header instances in the DOM; which one is visible is decided
       *  purely by CSS, never by JS state, so there is no device-detection
       *  logic left that can flicker, remount, or stack extra copies of the
       *  header while resizing/hydrating. */}
      <div className="lg:hidden">
        <HeaderPreview header={header} device="mobile" />
      </div>

      {/* Desktop header — hidden below the lg breakpoint, shown at lg and
       *  above. Mirrors the block above. */}
      <div className="hidden lg:block">
        <HeaderPreview header={header} device="desktop" />
      </div>

      <main className="flex-1">{children}</main>
      <FooterPreview key={device} footer={footer} device={device} />
    </div>
  );
}
