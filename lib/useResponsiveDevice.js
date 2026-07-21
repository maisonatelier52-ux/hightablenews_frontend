// "use client";

// // lib/useResponsiveDevice.js — every builder component (header, homepage
// // blocks, category/article/author templates, footer) already renders three
// // distinct layouts based on a `device` prop ("mobile" | "tablet" |
// // "desktop") — that's how the admin's Monitor/Tablet/Smartphone preview
// // toggle works. The public site was passing a hardcoded device="desktop"
// // on every page, so real phones/tablets always got squeezed desktop
// // layouts instead of the mobile/tablet ones that already exist. This hook
// // reads the *actual* viewport width and keeps it in sync on resize, so the
// // live site uses the same responsive layouts the admin sees in preview.
// //
// // Breakpoints match Tailwind's sm (640px) / lg (1024px) defaults.

// import { useEffect, useRef, useState } from "react";

// function computeDevice(width) {
//   if (width < 640) return "mobile";
//   if (width < 1024) return "tablet";
//   return "desktop";
// }

// export function useResponsiveDevice() {
//   // Default to "desktop" for the very first server-rendered paint (no
//   // window yet); corrected immediately on mount before the user sees it.
//   const [device, setDevice] = useState("desktop");
//   const frameRef = useRef(null);

//   useEffect(() => {
//     // rAF-throttled: a window `resize` event (or a ResizeObserver entry)
//     // can fire many times per second while dragging/emulating, and we only
//     // care about the final width for each paint.
//     function update() {
//       if (frameRef.current) cancelAnimationFrame(frameRef.current);
//       frameRef.current = requestAnimationFrame(() => {
//         setDevice(computeDevice(window.innerWidth));
//       });
//     }

//     update();

//     // Plain browser window resizing fires `resize` reliably. But Chrome
//     // DevTools' device toolbar (and some real mobile browser chrome
//     // show/hide transitions) can change the *viewport* without always
//     // dispatching a `resize` event the page picks up in time — that's why
//     // the header/footer used to get stuck on the desktop layout (nav items
//     // overlapping in a too-narrow container) until a full page reload
//     // reran this check from scratch. A ResizeObserver watching <html>
//     // catches those cases too, so we use both.
//     window.addEventListener("resize", update);
//     window.addEventListener("orientationchange", update);

//     let observer;
//     if (typeof ResizeObserver !== "undefined") {
//       observer = new ResizeObserver(update);
//       observer.observe(document.documentElement);
//     }

//     return () => {
//       window.removeEventListener("resize", update);
//       window.removeEventListener("orientationchange", update);
//       if (observer) observer.disconnect();
//       if (frameRef.current) cancelAnimationFrame(frameRef.current);
//     };
//   }, []);

//   return device;
// }



// chnaged for seo

"use client";

// lib/useResponsiveDevice.js — every builder component (header, homepage
// blocks, category/article/author templates, footer) already renders three
// distinct layouts based on a `device` prop ("mobile" | "tablet" |
// "desktop") — that's how the admin's Monitor/Tablet/Smartphone preview
// toggle works. The public site was passing a hardcoded device="desktop"
// on every page, so real phones/tablets always got squeezed desktop
// layouts instead of the mobile/tablet ones that already exist. This hook
// reads the *actual* viewport width and keeps it in sync on resize, so the
// live site uses the same responsive layouts the admin sees in preview.
//
// Breakpoints match Tailwind's sm (640px) / lg (1024px) defaults.

import { useEffect, useRef, useState } from "react";

function computeDevice(width) {
  if (width < 640) return "mobile";
  if (width < 1024) return "tablet";
  return "desktop";
}

export function useResponsiveDevice(initialDevice = "desktop") {
  // Defaults to "desktop" for the very first server-rendered paint if the
  // caller doesn't have a better guess. Callers that do have one (a
  // server-rendered page that read the request's User-Agent — see
  // lib/getInitialDevice.js) pass it in so the first paint is far more
  // likely to already match the real viewport, avoiding a layout swap.
  // Either way this is corrected against the *actual* viewport on mount.
  const [device, setDevice] = useState(initialDevice);
  const frameRef = useRef(null);

  useEffect(() => {
    // rAF-throttled: a window `resize` event (or a ResizeObserver entry)
    // can fire many times per second while dragging/emulating, and we only
    // care about the final width for each paint.
    function update() {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      frameRef.current = requestAnimationFrame(() => {
        setDevice(computeDevice(window.innerWidth));
      });
    }

    update();

    // Plain browser window resizing fires `resize` reliably. But Chrome
    // DevTools' device toolbar (and some real mobile browser chrome
    // show/hide transitions) can change the *viewport* without always
    // dispatching a `resize` event the page picks up in time — that's why
    // the header/footer used to get stuck on the desktop layout (nav items
    // overlapping in a too-narrow container) until a full page reload
    // reran this check from scratch. A ResizeObserver watching <html>
    // catches those cases too, so we use both.
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);

    let observer;
    if (typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(update);
      observer.observe(document.documentElement);
    }

    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
      if (observer) observer.disconnect();
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return device;
}
