// "use client";

// import HeaderPreview from "@/components/header-builder/HeaderPreview";
// import FooterPreview from "@/components/footer-builder/FooterPreview";
// import Skeleton from "@/components/ui/Skeleton";
// import { useSiteChrome } from "@/lib/useSiteChrome";
// import { useResponsiveDevice } from "@/lib/useResponsiveDevice";

// /** Wraps public-facing pages with the header/footer the admin designed in
//  *  the Header Builder / Footer Builder. Since that config lives in
//  *  localStorage (client-only), this is a client component that fetches on
//  *  mount and shows a lightweight skeleton until it's ready. */
// export default function SiteChrome({ children }) {
//   const { header, footer, loading } = useSiteChrome();
//   const device = useResponsiveDevice();

//   if (loading) {
//     return (
//       <div>
//         <div className="border-b border-gray-100 px-4 py-4">
//           <Skeleton className="h-8 w-48 mx-auto" />
//         </div>
//         <div className="max-w-6xl mx-auto px-4 py-10">
//           <Skeleton className="h-64 w-full mb-6" />
//           <Skeleton className="h-6 w-2/3 mb-3" />
//           <Skeleton className="h-6 w-1/2" />
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen flex flex-col bg-white">
//       {/* Mobile & Tablet header — rendered below the desktop (lg, 1024px)
//        *  breakpoint and CSS-hidden at lg and above. This is one of exactly
//        *  two header instances in the DOM; which one is visible is decided
//        *  purely by CSS, never by JS state, so there is no device-detection
//        *  logic left that can flicker, remount, or stack extra copies of the
//        *  header while resizing/hydrating. */}
//       <div className="lg:hidden">
//         <HeaderPreview header={header} device="mobile" />
//       </div>

//       {/* Desktop header — hidden below the lg breakpoint, shown at lg and
//        *  above. Mirrors the block above. */}
//       <div className="hidden lg:block">
//         <HeaderPreview header={header} device="desktop" />
//       </div>

//       <main className="flex-1">{children}</main>
//       <FooterPreview key={device} footer={footer} device={device} />
//     </div>
//   );
// }

// chnaged for seo

// components/site/SiteChrome.jsx
//
// Wraps public-facing pages with the header/footer the admin designed in
// the Header Builder / Footer Builder. This is now an async Server
// Component: header/footer config is fetched on the server (see
// lib/serverApi.js) and rendered directly into the first HTML response,
// instead of being fetched client-side after a loading skeleton.
//
// Why this matters for SEO/perf: the old client-fetch version meant every
// page's *entire* header/footer (including the masthead tagline, which is
// where most of the page's keyword-relevant text lives) was invisible to
// crawlers and to Lighthouse's first paint — it only existed after a
// mount -> fetch -> setState round trip. Rendering it on the server fixes
// that in one place, for every page that uses SiteChrome.
//
// HeaderPreview/FooterPreview stay client components (they're interactive:
// dropdown menus, search modal, mobile drawer) — Next.js fully supports a
// Server Component rendering a Client Component and passing it
// server-fetched data as props, which is exactly what happens below.
import HeaderPreview from "@/components/header-builder/HeaderPreview";
import FooterPreview from "@/components/footer-builder/FooterPreview";
import { serverApi } from "@/lib/serverApi";
import { getInitialDeviceFromRequest } from "@/lib/getInitialDevice";

export default async function SiteChrome({ children }) {
  const [header, footer] = await Promise.all([serverApi.getHeader(), serverApi.getFooter()]);
  // Best-effort device guess from the request's User-Agent, so the footer
  // (which branches its JSX by device instead of relying purely on CSS)
  // renders the right layout on the very first paint instead of rendering
  // desktop-by-default and swapping a moment later — that swap was a
  // direct contributor to the Cumulative Layout Shift warnings.
  const device = getInitialDeviceFromRequest();

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
      <FooterPreview footer={footer} device={device} />
    </div>
  );
}
