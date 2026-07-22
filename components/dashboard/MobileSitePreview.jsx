"use client";

// components/dashboard/MobileSitePreview.jsx
//
// Realistic iPhone 17-style device frame used by the admin Dashboard's
// "Mobile Site Preview" card. Renders the real site inside an iframe at a
// true mobile viewport width, then scales it down to fit the phone screen —
// so the preview always reflects the actual mobile layout, not a cropped
// desktop view. No external image assets or extra dependencies required.

import Link from "next/link";
import { ExternalLink, Wifi, SignalHigh, BatteryFull } from "lucide-react";

// The viewport the site is actually rendered at (a true mobile width),
// before being visually scaled down to fit inside the phone frame.
const VIEWPORT_W = 390;
const VIEWPORT_H = 844;

// Rendered size of the phone screen inside the card.
const SCREEN_W = 258;
const SCALE = SCREEN_W / VIEWPORT_W;
const SCREEN_H = Math.round(VIEWPORT_H * SCALE);

export default function MobileSitePreview({ src = "/" }) {
  return (
    <div className="rounded-card border border-border bg-white shadow-soft overflow-hidden flex flex-col h-full">
      <div className="px-4 py-3.5 border-b border-border">
        <h3 className="text-[13.5px] font-semibold text-ink-900">Mobile Site Preview</h3>
      </div>

      <div className="bg-surface-soft p-5 flex-1 flex items-center justify-center">
        {/* iPhone 17 device frame */}
        <div className="relative shrink-0" style={{ width: SCREEN_W + 18 }}>
          <div
            className="relative bg-ink-900 rounded-[42px] shadow-lift"
            style={{ padding: 9 }}
          >
            {/* Side buttons */}
            <span className="absolute -left-[2px] top-[86px] w-[2px] h-6 bg-ink-700/70 rounded-r-sm" />
            <span className="absolute -left-[2px] top-[122px] w-[2px] h-10 bg-ink-700/70 rounded-r-sm" />
            <span className="absolute -left-[2px] top-[168px] w-[2px] h-10 bg-ink-700/70 rounded-r-sm" />
            <span className="absolute -right-[2px] top-[130px] w-[2px] h-14 bg-ink-700/70 rounded-l-sm" />

            {/* Screen */}
            <div
              className="relative bg-white rounded-[34px] overflow-hidden"
              style={{ width: SCREEN_W, height: SCREEN_H }}
            >
              {/* Dynamic Island */}
              <div className="absolute top-[8px] left-1/2 -translate-x-1/2 w-[76px] h-[19px] bg-ink-900 rounded-full z-20" />

              {/* Status bar */}
              <div className="absolute top-0 left-0 right-0 h-[32px] flex items-end justify-between px-4 pb-1.5 z-10 text-[9.5px] font-semibold text-ink-900">
                <span>9:41</span>
                <div className="flex items-center gap-1 text-ink-900">
                  <SignalHigh size={10} strokeWidth={2.5} />
                  <Wifi size={10} strokeWidth={2.5} />
                  <BatteryFull size={12} strokeWidth={2} />
                </div>
              </div>

              {/* Site rendered at real mobile viewport, then scaled to fit */}
              <div
                className="absolute top-0 left-0 origin-top-left pointer-events-none"
                style={{ width: VIEWPORT_W, height: VIEWPORT_H, transform: `scale(${SCALE})` }}
              >
                <iframe
                  src={src}
                  title="Mobile site preview"
                  scrolling="no"
                  className="border-0"
                  style={{ width: VIEWPORT_W, height: VIEWPORT_H }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-3 border-t border-border flex justify-center">
        <Link
          href={src}
          target="_blank"
          className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-primary hover:underline"
        >
          Open Live Site <ExternalLink size={12} />
        </Link>
      </div>
    </div>
  );
}