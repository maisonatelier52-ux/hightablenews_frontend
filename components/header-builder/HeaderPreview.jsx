"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Search, ChevronDown, Menu as MenuIcon, Twitter, Facebook, Instagram, Linkedin, Youtube, BookOpen, Rss, MessageCircle, Pin, X } from "lucide-react";
import { getAllPreviewArticlesSorted, articleHref } from "@/lib/articlesSource";
import { getFooter } from "@/lib/api";
import SubscribeModal from "@/components/site/SubscribeModal";
import SearchModal from "@/components/site/SearchModal";

export const FONT_STACKS = {
  inter: "Inter, system-ui, sans-serif",
  playfair: "'Playfair Display', Georgia, serif",
  blackletter: "'UnifrakturMaguntia', Georgia, serif",
  georgia: "Georgia, 'Times New Roman', serif",
  times: "'Times New Roman', Times, serif",
};

const SOCIAL_ICON_MAP = {
  instagram: Instagram,
  twitter: Twitter,
  facebook: Facebook,
  linkedin: Linkedin,
  youtube: Youtube,
  medium: BookOpen,
  substack: Rss,
  reddit: MessageCircle,
  pinterest: Pin,
};

// Computes the *current* date on every call instead of returning a frozen
// string, so the top bar always shows today's date and rolls over at
// midnight automatically. `format` only controls how it is displayed.
function getFormattedDate(format = "full") {
  const now = new Date();
  switch (format) {
    case "none":
      return "";
    case "numeric":
      return now.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" });
    case "short":
      return now.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
    case "full":
    default:
      return now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  }
}

function Logo({ logo, mobile, disableLinks }) {
  const size = mobile ? Math.max(18, Math.round(logo.size * 0.55)) : logo.size;
  const handleClick = disableLinks ? (e) => e.preventDefault() : undefined;
  if (logo.type === "image" && logo.image) {
    return (
      <Link href="/" onClick={handleClick} className="inline-flex items-center">
        <img src={logo.image} alt={logo.text} style={{ height: size }} className="object-contain" />
      </Link>
    );
  }
  return (
    <Link
      href="/"
      onClick={handleClick}
      style={{
        fontFamily: FONT_STACKS[logo.font] || FONT_STACKS.blackletter,
        color: logo.color,
        fontSize: size,
        lineHeight: 1,
        fontWeight: logo.fontWeight || "700",
        letterSpacing: (logo.letterSpacing ?? 0) + "px",
      }}
      className="whitespace-nowrap"
    >
      {logo.text || "HighTableNews"}
    </Link>
  );
}

// Small hover-aware primitives used in the top bar. Colors are admin-
// configurable hex values (not fixed Tailwind classes), so the hover swap is
// done with local component state rather than a Tailwind `hover:` class.
function HoverIcon({ icon: Icon, size, color, hoverColor, href, disableLinks }) {
  const [hov, setHov] = useState(false);
  const style = { color: hov ? hoverColor : color, display: "inline-flex", transition: "color 150ms" };
  // Social icons link out to the URL configured in the Footer Builder's
  // Social editor (the single source of truth for social account URLs).
  // Without an href these were just static icons — nothing happened on
  // click. Fall back to a non-interactive span if no URL is configured yet.
  if (href && !disableLinks) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={style}
        aria-label="Social link"
      >
        <Icon size={size} />
      </a>
    );
  }
  return (
    <span
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={style}
    >
      <Icon size={size} />
    </span>
  );
}

function HoverLink({ children, href, color, hoverColor, className = "", disableLinks }) {
  const [hov, setHov] = useState(false);
  const style = { color: hov ? hoverColor : color, transition: "color 150ms" };
  if (href && !disableLinks) {
    const isExternal = /^https?:\/\//i.test(href);
    return isExternal ? (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        className={className}
        style={{ ...style, cursor: "pointer" }}
      >
        {children}
      </a>
    ) : (
      <Link
        href={href}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        className={className}
        style={{ ...style, cursor: "pointer" }}
      >
        {children}
      </Link>
    );
  }
  return (
    <span
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className={className}
      style={{ ...style, cursor: href ? "pointer" : "default" }}
    >
      {children}
    </span>
  );
}

function SubscribeButton({ topBar, onClick }) {
  const [hov, setHov] = useState(false);
  const bg = topBar.subscribeBg || "#7f1d1d";
  const hoverBg = topBar.subscribeHoverBg || "#c0392b";
  const textColor = topBar.subscribeTextColor || "#ffffff";
  const radius = topBar.subscribeRadius ?? 6;
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="font-semibold text-[10px] px-2.5 py-1 whitespace-nowrap transition-colors"
      style={{ background: hov ? hoverBg : bg, color: textColor, borderRadius: radius }}
    >
      Subscribe
    </button>
  );
}

function TopBar({ topBar, mobile, footerSocialLinks, disableLinks, onSubscribeClick }) {
  if (!topBar.enabled) return null;
  const dateText = topBar.leftText?.trim() ? topBar.leftText : getFormattedDate(topBar.dateFormat);
  const bg = topBar.bg || "#111111";
  const tc = topBar.textColor || "#ffffff";
  const itemColor = topBar.rightItemColor || "#9ca3af";
  const itemHoverColor = topBar.rightItemHoverColor || "#ffffff";
  const platforms = topBar.socialPlatforms || ["instagram", "twitter", "facebook", "linkedin"];

  return (
    <div className="flex items-center justify-between px-4 py-1.5 text-[11px]" style={{ background: bg, color: tc }}>
      <span className="truncate">{dateText}</span>
      {!mobile && (
        <div className="flex items-center gap-3 shrink-0">
          {topBar.rightItems.includes("socialIcons") && (
            <span className="flex items-center gap-2">
              {platforms.map((p) => {
                const Icon = SOCIAL_ICON_MAP[p];
                return Icon ? (
                  <HoverIcon
                    key={p}
                    icon={Icon}
                    size={11}
                    color={itemColor}
                    hoverColor={itemHoverColor}
                    href={topBar.socialLinks?.[p] || footerSocialLinks?.[p]}
                    disableLinks={disableLinks}
                  />
                ) : null;
              })}
            </span>
          )}
          {topBar.rightItems.includes("eEdition") && (
            <HoverLink href={topBar.eEditionUrl} color={itemColor} hoverColor={itemHoverColor} disableLinks={disableLinks}>E-Edition</HoverLink>
          )}
          {topBar.rightItems.includes("subscribe") && (
            <SubscribeButton topBar={topBar} onClick={disableLinks ? undefined : onSubscribeClick} />
          )}
        </div>
      )}
    </div>
  );
}

function BreakingNewsBanner({ breakingNews }) {
  const [paused, setPaused] = useState(false);
  const [allArticles, setAllArticles] = useState([]);

  useEffect(() => {
    setAllArticles(getAllPreviewArticlesSorted());
  }, []);

  if (!breakingNews.enabled) return null;

  const chosenIds = breakingNews.articleIds || [];
  const byId = Object.fromEntries(allArticles.map((a) => [a.id, a]));
  const items = chosenIds.length > 0
    ? chosenIds.map((id) => byId[id]).filter(Boolean)
    : allArticles.slice(0, 3); // default: latest 3 published articles

  if (items.length === 0) return null;

  const speed = breakingNews.speed ?? 80;
  // Convert px/sec to duration: approx. 1200px content at given speed
  const duration = Math.round(1200 / speed);

  const labelBg =
    breakingNews.bg ||
    (breakingNews.style === "red" ? "#b30000" : breakingNews.style === "blue" ? "#2563eb" : "#111111");
  const labelTextColor = breakingNews.labelTextColor || "#ffffff";
  const tickerBg = breakingNews.tickerBg ?? "#111111";
  const tickerTextColor = breakingNews.textColor || "#ffffff";

  const track = (
    <>
      {items.map((a, i) => {
        const href = articleHref(a);
        return (
          <span key={`${a.id}-${i}`} className="inline-flex items-center">
            {href ? <Link href={href} className="hover:underline underline-offset-2">{a.title}</Link> : <span>{a.title}</span>}
            <span className="mx-3 opacity-50">•</span>
          </span>
        );
      })}
    </>
  );

  return (
    <div className="flex items-stretch overflow-hidden" style={{ background: tickerBg }}>
      <span
        className="flex items-center px-3 py-1.5 text-[11px] font-bold shrink-0 whitespace-nowrap"
        style={{ background: labelBg, color: labelTextColor }}
      >
        {breakingNews.labelText || "BREAKING"}
      </span>
      <div
        className="flex-1 overflow-hidden relative"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div
          className="flex items-center whitespace-nowrap py-1.5 px-3 text-[12px]"
          style={{ animation: `htn-ticker ${duration}s linear infinite`, animationPlayState: paused ? "paused" : "running", color: tickerTextColor }}
        >
          {track}
          {track}
        </div>
      </div>
    </div>
  );
}

// Shared hover-dropdown behavior for desktop nav items with submenus.
//
// The submenu used to be an `absolute` child positioned via the trigger's
// `relative` wrapper, which only rendered correctly as long as every
// ancestor kept `overflow: visible`. The nav bars set `overflow-x-auto`
// (so many menu items can scroll on narrower desktop widths) alongside
// `overflow-y-visible`, but per the CSS spec that pairing is invalid:
// once one axis is non-visible, a "visible" value on the other axis is
// computed as "auto" by the browser — so the submenu was silently being
// clipped/hidden no matter what we set. Hovering "More" would highlight
// the link but the dropdown never appeared.
//
// Fix: render the submenu through a portal straight onto <body>, positioned
// with fixed coordinates from the trigger's bounding box. That removes it
// from the scrolling nav's box entirely, so no ancestor overflow can clip
// it. A short close delay (with a shared timer) lets the cursor travel from
// the trigger down into the portal content without the menu flickering
// closed in between.
function useHoverDropdown() {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const anchorRef = useRef(null);
  const closeTimer = useRef(null);

  function clearCloseTimer() {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }

  function show() {
    clearCloseTimer();
    if (anchorRef.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      setCoords({ top: rect.bottom, left: rect.left });
    }
    setOpen(true);
  }

  function scheduleHide() {
    clearCloseTimer();
    closeTimer.current = setTimeout(() => setOpen(false), 150);
  }

  useEffect(() => clearCloseTimer, []);

  return { open, coords, anchorRef, show, scheduleHide };
}

function NavDropdownPortal({ coords, minWidth = 160, onMouseEnter, onMouseLeave, children }) {
  if (typeof document === "undefined") return null;
  return createPortal(
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="fixed bg-white border border-border rounded-md shadow-lift z-[9999] py-1"
      style={{ top: coords.top, left: coords.left, minWidth }}
    >
      {children}
    </div>,
    document.body
  );
}

function NavLink({ item, menuStyle, mobile, disableLinks }) {
  const { open, coords, anchorRef, show, scheduleHide } = useHoverDropdown();
  const [hovered, setHovered] = useState(false);
  const hoverColor = menuStyle?.hoverColor || "#b30000";
  const effect = menuStyle?.hoverEffect || "red-underline";
  const fontSize = menuStyle?.fontSize || 12;
  const uppercase = menuStyle?.uppercase !== false;
  const hasChildren = item.children?.length > 0;
  // Items with a dropdown don't need (and shouldn't use) their own link —
  // they exist purely to reveal their submenu. Clicking one just toggles
  // the dropdown (useful on touch devices where there's no hover) instead
  // of navigating to a URL the admin no longer has to fill in.
  function handleClick(e) {
    if (hasChildren) {
      e.preventDefault();
      // Touch devices have no hover, so a tap toggles the dropdown directly.
      if (open) scheduleHide();
      else show();
      return;
    }
    if (disableLinks) e.preventDefault();
  }
  const handleChildClick = disableLinks ? (e) => e.preventDefault() : undefined;

  const baseStyle = {
    fontSize,
    fontWeight: menuStyle?.fontWeight || "700",
    letterSpacing: (menuStyle?.letterSpacing ?? 0.5) + "px",
    textTransform: uppercase ? "uppercase" : "none",
    whiteSpace: "nowrap",
    cursor: "pointer",
  };

  function getLinkClass(hov) {
    if (!hov) return "text-ink-700 py-2";
    if (effect === "red-underline" || effect === "blue-underline") return "py-2";
    if (effect === "background") return "py-2 px-2 rounded";
    if (effect === "bold") return "py-2 font-black";
    return "py-2";
  }

  function getHoverStyle(hov) {
    if (!hov) return {};
    if (effect === "red-underline" || effect === "blue-underline") {
      return { color: hoverColor, textDecoration: "underline", textUnderlineOffset: 3, textDecorationColor: hoverColor };
    }
    if (effect === "background") return { color: hoverColor, background: hoverColor + "15" };
    if (effect === "bold") return { color: hoverColor };
    return {};
  }

  return (
    <div
      ref={anchorRef}
      className="relative"
      onMouseEnter={() => { show(); setHovered(true); }}
      onMouseLeave={() => { scheduleHide(); setHovered(false); }}
    >
      <Link
        href={hasChildren ? "#" : (item.url || "#")}
        onClick={handleClick}
        className={`flex items-center gap-0.5 ${getLinkClass(hovered)}`}
        style={{ ...baseStyle, ...getHoverStyle(hovered) }}
      >
        {item.label}
        {hasChildren && <ChevronDown size={10} />}
      </Link>
      {hasChildren && open && (
        <NavDropdownPortal coords={coords} onMouseEnter={show} onMouseLeave={scheduleHide}>
          {item.children.map((c) => (
            <Link
              key={c.id}
              href={c.url || "#"}
              onClick={handleChildClick}
              className="block px-3.5 py-2 text-[12px] hover:bg-black/5 cursor-pointer whitespace-nowrap text-ink-700"
            >
              {c.label}
            </Link>
          ))}
        </NavDropdownPortal>
      )}
    </div>
  );
}

// Extracted into its own component (instead of calling useState() inline
// inside menu.map()) — calling hooks inside a loop callback is what caused
// the "Rendered more hooks than during the previous render" crash on the
// Magazine Red Bar layout. Each <RedNavLink> is its own component instance,
// so each gets a stable, independent set of hooks.
function RedNavLink({ item, disableLinks }) {
  const [hov, setHov] = useState(false);
  const { open, coords, anchorRef, show, scheduleHide } = useHoverDropdown();
  const hasChildren = item.children?.length > 0;
  function handleParentClick(e) {
    if (hasChildren) {
      e.preventDefault();
      if (open) scheduleHide();
      else show();
      return;
    }
    if (disableLinks) e.preventDefault();
  }
  const handleChildClick = disableLinks ? (e) => e.preventDefault() : undefined;
  return (
    <div
      ref={anchorRef}
      className="relative"
      onMouseEnter={() => { setHov(true); show(); }}
      onMouseLeave={() => { setHov(false); scheduleHide(); }}
    >
      <Link
        href={hasChildren ? "#" : (item.url || "#")}
        onClick={handleParentClick}
        className="flex items-center gap-0.5 py-2.5 px-3 text-[11.5px] font-bold uppercase tracking-wide whitespace-nowrap cursor-pointer"
        style={{ color: hov ? "rgba(255,255,255,0.7)" : "white" }}
      >
        {item.label}
        {hasChildren && <ChevronDown size={10} />}
      </Link>
      {hasChildren && open && (
        <NavDropdownPortal coords={coords} onMouseEnter={show} onMouseLeave={scheduleHide}>
          {item.children.map((c) => (
            <Link key={c.id} href={c.url || "#"} onClick={handleChildClick} className="block px-3.5 py-2 text-[12px] hover:bg-black/5 cursor-pointer text-ink-700">{c.label}</Link>
          ))}
        </NavDropdownPortal>
      )}
    </div>
  );
}

function RightControls({ rightSide, mobile, footerSocialLinks, disableLinks, onSubscribeClick, onSearchClick }) {
  const socialPlatforms = rightSide.socialPlatforms || ["instagram", "twitter", "facebook"];
  return (
    <div className="flex items-center gap-2.5 shrink-0">
      {rightSide.socialIcons && !mobile && (
        <span className="flex items-center gap-1.5 text-ink-400">
          {socialPlatforms.map((p) => {
            const Icon = SOCIAL_ICON_MAP[p];
            if (!Icon) return null;
            const href = rightSide.socialLinks?.[p] || footerSocialLinks?.[p];
            return href && !disableLinks ? (
              <a key={p} href={href} target="_blank" rel="noopener noreferrer" aria-label="Social link" className="hover:text-ink-700 transition-colors">
                <Icon size={13} />
              </a>
            ) : (
              <Icon key={p} size={13} />
            );
          })}
        </span>
      )}
      {rightSide.eEditionLink && !mobile && (
        rightSide.eEditionUrl && !disableLinks ? (
          /^https?:\/\//i.test(rightSide.eEditionUrl) ? (
            <a href={rightSide.eEditionUrl} target="_blank" rel="noopener noreferrer" className="text-[11px] font-medium text-ink-600 px-1 hover:text-ink-900 transition-colors">E-Edition</a>
          ) : (
            <Link href={rightSide.eEditionUrl} className="text-[11px] font-medium text-ink-600 px-1 hover:text-ink-900 transition-colors">E-Edition</Link>
          )
        ) : (
          <button type="button" className="text-[11px] font-medium text-ink-600 px-1">E-Edition</button>
        )
      )}
      {rightSide.searchEnabled && (
        <button type="button" onClick={disableLinks ? undefined : onSearchClick} aria-label="Search" className="text-ink-500 hover:text-ink-800 transition-colors">
          <Search size={15} />
        </button>
      )}
      {rightSide.loginButton && <button className="text-[12px] font-semibold text-ink-700 px-1.5">Login</button>}
      {rightSide.subscribeButton && (
        <button
          type="button"
          onClick={disableLinks ? undefined : onSubscribeClick}
          className="text-[12px] font-semibold text-white bg-red-600 px-3 py-1.5 rounded-md hover:bg-red-700 transition-colors"
        >
          Subscribe
        </button>
      )}
    </div>
  );
}

// --- Mobile menu overlay -----------------------------------------------
// Renders the actual menu surface for the "Mobile Layout" setting
// (Hamburger Drawer / Full Screen Menu / Bottom Sheet Menu). Previously
// none of these were wired up — the hamburger icon either had no onClick
// at all, or toggled state that nothing ever read.

function MobileMenuItem({ item, menuStyle, accent, onNavigate, disableLinks }) {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = item.children?.length > 0;
  const labelStyle = {
    fontSize: (menuStyle?.fontSize || 12) + 2,
    fontWeight: menuStyle?.fontWeight || "700",
    textTransform: menuStyle?.uppercase !== false ? "uppercase" : "none",
    letterSpacing: (menuStyle?.letterSpacing ?? 0.5) + "px",
  };
  const handleClick = disableLinks ? (e) => e.preventDefault() : onNavigate;
  return (
    <div className="border-b border-border/70">
      {hasChildren ? (
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          className="w-full flex items-center justify-between py-3 text-left text-ink-900"
          style={labelStyle}
        >
          {item.label}
          <ChevronDown size={14} style={{ color: accent, transform: expanded ? "rotate(180deg)" : "none", transition: "transform 150ms" }} />
        </button>
      ) : (
        <Link
          href={item.url || "#"}
          onClick={handleClick}
          className="w-full flex items-center justify-between py-3 text-left text-ink-900"
          style={labelStyle}
        >
          {item.label}
        </Link>
      )}
      {hasChildren && expanded && (
        <div className="pb-2.5 pl-3 space-y-2">
          {item.children.map((c) => (
            <Link key={c.id} href={c.url || "#"} onClick={handleClick} className="block text-[12.5px] text-ink-500 py-1">{c.label}</Link>
          ))}
        </div>
      )}
    </div>
  );
}

function MobileMenuFooter({ mobile, onSubscribeClick, onSearchClick }) {
  const showSearch = mobile?.showSearch ?? true;
  const showLogin = mobile?.showLogin ?? true;
  const showSubscribe = mobile?.showSubscribe ?? true;
  if (!showSearch && !showLogin && !showSubscribe) return null;
  return (
    <div className="flex items-center gap-4 pt-4 mt-1 border-t border-border">
      {showSearch && (
        <button type="button" onClick={onSearchClick} className="flex items-center gap-1.5 text-[12.5px] text-ink-600">
          <Search size={14} /> Search
        </button>
      )}
      {showLogin && <button className="text-[12.5px] font-semibold text-ink-700">Login</button>}
      {showSubscribe && (
        <button
          type="button"
          onClick={onSubscribeClick}
          className="ml-auto text-[12.5px] font-semibold text-white bg-red-600 px-3 py-1.5 rounded-md hover:bg-red-700 transition-colors"
        >
          Subscribe
        </button>
      )}
    </div>
  );
}

function MobileMenuOverlay({ layout, menu, menuStyle, mobile, logo, onClose, disableLinks, onSubscribeClick, onSearchClick }) {
  const accent = menuStyle?.hoverColor || "#b30000";

  const menuList = (
    <>
      {menu.map((item) => (
        <MobileMenuItem key={item.id} item={item} menuStyle={menuStyle} accent={accent} onNavigate={onClose} disableLinks={disableLinks} />
      ))}
      <MobileMenuFooter mobile={mobile} onSubscribeClick={disableLinks ? undefined : onSubscribeClick} onSearchClick={disableLinks ? undefined : onSearchClick} />
    </>
  );

  if (layout === "fullscreen") {
    return (
      <div className="absolute inset-0 z-30 bg-white flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
          <Logo logo={logo} mobile disableLinks={disableLinks} />
          <button onClick={onClose} className="p-1 text-ink-700" aria-label="Close menu">
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-4">{menuList}</div>
      </div>
    );
  }

  if (layout === "bottomSheet") {
    return (
      <div className="absolute inset-0 z-30">
        <div className="absolute inset-0 bg-black/40" onClick={onClose} />
        <div className="absolute left-0 right-0 bottom-0 max-h-[78%] bg-white rounded-t-2xl shadow-lift flex flex-col overflow-hidden">
          <div className="flex items-center justify-center pt-2.5 pb-1 shrink-0">
            <span className="h-1 w-10 rounded-full bg-border" />
          </div>
          <div className="flex items-center justify-between px-4 pb-2 border-b border-border shrink-0">
            <span className="text-[12.5px] font-semibold text-ink-900">Menu</span>
            <button onClick={onClose} className="p-1 text-ink-500" aria-label="Close menu">
              <X size={16} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-4">{menuList}</div>
        </div>
      </div>
    );
  }

  // "drawer" (default) — slides in from the left, dimmed backdrop on the rest
  return (
    <div className="absolute inset-0 z-30">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute left-0 top-0 bottom-0 w-[78%] max-w-[280px] bg-white shadow-lift flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
          <Logo logo={logo} mobile disableLinks={disableLinks} />
          <button onClick={onClose} className="p-1 text-ink-700" aria-label="Close menu">
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-4">{menuList}</div>
      </div>
    </div>
  );
}

export default function HeaderPreview({ header, device = "desktop", disableLinks = false }) {
  const mobile = device === "mobile";
  const [openMenu, setOpenMenu] = useState(false);
  const [subscribeOpen, setSubscribeOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [, forceTick] = useState(0);
  const [socialLinks, setSocialLinks] = useState({});
  const { template, logo, menu, topBar, rightSide, breakingNews, behavior, menuStyle, mobile: mobileSettings, masthead } = header;

  // Re-render once a minute so the top bar's computed date rolls over to the
  // next day on its own, without needing a page refresh.
  useEffect(() => {
    const id = setInterval(() => forceTick((t) => t + 1), 60 * 1000);
    return () => clearInterval(id);
  }, []);

  // The header builder only lets the admin pick *which* platforms to show as
  // icons — the actual account URLs live in the Footer Builder's Social
  // editor (footer.social: [{ platform, url }]). Pull that in so the header's
  // social icons are real, clickable links instead of dead decoration.
  useEffect(() => {
    let cancelled = false;
    getFooter().then((f) => {
      if (cancelled) return;
      const map = {};
      (f?.social || []).forEach((s) => {
        if (s.platform && s.url && s.url !== "#") map[s.platform] = s.url;
      });
      setSocialLinks(map);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Don't leave the mobile menu open when switching device/template in the
  // device toggle.
  useEffect(() => {
    setOpenMenu(false);
  }, [device, template]);

  function toggleMenu() {
    setOpenMenu((o) => !o);
  }

  function openSubscribe() {
    setOpenMenu(false);
    setSubscribeOpen(true);
  }

  function openSearch() {
    setOpenMenu(false);
    setSearchOpen(true);
  }

  const showOverlay = mobile && openMenu;

  return (
    <div
      className="bg-white relative"
      style={{
        boxShadow: behavior?.shadowOnScroll ? "0 1px 3px rgba(15,23,42,0.06)" : "none",
        minHeight: showOverlay ? 480 : undefined,
      }}
    >
      <TopBar topBar={topBar} mobile={mobile} footerSocialLinks={socialLinks} disableLinks={disableLinks} onSubscribeClick={openSubscribe} onSearchClick={openSearch} />

      {/* Magazine Blue (Classic) — top bar dark, logo row, then colored nav bar */}
      {template === "magazine-blue" && (
        <>
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            {mobile ? (
              <>
                <MenuIcon size={18} className="text-ink-700 shrink-0 cursor-pointer" onClick={toggleMenu} />
                <div className="flex-1 flex justify-center">
                  <Logo logo={logo} mobile={mobile} disableLinks={disableLinks} />
                </div>
                <Search size={16} className="text-ink-500 cursor-pointer" onClick={openSearch} />
              </>
            ) : (
              <>
                <Logo logo={logo} mobile={mobile} disableLinks={disableLinks} />
                <RightControls rightSide={rightSide} mobile={mobile} footerSocialLinks={socialLinks} disableLinks={disableLinks} onSubscribeClick={openSubscribe} onSearchClick={openSearch} />
              </>
            )}
          </div>
          {!mobile && (
            <nav className="flex items-center gap-5 px-4 border-b border-border overflow-x-auto overflow-y-visible">
              {menu.map((item) => (
                <NavLink key={item.id} item={item} menuStyle={menuStyle} disableLinks={disableLinks} />
              ))}
            </nav>
          )}
        </>
      )}

      {/* Magazine Red — red nav bar below */}
      {template === "magazine-red" && (
        <>
          <div className="flex items-center justify-between px-4 py-3">
            {mobile && <MenuIcon size={18} className="text-ink-700 shrink-0 cursor-pointer" onClick={toggleMenu} />}
            <div className={mobile ? "flex-1 flex justify-center" : ""}>
              <Logo logo={logo} mobile={mobile} disableLinks={disableLinks} />
            </div>
            <RightControls rightSide={rightSide} mobile={mobile} footerSocialLinks={socialLinks} disableLinks={disableLinks} onSubscribeClick={openSubscribe} onSearchClick={openSearch} />
          </div>
          {!mobile && (
            <nav className="flex items-center gap-0 px-4 overflow-x-auto overflow-y-visible" style={{ background: menuStyle?.hoverColor || "#b30000" }}>
              {menu.map((item) => (
                <RedNavLink key={item.id} item={item} disableLinks={disableLinks} />
              ))}
            </nav>
          )}
        </>
      )}

      {/* Center Logo */}
      {template === "center-logo" && (
        <div className="flex flex-col items-center py-3 border-b border-border gap-2">
          <div className="flex items-center w-full px-4 justify-between">
            {mobile ? (
              <MenuIcon size={18} className="text-ink-700 cursor-pointer" onClick={toggleMenu} />
            ) : (
              <span className="text-[11px] text-ink-400">{getFormattedDate(topBar.dateFormat)}</span>
            )}
            <RightControls rightSide={rightSide} mobile={mobile} footerSocialLinks={socialLinks} disableLinks={disableLinks} onSubscribeClick={openSubscribe} onSearchClick={openSearch} />
          </div>
          <Logo logo={logo} mobile={mobile} disableLinks={disableLinks} />
          {!mobile && (
            <nav className="flex items-center gap-5 overflow-x-auto overflow-y-visible">
              {menu.map((item) => <NavLink key={item.id} item={item} menuStyle={menuStyle} disableLinks={disableLinks} />)}
            </nav>
          )}
        </div>
      )}

      {/* Split Layout */}
      {template === "split" && (
        <>
          <div className="flex items-center px-4 py-3 border-b border-border">
            {mobile ? (
              <>
                <MenuIcon size={18} className="text-ink-700 shrink-0 cursor-pointer" onClick={toggleMenu} />
                <div className="flex-1 flex justify-center"><Logo logo={logo} mobile={mobile} disableLinks={disableLinks} /></div>
                <Search size={16} className="text-ink-500 cursor-pointer" onClick={openSearch} />
              </>
            ) : (
              <>
                <div className="flex-1 flex items-center gap-4 text-[11px] text-ink-400">
                  {topBar.enabled && <span>{getFormattedDate(topBar.dateFormat)}</span>}
                  {rightSide.socialIcons && (
                    <span className="flex items-center gap-1.5">
                      {(rightSide.socialPlatforms || ["instagram", "twitter"]).map((p) => {
                        const Icon = SOCIAL_ICON_MAP[p];
                        if (!Icon) return null;
                        const href = rightSide.socialLinks?.[p] || socialLinks?.[p];
                        return href && !disableLinks ? (
                          <a key={p} href={href} target="_blank" rel="noopener noreferrer" aria-label="Social link">
                            <Icon size={12} className="text-ink-400" />
                          </a>
                        ) : (
                          <Icon key={p} size={12} className="text-ink-400" />
                        );
                      })}
                    </span>
                  )}
                </div>
                <Logo logo={logo} mobile={mobile} disableLinks={disableLinks} />
                <div className="flex-1 flex justify-end">
                  <RightControls rightSide={rightSide} mobile={mobile} footerSocialLinks={socialLinks} disableLinks={disableLinks} onSubscribeClick={openSubscribe} onSearchClick={openSearch} />
                </div>
              </>
            )}
          </div>
          {!mobile && (
            <nav className="flex items-center justify-center gap-5 px-4 border-b border-border overflow-x-auto overflow-y-visible">
              {menu.map((item) => <NavLink key={item.id} item={item} menuStyle={menuStyle} disableLinks={disableLinks} />)}
            </nav>
          )}
        </>
      )}

      {/* Minimal */}
      {template === "minimal" && (
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          {mobile && <MenuIcon size={18} className="text-ink-700 shrink-0 cursor-pointer" onClick={toggleMenu} />}
          <Logo logo={logo} mobile={mobile} disableLinks={disableLinks} />
          {!mobile && (
            <nav className="flex items-center gap-4 overflow-x-auto overflow-y-visible">
              {menu.map((item) => (
                <NavLink key={item.id} item={item} menuStyle={{ ...menuStyle, fontWeight: "500", uppercase: false }} disableLinks={disableLinks} />
              ))}
            </nav>
          )}
          <RightControls rightSide={rightSide} mobile={mobile} footerSocialLinks={socialLinks} disableLinks={disableLinks} onSubscribeClick={openSubscribe} onSearchClick={openSearch} />
        </div>
      )}

      {/* Editorial Masthead — quote / logo / est. line, tagline row, accent divider, centered nav */}
      {template === "masthead" && (
        <>
          <div
            className="h-[3px] w-full"
            style={{
              background: `linear-gradient(90deg, ${menuStyle?.hoverColor || "#b30000"} 0%, #d97706 38%, #f4f1ea 75%, transparent 100%)`,
            }}
          />
          {mobile ? (
            <div className="flex flex-col items-center py-3 border-b border-border gap-2">
              <div className="flex items-center w-full px-4 justify-between">
                <MenuIcon size={18} className="text-ink-700 cursor-pointer" onClick={toggleMenu} />
                <Search size={16} className="text-ink-500 cursor-pointer" onClick={openSearch} />
              </div>
              <Logo logo={logo} mobile={mobile} disableLinks={disableLinks} />
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between px-6 py-5 gap-6">
                <p
                  className="flex-1 text-[12px] italic text-ink-400 leading-snug max-w-[230px]"
                  style={{ fontFamily: FONT_STACKS.georgia }}
                >
                  {masthead?.quote || '"Clarity, depth, and the courage to ask harder questions."'}
                </p>
                <Logo logo={logo} mobile={mobile} disableLinks={disableLinks} />
                <p
                  className="flex-1 text-[12px] text-ink-400 text-right max-w-[230px]"
                  style={{ fontFamily: FONT_STACKS.georgia }}
                >
                  {masthead?.establishedText || "Est. 1998 • London • New York • Singapore"}
                </p>
              </div>
              <div className="text-center text-[11px] tracking-[2px] uppercase text-ink-400 pb-3 px-4">
                {masthead?.tagline || "Power • Technology • Profiles • Wealth • Finance • Lifestyle • Culture"}
              </div>
              <nav className="flex items-center justify-center gap-5 border-t border-border py-2.5 px-4 overflow-x-auto overflow-y-visible">
                {menu.map((item) => (
                  <NavLink key={item.id} item={item} menuStyle={menuStyle} disableLinks={disableLinks} />
                ))}
              </nav>
            </>
          )}
        </>
      )}

      <BreakingNewsBanner breakingNews={breakingNews} />

      {showOverlay && (
        <MobileMenuOverlay
          layout={mobileSettings?.layout || "drawer"}
          menu={menu}
          menuStyle={menuStyle}
          mobile={mobileSettings}
          logo={logo}
          onClose={() => setOpenMenu(false)}
          disableLinks={disableLinks}
          onSubscribeClick={openSubscribe}
          onSearchClick={openSearch}
        />
      )}

      {!disableLinks && <SubscribeModal open={subscribeOpen} onClose={() => setSubscribeOpen(false)} />}
      {!disableLinks && <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />}
    </div>
  );
}
