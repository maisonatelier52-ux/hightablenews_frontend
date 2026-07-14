"use client";

import { useState } from "react";
import { Twitter, Linkedin, Instagram, Youtube, Facebook, Music2, Globe, BookOpen, Rss, MessageCircle, Pin, ChevronDown } from "lucide-react";
import NewsletterForm from "@/components/site/NewsletterForm";

const SOCIAL_ICONS = {
  twitter: Twitter,
  linkedin: Linkedin,
  instagram: Instagram,
  youtube: Youtube,
  facebook: Facebook,
  tiktok: Music2,
  medium: BookOpen,
  substack: Rss,
  reddit: MessageCircle,
  pinterest: Pin,
};

const LOGO_FONT_STACKS = {
  blackletter: "'UnifrakturMaguntia', 'UnifrakturCook', Georgia, serif",
  playfair: "'Playfair Display', Georgia, serif",
  inter: "Inter, system-ui, sans-serif",
  serif: "Georgia, 'Times New Roman', serif",
};

const TAGLINE_FONT_STACKS = {
  cormorant: "'Cormorant Garamond', Georgia, serif",
  playfair: "'Playfair Display', Georgia, serif",
  serif: "'Libre Baskerville', Georgia, serif",
};

function getGridCols(layout) {
  if (layout === "5-column") return "grid-cols-5";
  if (layout === "4-column") return "grid-cols-4";
  if (layout === "3-column") return "grid-cols-3";
  if (layout === "2-column") return "grid-cols-2";
  return "grid-cols-1 sm:grid-cols-3";
}

function ColumnLinks({ col, theme, fontSize }) {
  return (
    <>
      {col.type === "links" && (
        <ul className="space-y-2">
          {(col.links || []).map((link) => (
            <li key={link.id}>
              <a
                href={link.url || "#"}
                className="inline-block transition-all duration-300 hover:pl-1"
                style={{ color: theme.link, fontSize: fontSize ?? 14 }}
                onMouseEnter={(e) => (e.currentTarget.style.color = theme.hover)}
                onMouseLeave={(e) => (e.currentTarget.style.color = theme.link)}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      )}
      {col.type === "text" && (
        <p style={{ color: theme.link, fontSize: fontSize ?? 14 }}>{col.text || "Text block content"}</p>
      )}
    </>
  );
}

function AccordionColumn({ col, theme, mobile, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={mobile.showBorders ? "border-b" : ""} style={{ borderColor: theme.border }}>
      <button type="button" onClick={() => setOpen((o) => !o)} className="w-full flex items-center justify-between py-3.5 text-left">
        <span className="text-[11px] font-bold uppercase" style={{ color: theme.text, letterSpacing: "3px" }}>
          {col.title || "Untitled"}
        </span>
        <ChevronDown
          size={16}
          style={{
            color: theme.link,
            transition: mobile.collapseAnimation ? "transform 0.3s ease" : "none",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </button>
      <div
        style={{
          overflow: "hidden",
          transition: mobile.collapseAnimation ? "max-height 0.3s ease, opacity 0.3s ease" : "none",
          maxHeight: open ? 600 : 0,
          opacity: open ? 1 : 0,
        }}
      >
        <div className="pb-4">
          <ColumnLinks col={col} theme={theme} fontSize={mobile.fontSize} />
        </div>
      </div>
    </div>
  );
}

function LogoMark({ branding, bottomBar, theme }) {
  const source = bottomBar.logoMarkSource || "initial";
  const size = 22;

  if (source === "custom" && bottomBar.logoMarkImage) {
    return (
      <img
        src={bottomBar.logoMarkImage}
        alt="Logo mark"
        className="rounded-full object-cover shrink-0"
        style={{ width: size, height: size }}
      />
    );
  }

  if (source === "branding" && (branding.type || "text") === "image" && branding.image) {
    return (
      <img
        src={branding.image}
        alt="Logo mark"
        className="rounded-full object-cover shrink-0"
        style={{ width: size, height: size, background: theme.text }}
      />
    );
  }

  // Fallback: auto initial, or branding selected but no image uploaded yet
  return (
    <span
      className="flex items-center justify-center rounded-full font-bold shrink-0"
      style={{
        width: size,
        height: size,
        background: theme.text,
        color: theme.bg,
        fontSize: 11,
        fontFamily: LOGO_FONT_STACKS[branding.font] || LOGO_FONT_STACKS.blackletter,
      }}
    >
      {(branding.text || "H").charAt(0)}
    </span>
  );
}

export default function FooterPreview({ footer, device = "desktop" }) {
  const mobile = device === "mobile";
  const { theme, branding, columns, newsletter, social, bottomBar, depth, layout } = footer;
  const mobileSettings = footer.mobile || { layout: "accordion", defaultExpanded: false, showBorders: true, fontSize: 13, collapseAnimation: true };

  const accentLine = theme.accentLine || "#5c1111";
  const taglineColor = theme.taglineColor || theme.link;
  const isCenteredLayout = layout === "centered" || layout === "minimal" || columns.length === 0;

  const copyrightText = bottomBar.autoYear
    ? bottomBar.copyright.replace(/©\s*\d{4}/, `© ${new Date().getFullYear()}`)
    : bottomBar.copyright;

  const activeLinks =
    bottomBar.links && bottomBar.links.length > 0
      ? bottomBar.links
      : [
          bottomBar.showPrivacy && { id: "p", label: "Privacy Policy" },
          bottomBar.showTerms && { id: "t", label: "Terms of Service" },
          bottomBar.showCookie && { id: "c", label: "Cookie Policy" },
          bottomBar.showAccessibility && { id: "a", label: "Accessibility" },
        ].filter(Boolean);

  return (
    <div style={{ background: theme.bg, color: theme.text, fontFamily: "Inter, system-ui, sans-serif" }}>
      {/* Top accent line */}
      <div style={{ height: 3, background: accentLine, width: "100%" }} />

      <div
        style={{
          maxWidth: 1750,
          margin: "0 auto",
          padding: mobile
            ? `${Math.round(depth.paddingTop * 0.55)}px 24px ${Math.round(depth.paddingBottom * 0.5)}px`
            : `${depth.paddingTop}px 70px ${depth.paddingBottom * 0.5}px`,
        }}
      >
        {/* Logo + Tagline, centered */}
        <div className="flex flex-col items-center text-center">
          {(branding.type || "text") === "image" && branding.image ? (
            <img
              src={branding.image}
              alt={branding.text || "Logo"}
              style={{ height: mobile ? Math.max(24, Math.round(branding.size * 0.5)) : branding.size, objectFit: "contain" }}
            />
          ) : (
            <div
              className="font-bold tracking-tight leading-none"
              style={{
                fontFamily: LOGO_FONT_STACKS[branding.font] || LOGO_FONT_STACKS.blackletter,
                fontSize: mobile ? Math.max(28, Math.round(branding.size * 0.55)) : branding.size,
                color: branding.color || theme.text,
              }}
            >
              {branding.text}
            </div>
          )}
          {branding.tagline && (
            <p
              className="mt-3 italic"
              style={{
                fontFamily: TAGLINE_FONT_STACKS[branding.taglineFont] || TAGLINE_FONT_STACKS.cormorant,
                color: taglineColor,
                fontSize: mobile ? 14 : 18,
                maxWidth: 480,
              }}
            >
              "{branding.tagline}"
            </p>
          )}
        </div>

        {/* Divider below logo */}
        {(columns.length > 0 || newsletter.enabled) && (
          <div style={{ borderTop: `1px solid ${theme.border}`, marginTop: mobile ? 28 : 45 }} />
        )}

        {/* Columns */}
        {layout !== "minimal" && columns.length > 0 && (
          <>
            {mobile ? (
              <div className="mt-1">
                {mobileSettings.layout === "accordion" ? (
                  columns.map((col) => (
                    <AccordionColumn key={col.id} col={col} theme={theme} mobile={mobileSettings} defaultOpen={mobileSettings.defaultExpanded} />
                  ))
                ) : (
                  <div className="space-y-6 pt-6">
                    {columns.map((col) => (
                      <div key={col.id} className={mobileSettings.showBorders ? "pb-5 border-b" : "pb-1"} style={{ borderColor: theme.border }}>
                        <p className="text-[11px] font-bold uppercase mb-3" style={{ color: theme.text, letterSpacing: "3px" }}>
                          {col.title || "Untitled"}
                        </p>
                        <ColumnLinks col={col} theme={theme} fontSize={mobileSettings.fontSize} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div
                className={`grid ${isCenteredLayout ? "grid-cols-1 sm:grid-cols-3 justify-center text-center" : getGridCols(layout)}`}
                style={{ gap: `${depth.columnGap}px`, paddingTop: 45 }}
              >
                {columns.map((col) => (
                  <div key={col.id}>
                    <p className="font-bold uppercase mb-4" style={{ color: theme.text, fontSize: 13, letterSpacing: "3px" }}>
                      {col.title || "Untitled"}
                    </p>
                    <ColumnLinks col={col} theme={theme} />
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Newsletter block */}
        {newsletter.enabled && (
          <div
            className="mt-10 flex flex-col items-center"
            style={{ borderTop: layout === "minimal" ? `1px solid ${theme.border}` : "none", paddingTop: layout === "minimal" ? 24 : 0 }}
          >
            <p className="text-[13px] font-semibold mb-3" style={{ color: theme.text }}>{newsletter.title}</p>
            <div className="max-w-sm w-full">
              <NewsletterForm
                source="footer"
                layout={mobile ? "stack" : "row"}
                placeholder={newsletter.placeholder}
                buttonText={newsletter.buttonText}
                successMessage={newsletter.successMessage}
                dark
              />
            </div>
          </div>
        )}
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: `1px solid ${theme.border}` }}>
        <div
          className={`flex ${mobile ? "flex-col gap-3 items-center text-center" : "flex-row items-center justify-between"}`}
          style={{ maxWidth: 1750, margin: "0 auto", padding: mobile ? "20px 24px" : "20px 70px" }}
        >
          <div className={`flex items-center gap-2.5 ${mobile ? "flex-col gap-1.5" : ""}`}>
            {bottomBar.showLogoMark !== false && (
              <LogoMark branding={branding} bottomBar={bottomBar} theme={theme} />
            )}
            {bottomBar.showCopyright !== false && <p className="text-[12px]" style={{ color: theme.link }}>{copyrightText}</p>}
          </div>

          <div className={`flex items-center gap-3 ${mobile ? "flex-wrap justify-center" : ""}`}>
            {bottomBar.showMenu !== false &&
              activeLinks.map((link, i) => (
                <span key={link.id || i} className="flex items-center gap-3">
                  {i > 0 && <span style={{ color: theme.border }}>•</span>}
                  <a
                    href={link.url || "#"}
                    className="text-[12px] transition-colors duration-300"
                    style={{ color: theme.link }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = theme.hover)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = theme.link)}
                  >
                    {link.label}
                  </a>
                </span>
              ))}

            {social.length > 0 && (
              <div
                className={`flex items-center gap-3 ${activeLinks.length > 0 ? "ml-2 pl-3" : ""}`}
                style={activeLinks.length > 0 ? { borderLeft: `1px solid ${theme.border}` } : undefined}
              >
                {social.map((s) => {
                  const Icon = SOCIAL_ICONS[s.platform] || Globe;
                  const hasLink = s.url && s.url !== "#";
                  return (
                    <a
                      key={s.id}
                      href={s.url || "#"}
                      target={hasLink ? "_blank" : undefined}
                      rel={hasLink ? "noopener noreferrer" : undefined}
                      aria-label={s.platform}
                      style={{ color: theme.link }}
                    >
                      <Icon size={14} />
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
