"use client";

import NewsletterForm from "@/components/site/NewsletterForm";
import {
  ChevronDown, Shield, Globe, Search, Users, Scale, MessageCircle, BookOpen,
  Lock, Eye, PenLine, RefreshCw, Mail, MapPin, Star, Heart, CheckCircle2,
  FileText, Award, Clock, Megaphone,
} from "lucide-react";
import { useState } from "react";

const ICON_MAP = {
  shield: Shield, globe: Globe, search: Search, users: Users, scale: Scale,
  message: MessageCircle, book: BookOpen, lock: Lock, eye: Eye, pen: PenLine,
  refresh: RefreshCw, mail: Mail, "map-pin": MapPin, star: Star, heart: Heart,
  "check-circle": CheckCircle2, "file-text": FileText, award: Award, clock: Clock,
  megaphone: Megaphone,
};
function BlockIcon({ name, size = 20, ...props }) {
  const Cmp = ICON_MAP[name] || FileText;
  return <Cmp size={size} {...props} />;
}

const MAX_WIDTH_CLASS = { prose: "max-w-3xl", wide: "max-w-5xl", full: "max-w-none" };

function FaqItem({ item }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-200 py-3">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between text-left gap-3"
      >
        <span className="text-[14.5px] font-semibold text-ink-900">{item.question}</span>
        <ChevronDown size={16} className={`shrink-0 text-ink-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <p className="text-[13.5px] text-ink-600 mt-2 leading-relaxed">{item.answer}</p>}
    </div>
  );
}

/** Renders one page-builder block. Used identically in the admin editor's
 *  live preview and on the real public CMS page — so what the admin sees is
 *  exactly what visitors get. */
export default function PageBlockRenderer({ block, pageDesign = {} }) {
  const { type, data } = block;
  const headingFont = data.fontFamily || pageDesign.headingFontFamily || undefined;
  const bodyFont = data.fontFamily || pageDesign.bodyFontFamily || undefined;
  const primary = pageDesign.primaryColor || undefined;

  switch (type) {
    case "hero":
      return (
        <div
          className="relative flex items-center justify-center bg-cover bg-center"
          style={{
            height: data.height || 320,
            backgroundImage: data.bgImage ? `url(${data.bgImage})` : "linear-gradient(135deg,#1a1a1a,#3a3a3a)",
            textAlign: data.alignment || "center",
          }}
        >
          {data.bgImage && (
            <div className="absolute inset-0 bg-black" style={{ opacity: (data.overlayOpacity ?? 45) / 100 }} />
          )}
          <div className="relative z-10 px-6 max-w-3xl">
            <h1 className="text-[32px] md:text-[42px] font-bold leading-tight" style={{ color: data.textColor || "#fff", fontFamily: data.fontFamily || undefined }}>
              {data.title}
            </h1>
            {data.subtitle && (
              <p className="text-[15px] md:text-[17px] mt-3 opacity-90" style={{ color: data.textColor || "#fff", fontFamily: data.fontFamily || undefined }}>
                {data.subtitle}
              </p>
            )}
          </div>
        </div>
      );

    case "heading": {
      const Tag = data.level || "h2";
      const sizeMap = { h1: "text-[32px]", h2: "text-[26px]", h3: "text-[21px]", h4: "text-[17px]" };
      return (
        <div className="px-4 md:px-0 py-4">
          <Tag
            className={`font-bold ${data.fontSize ? "" : sizeMap[data.level] || sizeMap.h2}`}
            style={{
              color: data.color || "#111",
              textAlign: data.align || "left",
              fontFamily: headingFont,
              fontSize: data.fontSize ? `${data.fontSize}px` : undefined,
            }}
          >
            {data.text}
          </Tag>
        </div>
      );
    }

    case "richText":
      return (
        <div className={`px-4 md:px-0 py-3 mx-auto ${MAX_WIDTH_CLASS[data.maxWidth] || MAX_WIDTH_CLASS.prose}`}>
          <div
            className="prose prose-neutral max-w-none leading-relaxed"
            style={{
              fontFamily: bodyFont,
              fontSize: data.fontSize ? `${data.fontSize}px` : "15px",
              color: data.color || "#374151",
              textAlign: data.align || "left",
            }}
            dangerouslySetInnerHTML={{ __html: data.html || "" }}
          />
        </div>
      );

    case "image":
      return (
        <figure className={`px-4 md:px-0 py-4 mx-auto ${MAX_WIDTH_CLASS[data.maxWidth] || MAX_WIDTH_CLASS.prose}`}>
          {data.url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={data.url} alt={data.alt || ""} className={`w-full object-cover ${data.rounded ? "rounded-xl" : ""}`} />
          ) : (
            <div className="w-full aspect-video rounded-xl bg-gray-100 flex items-center justify-center text-ink-400 text-[13px]">
              No image set
            </div>
          )}
          {data.caption && <figcaption className="text-[12.5px] text-ink-500 mt-2 text-center">{data.caption}</figcaption>}
        </figure>
      );

    case "imageText":
      return (
        <div className={`px-4 md:px-0 py-6 flex flex-col md:flex-row gap-6 items-center ${data.imagePosition === "right" ? "md:flex-row-reverse" : ""}`}>
          <div className="w-full md:w-1/2">
            {data.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={data.imageUrl} alt={data.imageAlt || ""} className="w-full rounded-xl object-cover aspect-[4/3]" />
            ) : (
              <div className="w-full aspect-[4/3] rounded-xl bg-gray-100 flex items-center justify-center text-ink-400 text-[13px]">
                No image set
              </div>
            )}
          </div>
          <div className="w-full md:w-1/2">
            <h3 className="text-[21px] font-bold text-ink-900 mb-2">{data.heading}</h3>
            <p className="text-[14.5px] text-ink-600 leading-relaxed">{data.body}</p>
          </div>
        </div>
      );

    case "gallery":
      return (
        <div className="px-4 md:px-0 py-4">
          <div className={`grid gap-3`} style={{ gridTemplateColumns: `repeat(${data.columns || 3}, minmax(0,1fr))` }}>
            {(data.images || []).length === 0 && (
              <div className="col-span-full text-center text-[13px] text-ink-400 py-10 border border-dashed border-gray-200 rounded-xl">
                No images added yet
              </div>
            )}
            {(data.images || []).map((img, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={img.id || i} src={img.url} alt={img.alt || ""} className="w-full aspect-square object-cover rounded-lg" />
            ))}
          </div>
        </div>
      );

    case "quote":
      return (
        <div className="px-4 md:px-0 py-8 max-w-2xl mx-auto text-center">
          <p className="text-[22px] md:text-[26px] font-serif italic text-ink-900 leading-snug">&ldquo;{data.text}&rdquo;</p>
          {data.attribution && <p className="text-[13px] text-ink-500 mt-3 font-medium">— {data.attribution}</p>}
        </div>
      );

    case "cta":
      return (
        <div className="px-6 py-12 text-center rounded-2xl mx-4 md:mx-0" style={{ background: data.bg || "#111", color: data.textColor || "#fff" }}>
          <h3 className="text-[24px] font-bold">{data.heading}</h3>
          {data.body && <p className="text-[14.5px] mt-2 opacity-85 max-w-lg mx-auto">{data.body}</p>}
          {data.buttonLabel && (
            <a
              href={data.buttonUrl || "#"}
              className="inline-block mt-5 px-5 py-2.5 rounded-md font-semibold text-[13.5px]"
              style={{ background: data.textColor || "#fff", color: data.bg || "#111" }}
            >
              {data.buttonLabel}
            </a>
          )}
        </div>
      );

    case "faq":
      return (
        <div className="px-4 md:px-0 py-6 max-w-2xl mx-auto">
          {data.title && <h3 className="text-[21px] font-bold text-ink-900 mb-3">{data.title}</h3>}
          {(data.items || []).map((item) => (
            <FaqItem key={item.id} item={item} />
          ))}
        </div>
      );

    case "team":
      return (
        <div className="px-4 md:px-0 py-6">
          {data.title && <h3 className="text-[21px] font-bold text-ink-900 mb-4">{data.title}</h3>}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {(data.members || []).map((m) => (
              <div key={m.id} className="text-center">
                {m.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={m.photo} alt={m.name} className="w-20 h-20 rounded-full object-cover mx-auto mb-2" />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gray-100 mx-auto mb-2 flex items-center justify-center text-ink-400 text-[11px]">
                    Photo
                  </div>
                )}
                <p className="text-[13.5px] font-semibold text-ink-900">{m.name}</p>
                <p className="text-[12px] text-ink-500">{m.role}</p>
              </div>
            ))}
          </div>
        </div>
      );

    case "newsletter":
      return (
        <div className="px-4 py-10 text-center rounded-2xl mx-4 md:mx-0" style={{ background: data.bg || "#f5f5f0" }}>
          <h3 className="text-[20px] font-bold text-ink-900 mb-1">{data.heading}</h3>
          {data.subheading && <p className="text-[13.5px] text-ink-500 mb-4 max-w-md mx-auto">{data.subheading}</p>}
          <div className="max-w-sm mx-auto">
            <NewsletterForm source="page" />
          </div>
        </div>
      );

    case "video": {
      let embed = data.url || "";
      if (embed.includes("watch?v=")) embed = embed.replace("watch?v=", "embed/");
      if (embed.includes("youtu.be/")) embed = embed.replace("youtu.be/", "www.youtube.com/embed/");
      return (
        <div className="px-4 md:px-0 py-4 max-w-3xl mx-auto">
          {embed ? (
            <div className="aspect-video rounded-xl overflow-hidden">
              <iframe src={embed} title={data.caption || "Embedded video"} className="w-full h-full" allowFullScreen />
            </div>
          ) : (
            <div className="aspect-video rounded-xl bg-gray-100 flex items-center justify-center text-ink-400 text-[13px]">
              No video URL set
            </div>
          )}
          {data.caption && <p className="text-[12.5px] text-ink-500 mt-2 text-center">{data.caption}</p>}
        </div>
      );
    }

    case "map":
      return (
        <div className="px-4 md:px-0 py-4 max-w-3xl mx-auto">
          {data.mapEmbedUrl ? (
            <div className="aspect-video rounded-xl overflow-hidden">
              <iframe src={data.mapEmbedUrl} title="Map" className="w-full h-full border-0" loading="lazy" />
            </div>
          ) : (
            <div className="aspect-video rounded-xl bg-gray-100 flex items-center justify-center text-ink-400 text-[13px] text-center px-4">
              {data.address || "No address set"}
            </div>
          )}
        </div>
      );

    case "divider":
      return <div style={{ height: data.spacing || 32 }}>{data.style === "line" && <hr className="border-gray-200" />}</div>;

    case "embedHtml":
      return <div className="px-4 md:px-0 py-2" dangerouslySetInnerHTML={{ __html: data.html || "" }} />;

    case "statsGrid":
      return (
        <div className="px-4 md:px-0 py-6">
          <div className="rounded-2xl p-6 md:p-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center" style={{ background: data.bg || "#f5f5f0" }}>
            {(data.items || []).map((s) => (
              <div key={s.id}>
                <p className="text-[32px] md:text-[38px] font-extrabold leading-none" style={{ color: data.numberColor || primary || "#8a1c22" }}>{s.number}</p>
                <p className="text-[12.5px] text-ink-600 mt-2">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      );

    case "featureGrid":
      return (
        <div className="px-4 md:px-0 py-6">
          {data.title && <h3 className="text-[21px] font-bold text-ink-900 mb-4 text-center">{data.title}</h3>}
          <div className="grid gap-6" style={{ gridTemplateColumns: `repeat(${Math.min(data.columns || 2, 4)}, minmax(0,1fr))` }}>
            {(data.items || []).map((f) => (
              <div key={f.id}>
                <div className="mb-2" style={{ color: data.iconColor || primary || "#8a1c22" }}>
                  <BlockIcon name={f.icon} size={22} />
                </div>
                <p className="text-[14.5px] font-bold text-ink-900">{f.title}</p>
                <p className="text-[13px] text-ink-600 mt-1 leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      );

    case "numberedList":
      return (
        <div className="px-4 md:px-0 py-4 space-y-5">
          {(data.items || []).map((item) => (
            <div key={item.id} className="flex gap-3 pb-4 border-b border-gray-100 last:border-0">
              <div className="shrink-0 mt-0.5" style={{ color: data.iconColor || primary || "#8a1c22" }}>
                <BlockIcon name={item.icon} size={20} />
              </div>
              <div>
                <p className="text-[15px] font-bold text-ink-900">{item.number ? `${item.number}. ` : ""}{item.title}</p>
                <p className="text-[13.5px] text-ink-600 mt-1 leading-relaxed">{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      );

    case "editorNote":
      return (
        <div className="px-4 md:px-0 py-6">
          <div className="rounded-2xl overflow-hidden grid md:grid-cols-[280px_1fr]" style={{ background: data.bg || "#f2ede6" }}>
            {data.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={data.image} alt="" className="w-full h-full object-cover aspect-[4/3] md:aspect-auto" />
            ) : (
              <div className="w-full aspect-[4/3] md:aspect-auto bg-gray-200" />
            )}
            <div className="p-6 md:p-8">
              {data.eyebrow && <p className="text-[11px] font-bold tracking-wide text-red-700 mb-1.5">{data.eyebrow}</p>}
              <h3 className="text-[20px] font-bold text-ink-900 mb-2">{data.heading}</h3>
              <p className="text-[14px] text-ink-700 leading-relaxed">{data.body}</p>
              {data.signature && <p className="text-[13px] text-ink-500 mt-3 italic">{data.signature}</p>}
            </div>
          </div>
        </div>
      );

    // ── Sidebar-only widgets ──────────────────────────────────────────────
    case "aboutBox":
      return (
        <div>
          {data.title && <p className="text-[11px] font-bold uppercase tracking-wide text-ink-500 mb-2">{data.title}</p>}
          {data.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={data.image} alt="" className="w-full aspect-video object-cover rounded-lg mb-2.5" />
          )}
          <p className="text-[13px] text-ink-600 leading-relaxed">{data.body}</p>
          {data.linkLabel && (
            <a href={data.linkUrl || "#"} className="text-[12.5px] font-semibold text-red-700 mt-2 inline-block hover:underline">{data.linkLabel}</a>
          )}
        </div>
      );

    case "relatedLinks":
      return (
        <div>
          {data.title && <p className="text-[11px] font-bold uppercase tracking-wide text-ink-500 mb-2.5">{data.title}</p>}
          <ul className="space-y-2">
            {(data.links || []).map((l) => (
              <li key={l.id}>
                <a href={l.url || "#"} className="text-[13px] font-medium text-ink-700 hover:text-primary flex items-center gap-1.5">
                  <FileText size={13} className="text-red-700 shrink-0" /> {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      );

    case "contactInfo":
      return (
        <div>
          {data.title && <p className="text-[11px] font-bold uppercase tracking-wide text-ink-500 mb-2.5">{data.title}</p>}
          {data.email && <p className="text-[13px] text-ink-700 mb-1"><strong>Email:</strong> {data.email}</p>}
          {data.address && <p className="text-[13px] text-ink-600 leading-relaxed">{data.address}</p>}
        </div>
      );

    default:
      return null;
  }
}
