// lib/pageBlockDefinitions.js
//
// Block library for the CMS **Pages** builder (About, Privacy Policy,
// Careers, Contact, etc.) — deliberately separate from
// lib/blockDefinitions.js (the Homepage Builder's news-specific blocks like
// "Hero Story" or "Category Section"). CMS pages need generic content
// building blocks instead: headings, rich text, images, FAQs, and so on.
//
// Every block follows the same { id, type, data } shape used across the
// site's other builders, so the same drag/reorder/settings-panel pattern
// (@dnd-kit + a settings panel keyed by `type`) works unchanged.

import {
  Type, AlignLeft, Image as ImageIcon, Images, MousePointerClick,
  HelpCircle, Quote, Columns2, Minus, Code2, Users, Mail, Video, Map,
  BarChart3, LayoutGrid, ListOrdered, Link2, Contact,
} from "lucide-react";

// Icon choices offered in the settings panel for blocks that show a small
// icon per item (feature grids, values grids, numbered policy sections).
// Stored as a string key on the block's item data; PageBlockRenderer maps
// the key back to the actual lucide-react component at render time.
export const ICON_CHOICES = [
  "shield", "globe", "search", "users", "scale", "message", "book",
  "lock", "eye", "pen", "refresh", "mail", "map-pin", "star", "heart",
  "check-circle", "file-text", "award", "clock", "megaphone",
];

// Common web-safe / Google Fonts font stacks offered in the Design tab and
// per-block typography controls. Value is the actual CSS font-family string.
export const FONT_CHOICES = [
  { value: "", label: "Site default" },
  { value: "'Playfair Display', Georgia, serif", label: "Playfair Display (serif)" },
  { value: "Georgia, 'Times New Roman', serif", label: "Georgia (serif)" },
  { value: "'Merriweather', Georgia, serif", label: "Merriweather (serif)" },
  { value: "'Inter', -apple-system, sans-serif", label: "Inter (sans)" },
  { value: "'Helvetica Neue', Arial, sans-serif", label: "Helvetica (sans)" },
  { value: "'Poppins', sans-serif", label: "Poppins (sans)" },
  { value: "'Courier New', monospace", label: "Courier (monospace)" },
];

export const PAGE_BLOCK_DEFINITIONS = {
  hero: {
    type: "hero",
    label: "Hero / Banner",
    description: "Large title banner with optional background image",
    icon: ImageIcon,
    defaultData: () => ({
      title: "About HighTableNews",
      subtitle: "Clarity, depth, and the courage to ask harder questions.",
      bgImage: "",
      overlayOpacity: 45,
      textColor: "#ffffff",
      alignment: "center",
      height: 320,
      fontFamily: "",
    }),
  },
  heading: {
    type: "heading",
    label: "Heading",
    description: "Section title text",
    icon: Type,
    defaultData: () => ({ text: "Section heading", level: "h2", align: "left", color: "#111111", fontFamily: "", fontSize: null }),
  },
  richText: {
    type: "richText",
    label: "Rich Text",
    description: "Formatted paragraph content",
    icon: AlignLeft,
    defaultData: () => ({
      html: "<p>Write your content here. This block supports basic formatting like <strong>bold</strong>, <em>italics</em>, and links.</p>",
      maxWidth: "prose",
      fontFamily: "",
      fontSize: null,
      color: "",
      align: "left",
    }),
  },
  image: {
    type: "image",
    label: "Image",
    description: "Single image with optional caption",
    icon: ImageIcon,
    defaultData: () => ({ url: "", alt: "", caption: "", rounded: true, maxWidth: "prose" }),
  },
  imageText: {
    type: "imageText",
    label: "Image + Text",
    description: "Two-column image and copy",
    icon: Columns2,
    defaultData: () => ({
      imageUrl: "",
      imageAlt: "",
      heading: "Our mission",
      body: "Tell your story alongside a supporting image.",
      imagePosition: "left",
    }),
  },
  gallery: {
    type: "gallery",
    label: "Image Gallery",
    description: "Grid of multiple images",
    icon: Images,
    defaultData: () => ({ images: [], columns: 3 }),
  },
  cta: {
    type: "cta",
    label: "Call to Action",
    description: "Heading, copy, and a button",
    icon: MousePointerClick,
    defaultData: () => ({
      heading: "Get in touch",
      body: "Have a question or a story tip? We'd love to hear from you.",
      buttonLabel: "Contact us",
      buttonUrl: "/contact",
      bg: "#111111",
      textColor: "#ffffff",
    }),
  },
  faq: {
    type: "faq",
    label: "FAQ Accordion",
    description: "Expandable list of questions & answers",
    icon: HelpCircle,
    defaultData: () => ({
      title: "Frequently asked questions",
      items: [
        { id: "q1", question: "How do I contact the newsroom?", answer: "Email us at editors@hightablenews.com." },
        { id: "q2", question: "Do you accept freelance pitches?", answer: "Yes — see our Contributors page for guidelines." },
      ],
    }),
  },
  quote: {
    type: "quote",
    label: "Pull Quote",
    description: "Large stand-out quotation",
    icon: Quote,
    defaultData: () => ({ text: "Clarity, depth, and the courage to ask harder questions.", attribution: "" }),
  },
  team: {
    type: "team",
    label: "Team Grid",
    description: "Grid of people with photo, name & role",
    icon: Users,
    defaultData: () => ({
      title: "Leadership",
      members: [
        { id: "m1", name: "Jane Doe", role: "Editor-in-Chief", photo: "" },
        { id: "m2", name: "John Smith", role: "Managing Editor", photo: "" },
      ],
    }),
  },
  newsletter: {
    type: "newsletter",
    label: "Newsletter Signup",
    description: "Email capture form (uses the real subscribe backend)",
    icon: Mail,
    defaultData: () => ({
      heading: "Stay in the loop",
      subheading: "Get our best stories delivered to your inbox every morning.",
      bg: "#f5f5f0",
    }),
  },
  video: {
    type: "video",
    label: "Video Embed",
    description: "YouTube / Vimeo embed",
    icon: Video,
    defaultData: () => ({ url: "", caption: "" }),
  },
  map: {
    type: "map",
    label: "Map / Address",
    description: "Office location & embedded map",
    icon: Map,
    defaultData: () => ({ address: "1 Editorial Row, London", mapEmbedUrl: "" }),
  },
  divider: {
    type: "divider",
    label: "Divider",
    description: "Horizontal spacing rule",
    icon: Minus,
    defaultData: () => ({ style: "line", spacing: 32 }),
  },
  embedHtml: {
    type: "embedHtml",
    label: "Custom HTML",
    description: "Raw HTML / embed code for advanced use",
    icon: Code2,
    defaultData: () => ({ html: "<!-- Paste custom HTML or an embed snippet here -->" }),
  },
  statsGrid: {
    type: "statsGrid",
    label: "Stats Row",
    description: "Row of big numbers with labels (e.g. '25+ Years')",
    icon: BarChart3,
    defaultData: () => ({
      bg: "#f5f5f0",
      numberColor: "#8a1c22",
      items: [
        { id: "s1", number: "25+", label: "Years of journalism excellence" },
        { id: "s2", number: "1M+", label: "Monthly readers worldwide" },
        { id: "s3", number: "50+", label: "Expert contributors across the globe" },
        { id: "s4", number: "100%", label: "Commitment to editorial independence" },
      ],
    }),
  },
  featureGrid: {
    type: "featureGrid",
    label: "Icon Feature Grid",
    description: "Grid of icon + title + description cards (values, principles, features)",
    icon: LayoutGrid,
    defaultData: () => ({
      title: "",
      columns: 2,
      iconColor: "#8a1c22",
      items: [
        { id: "f1", icon: "shield", title: "Independent", body: "We are editorially independent and free from corporate or political influence." },
        { id: "f2", icon: "globe", title: "Global Perspective", body: "News and analysis from major markets and emerging centers of influence." },
        { id: "f3", icon: "search", title: "Rigorous Reporting", body: "Fact-checking, source verification, and editorial standards at the core of everything we publish." },
        { id: "f4", icon: "users", title: "Accountable", body: "We are transparent about our process, corrections, and editorial decisions." },
      ],
    }),
  },
  numberedList: {
    type: "numberedList",
    label: "Numbered Policy Sections",
    description: "Numbered sections with icon, heading & body — for legal/policy pages",
    icon: ListOrdered,
    defaultData: () => ({
      iconColor: "#8a1c22",
      items: [
        { id: "n1", icon: "file-text", number: "1", title: "Section title", body: "Describe this section's policy or clause here." },
      ],
    }),
  },
  editorNote: {
    type: "editorNote",
    label: "Editor's Note",
    description: "Highlighted quote/note block with a small image, for closing statements",
    icon: Quote,
    defaultData: () => ({
      eyebrow: "A NOTE FROM OUR EDITOR",
      heading: "We Believe in Responsible Journalism",
      body: "In a world of noise, our commitment is to clarity. In a world of speed, our commitment is to accuracy.",
      signature: "— The Editorial Team",
      image: "",
      bg: "#f2ede6",
    }),
  },
};

export const PAGE_BLOCK_LIBRARY_ORDER = [
  "hero", "heading", "richText", "image", "imageText", "gallery",
  "statsGrid", "featureGrid", "numberedList", "quote", "editorNote",
  "cta", "faq", "team", "newsletter", "video", "map",
  "divider", "embedHtml",
];

export function createPageBlock(type) {
  const def = PAGE_BLOCK_DEFINITIONS[type] || SIDEBAR_ONLY_DEFINITIONS[type];
  if (!def) throw new Error(`Unknown page block type: ${type}`);
  return {
    id: `${type}_${Date.now().toString(36)}_${Math.floor(Math.random() * 1000)}`,
    type,
    data: def.defaultData(),
  };
}

// Sidebar-only widgets, mirroring the "About High TableNews" / "Related
// Pages" / "Stay Informed" boxes seen on the Privacy/Terms/Editorial policy
// designs.
export const SIDEBAR_ONLY_DEFINITIONS = {
  aboutBox: {
    type: "aboutBox",
    label: "About / Image Box",
    description: "Small heading + image + description card",
    icon: Contact,
    defaultData: () => ({
      title: "About HighTableNews",
      image: "",
      body: "HighTableNews is an independent, global news publication covering power, business, technology, and the forces shaping our world.",
      linkLabel: "Learn more about us →",
      linkUrl: "/page/about",
    }),
  },
  relatedLinks: {
    type: "relatedLinks",
    label: "Related Pages",
    description: "List of links to other pages",
    icon: Link2,
    defaultData: () => ({
      title: "Related Pages",
      links: [
        { id: "l1", label: "Privacy Policy", url: "/page/privacy-policy" },
        { id: "l2", label: "Cookie Policy", url: "/page/cookie-policy" },
        { id: "l3", label: "Editorial Policy", url: "/page/editorial-policy" },
        { id: "l4", label: "Corrections Policy", url: "/page/corrections-policy" },
      ],
    }),
  },
  contactInfo: {
    type: "contactInfo",
    label: "Contact Info",
    description: "Simple contact details box",
    icon: Contact,
    defaultData: () => ({ title: "Contact", email: "editorial@hightablenews.com", address: "123 Newsroom Way, New York, NY 10001, USA" }),
  },
};

export const PAGE_LAYOUTS = [
  { id: "full-width", label: "Full Width", description: "Blocks span the entire page width" },
  { id: "boxed", label: "Boxed", description: "Content constrained to a centered, readable column" },
  { id: "sidebar-left", label: "Sidebar Left", description: "Narrow sidebar on the left, content on the right" },
  { id: "sidebar-right", label: "Sidebar Right", description: "Content on the left, narrow sidebar on the right" },
];

// Sidebar widgets available when a layout includes a sidebar. Reuses a
// small subset of the same block shape so the same settings-panel pattern
// applies.
export const SIDEBAR_WIDGET_DEFINITIONS = {
  aboutBox: SIDEBAR_ONLY_DEFINITIONS.aboutBox,
  relatedLinks: SIDEBAR_ONLY_DEFINITIONS.relatedLinks,
  contactInfo: SIDEBAR_ONLY_DEFINITIONS.contactInfo,
  newsletter: PAGE_BLOCK_DEFINITIONS.newsletter,
  richText: PAGE_BLOCK_DEFINITIONS.richText,
  team: PAGE_BLOCK_DEFINITIONS.team,
  map: PAGE_BLOCK_DEFINITIONS.map,
  embedHtml: PAGE_BLOCK_DEFINITIONS.embedHtml,
};

export const SIDEBAR_WIDGET_LIBRARY_ORDER = [
  "aboutBox", "relatedLinks", "contactInfo", "newsletter", "richText", "team", "map", "embedHtml",
];
