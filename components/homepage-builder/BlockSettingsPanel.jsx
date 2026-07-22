

"use client";

import { useState } from "react";
import { Settings2, ChevronDown, ChevronRight, Newspaper, X, Plus, Trash2 } from "lucide-react";
import { BLOCK_DEFINITIONS, CATEGORY_OPTIONS, makeCenterSectionForCategory } from "@/lib/blockDefinitions";
import ArticlePickerModal from "./ArticlePickerModal";
import { getPreviewArticleById } from "@/lib/articlesSource";
import { getCategories } from "@/lib/categoriesArticlesApi";

export default function BlockSettingsPanel({ block, onUpdate, fullWidth = false }) {
  if (!block) {
    return (
      <div className="rounded-card border border-border bg-white shadow-soft p-8 text-center">
        <div className="h-11 w-11 rounded-card bg-primary-50 text-primary flex items-center justify-center mx-auto mb-3">
          <Settings2 size={20} />
        </div>
        <p className="text-[13.5px] font-semibold text-ink-900">No block selected</p>
        <p className="text-[12.5px] text-ink-500 mt-1">Click a block in the page structure to edit its settings.</p>
      </div>
    );
  }

  const def = BLOCK_DEFINITIONS[block.type];
  const data = block.data;
  const set = (patch) => onUpdate(block.id, patch);

  return (
    <div className="rounded-card border border-border bg-white shadow-soft overflow-hidden">
      <div className="px-4 py-3 border-b border-border bg-gray-50/50">
        <h3 className="text-[13.5px] font-semibold text-ink-900">{def?.label} settings</h3>
        <p className="text-[11.5px] text-ink-500 mt-0.5">{def?.description}</p>
      </div>

      {/* On the full-width row layout there's no need to trap settings in a
          short scrollable box — the whole page just scrolls naturally, so
          every field is reachable without a nested scrollbar. The old
          capped-height + overflow-y-auto is kept only for callers that
          still place this panel in a narrow sticky sidebar column. */}
      <div className={fullWidth ? "p-4 space-y-4" : "p-4 space-y-4 max-h-[calc(100vh-260px)] overflow-y-auto"}>
        {block.type === "breakingNews" && <BreakingNewsSettings data={data} set={set} />}
        {block.type === "heroStory" && <HeroStorySettings data={data} set={set} />}
        {block.type === "topStoriesGrid" && <TopStoriesSettings data={data} set={set} />}
        {block.type === "newsFeed" && <NewsFeedSettings data={data} set={set} />}
        {block.type === "categorySection" && <CategorySectionSettings data={data} set={set} />}
        {block.type === "opinion" && <OpinionSettings data={data} set={set} />}
        {block.type === "authorSpotlight" && <AuthorSpotlightSettings data={data} set={set} />}
        {block.type === "advertisement" && <AdvertisementSettings data={data} set={set} />}
        {block.type === "video" && <VideoSettings data={data} set={set} />}
        {block.type === "fullWidthBanner" && <FullWidthBannerSettings data={data} set={set} />}
        {block.type === "featuredStoriesRow" && <FeaturedStoriesSettings data={data} set={set} />}
        {block.type === "newsletter" && <NewsletterSettings data={data} set={set} />}
        {block.type === "customHtml" && <CustomHtmlSettings data={data} set={set} />}
        {block.type === "stickyNotice" && <StickyNoticeSettings data={data} set={set} />}
        {block.type === "threeColumnLayout" && <ThreeColumnSettings data={data} set={set} />}
        {block.type === "newspaperEditorial" && <NewspaperEditorialSettings data={data} set={set} />}
        {block.type === "modernMagazineLayout" && <ModernMagazineSettings data={data} set={set} />}
        {block.type === "darkNewsLayout" && <DarkNewsSettings data={data} set={set} />}
        {block.type === "masonryEditorialLayout" && <MasonryEditorialSettings data={data} set={set} />}
      </div>
    </div>
  );
}

// ─── Block-specific settings ─────────────────────────────────────────────────

function BreakingNewsSettings({ data, set }) {
  return (
    <>
      <ToggleField label="Enabled" value={data.enabled !== false} onChange={(v) => set({ enabled: v })} />
      <TextField label="Label text" value={data.labelText} onChange={(v) => set({ labelText: v })} placeholder="BREAKING" />
      <SelectField label="Label style" value={data.labelStyle} onChange={(v) => set({ labelStyle: v })} options={["badge", "pill", "flat", "bordered"]} />
      <SelectField label="Number of headlines" value={data.limit} onChange={(v) => set({ limit: Number(v) })} options={[3, 5, 8, 10]} />
      <NumberField label="Scroll speed (px/sec)" value={data.speed} onChange={(v) => set({ speed: v })} min={20} max={200} />
      <SectionDivider label="Colors" />
      <ColorField label="Background color" value={data.bg} onChange={(v) => set({ bg: v })} />
      <ColorField label="Label background" value={data.labelBg} onChange={(v) => set({ labelBg: v })} />
      <ColorField label="Text color" value={data.textColor} onChange={(v) => set({ textColor: v })} />
    </>
  );
}

function HeroStorySettings({ data, set }) {
  return (
    <>
      <Accordion label="Content">
        <ArticleModeField data={data} set={set} idKey="articleId" label="Hero story" />
        <TextField label="Category label" value={data.category} onChange={(v) => set({ category: v })} placeholder="BUSINESS" />
        <TextField label="Headline" value={data.title} onChange={(v) => set({ title: v })} />
        <TextField label="Subheadline" value={data.subheadline} onChange={(v) => set({ subheadline: v })} />
        <ToggleField label="Show category badge" value={data.showCategory !== false} onChange={(v) => set({ showCategory: v })} />
        <ToggleField label="Show CTA button" value={data.showCta !== false} onChange={(v) => set({ showCta: v })} />
        {data.showCta && (
          <div className="grid grid-cols-2 gap-2">
            <TextField label="Button label" value={data.ctaLabel} onChange={(v) => set({ ctaLabel: v })} />
            <TextField label="Button URL" value={data.ctaUrl} onChange={(v) => set({ ctaUrl: v })} placeholder="/story" />
          </div>
        )}
      </Accordion>
      <Accordion label="Background">
        <TextField label="Background image URL" value={data.bgImage} onChange={(v) => set({ bgImage: v })} placeholder="https://…" />
        <RangeField label="Overlay opacity" value={data.overlayOpacity ?? 50} min={0} max={100} onChange={(v) => set({ overlayOpacity: v })} unit="%" />
      </Accordion>
      <Accordion label="Typography">
        <SelectField label="Font family" value={data.fontFamily} onChange={(v) => set({ fontFamily: v })} options={["sans", "serif", "mono", "playfair", "georgia"]} />
        <NumberField label="Title size (px)" value={data.titleSize ?? 28} onChange={(v) => set({ titleSize: v })} min={16} max={72} />
        <SelectField label="Title weight" value={data.titleWeight} onChange={(v) => set({ titleWeight: v })} options={["normal", "medium", "semibold", "bold", "extrabold"]} />
        <ColorField label="Title color" value={data.titleColor} onChange={(v) => set({ titleColor: v })} />
      </Accordion>
      <Accordion label="Layout">
        <SelectField label="Text alignment" value={data.alignment} onChange={(v) => set({ alignment: v })} options={["left", "center", "right"]} />
        <div className="grid grid-cols-2 gap-2">
          <NumberField label="Padding top (px)" value={data.paddingTop ?? 48} onChange={(v) => set({ paddingTop: v })} min={0} max={200} />
          <NumberField label="Padding bottom (px)" value={data.paddingBottom ?? 48} onChange={(v) => set({ paddingBottom: v })} min={0} max={200} />
        </div>
      </Accordion>
    </>
  );
}

function TopStoriesSettings({ data, set }) {
  return (
    <>
      <ArticleListField data={data} set={set} idsKey="articleIds" label="Top stories" />
      <SectionDivider label="Grid options" />
      <SelectField label="Number of stories" value={data.limit} onChange={(v) => set({ limit: Number(v) })} options={[4, 6, 8]} />
      <SelectField label="Columns" value={data.columns ?? 4} onChange={(v) => set({ columns: Number(v) })} options={[2, 3, 4]} />
      <ToggleField label="Show images" value={data.showImage !== false} onChange={(v) => set({ showImage: v })} />
      <ToggleField label="Show category label" value={data.showCategory !== false} onChange={(v) => set({ showCategory: v })} />
      <SectionDivider label="Card dimensions" />
      <div className="grid grid-cols-2 gap-2">
        <NumberField label="Card width (px)" value={data.cardWidth ?? 0} onChange={(v) => set({ cardWidth: v })} min={0} max={800} />
        <NumberField label="Card height (px)" value={data.cardHeight ?? 0} onChange={(v) => set({ cardHeight: v })} min={0} max={800} />
      </div>
      <p className="text-[11px] text-ink-400">Set 0 for auto sizing</p>
      <SectionDivider label="Text sizes" />
      <div className="grid grid-cols-2 gap-2">
        <NumberField label="Title size (px)" value={data.titleFontSize ?? 15} onChange={(v) => set({ titleFontSize: v })} min={10} max={48} />
        <NumberField label="Category size (px)" value={data.categoryFontSize ?? 11} onChange={(v) => set({ categoryFontSize: v })} min={9} max={24} />
      </div>
      <NumberField label="Date / meta size (px)" value={data.metaFontSize ?? 11} onChange={(v) => set({ metaFontSize: v })} min={9} max={20} />
    </>
  );
}

function NewsFeedSettings({ data, set }) {
  return (
    <>
      <ArticleListField data={data} set={set} idsKey="articleIds" label="News feed" />
      <SectionDivider label="Section options" />
      <TextField label="Section title (optional)" value={data.title} onChange={(v) => set({ title: v })} placeholder="Latest News" />
      <SelectField label="Category filter" value={data.category} onChange={(v) => set({ category: v })} options={["All", ...CATEGORY_OPTIONS]} />
      <SelectField label="Number of articles" value={data.limit} onChange={(v) => set({ limit: Number(v) })} options={[4, 6, 8, 10, 12]} />
      <SelectField label="Layout" value={data.layout} onChange={(v) => set({ layout: v })} options={["list", "grid", "compact"]} />
      <SectionDivider label="Display options" />
      <ToggleField label="Show images" value={data.showImages !== false} onChange={(v) => set({ showImages: v })} />
      <ToggleField label="Show category label" value={data.showCategory !== false} onChange={(v) => set({ showCategory: v })} />
      <ToggleField label="Show date" value={data.showDate !== false} onChange={(v) => set({ showDate: v })} />
      <ToggleField label="Show excerpt" value={data.showExcerpt !== false} onChange={(v) => set({ showExcerpt: v })} />
      {data.showImages && (
        <SelectField label="Image size" value={data.imageSize} onChange={(v) => set({ imageSize: v })} options={["small", "medium", "large"]} />
      )}
    </>
  );
}

function CategorySectionSettings({ data, set }) {
  return (
    <>
      <ArticleListField data={data} set={set} idsKey="articleIds" label="Section articles" />
      <SectionDivider label="Section options" />
      <SelectField label="Category" value={data.category} onChange={(v) => set({ category: v })} options={CATEGORY_OPTIONS} />
      <TextField label="Section title (optional)" value={data.title} placeholder={data.category} onChange={(v) => set({ title: v })} />
      <SelectField label="Layout" value={data.layout} onChange={(v) => set({ layout: v })} options={["grid", "list", "carousel"]} />
      <SelectField label="Number of articles" value={data.limit} onChange={(v) => set({ limit: Number(v) })} options={[3, 4, 6, 8, 12]} />
      <ToggleField label="Show images" value={data.showImages !== false} onChange={(v) => set({ showImages: v })} />
      <SectionDivider label="Colors" />
      <ColorField label="Background color" value={data.bg || "#ffffff"} onChange={(v) => set({ bg: v })} />
      <ColorField label="Text color" value={data.textColor || "#111111"} onChange={(v) => set({ textColor: v })} />
    </>
  );
}

function OpinionSettings({ data, set }) {
  return (
    <>
      <TextField label="Headline" value={data.title} onChange={(v) => set({ title: v })} />
      <TextField label="Author name" value={data.author} onChange={(v) => set({ author: v })} placeholder="Jane Doe" />
      <ColorField label="Background color" value={data.bg || "#f8f8f6"} onChange={(v) => set({ bg: v })} />
    </>
  );
}

function AuthorSpotlightSettings({ data, set }) {
  return (
    <>
      <TextField label="Section title" value={data.title} onChange={(v) => set({ title: v })} placeholder="Our Writers" />
      <SelectField label="Number of authors" value={data.limit} onChange={(v) => set({ limit: Number(v) })} options={[2, 3, 4, 6]} />
    </>
  );
}

function AdvertisementSettings({ data, set }) {
  return (
    <>
      <ImageUploadField
        label="Advertisement image"
        value={data.imageUrl}
        onChange={(v) => set({ imageUrl: v })}
        hint="Upload the creative you want to display. Falls back to a placeholder if left empty."
      />
      <TextField label="Or paste an image URL instead" value={data.imageUrl?.startsWith("data:") ? "" : data.imageUrl} onChange={(v) => set({ imageUrl: v })} placeholder="https://…" />
      <SectionDivider label="Size" />
      <SelectField label="Ad preset size" value={data.size} onChange={(v) => set({ size: v })} options={["leaderboard", "sidebar", "square", "billboard", "halfpage"]} />
      <div className="grid grid-cols-2 gap-2">
        <NumberField label="Width (px, 0 = full)" value={data.width ?? 0} onChange={(v) => set({ width: v })} min={0} max={1600} />
        <NumberField label="Height (px)" value={data.height ?? 90} onChange={(v) => set({ height: v })} min={50} max={600} />
      </div>
      <SectionDivider label="Link & accessibility" />
      <TextField label="Link URL" value={data.linkUrl} onChange={(v) => set({ linkUrl: v })} placeholder="https://…" />
      <TextField label="Alt text" value={data.altText} onChange={(v) => set({ altText: v })} />
      <ColorField label="Overlay color (optional)" value={data.overlayColor || ""} onChange={(v) => set({ overlayColor: v })} />
    </>
  );
}

function VideoSettings({ data, set }) {
  return (
    <>
      <TextField label="Video URL" value={data.videoUrl} placeholder="https://…" onChange={(v) => set({ videoUrl: v })} />
      <TextField label="Thumbnail URL (optional)" value={data.thumbUrl} placeholder="https://…" onChange={(v) => set({ thumbUrl: v })} />
      <TextField label="Title" value={data.title} onChange={(v) => set({ title: v })} />
      <TextField label="Caption (optional)" value={data.caption} onChange={(v) => set({ caption: v })} />
    </>
  );
}

function FullWidthBannerSettings({ data, set }) {
  return (
    <>
      <TextField label="Image URL" value={data.imageUrl} placeholder="https://…" onChange={(v) => set({ imageUrl: v })} />
      <TextField label="Headline" value={data.heading} onChange={(v) => set({ heading: v })} />
      <TextField label="Subheading (optional)" value={data.subheading} onChange={(v) => set({ subheading: v })} />
      <div className="grid grid-cols-2 gap-2">
        <TextField label="Button label" value={data.ctaLabel} onChange={(v) => set({ ctaLabel: v })} />
        <TextField label="Button URL" value={data.ctaUrl} placeholder="/article" onChange={(v) => set({ ctaUrl: v })} />
      </div>
      <TextField label="Link URL (whole banner)" value={data.linkUrl} placeholder="https://…" onChange={(v) => set({ linkUrl: v })} />
      <NumberField label="Height (px)" value={data.height ?? 320} onChange={(v) => set({ height: v })} min={80} max={800} />
      <ColorField label="Overlay color" value={data.overlayColor || "rgba(0,0,0,0.45)"} onChange={(v) => set({ overlayColor: v })} />
    </>
  );
}

function FeaturedStoriesSettings({ data, set }) {
  return (
    <>
      <ArticleListField data={data} set={set} idsKey="articleIds" label="Featured stories" />
      <SectionDivider label="Section options" />
      <TextField label="Section title" value={data.title} onChange={(v) => set({ title: v })} />
      <SelectField label="Number of stories" value={data.limit} onChange={(v) => set({ limit: Number(v) })} options={[3, 4, 5, 6]} />
      <ToggleField label="Show images" value={data.showImage !== false} onChange={(v) => set({ showImage: v })} />
      {data.showImage && (
        <NumberField label="Image height (px)" value={data.imageHeight ?? 120} onChange={(v) => set({ imageHeight: v })} min={60} max={300} />
      )}
      <SectionDivider label="Card dimensions" />
      <div className="grid grid-cols-2 gap-2">
        <NumberField label="Card width (px)" value={data.cardWidth ?? 0} onChange={(v) => set({ cardWidth: v })} min={0} max={800} />
        <NumberField label="Card height (px)" value={data.cardHeight ?? 0} onChange={(v) => set({ cardHeight: v })} min={0} max={800} />
      </div>
      <p className="text-[11px] text-ink-400">Set 0 for auto sizing</p>
      <SectionDivider label="Text sizes" />
      <div className="grid grid-cols-2 gap-2">
        <NumberField label="Title size (px)" value={data.titleFontSize ?? 15} onChange={(v) => set({ titleFontSize: v })} min={10} max={48} />
        <NumberField label="Category size (px)" value={data.categoryFontSize ?? 11} onChange={(v) => set({ categoryFontSize: v })} min={9} max={24} />
      </div>
      <NumberField label="Excerpt size (px)" value={data.excerptFontSize ?? 13} onChange={(v) => set({ excerptFontSize: v })} min={10} max={24} />
    </>
  );
}

function NewsletterSettings({ data, set }) {
  return (
    <>
      <ToggleField label="Enabled" value={data.enabled !== false} onChange={(v) => set({ enabled: v })} />
      <TextField label="Heading" value={data.heading} onChange={(v) => set({ heading: v })} />
      <TextField label="Subheading" value={data.subheading} onChange={(v) => set({ subheading: v })} />
      <TextField label="Input placeholder" value={data.placeholder} onChange={(v) => set({ placeholder: v })} />
      <div className="grid grid-cols-2 gap-2">
        <TextField label="Button text" value={data.ctaLabel} onChange={(v) => set({ ctaLabel: v })} />
      </div>
      <SectionDivider label="Colors" />
      <ColorField label="Background color" value={data.bg || "#f5f5f0"} onChange={(v) => set({ bg: v })} />
      <ColorField label="Text color" value={data.textColor || "#111111"} onChange={(v) => set({ textColor: v })} />
      <ColorField label="Button background" value={data.ctaBg || "#cc0000"} onChange={(v) => set({ ctaBg: v })} />
      <ColorField label="Button text color" value={data.ctaTextColor || "#ffffff"} onChange={(v) => set({ ctaTextColor: v })} />
    </>
  );
}

function CustomHtmlSettings({ data, set }) {
  const [tab, setTab] = useState("code");
  return (
    <>
      <ToggleField label="Enabled" value={data.enabled !== false} onChange={(v) => set({ enabled: v })} />
      <div className="flex gap-1 rounded-lg border border-border bg-surface-soft p-0.5 mt-1">
        {["code", "preview"].map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`flex-1 rounded-md py-1.5 text-[12px] font-medium capitalize transition-colors ${tab === t ? "bg-white shadow-sm text-ink-900" : "text-ink-500 hover:text-ink-700"}`}>
            {t}
          </button>
        ))}
      </div>
      {tab === "code" ? (
        <textarea
          value={data.html}
          onChange={(e) => set({ html: e.target.value })}
          rows={12}
          className="w-full rounded-lg border border-border bg-gray-900 text-green-400 font-mono text-[11.5px] px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/30 resize-y"
          placeholder="<!-- Add your custom HTML here -->"
          spellCheck={false}
        />
      ) : (
        <div className="rounded-lg border border-border overflow-hidden">
          {data.html?.trim() ? (
            <div className="p-3 text-[12px] leading-relaxed [&_img]:max-w-full" dangerouslySetInnerHTML={{ __html: data.html }} />
          ) : (
            <div className="p-6 text-center text-[12px] text-ink-400">Nothing to preview — add some HTML in the Code tab.</div>
          )}
        </div>
      )}
    </>
  );
}

function StickyNoticeSettings({ data, set }) {
  return (
    <>
      <ToggleField label="Enabled" value={data.enabled !== false} onChange={(v) => set({ enabled: v })} />
      <TextField label="Notice text" value={data.text} onChange={(v) => set({ text: v })} />
      <div className="grid grid-cols-2 gap-2">
        <TextField label="CTA label" value={data.ctaLabel} onChange={(v) => set({ ctaLabel: v })} />
        <TextField label="CTA URL" value={data.ctaUrl} onChange={(v) => set({ ctaUrl: v })} placeholder="/subscribe" />
      </div>
      <ToggleField label="Dismissible" value={data.dismissible !== false} onChange={(v) => set({ dismissible: v })} />
      <SectionDivider label="Colors" />
      <ColorField label="Background" value={data.bg || "#1a1a1a"} onChange={(v) => set({ bg: v })} />
      <ColorField label="Text color" value={data.textColor || "#ffffff"} onChange={(v) => set({ textColor: v })} />
      <ColorField label="CTA background" value={data.ctaBg || "#cc0000"} onChange={(v) => set({ ctaBg: v })} />
    </>
  );
}

function ThreeColumnSettings({ data, set }) {
  const leftItems = data.leftItems || [];

  function updateLeftItem(id, label) {
    set({ leftItems: leftItems.map((item) => (item.id === id ? { ...item, label } : item)) });
  }
  function addLeftItem() {
    const newId = `l${Date.now().toString(36)}`;
    set({ leftItems: [...leftItems, { id: newId, label: "New story link" }] });
  }
  function removeLeftItem(id) {
    set({ leftItems: leftItems.filter((item) => item.id !== id) });
  }

  return (
    <>
      <Accordion label="Left column (Most Read)">
        <TextField label="Column title" value={data.leftTitle} placeholder="Most Read" onChange={(v) => set({ leftTitle: v })} />
        <ToggleField label="Show rank numbers" value={data.leftShowNumbers} onChange={(v) => set({ leftShowNumbers: v })} />
        <div>
          <FieldLabel>Story links</FieldLabel>
          <div className="space-y-1.5">
            {leftItems.map((item) => (
              <div key={item.id} className="flex gap-1.5 items-center">
                <input
                  value={item.label}
                  onChange={(e) => updateLeftItem(item.id, e.target.value)}
                  className="flex-1 rounded-lg border border-border bg-surface-soft px-2.5 py-1.5 text-[12px] text-ink-900 focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <button onClick={() => removeLeftItem(item.id)} className="h-7 w-7 flex items-center justify-center rounded-md text-ink-300 hover:bg-red-50 hover:text-red-500 transition-colors">×</button>
              </div>
            ))}
          </div>
          <button onClick={addLeftItem} className="mt-2 text-[12px] font-medium text-primary hover:underline">+ Add story link</button>
        </div>
      </Accordion>

      <Accordion label="Center column (Latest News)">
        <ArticleListField data={data} set={set} idsKey="centerArticleIds" label="Latest news" />
        <TextField label="Section title" value={data.centerTitle} placeholder="Latest News" onChange={(v) => set({ centerTitle: v })} />
        <SelectField label="Category filter" value={data.centerCategory} onChange={(v) => set({ centerCategory: v })} options={["All", ...CATEGORY_OPTIONS]} />
        <SelectField label="Number of articles" value={data.centerLimit} onChange={(v) => set({ centerLimit: Number(v) })} options={[3, 4, 5, 6, 8, 10]} />
        <div>
          <FieldLabel>Article layout</FieldLabel>
          <div className="grid grid-cols-2 gap-2">
            {[{ value: "list", label: "List" }, { value: "grid", label: "Grid" }].map((opt) => (
              <button key={opt.value} onClick={() => set({ centerLayout: opt.value })} className={`rounded-lg border px-2 py-2 text-[12px] font-medium transition-colors ${data.centerLayout === opt.value ? "border-primary bg-primary-50 text-primary" : "border-border text-ink-700 hover:bg-surface-soft"}`}>{opt.label}</button>
            ))}
          </div>
        </div>
      </Accordion>

      <Accordion label="Right sidebar (In Brief)">
        <TextField label="Sidebar title" value={data.rightTitle} placeholder="In Brief" onChange={(v) => set({ rightTitle: v })} />
        <ToggleField label="Show newsletter signup" value={data.rightShowNewsletter} onChange={(v) => set({ rightShowNewsletter: v })} />
        {data.rightShowNewsletter && (
          <TextField label="Newsletter heading" value={data.rightNewsletterHeading} placeholder="Stay ahead of the story" onChange={(v) => set({ rightNewsletterHeading: v })} />
        )}
        <ToggleField label="Show advertisement" value={data.rightShowAd} onChange={(v) => set({ rightShowAd: v })} />
        {data.rightShowAd && (
          <>
            <ImageUploadField label="Advertisement image" value={data.rightAdImage} onChange={(v) => set({ rightAdImage: v })} hint="Falls back to a placeholder if left empty." />
            <TextField label="Link URL" value={data.rightAdLinkUrl} onChange={(v) => set({ rightAdLinkUrl: v })} placeholder="https://…" />
            <SelectField label="Ad preset size" value={data.rightAdSize} onChange={(v) => set({ rightAdSize: v })} options={["sidebar", "square"]} />
            <div className="grid grid-cols-2 gap-2">
              <NumberField label="Width (px, 0 = auto)" value={data.rightAdWidth ?? 0} onChange={(v) => set({ rightAdWidth: v })} min={0} max={600} />
              <NumberField label="Height (px, 0 = preset)" value={data.rightAdHeight ?? 0} onChange={(v) => set({ rightAdHeight: v })} min={0} max={600} />
            </div>
          </>
        )}
      </Accordion>

      <Accordion label="Layout & styling">
        <div>
          <FieldLabel>Column width mode</FieldLabel>
          <div className="grid grid-cols-2 gap-2">
            {[{ value: "equal", label: "Equal width" }, { value: "custom", label: "Custom width" }].map((opt) => (
              <button key={opt.value} onClick={() => set({ widthMode: opt.value })} className={`rounded-lg border px-2 py-2 text-[12px] font-medium transition-colors ${(data.widthMode || "equal") === opt.value ? "border-primary bg-primary-50 text-primary" : "border-border text-ink-700 hover:bg-surface-soft"}`}>{opt.label}</button>
            ))}
          </div>
        </div>
        <ColorField label="Background" value={data.bg || "#ffffff"} onChange={(v) => set({ bg: v })} />
        <ColorField label="Border color" value={data.border || "#e5e7eb"} onChange={(v) => set({ border: v })} />
        <RangeField label="Padding" value={data.padding ?? 24} min={0} max={64} onChange={(v) => set({ padding: v })} unit="px" />
        <RangeField label="Border radius" value={data.borderRadius ?? 12} min={0} max={24} onChange={(v) => set({ borderRadius: v })} unit="px" />
      </Accordion>
    </>
  );
}

// ─── Shared form field components ─────────────────────────────────────────────

function SectionDivider({ label }) {
  return (
    <div className="flex items-center gap-2 pt-1">
      <div className="flex-1 h-px bg-border" />
      <span className="text-[10px] font-semibold uppercase tracking-wide text-ink-400">{label}</span>
      <div className="flex-1 h-px bg-border" />
    </div>
  );
}

function FieldLabel({ children }) {
  return <label className="block text-[12px] font-medium text-ink-700 mb-1">{children}</label>;
}

function TextField({ label, value, onChange, placeholder }) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <input
        type="text"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-border bg-surface-soft px-3 py-2 text-[12.5px] text-ink-900 placeholder:text-ink-300 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
      />
    </div>
  );
}

/** Upload an image from disk (stored inline as a base64 data URL so it
 *  survives reloads in localStorage-backed persistence, unlike a blob URL).
 *  Shows a live preview with a remove ("×") button once an image is set. */
function ImageUploadField({ label = "Ad image", value, onChange, hint }) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      {hint && <p className="text-[11px] text-ink-400 mb-1.5 -mt-0.5">{hint}</p>}
      {value ? (
        <div className="relative rounded-lg border border-border bg-surface-soft p-2">
          <img src={value} alt="Advertisement preview" className="max-h-28 w-full object-contain rounded" />
          <div className="flex items-center gap-2 mt-2">
            <label className="flex-1 text-center rounded-lg border border-border bg-white px-2 py-1.5 text-[11.5px] text-ink-600 cursor-pointer hover:border-primary/40 transition-colors">
              Replace image
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = () => onChange(reader.result);
                  reader.readAsDataURL(file);
                }}
              />
            </label>
            <button
              type="button"
              onClick={() => onChange("")}
              className="rounded-lg border border-border px-2 py-1.5 text-[11.5px] text-red-600 hover:bg-red-50 transition-colors"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <label className="flex items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-surface-soft px-3 py-5 text-[12px] text-ink-500 cursor-pointer hover:border-primary/40 transition-colors">
          Click to upload advertisement image
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = () => onChange(reader.result);
              reader.readAsDataURL(file);
            }}
          />
        </label>
      )}
    </div>
  );
}

function NumberField({ label, value, onChange, min = 0, max = 9999 }) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <input
        type="number"
        value={value || 0}
        min={min}
        max={max}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full rounded-lg border border-border bg-surface-soft px-3 py-2 text-[12.5px] text-ink-900 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
      />
    </div>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-border bg-surface-soft px-3 py-2 text-[12.5px] text-ink-900 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>{String(opt)}</option>
        ))}
      </select>
    </div>
  );
}

function ColorField({ label, value, onChange }) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value && value.startsWith("#") ? value : "#ffffff"}
          onChange={(e) => onChange(e.target.value)}
          className="h-8 w-10 rounded border border-border cursor-pointer"
        />
        <input
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000"
          className="flex-1 rounded-lg border border-border bg-surface-soft px-2.5 py-1.5 text-[12px] text-ink-900 font-mono focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>
    </div>
  );
}

function RangeField({ label, value, onChange, min, max, unit = "" }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <FieldLabel>{label}</FieldLabel>
        <span className="text-[12px] text-ink-500 font-mono">{value}{unit}</span>
      </div>
      <input
        type="range"
        value={value}
        min={min}
        max={max}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-primary"
      />
    </div>
  );
}

function ToggleField({ label, value, onChange }) {
  return (
    <label className="flex items-center justify-between gap-3 cursor-pointer">
      <span className="text-[12.5px] font-medium text-ink-700">{label}</span>
      <button
        role="switch"
        aria-checked={!!value}
        onClick={() => onChange(!value)}
        className={`relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30 ${value ? "bg-primary" : "bg-border"}`}
      >
        <span className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-sm transform transition-transform ${value ? "translate-x-4" : "translate-x-0"}`} />
      </button>
    </label>
  );
}

// ─── Article source pickers (real Articles data, latest-first, searchable) ──

/** Single-article picker — e.g. for Hero Story. */
function ArticleModeField({ data, set, idKey = "articleId", label = "Article" }) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const isManual = data.articleMode === "manual";
  const chosen = isManual && data[idKey] ? getPreviewArticleById(data[idKey]) : null;

  return (
    <div className="space-y-2">
      <FieldLabel>{label} source</FieldLabel>
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => set({ articleMode: "auto", [idKey]: "" })}
          className={`rounded-lg border px-2 py-2 text-[12px] font-medium transition-colors ${!isManual ? "border-primary bg-primary-50 text-primary" : "border-border text-ink-700 hover:bg-surface-soft"}`}
        >
          Latest article
        </button>
        <button
          onClick={() => set({ articleMode: "manual" })}
          className={`rounded-lg border px-2 py-2 text-[12px] font-medium transition-colors ${isManual ? "border-primary bg-primary-50 text-primary" : "border-border text-ink-700 hover:bg-surface-soft"}`}
        >
          Choose article
        </button>
      </div>
      {!isManual && (
        <p className="text-[11px] text-ink-400">Automatically shows the most recently published article.</p>
      )}
      {isManual && (
        <>
          {chosen ? (
            <div className="flex items-center gap-2 rounded-lg border border-border bg-surface-soft px-2.5 py-2">
              <div className="h-9 w-12 rounded bg-gray-100 flex-none overflow-hidden flex items-center justify-center">
                {chosen.img ? <img src={chosen.img} alt="" className="h-full w-full object-cover" /> : <Newspaper size={12} className="text-ink-300" />}
              </div>
              <p className="flex-1 min-w-0 text-[12px] text-ink-900 line-clamp-2">{chosen.title}</p>
              <button onClick={() => setPickerOpen(true)} className="text-[11px] font-medium text-primary hover:underline shrink-0">Change</button>
            </div>
          ) : (
            <button onClick={() => setPickerOpen(true)} className="w-full text-[12px] font-medium text-primary border border-dashed border-primary/40 rounded-lg py-2 hover:bg-primary-50 transition-colors">
              + Choose an article
            </button>
          )}
        </>
      )}
      {pickerOpen && (
        <ArticlePickerModal
          mode="single"
          onClose={() => setPickerOpen(false)}
          onConfirm={(ids) => { set({ articleMode: "manual", [idKey]: ids[0] }); setPickerOpen(false); }}
        />
      )}
    </div>
  );
}

/** Multi-article picker for grid/list/feed blocks — selecting articles here
 *  fills every card in this block, in order (and doubles as the "use these
 *  articles for all the cards" control). */
function ArticleListField({ data, set, idsKey = "articleIds", label = "Articles" }) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const isManual = data.articleMode === "manual";
  const ids = data[idsKey] || [];
  const chosen = ids.map((id) => getPreviewArticleById(id)).filter(Boolean);

  function removeId(id) {
    set({ [idsKey]: ids.filter((x) => x !== id) });
  }
  function move(id, dir) {
    const i = ids.indexOf(id);
    const j = i + dir;
    if (j < 0 || j >= ids.length) return;
    const next = [...ids];
    [next[i], next[j]] = [next[j], next[i]];
    set({ [idsKey]: next });
  }

  return (
    <div className="space-y-2">
      <FieldLabel>{label} source</FieldLabel>
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => set({ articleMode: "auto", [idsKey]: [] })}
          className={`rounded-lg border px-2 py-2 text-[12px] font-medium transition-colors ${!isManual ? "border-primary bg-primary-50 text-primary" : "border-border text-ink-700 hover:bg-surface-soft"}`}
        >
          Latest articles
        </button>
        <button
          onClick={() => set({ articleMode: "manual" })}
          className={`rounded-lg border px-2 py-2 text-[12px] font-medium transition-colors ${isManual ? "border-primary bg-primary-50 text-primary" : "border-border text-ink-700 hover:bg-surface-soft"}`}
        >
          Choose for all cards
        </button>
      </div>
      {!isManual && (
        <p className="text-[11px] text-ink-400">Automatically shows the newest published articles first, refreshed as you publish more.</p>
      )}
      {isManual && (
        <>
          {chosen.length > 0 && (
            <div className="space-y-1.5">
              {chosen.map((a, i) => (
                <div key={a.id} className="flex items-center gap-2 rounded-lg border border-border bg-surface-soft px-2.5 py-1.5">
                  <span className="text-[10px] font-semibold text-ink-400 w-4 shrink-0">{i + 1}</span>
                  <div className="h-8 w-11 rounded bg-gray-100 flex-none overflow-hidden flex items-center justify-center">
                    {a.img ? <img src={a.img} alt="" className="h-full w-full object-cover" /> : <Newspaper size={11} className="text-ink-300" />}
                  </div>
                  <p className="flex-1 min-w-0 text-[11.5px] text-ink-900 line-clamp-1">{a.title}</p>
                  <div className="flex items-center gap-0.5 shrink-0">
                    <button onClick={() => move(a.id, -1)} disabled={i === 0} className="h-6 w-6 flex items-center justify-center rounded text-ink-300 hover:bg-gray-100 hover:text-ink-700 disabled:opacity-30 transition-colors"><ChevronDown className="rotate-180" size={12} /></button>
                    <button onClick={() => move(a.id, 1)} disabled={i === chosen.length - 1} className="h-6 w-6 flex items-center justify-center rounded text-ink-300 hover:bg-gray-100 hover:text-ink-700 disabled:opacity-30 transition-colors"><ChevronDown size={12} /></button>
                    <button onClick={() => removeId(a.id)} className="h-6 w-6 flex items-center justify-center rounded text-ink-300 hover:bg-red-50 hover:text-red-500 transition-colors"><X size={12} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <button onClick={() => setPickerOpen(true)} className="w-full text-[12px] font-medium text-primary border border-dashed border-primary/40 rounded-lg py-2 hover:bg-primary-50 transition-colors">
            + Add / search articles
          </button>
          <p className="text-[11px] text-ink-400">Cards fill in this order. Any remaining cards auto-fill with the next latest articles.</p>
        </>
      )}
      {pickerOpen && (
        <ArticlePickerModal
          mode="multi"
          initialSelectedIds={ids}
          onClose={() => setPickerOpen(false)}
          onConfirm={(newIds) => { set({ articleMode: "manual", [idsKey]: newIds }); setPickerOpen(false); }}
        />
      )}
    </div>
  );
}

function NewspaperEditorialSettings({ data, set }) {
  const CATEGORY_COLORS = [
    { label: "Red", value: "#dc2626" },
    { label: "Blue", value: "#2563eb" },
    { label: "Green", value: "#059669" },
    { label: "Amber", value: "#d97706" },
    { label: "Purple", value: "#7c3aed" },
    { label: "Gray", value: "#6b7280" },
    { label: "Black", value: "#111111" },
  ];

  const updateLeftBlock = (id, patch) => {
    set({ leftBlocks: (data.leftBlocks || []).map(b => b.id === id ? { ...b, ...patch } : b) });
  };

  const updateRightBlock = (id, patch) => {
    set({ rightBlocks: (data.rightBlocks || []).map(b => b.id === id ? { ...b, ...patch } : b) });
  };

  const updateCenterSection = (id, patch) => {
    set({ centerSections: (data.centerSections || []).map(s => s.id === id ? { ...s, ...patch } : s) });
  };

  return (
    <>
      <Accordion label="Top Stories Grid">
        <ToggleField label="Show Top Stories" value={data.showTopStories !== false} onChange={v => set({ showTopStories: v })} />
        {data.showTopStories !== false && (
          <>
            <TextField label="Section title" value={data.topStoriesTitle} onChange={v => set({ topStoriesTitle: v })} placeholder="FEATURED STORIES" />
            <SelectField label="Number of cards" value={data.topStoriesCount} onChange={v => set({ topStoriesCount: Number(v) })} options={[2, 3, 4]} />
            <SelectField label="Image ratio" value={data.topStoriesImageRatio} onChange={v => set({ topStoriesImageRatio: v })} options={["16/9", "4/3", "1/1", "3/2"]} />
            <ColorField label="Category color" value={data.topStoriesCategoryColor} onChange={v => set({ topStoriesCategoryColor: v })} />
            <SectionDivider label="Card dimensions" />
            <div className="grid grid-cols-2 gap-2">
              <NumberField label="Card width (px)" value={data.topStoriesCardWidth ?? 0} onChange={v => set({ topStoriesCardWidth: v })} min={0} max={800} />
              <NumberField label="Card height (px)" value={data.topStoriesCardHeight ?? 0} onChange={v => set({ topStoriesCardHeight: v })} min={0} max={800} />
            </div>
            <p className="text-[11px] text-ink-400">Set 0 for auto sizing</p>
            <SectionDivider label="Text sizes" />
            <div className="grid grid-cols-2 gap-2">
              <NumberField label="Title size (px)" value={data.topStoriesTitleSize ?? 14} onChange={v => set({ topStoriesTitleSize: v })} min={10} max={36} />
              <NumberField label="Category size (px)" value={data.topStoriesCategorySize ?? 11} onChange={v => set({ topStoriesCategorySize: v })} min={9} max={20} />
            </div>
          </>
        )}
      </Accordion>

      <Accordion label="Left Sidebar Blocks">
        <p className="text-[11px] text-ink-500 mb-2">Control visibility and settings for each left sidebar block.</p>
        {(data.leftBlocks || []).map(block => (
          <div key={block.id} className="border border-border rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-3 py-2 bg-gray-50">
              <span className="text-[12px] font-semibold text-ink-800">{block.label}</span>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <span className="text-[11px] text-ink-500">Visible</span>
                <button
                  role="switch"
                  aria-checked={!!block.visible}
                  onClick={() => updateLeftBlock(block.id, { visible: !block.visible })}
                  className={`relative inline-flex h-4 w-8 shrink-0 rounded-full border-2 border-transparent transition-colors ${block.visible ? "bg-primary" : "bg-border"}`}
                >
                  <span className={`pointer-events-none inline-block h-3 w-3 rounded-full bg-white shadow-sm transform transition-transform ${block.visible ? "translate-x-4" : "translate-x-0"}`} />
                </button>
              </label>
            </div>
            {block.visible && (
              <div className="p-2 space-y-2">
                <TextField label="Category" value={block.category} onChange={v => updateLeftBlock(block.id, { category: v })} />
                <ColorField label="Category color" value={block.categoryColor} onChange={v => updateLeftBlock(block.id, { categoryColor: v })} />
                <TextField label="Headline" value={block.headline} onChange={v => updateLeftBlock(block.id, { headline: v })} />
                <div className="flex gap-2 flex-wrap">
                  <label className="flex items-center gap-1 text-[11px] text-ink-600 cursor-pointer"><input type="checkbox" checked={!!block.showImage} onChange={e => updateLeftBlock(block.id, { showImage: e.target.checked })} className="rounded" /> Image</label>
                  <label className="flex items-center gap-1 text-[11px] text-ink-600 cursor-pointer"><input type="checkbox" checked={!!block.showDesc} onChange={e => updateLeftBlock(block.id, { showDesc: e.target.checked })} className="rounded" /> Description</label>
                  <label className="flex items-center gap-1 text-[11px] text-ink-600 cursor-pointer"><input type="checkbox" checked={!!block.showAuthor} onChange={e => updateLeftBlock(block.id, { showAuthor: e.target.checked })} className="rounded" /> Author</label>
                  <label className="flex items-center gap-1 text-[11px] text-ink-600 cursor-pointer"><input type="checkbox" checked={!!block.showDate} onChange={e => updateLeftBlock(block.id, { showDate: e.target.checked })} className="rounded" /> Date</label>
                </div>
                <SectionDivider label="Card dimensions" />
                <div className="grid grid-cols-2 gap-2">
                  <NumberField label="Width (px)" value={block.cardWidth ?? 0} onChange={v => updateLeftBlock(block.id, { cardWidth: v })} min={0} max={600} />
                  <NumberField label="Height (px)" value={block.cardHeight ?? 0} onChange={v => updateLeftBlock(block.id, { cardHeight: v })} min={0} max={600} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <NumberField label="Headline (px)" value={block.headlineFontSize ?? 14} onChange={v => updateLeftBlock(block.id, { headlineFontSize: v })} min={10} max={36} />
                  <NumberField label="Category (px)" value={block.categoryFontSize ?? 11} onChange={v => updateLeftBlock(block.id, { categoryFontSize: v })} min={9} max={20} />
                </div>
                <NumberField label="Description (px)" value={block.descFontSize ?? 12} onChange={v => updateLeftBlock(block.id, { descFontSize: v })} min={10} max={24} />
              </div>
            )}
          </div>
        ))}
      </Accordion>

      <Accordion label="Center Column — Hero">
        <ArticleModeField data={data} set={set} idKey="heroArticleId" label="Hero article" />
        <p className="text-[11px] text-ink-400">
          On "Latest article", the newest article marked as <strong>Client News</strong> always leads this hero slot automatically. If there's no Client News article yet, the newest published article is used instead. Choose "Choose article" to pin a specific story here.
        </p>
        <SectionDivider label="Fallback content (only used when no real articles are published yet)" />
        <TextField label="Category + Date line" value={data.heroCategory} onChange={v => set({ heroCategory: v })} placeholder="WORLD • POLITICS" />
        <TextField label="Hero headline" value={data.heroHeadline} onChange={v => set({ heroHeadline: v })} />
        <TextField label="Summary" value={data.heroSummary} onChange={v => set({ heroSummary: v })} />
        <TextField label="Author" value={data.heroAuthor} onChange={v => set({ heroAuthor: v })} />
        <TextField label="Author role" value={data.heroAuthorRole} onChange={v => set({ heroAuthorRole: v })} />
        <SectionDivider label="Text sizes" />
        <div className="grid grid-cols-2 gap-2">
          <NumberField label="Headline (px)" value={data.heroHeadlineSize ?? 28} onChange={v => set({ heroHeadlineSize: v })} min={16} max={64} />
          <NumberField label="Summary (px)" value={data.heroSummarySize ?? 15} onChange={v => set({ heroSummarySize: v })} min={12} max={28} />
        </div>
        <NumberField label="Category/meta (px)" value={data.heroCategorySize ?? 12} onChange={v => set({ heroCategorySize: v })} min={9} max={20} />
      </Accordion>

      <Accordion label="Center Column — Category Sections">
        {(() => {
          const realCategories = getCategories();
          const sections = data.centerSections || [];
          // A category is "on" if some section already references it — by
          // real _id when we have one, else by its (uppercased) name for
          // legacy/placeholder sections created before categoryId existed.
          const isCategoryOn = (cat) => sections.some(s =>
            (cat._id && s.categoryId === cat._id) ||
            (!s.categoryId && s.category === String(cat.name || cat.title || "").toUpperCase())
          );
          const toggleCategory = (cat) => {
            if (isCategoryOn(cat)) {
              set({ centerSections: sections.filter(s => !((cat._id && s.categoryId === cat._id) || (!s.categoryId && s.category === String(cat.name || cat.title || "").toUpperCase()))) });
            } else {
              const newSection = makeCenterSectionForCategory(cat, sections.length);
              set({ centerSections: [...sections, newSection] });
            }
          };
          return (
            <>
              {realCategories.length > 0 ? (
                <>
                  <p className="text-[11px] text-ink-500 mb-1">
                    Toggle a category on to add a "{"{Category}"}" section to the homepage's center column, pulling real articles from that category (newest first, never repeating a story already used elsewhere on the page). Toggle off to remove it.
                  </p>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {realCategories.map(cat => {
                      const on = isCategoryOn(cat);
                      return (
                        <button
                          key={cat._id}
                          type="button"
                          onClick={() => toggleCategory(cat)}
                          className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border transition-colors ${on ? "bg-primary text-white border-primary" : "bg-white text-ink-600 border-border hover:border-primary"}`}
                        >
                          {on ? "✓ " : "+ "}{(cat.name || cat.title || "").toUpperCase()}
                        </button>
                      );
                    })}
                  </div>
                </>
              ) : (
                <p className="text-[11px] text-ink-500 mb-2">No categories created yet — add categories on the Categories page to get per-category toggles here. In the meantime you can still edit the placeholder sections below.</p>
              )}

              {sections.map(section => (
                <div key={section.id} className="border border-border rounded-lg overflow-hidden mb-2">
                  <div className="px-3 py-2 bg-gray-50 flex items-center justify-between">
                    <span className="text-[12px] font-semibold" style={{ color: section.color }}>{section.category}</span>
                    <button
                      type="button"
                      title="Remove this section"
                      onClick={() => set({ centerSections: sections.filter(s => s.id !== section.id) })}
                      className="h-5 w-5 flex items-center justify-center rounded text-ink-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                      <X size={12} />
                    </button>
                  </div>
                  <div className="p-2 space-y-2">
                    {!section.categoryId && realCategories.length > 0 && (
                      <SelectField
                        label="Category (shows real articles from this category)"
                        value={section.category}
                        onChange={v => {
                          const matched = realCategories.find(c => (c.name || c.title || "").toUpperCase() === v);
                          updateCenterSection(section.id, matched ? { category: v, categoryId: matched._id } : { category: v });
                        }}
                        options={realCategories.map(c => (c.name || c.title || "").toUpperCase())}
                      />
                    )}
                    {!section.categoryId && realCategories.length === 0 && (
                      <TextField label="Category name" value={section.category} onChange={v => updateCenterSection(section.id, { category: v })} />
                    )}
                    <ColorField label="Color" value={section.color} onChange={v => updateCenterSection(section.id, { color: v })} />
                    <SelectField label="Number of stories" value={section.stories} onChange={v => updateCenterSection(section.id, { stories: Number(v) })} options={[2, 3, 4, 6, 8]} />
                    <SelectField label="Image position" value={section.imagePosition} onChange={v => updateCenterSection(section.id, { imagePosition: v })} options={["top", "left", "right", "hidden"]} />
                    <div className="flex gap-2 flex-wrap">
                      <label className="flex items-center gap-1 text-[11px] text-ink-600 cursor-pointer"><input type="checkbox" checked={!!section.showDesc} onChange={e => updateCenterSection(section.id, { showDesc: e.target.checked })} className="rounded" /> Description</label>
                      <label className="flex items-center gap-1 text-[11px] text-ink-600 cursor-pointer"><input type="checkbox" checked={!!section.showDate} onChange={e => updateCenterSection(section.id, { showDate: e.target.checked })} className="rounded" /> Date</label>
                      <label className="flex items-center gap-1 text-[11px] text-ink-600 cursor-pointer"><input type="checkbox" checked={!!section.showAuthor} onChange={e => updateCenterSection(section.id, { showAuthor: e.target.checked })} className="rounded" /> Author</label>
                    </div>
                    <SectionDivider label="Card dimensions" />
                    <div className="grid grid-cols-2 gap-2">
                      <NumberField label="Width (px)" value={section.cardWidth ?? 0} onChange={v => updateCenterSection(section.id, { cardWidth: v })} min={0} max={600} />
                      <NumberField label="Height (px)" value={section.cardHeight ?? 0} onChange={v => updateCenterSection(section.id, { cardHeight: v })} min={0} max={600} />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <NumberField label="Title (px)" value={section.titleFontSize ?? 14} onChange={v => updateCenterSection(section.id, { titleFontSize: v })} min={10} max={36} />
                      <NumberField label="Desc (px)" value={section.descFontSize ?? 12} onChange={v => updateCenterSection(section.id, { descFontSize: v })} min={10} max={24} />
                    </div>
                  </div>
                </div>
              ))}
            </>
          );
        })()}
      </Accordion>

      <Accordion label="Right Sidebar Blocks">
        {(data.rightBlocks || []).map(block => (
          <div key={block.id} className="border border-border rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-3 py-2 bg-gray-50">
              <span className="text-[12px] font-semibold text-ink-800">{block.label}</span>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <span className="text-[11px] text-ink-500">Visible</span>
                <button
                  role="switch"
                  aria-checked={!!block.visible}
                  onClick={() => updateRightBlock(block.id, { visible: !block.visible })}
                  className={`relative inline-flex h-4 w-8 shrink-0 rounded-full border-2 border-transparent transition-colors ${block.visible ? "bg-primary" : "bg-border"}`}
                >
                  <span className={`pointer-events-none inline-block h-3 w-3 rounded-full bg-white shadow-sm transform transition-transform ${block.visible ? "translate-x-4" : "translate-x-0"}`} />
                </button>
              </label>
            </div>
            {block.visible && block.type === "advertisement" && (
              <div className="p-2 space-y-2">
                <ImageUploadField label="Advertisement image" value={block.imageUrl} onChange={v => updateRightBlock(block.id, { imageUrl: v })} hint="Falls back to the default promo card if left empty." />
                <TextField label="Link URL" value={block.linkUrl} onChange={v => updateRightBlock(block.id, { linkUrl: v })} placeholder="https://…" />
                <TextField label="Alt text" value={block.altText} onChange={v => updateRightBlock(block.id, { altText: v })} />
                <SectionDivider label="Size" />
                <div className="grid grid-cols-2 gap-2">
                  <NumberField label="Width (px, 0 = full)" value={block.width ?? 0} onChange={v => updateRightBlock(block.id, { width: v })} min={0} max={600} />
                  <NumberField label="Height (px)" value={block.height ?? 250} onChange={v => updateRightBlock(block.id, { height: v })} min={50} max={600} />
                </div>
              </div>
            )}
            {block.visible && block.type !== "advertisement" && (
              <div className="p-2 space-y-2">
                <TextField label="Title" value={block.title} onChange={v => updateRightBlock(block.id, { title: v })} />
                {block.itemCount !== undefined && (
                  <SelectField label="Number of items" value={block.itemCount} onChange={v => updateRightBlock(block.id, { itemCount: Number(v) })} options={[3, 4, 5, 6, 8]} />
                )}
                <div className="flex gap-2 flex-wrap">
                  {block.showImages !== undefined && <label className="flex items-center gap-1 text-[11px] text-ink-600 cursor-pointer"><input type="checkbox" checked={!!block.showImages} onChange={e => updateRightBlock(block.id, { showImages: e.target.checked })} className="rounded" /> Images</label>}
                  {block.showDates !== undefined && <label className="flex items-center gap-1 text-[11px] text-ink-600 cursor-pointer"><input type="checkbox" checked={!!block.showDates} onChange={e => updateRightBlock(block.id, { showDates: e.target.checked })} className="rounded" /> Dates</label>}
                  {block.showExcerpt !== undefined && <label className="flex items-center gap-1 text-[11px] text-ink-600 cursor-pointer"><input type="checkbox" checked={!!block.showExcerpt} onChange={e => updateRightBlock(block.id, { showExcerpt: e.target.checked })} className="rounded" /> Excerpt</label>}
                </div>
                <SectionDivider label="Card dimensions" />
                <div className="grid grid-cols-2 gap-2">
                  <NumberField label="Width (px)" value={block.cardWidth ?? 0} onChange={v => updateRightBlock(block.id, { cardWidth: v })} min={0} max={600} />
                  <NumberField label="Height (px)" value={block.cardHeight ?? 0} onChange={v => updateRightBlock(block.id, { cardHeight: v })} min={0} max={600} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <NumberField label="Title (px)" value={block.titleFontSize ?? 13} onChange={v => updateRightBlock(block.id, { titleFontSize: v })} min={10} max={28} />
                  <NumberField label="Meta (px)" value={block.metaFontSize ?? 11} onChange={v => updateRightBlock(block.id, { metaFontSize: v })} min={9} max={20} />
                </div>
              </div>
            )}
          </div>
        ))}
      </Accordion>

      <Accordion label="Layout">
        <NumberField label="Max width (px)" value={data.maxWidth} onChange={v => set({ maxWidth: v })} min={800} max={1920} />
        <NumberField label="Column gap (px)" value={data.columnGap} onChange={v => set({ columnGap: v })} min={8} max={48} />
        <ColorField label="Background color" value={data.bg} onChange={v => set({ bg: v })} />
      </Accordion>
    </>
  );
}

// ─── Shared: sidebar widget list editor (Template 2 / 3 / 7) ────────────────
function SidebarWidgetListEditor({ widgets, onUpdate, sizeOptions = ["sidebar", "square"] }) {
  return (
    <>
      {(widgets || []).filter((w) => w.type !== "categories").map((w) => (
        <div key={w.id} className="border border-border rounded-lg overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 bg-gray-50">
            <span className="text-[12px] font-semibold text-ink-800">{w.label}</span>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <span className="text-[11px] text-ink-500">Enabled</span>
              <button
                role="switch"
                aria-checked={!!w.enabled}
                onClick={() => onUpdate(w.id, { enabled: !w.enabled })}
                className={`relative inline-flex h-4 w-8 shrink-0 rounded-full border-2 border-transparent transition-colors ${w.enabled ? "bg-primary" : "bg-border"}`}
              >
                <span className={`pointer-events-none inline-block h-3 w-3 rounded-full bg-white shadow-sm transform transition-transform ${w.enabled ? "translate-x-4" : "translate-x-0"}`} />
              </button>
            </label>
          </div>
          {w.enabled && (
            <div className="p-2 space-y-2">
              {w.type !== "advertisement" && (
                <TextField label="Title" value={w.title} onChange={(v) => onUpdate(w.id, { title: v })} />
              )}
              {w.type === "newsletter" && (
                <TextField label="Description" value={w.description} onChange={(v) => onUpdate(w.id, { description: v })} />
              )}
              {w.itemCount !== undefined && (
                <SelectField label="Number of items" value={w.itemCount} onChange={(v) => onUpdate(w.id, { itemCount: Number(v) })} options={[3, 4, 5, 6, 8]} />
              )}
              {w.type === "trending" && (
                <div className="flex gap-2 flex-wrap">
                  <label className="flex items-center gap-1 text-[11px] text-ink-600 cursor-pointer"><input type="checkbox" checked={!!w.showImages} onChange={(e) => onUpdate(w.id, { showImages: e.target.checked })} className="rounded" /> Images</label>
                  <label className="flex items-center gap-1 text-[11px] text-ink-600 cursor-pointer"><input type="checkbox" checked={!!w.showTime} onChange={(e) => onUpdate(w.id, { showTime: e.target.checked })} className="rounded" /> Time</label>
                </div>
              )}
              {w.type === "popular" && (
                <label className="flex items-center gap-1 text-[11px] text-ink-600 cursor-pointer"><input type="checkbox" checked={!!w.showNumbers} onChange={(e) => onUpdate(w.id, { showNumbers: e.target.checked })} className="rounded" /> Show numbers</label>
              )}
              {w.type === "categories" && (
                <TextField
                  label="Categories (comma separated)"
                  value={(w.categories || []).join(", ")}
                  onChange={(v) => onUpdate(w.id, { categories: v.split(",").map((s) => s.trim()).filter(Boolean) })}
                />
              )}
              {w.type === "advertisement" && (
                <>
                  <ImageUploadField label="Advertisement image" value={w.imageUrl} onChange={(v) => onUpdate(w.id, { imageUrl: v })} />
                  <TextField label="Link URL" value={w.linkUrl} onChange={(v) => onUpdate(w.id, { linkUrl: v })} placeholder="https://…" />
                  <SelectField label="Ad preset size" value={w.size} onChange={(v) => onUpdate(w.id, { size: v })} options={sizeOptions} />
                  <div className="grid grid-cols-2 gap-2">
                    <NumberField label="Width (px, 0 = auto)" value={w.width ?? 0} onChange={(v) => onUpdate(w.id, { width: v })} min={0} max={600} />
                    <NumberField label="Height (px, 0 = auto)" value={w.height ?? 0} onChange={(v) => onUpdate(w.id, { height: v })} min={0} max={600} />
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      ))}
    </>
  );
}

// ─── Shared: simple named-list editor (categories, category grid sections) ──
function NamedCountListEditor({ items, onUpdate, countLabel = "Number of articles", countOptions = [2, 3, 4, 6, 8] }) {
  return (
    <>
      {(items || []).map((item) => (
        <div key={item.id} className="border border-border rounded-lg overflow-hidden p-2 space-y-2">
          <TextField label="Category name" value={item.name} onChange={(v) => onUpdate(item.id, { name: v })} />
          <SelectField label={countLabel} value={item.articleCount} onChange={(v) => onUpdate(item.id, { articleCount: Number(v) })} options={countOptions} />
        </div>
      ))}
    </>
  );
}

/**
 * Editor for a homepage "category grid" list (Modern Magazine's Category
 * Grid, Dark News's Category Blocks, Masonry's Category Grid). Unlike
 * NamedCountListEditor, each item's category is picked from a dropdown of
 * the *real* categories the admin created on the Categories page (instead
 * of a free-text name that can typo/drift out of sync), and the whole list
 * is dynamic — admin can add a new category item or delete an existing one.
 * Stores both `categoryId` (used to reliably match real articles) and
 * `name` (used for display + backward compatibility with older saved data)
 * on each item.
 */
function CategoryGridListEditor({ items, onUpdate, onAdd, onRemove, countLabel = "Number of articles", countOptions = [2, 3, 4, 6, 8] }) {
  const realCategories = getCategories();
  const list = items || [];

  return (
    <div className="space-y-2">
      {list.length === 0 && (
        <p className="text-[11.5px] text-ink-400">No category items yet. Click "Add category" below to add one.</p>
      )}
      {list.map((item) => (
        <div key={item.id} className="border border-border rounded-lg overflow-hidden p-2 space-y-2 relative">
          <button
            type="button"
            onClick={() => onRemove(item.id)}
            title="Remove this category item"
            className="absolute top-2 right-2 h-6 w-6 flex items-center justify-center rounded-md text-ink-400 hover:text-red-600 hover:bg-red-50 transition-colors"
          >
            <Trash2 size={14} />
          </button>
          <div className="pr-7">
            <FieldLabel>Category</FieldLabel>
            {realCategories.length > 0 ? (
              <select
                value={item.categoryId || ""}
                onChange={(e) => {
                  const cat = realCategories.find((c) => c._id === e.target.value);
                  onUpdate(item.id, { categoryId: e.target.value, name: cat ? (cat.name || cat.title) : item.name });
                }}
                className="w-full rounded-lg border border-border bg-surface-soft px-3 py-2 text-[12.5px] text-ink-900 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
              >
                {!item.categoryId && <option value="">Select a category…</option>}
                {realCategories.map((c) => (
                  <option key={c._id} value={c._id}>{c.name || c.title}</option>
                ))}
              </select>
            ) : (
              <>
                <p className="text-[11px] text-ink-400 mb-1.5">No categories created yet on the Categories page — using a text name for now.</p>
                <TextField label="" value={item.name} onChange={(v) => onUpdate(item.id, { name: v, categoryId: "" })} placeholder="Category name" />
              </>
            )}
          </div>
          <SelectField label={countLabel} value={item.articleCount} onChange={(v) => onUpdate(item.id, { articleCount: Number(v) })} options={countOptions} />
        </div>
      ))}
      <button
        type="button"
        onClick={onAdd}
        className="w-full flex items-center justify-center gap-1.5 rounded-lg border border-dashed border-border px-3 py-2 text-[12px] font-medium text-primary hover:border-primary/40 hover:bg-primary-50 transition-colors"
      >
        <Plus size={14} /> Add category
      </button>
    </div>
  );
}

// ─── Template 2: Modern Magazine ─────────────────────────────────────────────
function ModernMagazineSettings({ data, set }) {
  const updateWidget = (id, patch) => set({ sidebarWidgets: (data.sidebarWidgets || []).map((w) => (w.id === id ? { ...w, ...patch } : w)) });
  const updateCategory = (id, patch) => set({ categoryGridCategories: (data.categoryGridCategories || []).map((c) => (c.id === id ? { ...c, ...patch } : c)) });
  const addCategory = () => {
    const realCategories = getCategories();
    const used = new Set((data.categoryGridCategories || []).map((c) => c.categoryId).filter(Boolean));
    const next = realCategories.find((c) => !used.has(c._id)) || realCategories[0] || null;
    set({
      categoryGridCategories: [
        ...(data.categoryGridCategories || []),
        { id: `cg${Date.now()}`, categoryId: next?._id || "", name: next ? (next.name || next.title) : "New Category", articleCount: 4 },
      ],
    });
  };
  const removeCategory = (id) => set({ categoryGridCategories: (data.categoryGridCategories || []).filter((c) => c.id !== id) });

  return (
    <>
      <Accordion label="Hero Section">
        <ToggleField label="Show Hero" value={data.heroEnabled !== false} onChange={(v) => set({ heroEnabled: v })} />
        {data.heroEnabled !== false && (
          <>
            <TextField label="Background image URL" value={data.heroImage} onChange={(v) => set({ heroImage: v })} placeholder="https://…" />
            <RangeField label="Overlay opacity" value={data.heroOverlayOpacity ?? 55} min={0} max={100} onChange={(v) => set({ heroOverlayOpacity: v })} unit="%" />
            <TextField label="Category label" value={data.heroCategory} onChange={(v) => set({ heroCategory: v })} />
            <TextField label="Headline" value={data.heroHeadline} onChange={(v) => set({ heroHeadline: v })} />
            <TextField label="Description" value={data.heroDescription} onChange={(v) => set({ heroDescription: v })} />
            <div className="grid grid-cols-2 gap-2">
              <TextField label="Button label" value={data.heroCtaLabel} onChange={(v) => set({ heroCtaLabel: v })} />
              <TextField label="Button URL" value={data.heroCtaUrl} onChange={(v) => set({ heroCtaUrl: v })} />
            </div>
            <NumberField label="Height (px)" value={data.heroHeight ?? 420} onChange={(v) => set({ heroHeight: v })} min={200} max={800} />
            <NumberField label="Width (px, 0=full)" value={data.heroWidth ?? 0} onChange={(v) => set({ heroWidth: v })} min={0} max={1920} />
            <NumberField label="Title size (px)" value={data.heroTitleSize ?? 32} onChange={(v) => set({ heroTitleSize: v })} min={18} max={56} />
            <NumberField label="Description size (px)" value={data.heroDescSize ?? 15} onChange={(v) => set({ heroDescSize: v })} min={12} max={28} />
            <NumberField label="Category label size (px)" value={data.heroCategorySize ?? 11} onChange={(v) => set({ heroCategorySize: v })} min={9} max={20} />
          </>
        )}
      </Accordion>

      <Accordion label="Top Stories">
        <ToggleField label="Show Top Stories" value={data.topStoriesEnabled !== false} onChange={(v) => set({ topStoriesEnabled: v })} />
        {data.topStoriesEnabled !== false && (
          <>
            <TextField label="Section title" value={data.topStoriesTitle} onChange={(v) => set({ topStoriesTitle: v })} />
            <SelectField label="Number of cards" value={data.topStoriesCount} onChange={(v) => set({ topStoriesCount: Number(v) })} options={[2, 4, 6, 8]} />
            <SectionDivider label="Card dimensions" />
            <div className="grid grid-cols-2 gap-2">
              <NumberField label="Card width (px)" value={data.topStoriesCardWidth ?? 0} onChange={(v) => set({ topStoriesCardWidth: v })} min={0} max={800} />
              <NumberField label="Card height (px)" value={data.topStoriesCardHeight ?? 0} onChange={(v) => set({ topStoriesCardHeight: v })} min={0} max={600} />
            </div>
            <p className="text-[11px] text-ink-400">Set 0 for auto sizing</p>
            <SectionDivider label="Text sizes" />
            <div className="grid grid-cols-2 gap-2">
              <NumberField label="Title (px)" value={data.topStoriesTitleSize ?? 15} onChange={(v) => set({ topStoriesTitleSize: v })} min={10} max={36} />
              <NumberField label="Category (px)" value={data.topStoriesCategorySize ?? 11} onChange={(v) => set({ topStoriesCategorySize: v })} min={9} max={20} />
            </div>
          </>
        )}
      </Accordion>

      <Accordion label="Right Sidebar Widgets">
        <p className="text-[11px] text-ink-500 mb-2">Enable, reorder and configure each sidebar widget.</p>
        <SidebarWidgetListEditor widgets={data.sidebarWidgets} onUpdate={updateWidget} />
      </Accordion>

      <Accordion label="Latest News">
        <ToggleField label="Show Latest News" value={data.latestNewsEnabled !== false} onChange={(v) => set({ latestNewsEnabled: v })} />
        {data.latestNewsEnabled !== false && (
          <>
            <TextField label="Section title" value={data.latestNewsTitle} onChange={(v) => set({ latestNewsTitle: v })} />
            <SelectField label="Number of articles" value={data.latestNewsLimit} onChange={(v) => set({ latestNewsLimit: Number(v) })} options={[4, 6, 8, 10, 12]} />
            <SectionDivider label="Card dimensions" />
            <div className="grid grid-cols-2 gap-2">
              <NumberField label="Card width (px)" value={data.latestNewsCardWidth ?? 0} onChange={(v) => set({ latestNewsCardWidth: v })} min={0} max={800} />
              <NumberField label="Card height (px)" value={data.latestNewsCardHeight ?? 0} onChange={(v) => set({ latestNewsCardHeight: v })} min={0} max={600} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <NumberField label="Title (px)" value={data.latestNewsTitleSize ?? 15} onChange={(v) => set({ latestNewsTitleSize: v })} min={10} max={36} />
              <NumberField label="Excerpt (px)" value={data.latestNewsExcerptSize ?? 13} onChange={(v) => set({ latestNewsExcerptSize: v })} min={10} max={24} />
            </div>
            <NumberField label="Category (px)" value={data.latestNewsCategorySize ?? 11} onChange={(v) => set({ latestNewsCategorySize: v })} min={9} max={20} />
          </>
        )}
      </Accordion>

      <Accordion label="Editor's Picks">
        <ToggleField label="Show Editor's Picks" value={data.editorsPicksEnabled !== false} onChange={(v) => set({ editorsPicksEnabled: v })} />
        {data.editorsPicksEnabled !== false && (
          <TextField label="Section title" value={data.editorsPicksTitle} onChange={(v) => set({ editorsPicksTitle: v })} />
        )}
      </Accordion>

      <Accordion label="Category Grid">
        <ToggleField label="Show Category Grid" value={data.categoryGridEnabled !== false} onChange={(v) => set({ categoryGridEnabled: v })} />
        {data.categoryGridEnabled !== false && (
          <CategoryGridListEditor items={data.categoryGridCategories} onUpdate={updateCategory} onAdd={addCategory} onRemove={removeCategory} />
        )}
      </Accordion>

      <Accordion label="Advertisement Banner">
        <ToggleField label="Show Advertisement" value={data.adEnabled !== false} onChange={(v) => set({ adEnabled: v })} />
        {data.adEnabled !== false && (
          <>
            <ImageUploadField label="Advertisement image" value={data.adImage} onChange={(v) => set({ adImage: v })} hint="Falls back to a placeholder banner if left empty." />
            <TextField label="Link URL" value={data.adLinkUrl} onChange={(v) => set({ adLinkUrl: v })} placeholder="https://…" />
            <TextField label="Alt text" value={data.adAltText} onChange={(v) => set({ adAltText: v })} />
            <SelectField label="Ad preset size" value={data.adSize} onChange={(v) => set({ adSize: v })} options={["970x90", "728x90"]} />
            <div className="grid grid-cols-2 gap-2">
              <NumberField label="Width (px, 0 = full)" value={data.adWidth ?? 0} onChange={(v) => set({ adWidth: v })} min={0} max={1600} />
              <NumberField label="Height (px, 0 = preset)" value={data.adHeight ?? 0} onChange={(v) => set({ adHeight: v })} min={0} max={600} />
            </div>
          </>
        )}
      </Accordion>

      <Accordion label="Latest Articles Grid">
        <ToggleField label="Show Latest Articles Grid" value={data.latestGridEnabled !== false} onChange={(v) => set({ latestGridEnabled: v })} />
        {data.latestGridEnabled !== false && (
          <>
            <TextField label="Section title" value={data.latestGridTitle} onChange={(v) => set({ latestGridTitle: v })} />
            <SelectField label="Desktop columns" value={data.latestGridColumns ?? 3} onChange={(v) => set({ latestGridColumns: Number(v) })} options={[2, 3, 4]} />
            <SelectField label="Number of articles" value={data.latestGridLimit} onChange={(v) => set({ latestGridLimit: Number(v) })} options={[6, 9, 12, 15]} />
            <SectionDivider label="Card dimensions" />
            <div className="grid grid-cols-2 gap-2">
              <NumberField label="Card width (px)" value={data.latestGridCardWidth ?? 0} onChange={(v) => set({ latestGridCardWidth: v })} min={0} max={800} />
              <NumberField label="Card height (px)" value={data.latestGridCardHeight ?? 0} onChange={(v) => set({ latestGridCardHeight: v })} min={0} max={600} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <NumberField label="Title (px)" value={data.latestGridTitleSize ?? 15} onChange={(v) => set({ latestGridTitleSize: v })} min={10} max={36} />
              <NumberField label="Excerpt (px)" value={data.latestGridExcerptSize ?? 13} onChange={(v) => set({ latestGridExcerptSize: v })} min={10} max={24} />
            </div>
          </>
        )}
      </Accordion>

      <Accordion label="Newsletter">
        <ToggleField label="Show Newsletter" value={data.newsletterEnabled !== false} onChange={(v) => set({ newsletterEnabled: v })} />
        {data.newsletterEnabled !== false && (
          <>
            <TextField label="Heading" value={data.newsletterHeading} onChange={(v) => set({ newsletterHeading: v })} />
            <TextField label="Description" value={data.newsletterSubheading} onChange={(v) => set({ newsletterSubheading: v })} />
            <TextField label="Button label" value={data.newsletterCtaLabel} onChange={(v) => set({ newsletterCtaLabel: v })} />
            <ColorField label="Background color" value={data.newsletterBg} onChange={(v) => set({ newsletterBg: v })} />
          </>
        )}
      </Accordion>

      <Accordion label="Load More Button">
        <ToggleField label="Show Load More" value={data.loadMoreEnabled !== false} onChange={(v) => set({ loadMoreEnabled: v })} />
        {data.loadMoreEnabled !== false && (
          <>
            <TextField label="Button text" value={data.loadMoreLabel} onChange={(v) => set({ loadMoreLabel: v })} />
            <ColorField label="Button color" value={data.loadMoreColor} onChange={(v) => set({ loadMoreColor: v })} />
            <NumberField label="Border radius (px)" value={data.loadMoreRadius ?? 6} onChange={(v) => set({ loadMoreRadius: v })} min={0} max={30} />
            <SelectField label="Action" value={data.loadMoreAction} onChange={(v) => set({ loadMoreAction: v })} options={["loadMore", "pagination", "customUrl"]} />
            {data.loadMoreAction === "customUrl" && (
              <TextField label="Custom URL" value={data.loadMoreUrl} onChange={(v) => set({ loadMoreUrl: v })} placeholder="/articles" />
            )}
            {data.loadMoreAction === "loadMore" && (
              <NumberField label="Articles to reveal per click" value={data.loadMoreIncrement ?? 3} onChange={(v) => set({ loadMoreIncrement: Math.max(3, v) })} min={3} max={24} />
            )}
          </>
        )}
      </Accordion>

      <Accordion label="Layout">
        <NumberField label="Max width (px)" value={data.maxWidth} onChange={(v) => set({ maxWidth: v })} min={960} max={1920} />
        <NumberField label="Column gap (px)" value={data.columnGap} onChange={(v) => set({ columnGap: v })} min={8} max={48} />
        <ColorField label="Background color" value={data.bg} onChange={(v) => set({ bg: v })} />
      </Accordion>
    </>
  );
}

// ─── Template 3: Dark News ────────────────────────────────────────────────────
function DarkNewsSettings({ data, set }) {
  const updateWidget = (id, patch) => set({ sidebarWidgets: (data.sidebarWidgets || []).map((w) => (w.id === id ? { ...w, ...patch } : w)) });
  const updateLowerWidget = (id, patch) => set({ lowerSidebarWidgets: (data.lowerSidebarWidgets || []).map((w) => (w.id === id ? { ...w, ...patch } : w)) });
  const updateCategoryBlock = (id, patch) => set({ categoryBlocks: (data.categoryBlocks || []).map((c) => (c.id === id ? { ...c, ...patch } : c)) });
  const addCategoryBlock = () => {
    const realCategories = getCategories();
    const used = new Set((data.categoryBlocks || []).map((c) => c.categoryId).filter(Boolean));
    const next = realCategories.find((c) => !used.has(c._id)) || realCategories[0] || null;
    set({
      categoryBlocks: [
        ...(data.categoryBlocks || []),
        { id: `db${Date.now()}`, categoryId: next?._id || "", name: next ? (next.name || next.title) : "New Category", articleCount: 2 },
      ],
    });
  };
  const removeCategoryBlock = (id) => set({ categoryBlocks: (data.categoryBlocks || []).filter((c) => c.id !== id) });

  return (
    <>
      <Accordion label="Dark Theme Colors">
        <ColorField label="Page background" value={data.bg} onChange={(v) => set({ bg: v })} />
        <ColorField label="Card background" value={data.cardBg} onChange={(v) => set({ cardBg: v })} />
        <ColorField label="Accent color" value={data.accentColor} onChange={(v) => set({ accentColor: v })} />
      </Accordion>

      <Accordion label="Hero">
        <ToggleField label="Show Hero" value={data.heroEnabled !== false} onChange={(v) => set({ heroEnabled: v })} />
        {data.heroEnabled !== false && (
          <>
            <TextField label="Background image URL" value={data.heroImage} onChange={(v) => set({ heroImage: v })} placeholder="https://…" />
            <RangeField label="Overlay opacity" value={data.heroOverlayOpacity ?? 65} min={0} max={100} onChange={(v) => set({ heroOverlayOpacity: v })} unit="%" />
            <TextField label="Category label" value={data.heroCategory} onChange={(v) => set({ heroCategory: v })} />
            <TextField label="Headline" value={data.heroHeadline} onChange={(v) => set({ heroHeadline: v })} />
            <TextField label="Description" value={data.heroDescription} onChange={(v) => set({ heroDescription: v })} />
            <div className="grid grid-cols-2 gap-2">
              <TextField label="Button label" value={data.heroCtaLabel} onChange={(v) => set({ heroCtaLabel: v })} />
              <TextField label="Button URL" value={data.heroCtaUrl} onChange={(v) => set({ heroCtaUrl: v })} />
            </div>
            <NumberField label="Height (px)" value={data.heroHeight ?? 460} onChange={(v) => set({ heroHeight: v })} min={200} max={800} />
            <NumberField label="Width (px, 0=full)" value={data.heroWidth ?? 0} onChange={(v) => set({ heroWidth: v })} min={0} max={1920} />
            <SectionDivider label="Text sizes" />
            <div className="grid grid-cols-2 gap-2">
              <NumberField label="Headline (px)" value={data.heroTitleSize ?? 34} onChange={(v) => set({ heroTitleSize: v })} min={18} max={64} />
              <NumberField label="Description (px)" value={data.heroDescSize ?? 15} onChange={(v) => set({ heroDescSize: v })} min={12} max={28} />
            </div>
            <NumberField label="Category label (px)" value={data.heroCategorySize ?? 11} onChange={(v) => set({ heroCategorySize: v })} min={9} max={20} />
          </>
        )}
      </Accordion>

      <Accordion label="Right Sidebar (top)">
        <SidebarWidgetListEditor widgets={data.sidebarWidgets} onUpdate={updateWidget} />
      </Accordion>

      <Accordion label="Featured Stories">
        <ToggleField label="Show Featured Stories" value={data.featuredStoriesEnabled !== false} onChange={(v) => set({ featuredStoriesEnabled: v })} />
        {data.featuredStoriesEnabled !== false && (
          <>
            <TextField label="Section title" value={data.featuredStoriesTitle} onChange={(v) => set({ featuredStoriesTitle: v })} />
            <SelectField label="Number of cards" value={data.featuredStoriesCount} onChange={(v) => set({ featuredStoriesCount: Number(v) })} options={[2, 4, 6]} />
            <SectionDivider label="Card dimensions" />
            <div className="grid grid-cols-2 gap-2">
              <NumberField label="Card width (px)" value={data.featuredCardWidth ?? 0} onChange={(v) => set({ featuredCardWidth: v })} min={0} max={800} />
              <NumberField label="Card height (px)" value={data.featuredCardHeight ?? 0} onChange={(v) => set({ featuredCardHeight: v })} min={0} max={600} />
            </div>
            <p className="text-[11px] text-ink-400">Set 0 for auto sizing</p>
            <div className="grid grid-cols-2 gap-2">
              <NumberField label="Title (px)" value={data.featuredTitleSize ?? 16} onChange={(v) => set({ featuredTitleSize: v })} min={10} max={36} />
              <NumberField label="Category (px)" value={data.featuredCategorySize ?? 11} onChange={(v) => set({ featuredCategorySize: v })} min={9} max={20} />
            </div>
          </>
        )}
      </Accordion>

      <Accordion label="Latest News">
        <ToggleField label="Show Latest News" value={data.latestNewsEnabled !== false} onChange={(v) => set({ latestNewsEnabled: v })} />
        {data.latestNewsEnabled !== false && (
          <>
            <TextField label="Section title" value={data.latestNewsTitle} onChange={(v) => set({ latestNewsTitle: v })} />
            <SelectField label="Number of articles" value={data.latestNewsLimit} onChange={(v) => set({ latestNewsLimit: Number(v) })} options={[4, 6, 8]} />
            <SectionDivider label="Card dimensions" />
            <div className="grid grid-cols-2 gap-2">
              <NumberField label="Card width (px)" value={data.latestNewsCardWidth ?? 0} onChange={(v) => set({ latestNewsCardWidth: v })} min={0} max={800} />
              <NumberField label="Card height (px)" value={data.latestNewsCardHeight ?? 0} onChange={(v) => set({ latestNewsCardHeight: v })} min={0} max={600} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <NumberField label="Title (px)" value={data.latestNewsTitleSize ?? 15} onChange={(v) => set({ latestNewsTitleSize: v })} min={10} max={36} />
              <NumberField label="Excerpt (px)" value={data.latestNewsExcerptSize ?? 13} onChange={(v) => set({ latestNewsExcerptSize: v })} min={10} max={24} />
            </div>
          </>
        )}
      </Accordion>

      <Accordion label="Most Read">
        <ToggleField label="Show Most Read" value={data.mostReadEnabled !== false} onChange={(v) => set({ mostReadEnabled: v })} />
        {data.mostReadEnabled !== false && (
          <>
            <TextField label="Section title" value={data.mostReadTitle} onChange={(v) => set({ mostReadTitle: v })} />
            <SelectField label="Number of items" value={data.mostReadCount} onChange={(v) => set({ mostReadCount: Number(v) })} options={[3, 4, 5, 6]} />
          </>
        )}
      </Accordion>

      <Accordion label="Editor's Choice">
        <ToggleField label="Show Editor's Choice" value={data.editorsChoiceEnabled !== false} onChange={(v) => set({ editorsChoiceEnabled: v })} />
        {data.editorsChoiceEnabled !== false && (
          <>
            <TextField label="Section title" value={data.editorsChoiceTitle} onChange={(v) => set({ editorsChoiceTitle: v })} />
            <SelectField label="Number of cards" value={data.editorsChoiceCount} onChange={(v) => set({ editorsChoiceCount: Number(v) })} options={[2, 4, 6]} />
          </>
        )}
      </Accordion>

      <Accordion label="Category Blocks">
        <ToggleField label="Show Category Blocks" value={data.categoryBlocksEnabled !== false} onChange={(v) => set({ categoryBlocksEnabled: v })} />
        {data.categoryBlocksEnabled !== false && (
          <CategoryGridListEditor items={data.categoryBlocks} onUpdate={updateCategoryBlock} onAdd={addCategoryBlock} onRemove={removeCategoryBlock} countLabel="Number of articles" countOptions={[1, 2, 3, 4]} />
        )}
      </Accordion>

      <Accordion label="Right Sidebar (lower)">
        <SidebarWidgetListEditor widgets={data.lowerSidebarWidgets} onUpdate={updateLowerWidget} />
      </Accordion>

      <Accordion label="Advertisement">
        <ToggleField label="Show Advertisement" value={data.adEnabled !== false} onChange={(v) => set({ adEnabled: v })} />
        {data.adEnabled !== false && (
          <>
            <ImageUploadField label="Advertisement image" value={data.adImage} onChange={(v) => set({ adImage: v })} hint="Falls back to a placeholder banner if left empty." />
            <TextField label="Link URL" value={data.adLinkUrl} onChange={(v) => set({ adLinkUrl: v })} placeholder="https://…" />
            <TextField label="Alt text" value={data.adAltText} onChange={(v) => set({ adAltText: v })} />
            <SelectField label="Ad preset size" value={data.adSize} onChange={(v) => set({ adSize: v })} options={["728x90", "970x90"]} />
            <div className="grid grid-cols-2 gap-2">
              <NumberField label="Width (px, 0 = full)" value={data.adWidth ?? 0} onChange={(v) => set({ adWidth: v })} min={0} max={1600} />
              <NumberField label="Height (px, 0 = preset)" value={data.adHeight ?? 0} onChange={(v) => set({ adHeight: v })} min={0} max={600} />
            </div>
          </>
        )}
      </Accordion>

      <Accordion label="Latest Articles">
        <ToggleField label="Show Latest Articles" value={data.latestGridEnabled !== false} onChange={(v) => set({ latestGridEnabled: v })} />
        {data.latestGridEnabled !== false && (
          <>
            <TextField label="Section title" value={data.latestGridTitle} onChange={(v) => set({ latestGridTitle: v })} />
            <SelectField label="Desktop columns" value={data.latestGridColumns ?? 3} onChange={(v) => set({ latestGridColumns: Number(v) })} options={[2, 3, 4]} />
            <SelectField label="Number of articles" value={data.latestGridLimit} onChange={(v) => set({ latestGridLimit: Number(v) })} options={[3, 6, 9, 12]} />
            <SectionDivider label="Card dimensions" />
            <div className="grid grid-cols-2 gap-2">
              <NumberField label="Card width (px)" value={data.latestGridCardWidth ?? 0} onChange={(v) => set({ latestGridCardWidth: v })} min={0} max={800} />
              <NumberField label="Card height (px)" value={data.latestGridCardHeight ?? 0} onChange={(v) => set({ latestGridCardHeight: v })} min={0} max={600} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <NumberField label="Title (px)" value={data.latestGridTitleSize ?? 15} onChange={(v) => set({ latestGridTitleSize: v })} min={10} max={36} />
              <NumberField label="Excerpt (px)" value={data.latestGridExcerptSize ?? 13} onChange={(v) => set({ latestGridExcerptSize: v })} min={10} max={24} />
            </div>
          </>
        )}
      </Accordion>

      <Accordion label="Newsletter">
        <ToggleField label="Show Newsletter" value={data.newsletterEnabled !== false} onChange={(v) => set({ newsletterEnabled: v })} />
        {data.newsletterEnabled !== false && (
          <>
            <TextField label="Heading" value={data.newsletterHeading} onChange={(v) => set({ newsletterHeading: v })} />
            <TextField label="Description" value={data.newsletterSubheading} onChange={(v) => set({ newsletterSubheading: v })} />
            <TextField label="Button label" value={data.newsletterCtaLabel} onChange={(v) => set({ newsletterCtaLabel: v })} />
          </>
        )}
      </Accordion>

      <Accordion label="Load More Articles">
        <ToggleField label="Show Load More" value={data.loadMoreEnabled !== false} onChange={(v) => set({ loadMoreEnabled: v })} />
        {data.loadMoreEnabled !== false && (
          <>
            <TextField label="Button text" value={data.loadMoreLabel} onChange={(v) => set({ loadMoreLabel: v })} />
            <ColorField label="Button color" value={data.loadMoreColor} onChange={(v) => set({ loadMoreColor: v })} />
            <NumberField label="Border radius (px)" value={data.loadMoreRadius ?? 6} onChange={(v) => set({ loadMoreRadius: v })} min={0} max={30} />
            <SelectField label="Action" value={data.loadMoreAction} onChange={(v) => set({ loadMoreAction: v })} options={["loadMore", "pagination", "customUrl"]} />
            {data.loadMoreAction === "customUrl" && (
              <TextField label="Custom URL" value={data.loadMoreUrl} onChange={(v) => set({ loadMoreUrl: v })} placeholder="/articles" />
            )}
            {data.loadMoreAction === "loadMore" && (
              <NumberField label="Articles to reveal per click" value={data.loadMoreIncrement ?? 3} onChange={(v) => set({ loadMoreIncrement: Math.max(3, v) })} min={3} max={24} />
            )}
          </>
        )}
      </Accordion>

      <Accordion label="Layout">
        <NumberField label="Max width (px)" value={data.maxWidth} onChange={(v) => set({ maxWidth: v })} min={960} max={1920} />
        <NumberField label="Column gap (px)" value={data.columnGap} onChange={(v) => set({ columnGap: v })} min={8} max={48} />
      </Accordion>
    </>
  );
}

// ─── Template 7: Masonry Editorial Layout ───────────────────────────────────
function MasonryEditorialSettings({ data, set }) {
  const updateWidget = (id, patch) => set({ sidebarWidgets: (data.sidebarWidgets || []).map((w) => (w.id === id ? { ...w, ...patch } : w)) });
  const updateCategory = (id, patch) => set({ categoryGridCategories: (data.categoryGridCategories || []).map((c) => (c.id === id ? { ...c, ...patch } : c)) });
  const addCategory = () => {
    const realCategories = getCategories();
    const used = new Set((data.categoryGridCategories || []).map((c) => c.categoryId).filter(Boolean));
    const next = realCategories.find((c) => !used.has(c._id)) || realCategories[0] || null;
    set({
      categoryGridCategories: [
        ...(data.categoryGridCategories || []),
        { id: `mc${Date.now()}`, categoryId: next?._id || "", name: next ? (next.name || next.title) : "New Category", articleCount: 4 },
      ],
    });
  };
  const removeCategory = (id) => set({ categoryGridCategories: (data.categoryGridCategories || []).filter((c) => c.id !== id) });

  return (
    <>
      <Accordion label="Hero Masonry">
        <SelectField label="Hero source" value={data.heroSource} onChange={(v) => set({ heroSource: v })} options={["manual", "latest", "category", "tag"]} />
        <TextField label="Category label" value={data.heroCategory} onChange={(v) => set({ heroCategory: v })} />
        <TextField label="Headline" value={data.heroHeadline} onChange={(v) => set({ heroHeadline: v })} />
        <TextField label="Description" value={data.heroDescription} onChange={(v) => set({ heroDescription: v })} />
        <div className="grid grid-cols-2 gap-2">
          <TextField label="Author" value={data.heroAuthor} onChange={(v) => set({ heroAuthor: v })} />
          <TextField label="Date" value={data.heroDate} onChange={(v) => set({ heroDate: v })} />
        </div>
        <TextField label="Background image URL" value={data.heroImage} onChange={(v) => set({ heroImage: v })} placeholder="https://…" />
        <RangeField label="Overlay opacity" value={data.heroOverlayOpacity ?? 45} min={0} max={100} onChange={(v) => set({ heroOverlayOpacity: v })} unit="%" />
        <NumberField label="Image height (px)" value={data.heroImageHeight ?? 420} onChange={(v) => set({ heroImageHeight: v })} min={240} max={800} />
        <NumberField label="Image width (px, 0=auto)" value={data.heroImageWidth ?? 0} onChange={(v) => set({ heroImageWidth: v })} min={0} max={1920} />
        <div className="grid grid-cols-2 gap-2">
          <TextField label="Button label" value={data.heroCtaLabel} onChange={(v) => set({ heroCtaLabel: v })} />
          <TextField label="Button URL" value={data.heroCtaUrl} onChange={(v) => set({ heroCtaUrl: v })} />
        </div>
        <SelectField label="Small stories (right column)" value={data.heroSmallStories ?? 2} onChange={(v) => set({ heroSmallStories: Number(v) })} options={[2, 3]} />
        <SectionDivider label="Text sizes" />
        <div className="grid grid-cols-2 gap-2">
          <NumberField label="Headline (px)" value={data.heroHeadlineSize ?? 28} onChange={(v) => set({ heroHeadlineSize: v })} min={16} max={64} />
          <NumberField label="Description (px)" value={data.heroDescSize ?? 14} onChange={(v) => set({ heroDescSize: v })} min={12} max={28} />
        </div>
        <NumberField label="Category label (px)" value={data.heroCategorySize ?? 11} onChange={(v) => set({ heroCategorySize: v })} min={9} max={20} />
      </Accordion>

      <Accordion label="Editor's Picks">
        <ToggleField label="Show Editor's Picks" value={data.editorsPicksEnabled !== false} onChange={(v) => set({ editorsPicksEnabled: v })} />
        {data.editorsPicksEnabled !== false && (
          <>
            <TextField label="Section title" value={data.editorsPicksTitle} onChange={(v) => set({ editorsPicksTitle: v })} />
            <SelectField label="Number of cards" value={data.editorsPicksCount} onChange={(v) => set({ editorsPicksCount: Number(v) })} options={[2, 3, 4, 6]} />
            <SectionDivider label="Card dimensions" />
            <div className="grid grid-cols-2 gap-2">
              <NumberField label="Card width (px)" value={data.editorsPicksCardWidth ?? 0} onChange={(v) => set({ editorsPicksCardWidth: v })} min={0} max={800} />
              <NumberField label="Card height (px)" value={data.editorsPicksCardHeight ?? 0} onChange={(v) => set({ editorsPicksCardHeight: v })} min={0} max={600} />
            </div>
            <p className="text-[11px] text-ink-400">Set 0 for auto sizing</p>
            <div className="grid grid-cols-2 gap-2">
              <NumberField label="Title (px)" value={data.editorsPicksTitleSize ?? 15} onChange={(v) => set({ editorsPicksTitleSize: v })} min={10} max={36} />
              <NumberField label="Category (px)" value={data.editorsPicksCategorySize ?? 11} onChange={(v) => set({ editorsPicksCategorySize: v })} min={9} max={20} />
            </div>
          </>
        )}
      </Accordion>

      <Accordion label="Latest News + Sidebar">
        <ToggleField label="Show Latest News" value={data.latestNewsEnabled !== false} onChange={(v) => set({ latestNewsEnabled: v })} />
        {data.latestNewsEnabled !== false && (
          <>
            <TextField label="Section title" value={data.latestNewsTitle} onChange={(v) => set({ latestNewsTitle: v })} />
            <SelectField label="Number of articles" value={data.latestNewsLimit} onChange={(v) => set({ latestNewsLimit: Number(v) })} options={[4, 6, 8, 10]} />
          </>
        )}
        <p className="text-[11px] text-ink-500 mt-2 mb-1">Sidebar widgets</p>
        <SidebarWidgetListEditor widgets={data.sidebarWidgets} onUpdate={updateWidget} />
      </Accordion>

      <Accordion label="More News (Masonry Grid)">
        <ToggleField label="Show More News" value={data.moreNewsEnabled !== false} onChange={(v) => set({ moreNewsEnabled: v })} />
        {data.moreNewsEnabled !== false && (
          <>
            <TextField label="Section title" value={data.moreNewsTitle} onChange={(v) => set({ moreNewsTitle: v })} />
            <SelectField label="Number of cards" value={data.moreNewsCount} onChange={(v) => set({ moreNewsCount: Number(v) })} options={[4, 6, 8]} />
            <SectionDivider label="Card dimensions" />
            <div className="grid grid-cols-2 gap-2">
              <NumberField label="Card width (px)" value={data.moreNewsCardWidth ?? 0} onChange={(v) => set({ moreNewsCardWidth: v })} min={0} max={800} />
              <NumberField label="Card height (px)" value={data.moreNewsCardHeight ?? 0} onChange={(v) => set({ moreNewsCardHeight: v })} min={0} max={600} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <NumberField label="Title (px)" value={data.moreNewsTitleSize ?? 15} onChange={(v) => set({ moreNewsTitleSize: v })} min={10} max={36} />
              <NumberField label="Category (px)" value={data.moreNewsCategorySize ?? 11} onChange={(v) => set({ moreNewsCategorySize: v })} min={9} max={20} />
            </div>
          </>
        )}
      </Accordion>

      <Accordion label="Category Grid">
        <ToggleField label="Show Category Grid" value={data.categoryGridEnabled !== false} onChange={(v) => set({ categoryGridEnabled: v })} />
        {data.categoryGridEnabled !== false && (
          <>
            <SelectField label="Columns" value={data.categoryGridColumns ?? 4} onChange={(v) => set({ categoryGridColumns: Number(v) })} options={[2, 3, 4]} />
            <SelectField label="Image ratio" value={data.categoryGridImageRatio} onChange={(v) => set({ categoryGridImageRatio: v })} options={["16/9", "4/3", "1/1", "3/2"]} />
            <SectionDivider label="Card dimensions" />
            <div className="grid grid-cols-2 gap-2">
              <NumberField label="Card width (px)" value={data.categoryGridCardWidth ?? 0} onChange={(v) => set({ categoryGridCardWidth: v })} min={0} max={800} />
              <NumberField label="Card height (px)" value={data.categoryGridCardHeight ?? 0} onChange={(v) => set({ categoryGridCardHeight: v })} min={0} max={600} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <NumberField label="Title (px)" value={data.categoryGridTitleSize ?? 14} onChange={(v) => set({ categoryGridTitleSize: v })} min={10} max={30} />
              <NumberField label="Category (px)" value={data.categoryGridCategorySize ?? 11} onChange={(v) => set({ categoryGridCategorySize: v })} min={9} max={20} />
            </div>
            <CategoryGridListEditor items={data.categoryGridCategories} onUpdate={updateCategory} onAdd={addCategory} onRemove={removeCategory} />
          </>
        )}
      </Accordion>

      <Accordion label="Trending Stories">
        <ToggleField label="Show Trending Stories" value={data.trendingEnabled !== false} onChange={(v) => set({ trendingEnabled: v })} />
        {data.trendingEnabled !== false && (
          <>
            <TextField label="Section title" value={data.trendingTitle} onChange={(v) => set({ trendingTitle: v })} />
            <SelectField label="Number of stories" value={data.trendingCount} onChange={(v) => set({ trendingCount: Number(v) })} options={[4, 6, 8]} />
          </>
        )}
      </Accordion>

      <Accordion label="Newsletter">
        <ToggleField label="Show Newsletter" value={data.newsletterEnabled !== false} onChange={(v) => set({ newsletterEnabled: v })} />
        {data.newsletterEnabled !== false && (
          <>
            <TextField label="Title" value={data.newsletterHeading} onChange={(v) => set({ newsletterHeading: v })} />
            <TextField label="Description" value={data.newsletterSubheading} onChange={(v) => set({ newsletterSubheading: v })} />
            <TextField label="Button label" value={data.newsletterCtaLabel} onChange={(v) => set({ newsletterCtaLabel: v })} />
            <ColorField label="Background color" value={data.newsletterBg} onChange={(v) => set({ newsletterBg: v })} />
            <NumberField label="Border radius (px)" value={data.newsletterRadius ?? 12} onChange={(v) => set({ newsletterRadius: v })} min={0} max={40} />
          </>
        )}
      </Accordion>

      <Accordion label="Featured Authors">
        <ToggleField label="Show Featured Authors" value={data.authorsEnabled !== false} onChange={(v) => set({ authorsEnabled: v })} />
        {data.authorsEnabled !== false && (
          <>
            <TextField label="Section title" value={data.authorsTitle} onChange={(v) => set({ authorsTitle: v })} />
            <SelectField label="Number of authors" value={data.authorsCount} onChange={(v) => set({ authorsCount: Number(v) })} options={[4, 6, 8]} />
          </>
        )}
      </Accordion>

      <Accordion label="Advertisement">
        <ToggleField label="Show Advertisement" value={data.adEnabled !== false} onChange={(v) => set({ adEnabled: v })} />
        {data.adEnabled !== false && (
          <>
            <ImageUploadField label="Advertisement image" value={data.adImage} onChange={(v) => set({ adImage: v })} hint="Falls back to a placeholder banner if left empty." />
            <TextField label="Link URL" value={data.adLinkUrl} onChange={(v) => set({ adLinkUrl: v })} placeholder="https://…" />
            <TextField label="Alt text" value={data.adAltText} onChange={(v) => set({ adAltText: v })} />
            <SelectField label="Ad preset size" value={data.adSize} onChange={(v) => set({ adSize: v })} options={["970x250", "728x90"]} />
            <div className="grid grid-cols-2 gap-2">
              <NumberField label="Width (px, 0 = full)" value={data.adWidth ?? 0} onChange={(v) => set({ adWidth: v })} min={0} max={1600} />
              <NumberField label="Height (px, 0 = preset)" value={data.adHeight ?? 0} onChange={(v) => set({ adHeight: v })} min={0} max={600} />
            </div>
          </>
        )}
      </Accordion>

      <Accordion label="Latest Articles Grid">
        <ToggleField label="Show Latest Articles Grid" value={data.latestGridEnabled !== false} onChange={(v) => set({ latestGridEnabled: v })} />
        {data.latestGridEnabled !== false && (
          <>
            <TextField label="Section title" value={data.latestGridTitle} onChange={(v) => set({ latestGridTitle: v })} />
            <SelectField label="Number of articles" value={data.latestGridLimit} onChange={(v) => set({ latestGridLimit: Number(v) })} options={[4, 8, 12, 16]} />
            <SectionDivider label="Card dimensions" />
            <div className="grid grid-cols-2 gap-2">
              <NumberField label="Card width (px)" value={data.latestGridCardWidth ?? 0} onChange={(v) => set({ latestGridCardWidth: v })} min={0} max={800} />
              <NumberField label="Card height (px)" value={data.latestGridCardHeight ?? 0} onChange={(v) => set({ latestGridCardHeight: v })} min={0} max={600} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <NumberField label="Title (px)" value={data.latestGridTitleSize ?? 15} onChange={(v) => set({ latestGridTitleSize: v })} min={10} max={36} />
              <NumberField label="Excerpt (px)" value={data.latestGridExcerptSize ?? 13} onChange={(v) => set({ latestGridExcerptSize: v })} min={10} max={24} />
            </div>
          </>
        )}
      </Accordion>

      <Accordion label="Load More Button">
        <ToggleField label="Show Load More" value={data.loadMoreEnabled !== false} onChange={(v) => set({ loadMoreEnabled: v })} />
        {data.loadMoreEnabled !== false && (
          <>
            <TextField label="Button text" value={data.loadMoreLabel} onChange={(v) => set({ loadMoreLabel: v })} />
            <ColorField label="Button color" value={data.loadMoreColor} onChange={(v) => set({ loadMoreColor: v })} />
            <NumberField label="Border radius (px)" value={data.loadMoreRadius ?? 6} onChange={(v) => set({ loadMoreRadius: v })} min={0} max={30} />
            <SelectField label="Action" value={data.loadMoreAction} onChange={(v) => set({ loadMoreAction: v })} options={["loadMore", "pagination", "customUrl"]} />
            {data.loadMoreAction === "customUrl" && (
              <TextField label="Custom URL" value={data.loadMoreUrl} onChange={(v) => set({ loadMoreUrl: v })} placeholder="/articles" />
            )}
            {data.loadMoreAction === "loadMore" && (
              <NumberField label="Articles to reveal per click" value={data.loadMoreIncrement ?? 3} onChange={(v) => set({ loadMoreIncrement: Math.max(3, v) })} min={3} max={24} />
            )}
          </>
        )}
      </Accordion>

      <Accordion label="Layout">
        <NumberField label="Max width (px)" value={data.maxWidth} onChange={(v) => set({ maxWidth: v })} min={960} max={1920} />
        <NumberField label="Column gap (px)" value={data.columnGap} onChange={(v) => set({ columnGap: v })} min={8} max={48} />
        <NumberField label="Padding (px)" value={data.padding} onChange={(v) => set({ padding: v })} min={0} max={64} />
        <ColorField label="Background color" value={data.bg} onChange={(v) => set({ bg: v })} />
      </Accordion>
    </>
  );
}

function Accordion({ label, children }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button onClick={() => setOpen((v) => !v)} className="w-full flex items-center justify-between px-3 py-2.5 bg-gray-50 hover:bg-gray-100 transition-colors">
        <span className="text-[12.5px] font-semibold text-ink-900">{label}</span>
        {open ? <ChevronDown size={14} className="text-ink-400" /> : <ChevronRight size={14} className="text-ink-400" />}
      </button>
      {open && <div className="p-3 space-y-3">{children}</div>}
    </div>
  );
}