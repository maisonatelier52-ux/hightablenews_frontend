// // lib/blockDefinitions.js
// import {
//   Zap, Star, LayoutGrid, FolderKanban, MessageSquareQuote, Users,
//   Megaphone, PlaySquare, Image as ImageIcon, Rows3, Mail, Code2, Columns3,
//   Newspaper, StickyNote, Moon, LayoutPanelTop,
// } from "lucide-react";

// export const CATEGORY_OPTIONS = ["Power", "Wealth", "Real Estate", "Technology", "Markets", "Opinion", "Politics", "Business", "World", "Health", "Justice", "Free Speech"];

// export const BLOCK_DEFINITIONS = {
//   breakingNews: {
//     type: "breakingNews",
//     label: "Breaking News Ticker",
//     description: "Auto feed of the latest articles",
//     icon: Zap,
//     defaultData: () => ({
//       limit: 5,
//       bg: "#111111",
//       labelBg: "#cc0000",
//       textColor: "#ffffff",
//       labelText: "BREAKING",
//       speed: 80,
//       enabled: true,
//       labelStyle: "badge",
//     }),
//   },
//   heroStory: {
//     type: "heroStory",
//     label: "Hero Story",
//     description: "Large featured-article display",
//     icon: Star,
//     defaultData: () => ({
//       articleId: "",
//       title: "Global Markets Rally As Inflation Fears Ease",
//       subheadline: "Central banks signal coordinated pause on rate hikes",
//       category: "BUSINESS",
//       ctaLabel: "Read More",
//       ctaUrl: "#",
//       bgImage: "",
//       overlayOpacity: 50,
//       fontFamily: "sans",
//       titleSize: 28,
//       titleWeight: "bold",
//       titleColor: "#ffffff",
//       alignment: "left",
//       paddingTop: 48,
//       paddingBottom: 48,
//       showCategory: true,
//       showCta: true,
//     }),
//   },
//   topStoriesGrid: {
//     type: "topStoriesGrid",
//     label: "Top Stories Grid",
//     description: "Grid of recent top stories",
//     icon: LayoutGrid,
//     defaultData: () => ({ limit: 4, columns: 4, showImage: true, showCategory: true }),
//   },
//   categorySection: {
//     type: "categorySection",
//     label: "Category Section",
//     description: "Articles from a chosen category",
//     icon: FolderKanban,
//     defaultData: () => ({
//       category: "Power",
//       layout: "grid",
//       limit: 6,
//       title: "",
//       bg: "#ffffff",
//       textColor: "#111111",
//       showImages: true,
//     }),
//   },
//   featuredStoriesRow: {
//     type: "featuredStoriesRow",
//     label: "Featured Stories Row",
//     description: "Horizontal strip of featured stories",
//     icon: Rows3,
//     defaultData: () => ({
//       limit: 4,
//       title: "Featured Stories",
//       showImage: true,
//       imageHeight: 120,
//     }),
//   },
//   opinion: {
//     type: "opinion",
//     label: "Opinion Block",
//     description: "Featured editorial / opinion content",
//     icon: MessageSquareQuote,
//     defaultData: () => ({
//       articleId: "",
//       title: "The case for deliberate slowness in an age of algorithmic haste",
//       author: "Sarah Mills",
//       bg: "#f8f8f6",
//     }),
//   },
//   authorSpotlight: {
//     type: "authorSpotlight",
//     label: "Author Spotlight",
//     description: "Show top authors",
//     icon: Users,
//     defaultData: () => ({ limit: 3, title: "Our Writers" }),
//   },
//   video: {
//     type: "video",
//     label: "Video Block",
//     description: "Featured videos",
//     icon: PlaySquare,
//     defaultData: () => ({ videoUrl: "", title: "Featured video", caption: "", thumbUrl: "" }),
//   },
//   fullWidthBanner: {
//     type: "fullWidthBanner",
//     label: "Full-Width Banner",
//     description: "Edge-to-edge image with heading & CTA",
//     icon: ImageIcon,
//     defaultData: () => ({
//       imageUrl: "",
//       heading: "Exploring The World's Most Incredible Places",
//       subheading: "",
//       ctaLabel: "Read Story",
//       ctaUrl: "",
//       overlayColor: "rgba(0,0,0,0.45)",
//       height: 320,
//       linkUrl: "",
//     }),
//   },
//   newsletter: {
//     type: "newsletter",
//     label: "Newsletter Signup",
//     description: "Email capture block",
//     icon: Mail,
//     defaultData: () => ({
//       heading: "Stay ahead of the story",
//       subheading: "Get the headlines that matter, every morning.",
//       placeholder: "Enter your email",
//       ctaLabel: "Subscribe",
//       ctaBg: "#cc0000",
//       ctaTextColor: "#ffffff",
//       bg: "#f5f5f0",
//       textColor: "#111111",
//       enabled: true,
//     }),
//   },
//   advertisement: {
//     type: "advertisement",
//     label: "Advertisement",
//     description: "Ad banner / placeholder",
//     icon: Megaphone,
//     defaultData: () => ({
//       size: "leaderboard",
//       imageUrl: "",
//       linkUrl: "",
//       overlayColor: "",
//       width: 0,
//       height: 90,
//       altText: "Advertisement",
//     }),
//   },
//   customHtml: {
//     type: "customHtml",
//     label: "Custom HTML",
//     description: "Add custom content",
//     icon: Code2,
//     defaultData: () => ({ html: "<!-- Add custom markup -->", enabled: true }),
//   },
//   threeColumnLayout: {
//     type: "threeColumnLayout",
//     label: "3-Column Layout",
//     description: "Left sticky + center feed + right sidebar",
//     icon: Columns3,
//     defaultData: () => ({
//       leftTitle: "Most Read",
//       leftItems: [
//         { id: "l1", label: "Global Markets Rally As Inflation Fears Ease" },
//         { id: "l2", label: "Power Brokers of the Year: The 50 Who Shape Our World" },
//         { id: "l3", label: "Real Estate Outlook 2026: Buy, Sell, or Wait?" },
//         { id: "l4", label: "Tech Giants Face New Antitrust Pressure in Brussels" },
//         { id: "l5", label: "Opinion: Why Central Banks Are Losing the Plot" },
//       ],
//       leftShowNumbers: true,
//       centerTitle: "Latest News",
//       centerCategory: "All",
//       centerLimit: 5,
//       centerLayout: "list",
//       rightTitle: "In Brief",
//       rightShowAd: true,
//       rightAdSize: "sidebar",
//       rightAdImage: "",
//       rightAdLinkUrl: "",
//       rightAdAltText: "Advertisement",
//       rightAdWidth: 0,
//       rightAdHeight: 0,
//       rightShowNewsletter: true,
//       rightNewsletterHeading: "Stay ahead of the story",
//       bg: "#ffffff",
//       border: "#e5e7eb",
//       padding: 24,
//       borderRadius: 12,
//       widthMode: "equal",
//     }),
//   },
//   newsFeed: {
//     type: "newsFeed",
//     label: "News Feed",
//     description: "Vertical list of articles with images",
//     icon: Newspaper,
//     defaultData: () => ({
//       title: "",
//       category: "All",
//       limit: 8,
//       layout: "list",
//       showImages: true,
//       showCategory: true,
//       showDate: true,
//       showExcerpt: true,
//       imageSize: "medium",
//     }),
//   },
//   stickyNotice: {
//     type: "stickyNotice",
//     label: "Sticky Notice",
//     description: "Announcements / site-wide notices",
//     icon: StickyNote,
//     defaultData: () => ({
//       text: "Subscribe for full access to all stories.",
//       ctaLabel: "Subscribe Now",
//       ctaUrl: "#",
//       bg: "#1a1a1a",
//       textColor: "#ffffff",
//       ctaBg: "#cc0000",
//       dismissible: true,
//       enabled: true,
//     }),
//   },
//   newspaperEditorial: {
//     type: "newspaperEditorial",
//     label: "Newspaper Editorial Layout",
//     description: "3-column newspaper layout: sticky left sidebar + center editorial + right sidebar",
//     icon: Columns3,
//     defaultData: () => ({
//       // Top Stories Grid (4 cards)
//       showTopStories: true,
//       topStoriesTitle: "FEATURED STORIES",
//       topStoriesCount: 4,
//       topStoriesImageRatio: "4/3",
//       topStoriesSpacing: 16,
//       topStoriesCategoryColor: "#cc0000",

//       // Left Sidebar blocks
//       leftBlocks: [
//         { id: "lb1", type: "featuredArticle", label: "Featured Article", visible: true, category: "WHITE HOUSE • LIVE", categoryColor: "#dc2626", headline: "Live updates from The White House: diplomatic tensions mount", description: "Senior officials confirm back-channel talks with three European counterparts are ongoing, amid growing calls for a formal summit before the autumn recess.", author: "James Whitmore", date: "Jan 8, 2026", showImage: true, showDesc: true, showAuthor: true, showDate: true },
//         { id: "lb2", type: "smallStoryCard", label: "Economy Card", visible: true, category: "ECONOMY", categoryColor: "#d97706", headline: "It's Never Been More Expensive to Visit New York City", author: "Anna Cole", date: "Jan 8", showImage: true, showDesc: false, showAuthor: true, showDate: true },
//         { id: "lb3", type: "smallStoryCard", label: "Health Card", visible: true, category: "HEALTH", categoryColor: "#059669", headline: "How Sarah Coped With Her Chronic Disease — and Found Clarity", author: "Mark Wells", date: "Jan 8", showImage: true, showDesc: false, showAuthor: true, showDate: true },
//         { id: "lb4", type: "opinionCard", label: "Opinion Card", visible: true, category: "OPINION", categoryColor: "#6b7280", label2: "EDITOR'S PICK", headline: "The case for deliberate slowness in an age of algorithmic haste", author: "Eleanor Marsh, Senior Columnist", date: "Jan 8", showImage: false, showDesc: false, showAuthor: true, showDate: false },
//         { id: "lb5", type: "smallStoryCard", label: "Economy Card 2", visible: true, category: "ECONOMY", categoryColor: "#d97706", headline: "It's Never Been More Expensive to Visit New York City", author: "Maya Chen", date: "Jan 8", showImage: false, showDesc: false, showAuthor: true, showDate: true },
//         { id: "lb6", type: "smallStoryCard", label: "Justice Card", visible: true, category: "JUSTICE", categoryColor: "#7c3aed", headline: "The slow reckoning: how courts are reshaping AI liability law", author: "Marcus Reid", date: "Jan 8", showImage: false, showDesc: true, showAuthor: true, showDate: true },
//         { id: "lb7", type: "smallStoryCard", label: "Finance Card", visible: true, category: "FINANCE", categoryColor: "#2563eb", headline: "Extra £2.50 for half a prawn? The surcharge economy arrives", author: "Marcus Reid", date: "Jan 8", showImage: false, showDesc: false, showAuthor: true, showDate: true },
//       ],

//       // Center Column
//       heroHeadline: "Live updates from The White House: A new chapter in transatlantic diplomacy",
//       heroCategory: "WORLD • POLITICS",
//       heroDate: "JANUARY 8, 2026",
//       heroSummary: "Senior diplomats from twelve nations convened in an extraordinary session yesterday as mounting trade tensions threatened to derail the framework agreements painstakingly built over the past eighteen months.",
//       heroAuthor: "James Whitmore",
//       heroAuthorRole: "White House Correspondent",

//       // Category sections in center
//       // Placeholder labels used only until the admin actually applies this
//       // template (HomepageBuilder.applyTemplate swaps these for the site's
//       // real categories automatically) or opens Category Sections in the
//       // settings panel, which lists every real category with a visible/
//       // disable toggle. categoryId is left blank here — resolveArticlesBy
//       // CategoryName() then falls back to loose name matching.
//       centerSections: [
//         { id: "cs1", categoryId: "", category: "ECONOMY", color: "#d97706", stories: 2, imagePosition: "left", showDesc: true, showDate: true, showAuthor: true },
//         { id: "cs2", categoryId: "", category: "CULTURE", color: "#7c3aed", stories: 3, imagePosition: "top", showDesc: false, showDate: true, showAuthor: true },
//         { id: "cs3", categoryId: "", category: "BUSINESS", color: "#2563eb", stories: 4, imagePosition: "top", showDesc: false, showDate: true, showAuthor: false },
//       ],

//       // Right Sidebar
//       rightBlocks: [
//         { id: "rb1", type: "futureStory", label: "Future Story", visible: true, title: "Future of Contemporary Art", enabled: true, showImage: true, showDate: true, showExcerpt: true },
//         { id: "rb2", type: "topOfMonth", label: "Top of Month", visible: true, title: "Top of Month", enabled: true, showImages: true, showDates: true, itemCount: 3 },
//         { id: "rb3", type: "mostCommented", label: "Trending Now", visible: true, title: "Trending Now", enabled: true, itemCount: 5, showDates: true },
//         { id: "rb4", type: "topAuthors", label: "Top Authors", visible: true, title: "Top Authors", enabled: true, showImages: true, itemCount: 4 },
//         { id: "rb5", type: "advertisement", label: "Advertisement", visible: true, enabled: true, title: "Advertisement", imageUrl: "", linkUrl: "", altText: "Advertisement", width: 0, height: 250 },
//         { id: "rb6", type: "newsletter", label: "Newsletter", visible: false, enabled: false, title: "Newsletter" },
//       ],

//       // Layout
//       maxWidth: 1600,
//       columnGap: 24,
//       bg: "#ffffff",
//     }),
//   },
//   // ─── Template 2: Modern Magazine ───────────────────────────────────────────
//   modernMagazineLayout: {
//     type: "modernMagazineLayout",
//     label: "Modern Magazine Layout",
//     description: "Full Template 2 homepage: 75/25 layout, hero, top stories, sidebar, latest news, editor's picks, category grid & more",
//     icon: LayoutPanelTop,
//     defaultData: () => ({
//       // Layout
//       maxWidth: 1600,
//       columnGap: 24,
//       bg: "#ffffff",

//       // Section 1: Hero
//       heroEnabled: true,
//       heroImage: "",
//       heroOverlayOpacity: 55,
//       heroCategory: "BUSINESS",
//       heroHeadline: "Global Markets Rally As Inflation Fears Ease",
//       heroDescription: "Central banks signal coordinated pause on rate hikes as economic outlook improves across major economies.",
//       heroCtaLabel: "Read More",
//       heroCtaUrl: "#",
//       heroHeight: 420,
//       heroTitleSize: 32,
//       heroBg: "#1a1a2e",

//       // Section 2: Top Stories
//       topStoriesEnabled: true,
//       topStoriesTitle: "Top Stories",
//       topStoriesCount: 4,

//       // Right Sidebar widgets
//       sidebarWidgets: [
//         { id: "sw1", type: "trending", label: "Trending Stories", enabled: true, title: "Trending Now", itemCount: 5, showImages: true, showTime: true },
//         { id: "sw2", type: "popular", label: "Popular Articles", enabled: true, title: "Popular Articles", itemCount: 5, showNumbers: true },
//         { id: "sw3", type: "newsletter", label: "Newsletter", enabled: true, title: "Stay updated", description: "Get the latest news and insights." },
//         { id: "sw4", type: "advertisement", label: "Advertisement", enabled: true, size: "sidebar", imageUrl: "", linkUrl: "", altText: "Advertisement", width: 0, height: 0 },
//       ],

//       // Section 3: Latest News
//       latestNewsEnabled: true,
//       latestNewsTitle: "Latest News",
//       latestNewsLimit: 8,

//       // Section 4: Editor's Picks
//       editorsPicksEnabled: true,
//       editorsPicksTitle: "Editor's Picks",

//       // Section 5: Category Grid
//       categoryGridEnabled: true,
//       categoryGridCategories: [
//         { id: "cg1", categoryId: "", name: "Business", articleCount: 4 },
//         { id: "cg2", categoryId: "", name: "Technology", articleCount: 4 },
//         { id: "cg3", categoryId: "", name: "Politics", articleCount: 4 },
//         { id: "cg4", categoryId: "", name: "Lifestyle", articleCount: 4 },
//       ],

//       // Section 6: Advertisement Banner
//       adEnabled: true,
//       adSize: "970x90",
//       adImage: "",
//       adLinkUrl: "",
//       adAltText: "Advertisement",
//       adWidth: 0,
//       adHeight: 0,

//       // Section 7: Latest Articles Grid
//       latestGridEnabled: true,
//       latestGridTitle: "Latest Articles",
//       latestGridColumns: 3,
//       latestGridLimit: 9,

//       // Section 8: Newsletter
//       newsletterEnabled: true,
//       newsletterHeading: "Stay ahead of the story",
//       newsletterSubheading: "Get the headlines that matter, every morning.",
//       newsletterCtaLabel: "Subscribe",
//       newsletterBg: "#f5f5f0",

//       // Section 9: Load More
//       loadMoreEnabled: true,
//       loadMoreLabel: "Load More Articles",
//       loadMoreColor: "#cc0000",
//       loadMoreRadius: 6,
//       loadMoreAction: "loadMore",
//       loadMoreUrl: "",
//       loadMoreIncrement: 3,
//     }),
//   },

//   // ─── Template 3: Dark News ──────────────────────────────────────────────────
//   darkNewsLayout: {
//     type: "darkNewsLayout",
//     label: "Dark News Layout",
//     description: "Full Template 3 homepage: premium dark theme, 75/25 layout, hero, featured stories, most read, editor's choice & more",
//     icon: Moon,
//     defaultData: () => ({
//       // Theme / Layout
//       maxWidth: 1600,
//       columnGap: 24,
//       bg: "#111111",
//       cardBg: "#1a1a1a",
//       accentColor: "#cc0000",
//       textColor: "#ffffff",

//       // Section 1: Hero
//       heroEnabled: true,
//       heroImage: "",
//       heroOverlayOpacity: 65,
//       heroCategory: "TECHNOLOGY",
//       heroHeadline: "The Future of AI: How Technology is Shaping Our World",
//       heroDescription: "Artificial intelligence is transforming industries and redefining the future of humanity.",
//       heroCtaLabel: "Read More",
//       heroCtaUrl: "#",
//       heroHeight: 460,
//       heroTitleSize: 34,

//       // Right Sidebar (after hero)
//       sidebarWidgets: [
//         { id: "dw1", type: "trending", label: "Trending Stories", enabled: true, title: "Trending Now", itemCount: 5, showImages: true, showTime: true },
//         { id: "dw2", type: "newsletter", label: "Newsletter", enabled: true, title: "Stay informed", description: "Stay updated with the latest breaking news." },
//         { id: "dw3", type: "advertisement", label: "Advertisement", enabled: true, size: "sidebar", imageUrl: "", linkUrl: "", altText: "Advertisement", width: 0, height: 0 },
//       ],

//       // Section 2: Featured Stories
//       featuredStoriesEnabled: true,
//       featuredStoriesTitle: "Featured Stories",
//       featuredStoriesCount: 4,

//       // Section 3: Latest News
//       latestNewsEnabled: true,
//       latestNewsTitle: "Latest News",
//       latestNewsLimit: 6,

//       // Section 4: Most Read
//       mostReadEnabled: true,
//       mostReadTitle: "Most Read",
//       mostReadCount: 5,

//       // Section 5: Editor's Choice
//       editorsChoiceEnabled: true,
//       editorsChoiceTitle: "Editor's Choice",
//       editorsChoiceCount: 4,

//       // Section 6: Category Blocks
//       categoryBlocksEnabled: true,
//       categoryBlocks: [
//         { id: "db1", categoryId: "", name: "World", articleCount: 2 },
//         { id: "db2", categoryId: "", name: "Business", articleCount: 2 },
//         { id: "db3", categoryId: "", name: "Technology", articleCount: 2 },
//       ],

//       // Lower right sidebar (used in category blocks row)
//       lowerSidebarWidgets: [
//         { id: "lw1", type: "newsletter", label: "Newsletter", enabled: true, title: "Newsletter", description: "Stay updated with the latest breaking news." },
//         { id: "lw2", type: "advertisement", label: "Advertisement", enabled: true, size: "sidebar", imageUrl: "", linkUrl: "", altText: "Advertisement", width: 0, height: 0 },
//       ],

//       // Section 7: Advertisement
//       adEnabled: true,
//       adSize: "728x90",
//       adImage: "",
//       adLinkUrl: "",
//       adAltText: "Advertisement",
//       adWidth: 0,
//       adHeight: 0,

//       // Section 8: Latest Articles
//       latestGridEnabled: true,
//       latestGridTitle: "Latest Articles",
//       latestGridColumns: 3,
//       latestGridLimit: 6,

//       // Section 9: Newsletter
//       newsletterEnabled: true,
//       newsletterHeading: "Stay ahead of the story",
//       newsletterSubheading: "Subscribe for the headlines that matter.",
//       newsletterCtaLabel: "Subscribe",

//       // Section 10: Load More
//       loadMoreEnabled: true,
//       loadMoreLabel: "Load More Articles",
//       loadMoreColor: "#cc0000",
//       loadMoreRadius: 6,
//       loadMoreAction: "loadMore",
//       loadMoreUrl: "",
//       loadMoreIncrement: 3,
//     }),
//   },

//   // ─── Template 7: Masonry Editorial Layout ──────────────────────────────────
//   masonryEditorialLayout: {
//     type: "masonryEditorialLayout",
//     label: "Masonry Editorial Layout",
//     description: "Full Template 7 homepage: hero masonry, editor's picks, latest+sidebar, category grid, trending, authors & more",
//     icon: LayoutGrid,
//     defaultData: () => ({
//       // Layout
//       maxWidth: 1600,
//       columnGap: 24,
//       padding: 24,
//       bg: "#ffffff",

//       // Section 1: Hero Masonry
//       heroSource: "manual",
//       heroCategory: "WORLD",
//       heroHeadline: "Global economy outlook for the rest of 2026",
//       heroDescription: "Experts predict steady growth despite inflation and geopolitical risks.",
//       heroAuthor: "Anna Cole",
//       heroDate: "2h ago",
//       heroImage: "",
//       heroImageHeight: 420,
//       heroOverlayOpacity: 45,
//       heroCtaLabel: "Read More",
//       heroCtaUrl: "#",
//       heroSmallStories: 2,

//       // Section 2: Editor's Picks
//       editorsPicksEnabled: true,
//       editorsPicksTitle: "Editor's Picks",
//       editorsPicksCount: 4,

//       // Section 3: Latest News + Sidebar
//       latestNewsEnabled: true,
//       latestNewsTitle: "Latest News",
//       latestNewsLimit: 6,
//       sidebarWidgets: [
//         { id: "mw1", type: "popular", label: "Popular Articles", enabled: true, title: "Popular Articles", itemCount: 5, showNumbers: false },
//         { id: "mw2", type: "newsletter", label: "Newsletter", enabled: true, title: "Newsletter", description: "Stay updated with the latest news and insights." },
//         { id: "mw4", type: "advertisement", label: "Advertisement", enabled: true, size: "sidebar", imageUrl: "", linkUrl: "", altText: "Advertisement", width: 0, height: 0 },
//       ],

//       // Section 4: More News Masonry Grid
//       moreNewsEnabled: true,
//       moreNewsTitle: "More News",
//       moreNewsCount: 6,

//       // Section 5: Category Grid
//       categoryGridEnabled: true,
//       categoryGridColumns: 4,
//       categoryGridImageRatio: "4/3",
//       categoryGridArticleCount: 4,
//       categoryGridCategories: [
//         { id: "mc1", categoryId: "", name: "Business", articleCount: 4 },
//         { id: "mc2", categoryId: "", name: "Technology", articleCount: 4 },
//         { id: "mc3", categoryId: "", name: "Politics", articleCount: 4 },
//         { id: "mc4", categoryId: "", name: "World", articleCount: 4 },
//         { id: "mc5", categoryId: "", name: "Sports", articleCount: 4 },
//         { id: "mc6", categoryId: "", name: "Lifestyle", articleCount: 4 },
//       ],

//       // Section 6: Trending Stories
//       trendingEnabled: true,
//       trendingTitle: "Trending Stories",
//       trendingCount: 6,

//       // Section 7: Newsletter
//       newsletterEnabled: true,
//       newsletterHeading: "Stay updated with the latest news and insights.",
//       newsletterSubheading: "We respect your privacy.",
//       newsletterCtaLabel: "Subscribe",
//       newsletterBg: "#f5f5f0",
//       newsletterRadius: 12,

//       // Section 8: Featured Authors
//       authorsEnabled: true,
//       authorsTitle: "Featured Authors",
//       authorsCount: 4,

//       // Section 9: Advertisement
//       adEnabled: true,
//       adSize: "970x250",
//       adImage: "",
//       adLinkUrl: "",
//       adAltText: "Advertisement",
//       adWidth: 0,
//       adHeight: 0,

//       // Section 10: Latest Articles Grid
//       latestGridEnabled: true,
//       latestGridTitle: "Latest Articles",
//       latestGridLimit: 8,

//       // Load More
//       loadMoreEnabled: true,
//       loadMoreLabel: "Load More Articles",
//       loadMoreColor: "#cc0000",
//       loadMoreRadius: 6,
//       loadMoreAction: "loadMore",
//       loadMoreUrl: "",
//       loadMoreIncrement: 3,
//     }),
//   },
// };

// export const BLOCK_LIBRARY_ORDER = [
//   "breakingNews",
//   "heroStory",
//   "threeColumnLayout",
//   "newsFeed",
//   "topStoriesGrid",
//   "categorySection",
//   "featuredStoriesRow",
//   "opinion",
//   "authorSpotlight",
//   "video",
//   "fullWidthBanner",
//   "newsletter",
//   "advertisement",
//   "stickyNotice",
//   "customHtml",
//   "newspaperEditorial",
//   "modernMagazineLayout",
//   "darkNewsLayout",
//   "masonryEditorialLayout",
// ];

// // Palette cycled through when auto-generating a center-column category
// // section for a real category (template apply, or the admin toggling a new
// // category on in the settings panel) — matches the manual CATEGORY_COLORS
// // list in BlockSettingsPanel so auto-added and manually-added sections look
// // consistent.
// export const CENTER_SECTION_COLOR_PALETTE = ["#dc2626", "#2563eb", "#059669", "#d97706", "#7c3aed", "#0891b2", "#db2777", "#65a30d"];

// /** Builds a Newspaper Editorial "center section" object for one real
//  *  category (from lib/categoriesArticlesApi's getCategories()). Used both
//  *  when the template is first applied and when an admin toggles a category
//  *  on in the Category Sections settings, so the two code paths always
//  *  produce the same shape. */
// export function makeCenterSectionForCategory(category, colorIndex = 0) {
//   return {
//     id: `cs_${category._id || category.slug || colorIndex}`,
//     categoryId: category._id || "",
//     category: String(category.name || category.title || "").toUpperCase(),
//     color: CENTER_SECTION_COLOR_PALETTE[colorIndex % CENTER_SECTION_COLOR_PALETTE.length],
//     stories: 3,
//     imagePosition: colorIndex % 2 === 0 ? "top" : "left",
//     showDesc: true,
//     showDate: true,
//     showAuthor: true,
//   };
// }

// export function createBlock(type) {
//   const def = BLOCK_DEFINITIONS[type];
//   if (!def) throw new Error(`Unknown block type: ${type}`);
//   return {
//     id: `${type}_${Date.now().toString(36)}_${Math.floor(Math.random() * 1000)}`,
//     type,
//     data: def.defaultData(),
//   };
// }

// // ─── Template 5: Newspaper Editorial block types ─────────────────────────────

// // =============================================================================
// // CATEGORY PAGE BUILDER — 4 standalone category-page templates
// // =============================================================================
// // These are intentionally separate from BLOCK_DEFINITIONS/createBlock above
// // (which power the Homepage Builder's block library). A category page is
// // always exactly ONE of these 4 full-page templates — never a mix of
// // composable blocks — selected once and shared across every category on the
// // site. No header/footer markup lives in these configs; only the dark
// // category banner + content sections, per the category-builder spec.

// export const CATEGORY_TEMPLATES = [
//   {
//     id: "sticky-editorial",
//     name: "Sticky Sidebar Editorial",
//     description: "Lead story + top stories grid + opinion strip + article list, with a sticky right sidebar (Most Read, Latest, Newsletter, Topics, Authors).",
//     badge: "Template 1",
//     color: "amber",
//   },
//   {
//     id: "grid-2col",
//     name: "Two-Column Grid",
//     description: "Clean, uniform two-column article grid with Load More — no sidebar.",
//     badge: "Template 2",
//     color: "blue",
//   },
//   {
//     id: "grid-3col",
//     name: "Three-Column Grid",
//     description: "Symmetric three-column article grid with Load More — no sidebar.",
//     badge: "Template 3",
//     color: "slate",
//   },
//   {
//     id: "carousel-magazine",
//     name: "Carousel Magazine",
//     description: "Hero carousel + Top Stories carousel + Latest Updates grid + More From Category.",
//     badge: "Template 4",
//     color: "rose",
//   },
// ];

// function defaultCategoryBanner() {
//   return {
//     title: "Business",
//     description: "Insights, analysis and key developments shaping the global business landscape.",
//     bgImage: "",
//     overlayOpacity: 70,
//     showGlobeGraphic: true,
//   };
// }

// export const CATEGORY_TEMPLATE_DEFAULTS = {
//   "sticky-editorial": () => ({
//     banner: defaultCategoryBanner(),
//     // Hero / lead story — always resolved with client-news priority at
//     // render time (see lib/articlesSource.js: resolveCategoryHero).
//     hero: { showLiveBadge: true, showAuthor: true, showDate: true, showReadTime: true, showDescription: true },
//     topStories: { title: "Top Stories", count: 3, showImage: true, showDescription: true, showAuthor: true, showDate: true, imageRatio: "16/9" },
//     opinion: { enabled: true, title: "Opinion", count: 2 },
//     articleList: { title: "More From Category", count: 12, showImage: true, showDescription: true, showAuthor: true, showDate: true, showReadTime: true },
//     sidebar: {
//       mostRead: { enabled: true, title: "Most Read", count: 3, showNumbers: true },
//       latest: { enabled: true, title: "Latest Updates", count: 4 },
//       newsletter: { enabled: true, heading: "World Briefing", subheading: "Our correspondents' dispatch, every morning at 7am.", ctaLabel: "Subscribe Free" },
//       topics: { enabled: true, title: "Browse by Topic", tags: ["All", "Markets", "Economy", "Finance", "Technology", "Energy", "Crypto"] },
//       authors: { enabled: true, title: "Correspondents", count: 4 },
//     },
//     card: { imageRatio: "16/9", borderEnabled: true, padding: 16 },
//   }),
//   "grid-2col": () => ({
//     banner: defaultCategoryBanner(),
//     hero: { showLiveBadge: true, showAuthor: true, showDate: true, showReadTime: true, showDescription: false },
//     grid: { columns: 2, count: 12, showImage: true, showDescription: true, showAuthor: true, showDate: true, showReadTime: true, imageRatio: "16/9" },
//     loadMore: { enabled: true, label: "Load More Articles", batchSize: 6 },
//     card: { imageRatio: "16/9", borderEnabled: false, padding: 0 },
//   }),
//   "grid-3col": () => ({
//     banner: defaultCategoryBanner(),
//     hero: { showLiveBadge: true, showAuthor: true, showDate: true, showReadTime: true, showDescription: false },
//     grid: { columns: 3, count: 9, showImage: true, showDescription: false, showAuthor: true, showDate: true, showReadTime: true, imageRatio: "16/9" },
//     loadMore: { enabled: true, label: "Load More Articles", batchSize: 6 },
//     card: { imageRatio: "16/9", borderEnabled: false, padding: 0 },
//   }),
//   "carousel-magazine": () => ({
//     banner: defaultCategoryBanner(),
//     hero: { autoplay: false, intervalMs: 6000, slideCount: 5, showAuthor: true, showDate: true, showReadTime: true, ctaLabel: "Read Full Story" },
//     topStories: { title: "Top Stories", visibleCount: 5, totalSlides: 9, showDescription: false },
//     latestUpdates: { title: "Latest Updates", count: 6, columns: 3 },
//     moreFromCategory: { title: "More From Category", count: 6 },
//     card: { imageRatio: "16/9", borderEnabled: false, padding: 0 },
//   }),
// };

// export function createCategoryBlock(templateId) {
//   const factory = CATEGORY_TEMPLATE_DEFAULTS[templateId];
//   if (!factory) throw new Error(`Unknown category template: ${templateId}`);
//   return factory();
// }

// // =============================================================================
// // AUTHOR DETAIL PAGE BUILDER — 3 standalone author-profile templates
// // =============================================================================
// // Same philosophy as the category builder above: exactly ONE of these 3
// // full-page templates is active at a time, shared across every author's
// // profile page on the site — only the *content* (author bio, stats,
// // articles) changes per author, never the structure.

// export const AUTHOR_TEMPLATES = [
//   {
//     id: "sidebar-right",
//     name: "Sticky Right Sidebar",
//     description: "Profile header + stats strip + trust badges + 2-column article grid + about/topics, with a sticky right sidebar (About, Most Read, World Briefing).",
//     badge: "Template 1",
//     color: "amber",
//   },
//   {
//     id: "hero-banner",
//     name: "Hero Banner Layout",
//     description: "Full-width dark gradient hero with portrait + bio, horizontal metrics strip, 3-column article grid, about/topics below — no sidebar.",
//     badge: "Template 2",
//     color: "blue",
//   },
//   {
//     id: "sidebar-left",
//     name: "Sticky Left Sidebar",
//     description: "Sticky left profile panel (avatar, stats, badges, topics) beside a scrolling center column of articles, about section and most-read list.",
//     badge: "Template 3",
//     color: "slate",
//   },
// ];

// function defaultAuthorBadges() {
//   return [
//     { id: "b1", title: "Trusted Reporting", description: "Rigorous fact-checking and source verification.", enabled: true },
//     { id: "b2", title: "Global Perspective", description: "In-depth coverage from conflict to boardrooms.", enabled: true },
//     { id: "b3", title: "Independent Journalism", description: "No corporate influence, no hidden agenda.", enabled: true },
//     { id: "b4", title: "Editorial Standards", description: "Committed to accuracy, fairness and transparency.", enabled: true },
//   ];
// }

// function defaultAuthorSidebar() {
//   return {
//     about: { enabled: true, title: "About {name}" },
//     mostRead: { enabled: true, title: "Most Read by {firstName}", count: 5, showNumbers: true },
//     newsletter: { enabled: true, heading: "World Briefing", subheading: "Our correspondents' dispatch, every morning at 7am.", ctaLabel: "Subscribe Free" },
//     advertisement: { enabled: false },
//   };
// }

// export const AUTHOR_TEMPLATE_DEFAULTS = {
//   "sidebar-right": () => ({
//     stats: { enabled: true, showArticles: true, showExperience: true, showLocation: true, showAwards: false },
//     badges: defaultAuthorBadges(),
//     latestArticles: { title: "Latest Articles by {name}", count: 6, columns: 3, showImage: true, showCategory: true, showDescription: false, showDate: true, showReadTime: true, imageRatio: "16/9" },
//     topics: { enabled: true, title: "Topics {firstName} Covers" },
//     moreWriters: { enabled: true, title: "More Writers", count: 4 },
//     sidebar: defaultAuthorSidebar(),
//     card: { imageRatio: "16/9", borderEnabled: true, padding: 12 },
//   }),
//   "hero-banner": () => ({
//     hero: { bg: "#0f1115", showSocial: true },
//     stats: { enabled: true, showArticles: true, showExperience: true, showLocation: true, showAwards: true },
//     latestArticles: { title: "Latest Articles by {name}", count: 6, columns: 3, showImage: true, showCategory: true, showDescription: false, showDate: true, showReadTime: true, imageRatio: "16/9" },
//     about: { enabled: true, title: "About {name}" },
//     topics: { enabled: true, title: "Topics {firstName} Covers" },
//     card: { imageRatio: "16/9", borderEnabled: true, padding: 12 },
//   }),
//   "sidebar-left": () => ({
//     stats: { enabled: true, showArticles: true, showExperience: true, showLocation: true, showAwards: false },
//     badges: defaultAuthorBadges(),
//     topics: { enabled: true, title: "Topics {firstName} Covers" },
//     latestArticles: { title: "Latest Articles by {name}", count: 6, columns: 3, showImage: true, showCategory: true, showDescription: false, showDate: true, showReadTime: true, imageRatio: "16/9" },
//     about: { enabled: true, title: "About {name}" },
//     mostRead: { enabled: true, title: "Most Read by {firstName}", count: 5, showNumbers: true },
//     card: { imageRatio: "16/9", borderEnabled: true, padding: 12 },
//   }),
// };

// export function createAuthorBlock(templateId) {
//   const factory = AUTHOR_TEMPLATE_DEFAULTS[templateId];
//   if (!factory) throw new Error(`Unknown author template: ${templateId}`);
//   return factory();
// }

// // =============================================================================
// // ARTICLE DETAIL PAGE BUILDER — 3 standalone article-page templates
// // =============================================================================
// // Exactly ONE of these 3 templates is active at a time and renders every
// // article's detail page on the site — only the article's own content
// // (title, body, images, author) changes per page, never the structure.

// export const ARTICLE_TEMPLATES = [
//   {
//     id: "sticky-sidebar",
//     name: "Sticky Sidebar Editorial",
//     description: "Classic single-column article — breadcrumb, hero image, drop-cap body, pull quotes, key points, about author, related grid — with a sticky right sidebar (Most Read, Most Commented, Ad slot).",
//     badge: "Template 1",
//     color: "slate",
//   },
//   {
//     id: "full-hero",
//     name: "Full-Width Hero Editorial",
//     description: "Edge-to-edge hero image, breadcrumb + category tags below, title/subtitle, body, key points box, about author, previous/next navigation, related articles grid. No sidebar.",
//     badge: "Template 2",
//     color: "amber",
//   },
//   {
//     id: "split-column",
//     name: "Split Column Magazine",
//     description: "Title, meta and byline in a left text column beside a large photo + author card + prev/next navigation on the right. Stacks to a single column on mobile.",
//     badge: "Template 3",
//     color: "blue",
//   },
// ];

// function defaultArticleTypography() {
//   return { titleSize: 30, subtitleSize: 15, bodySize: 16, lineHeight: 1.7, fontWeight: 400 };
// }

// function defaultArticleWidgets() {
//   return { mostRead: true, mostCommented: true, advertisement: true, authorCard: true };
// }

// /** Default "Previous / Next article" navigation settings — admin can toggle
//  *  visibility, the thumbnail, label text, font sizes, and every color
//  *  (including the hover color of the article title) from the Article
//  *  Detail Page Builder. Shared shape across all 3 templates. */
// function defaultPrevNext() {
//   return {
//     enabled: true,
//     showThumbnail: true,
//     prevLabel: "Previous Article",
//     nextLabel: "Next Article",
//     labelSize: 10,
//     titleSize: 12.5,
//     labelColor: "#9ca3af",
//     textColor: "#111827",
//     hoverColor: "#dc2626",
//     bgColor: "#f9fafb",
//     hoverBgColor: "#f3f4f6",
//     borderColor: "#f1f5f9",
//     borderRadius: 10,
//   };
// }

// export const ARTICLE_TEMPLATE_DEFAULTS = {
//   "sticky-sidebar": () => ({
//     typography: defaultArticleTypography(),
//     hero: { enabled: true, ratio: "16/9" },
//     header: { showBreadcrumb: true, showCategoryTags: true, showShare: true, sharePlatforms: ["facebook", "twitter", "linkedin", "copyLink"], showDate: true, showReadTime: true },
//     body: { dropCap: true, showPullquotes: true, showKeyPoints: true, contentWidth: 720 },
//     authorBox: { enabled: true },
//     prevNext: defaultPrevNext(),
//     relatedArticles: { enabled: true, title: "Related Articles", count: 3, columns: 3 },
//     sidebar: {
//       enabled: true,
//       width: 280,
//       sticky: true,
//       widgets: defaultArticleWidgets(),
//       ad: { imageUrl: "", linkUrl: "", altText: "Advertisement", width: 0, height: 250 },
//     },
//     card: { imageRatio: "4/3", borderEnabled: true },
//   }),
//   "full-hero": () => ({
//     typography: { ...defaultArticleTypography(), titleSize: 34, subtitleSize: 17 },
//     hero: { enabled: true, heightDesktop: 460, overlay: false, ratio: "21/9" },
//     header: { showBreadcrumb: true, showCategoryTags: true, showShare: true, sharePlatforms: ["facebook", "twitter", "linkedin", "copyLink"], showDate: true, showReadTime: true },
//     body: { dropCap: true, showPullquotes: true, showKeyPoints: true, contentWidth: 760 },
//     authorBox: { enabled: true },
//     prevNext: defaultPrevNext(),
//     relatedArticles: { enabled: true, title: "Related Articles", count: 4, columns: 4 },
//     card: { imageRatio: "4/3", borderEnabled: true },
//   }),
//   "split-column": () => ({
//     typography: { ...defaultArticleTypography(), titleSize: 28 },
//     hero: { enabled: true, ratio: "4/5" },
//     header: { showBreadcrumb: true, showCategoryTags: true, showShare: true, sharePlatforms: ["facebook", "twitter", "linkedin", "copyLink"], showDate: true, showReadTime: true },
//     body: { dropCap: false, showPullquotes: true, showKeyPoints: true, contentWidth: 680 },
//     authorBox: { enabled: true },
//     prevNext: defaultPrevNext(),
//     relatedArticles: { enabled: true, title: "Related Articles", count: 3, columns: 3 },
//     card: { imageRatio: "4/3", borderEnabled: true },
//   }),
// };

// export function createArticleBlock(templateId) {
//   const factory = ARTICLE_TEMPLATE_DEFAULTS[templateId];
//   if (!factory) throw new Error(`Unknown article template: ${templateId}`);
//   return factory();
// }


// lib/blockDefinitions.js
import {
  Zap, Star, LayoutGrid, FolderKanban, MessageSquareQuote, Users,
  Megaphone, PlaySquare, Image as ImageIcon, Rows3, Mail, Code2, Columns3,
  Newspaper, StickyNote, Moon, LayoutPanelTop,
} from "lucide-react";

export const CATEGORY_OPTIONS = ["Power", "Wealth", "Real Estate", "Technology", "Markets", "Opinion", "Politics", "Business", "World", "Health", "Justice", "Free Speech"];

export const BLOCK_DEFINITIONS = {
  breakingNews: {
    type: "breakingNews",
    label: "Breaking News Ticker",
    description: "Auto feed of the latest articles",
    icon: Zap,
    defaultData: () => ({
      limit: 5,
      bg: "#111111",
      labelBg: "#cc0000",
      textColor: "#ffffff",
      labelText: "BREAKING",
      speed: 80,
      enabled: true,
      labelStyle: "badge",
    }),
  },
  heroStory: {
    type: "heroStory",
    label: "Hero Story",
    description: "Large featured-article display",
    icon: Star,
    defaultData: () => ({
      articleId: "",
      title: "Global Markets Rally As Inflation Fears Ease",
      subheadline: "Central banks signal coordinated pause on rate hikes",
      category: "BUSINESS",
      ctaLabel: "Read More",
      ctaUrl: "#",
      bgImage: "",
      overlayOpacity: 50,
      fontFamily: "sans",
      titleSize: 28,
      titleWeight: "bold",
      titleColor: "#ffffff",
      alignment: "left",
      paddingTop: 48,
      paddingBottom: 48,
      showCategory: true,
      showCta: true,
    }),
  },
  topStoriesGrid: {
    type: "topStoriesGrid",
    label: "Top Stories Grid",
    description: "Grid of recent top stories",
    icon: LayoutGrid,
    defaultData: () => ({ limit: 4, columns: 4, showImage: true, showCategory: true }),
  },
  categorySection: {
    type: "categorySection",
    label: "Category Section",
    description: "Articles from a chosen category",
    icon: FolderKanban,
    defaultData: () => ({
      category: "Power",
      layout: "grid",
      limit: 6,
      title: "",
      bg: "#ffffff",
      textColor: "#111111",
      showImages: true,
    }),
  },
  featuredStoriesRow: {
    type: "featuredStoriesRow",
    label: "Featured Stories Row",
    description: "Horizontal strip of featured stories",
    icon: Rows3,
    defaultData: () => ({
      limit: 4,
      title: "Featured Stories",
      showImage: true,
      imageHeight: 120,
    }),
  },
  opinion: {
    type: "opinion",
    label: "Opinion Block",
    description: "Featured editorial / opinion content",
    icon: MessageSquareQuote,
    defaultData: () => ({
      articleId: "",
      title: "The case for deliberate slowness in an age of algorithmic haste",
      author: "Sarah Mills",
      bg: "#f8f8f6",
    }),
  },
  authorSpotlight: {
    type: "authorSpotlight",
    label: "Author Spotlight",
    description: "Show top authors",
    icon: Users,
    defaultData: () => ({ limit: 3, title: "Our Writers" }),
  },
  video: {
    type: "video",
    label: "Video Block",
    description: "Featured videos",
    icon: PlaySquare,
    defaultData: () => ({ videoUrl: "", title: "Featured video", caption: "", thumbUrl: "" }),
  },
  fullWidthBanner: {
    type: "fullWidthBanner",
    label: "Full-Width Banner",
    description: "Edge-to-edge image with heading & CTA",
    icon: ImageIcon,
    defaultData: () => ({
      imageUrl: "",
      heading: "Exploring The World's Most Incredible Places",
      subheading: "",
      ctaLabel: "Read Story",
      ctaUrl: "",
      overlayColor: "rgba(0,0,0,0.45)",
      height: 320,
      linkUrl: "",
    }),
  },
  newsletter: {
    type: "newsletter",
    label: "Newsletter Signup",
    description: "Email capture block",
    icon: Mail,
    defaultData: () => ({
      heading: "Stay ahead of the story",
      subheading: "Get the headlines that matter, every morning.",
      placeholder: "Enter your email",
      ctaLabel: "Subscribe",
      ctaBg: "#cc0000",
      ctaTextColor: "#ffffff",
      bg: "#f5f5f0",
      textColor: "#111111",
      enabled: true,
    }),
  },
  advertisement: {
    type: "advertisement",
    label: "Advertisement",
    description: "Ad banner / placeholder",
    icon: Megaphone,
    defaultData: () => ({
      size: "leaderboard",
      imageUrl: "",
      linkUrl: "",
      overlayColor: "",
      width: 0,
      height: 90,
      altText: "Advertisement",
    }),
  },
  customHtml: {
    type: "customHtml",
    label: "Custom HTML",
    description: "Add custom content",
    icon: Code2,
    defaultData: () => ({ html: "<!-- Add custom markup -->", enabled: true }),
  },
  threeColumnLayout: {
    type: "threeColumnLayout",
    label: "3-Column Layout",
    description: "Left sticky + center feed + right sidebar",
    icon: Columns3,
    defaultData: () => ({
      leftTitle: "Most Read",
      leftItems: [
        { id: "l1", label: "Global Markets Rally As Inflation Fears Ease" },
        { id: "l2", label: "Power Brokers of the Year: The 50 Who Shape Our World" },
        { id: "l3", label: "Real Estate Outlook 2026: Buy, Sell, or Wait?" },
        { id: "l4", label: "Tech Giants Face New Antitrust Pressure in Brussels" },
        { id: "l5", label: "Opinion: Why Central Banks Are Losing the Plot" },
      ],
      leftShowNumbers: true,
      centerTitle: "Latest News",
      centerCategory: "All",
      centerLimit: 5,
      centerLayout: "list",
      rightTitle: "In Brief",
      rightShowAd: true,
      rightAdSize: "sidebar",
      rightAdImage: "",
      rightAdLinkUrl: "",
      rightAdAltText: "Advertisement",
      rightAdWidth: 0,
      rightAdHeight: 0,
      rightShowNewsletter: true,
      rightNewsletterHeading: "Stay ahead of the story",
      bg: "#ffffff",
      border: "#e5e7eb",
      padding: 24,
      borderRadius: 12,
      widthMode: "equal",
    }),
  },
  newsFeed: {
    type: "newsFeed",
    label: "News Feed",
    description: "Vertical list of articles with images",
    icon: Newspaper,
    defaultData: () => ({
      title: "",
      category: "All",
      limit: 8,
      layout: "list",
      showImages: true,
      showCategory: true,
      showDate: true,
      showExcerpt: true,
      imageSize: "medium",
    }),
  },
  stickyNotice: {
    type: "stickyNotice",
    label: "Sticky Notice",
    description: "Announcements / site-wide notices",
    icon: StickyNote,
    defaultData: () => ({
      text: "Subscribe for full access to all stories.",
      ctaLabel: "Subscribe Now",
      ctaUrl: "#",
      bg: "#1a1a1a",
      textColor: "#ffffff",
      ctaBg: "#cc0000",
      dismissible: true,
      enabled: true,
    }),
  },
  newspaperEditorial: {
    type: "newspaperEditorial",
    label: "Newspaper Editorial Layout",
    description: "3-column newspaper layout: sticky left sidebar + center editorial + right sidebar",
    icon: Columns3,
    defaultData: () => ({
      // Top Stories Grid (4 cards)
      showTopStories: true,
      topStoriesTitle: "FEATURED STORIES",
      topStoriesCount: 4,
      topStoriesImageRatio: "4/3",
      topStoriesSpacing: 16,
      topStoriesCategoryColor: "#cc0000",

      // Left Sidebar blocks
      leftBlocks: [
        { id: "lb1", type: "featuredArticle", label: "Featured Article", visible: true, category: "WHITE HOUSE • LIVE", categoryColor: "#dc2626", headline: "Live updates from The White House: diplomatic tensions mount", description: "Senior officials confirm back-channel talks with three European counterparts are ongoing, amid growing calls for a formal summit before the autumn recess.", author: "James Whitmore", date: "Jan 8, 2026", showImage: true, showDesc: true, showAuthor: true, showDate: true },
        { id: "lb2", type: "smallStoryCard", label: "Economy Card", visible: true, category: "ECONOMY", categoryColor: "#d97706", headline: "It's Never Been More Expensive to Visit New York City", author: "Anna Cole", date: "Jan 8", showImage: true, showDesc: false, showAuthor: true, showDate: true },
        { id: "lb3", type: "smallStoryCard", label: "Health Card", visible: true, category: "HEALTH", categoryColor: "#059669", headline: "How Sarah Coped With Her Chronic Disease — and Found Clarity", author: "Mark Wells", date: "Jan 8", showImage: true, showDesc: false, showAuthor: true, showDate: true },
        { id: "lb4", type: "opinionCard", label: "Opinion Card", visible: true, category: "OPINION", categoryColor: "#6b7280", label2: "EDITOR'S PICK", headline: "The case for deliberate slowness in an age of algorithmic haste", author: "Eleanor Marsh, Senior Columnist", date: "Jan 8", showImage: false, showDesc: false, showAuthor: true, showDate: false },
        { id: "lb5", type: "smallStoryCard", label: "Economy Card 2", visible: true, category: "ECONOMY", categoryColor: "#d97706", headline: "It's Never Been More Expensive to Visit New York City", author: "Maya Chen", date: "Jan 8", showImage: false, showDesc: false, showAuthor: true, showDate: true },
        { id: "lb6", type: "smallStoryCard", label: "Justice Card", visible: true, category: "JUSTICE", categoryColor: "#7c3aed", headline: "The slow reckoning: how courts are reshaping AI liability law", author: "Marcus Reid", date: "Jan 8", showImage: false, showDesc: true, showAuthor: true, showDate: true },
        { id: "lb7", type: "smallStoryCard", label: "Finance Card", visible: true, category: "FINANCE", categoryColor: "#2563eb", headline: "Extra £2.50 for half a prawn? The surcharge economy arrives", author: "Marcus Reid", date: "Jan 8", showImage: false, showDesc: false, showAuthor: true, showDate: true },
      ],

      // Center Column
      heroHeadline: "Live updates from The White House: A new chapter in transatlantic diplomacy",
      heroCategory: "WORLD • POLITICS",
      heroDate: "JANUARY 8, 2026",
      heroSummary: "Senior diplomats from twelve nations convened in an extraordinary session yesterday as mounting trade tensions threatened to derail the framework agreements painstakingly built over the past eighteen months.",
      heroAuthor: "James Whitmore",
      heroAuthorRole: "White House Correspondent",

      // Category sections in center
      // Placeholder labels used only until the admin actually applies this
      // template (HomepageBuilder.applyTemplate swaps these for the site's
      // real categories automatically) or opens Category Sections in the
      // settings panel, which lists every real category with a visible/
      // disable toggle. categoryId is left blank here — resolveArticlesBy
      // CategoryName() then falls back to loose name matching.
      centerSections: [
        { id: "cs1", categoryId: "", category: "ECONOMY", color: "#d97706", stories: 2, imagePosition: "left", showDesc: true, showDate: true, showAuthor: true },
        { id: "cs2", categoryId: "", category: "CULTURE", color: "#7c3aed", stories: 3, imagePosition: "top", showDesc: false, showDate: true, showAuthor: true },
        { id: "cs3", categoryId: "", category: "BUSINESS", color: "#2563eb", stories: 4, imagePosition: "top", showDesc: false, showDate: true, showAuthor: false },
      ],

      // Right Sidebar
      rightBlocks: [
        { id: "rb1", type: "futureStory", label: "Future Story", visible: true, title: "Future of Contemporary Art", enabled: true, showImage: true, showDate: true, showExcerpt: true },
        { id: "rb2", type: "topOfMonth", label: "Top of Month", visible: true, title: "Top of Month", enabled: true, showImages: true, showDates: true, itemCount: 3 },
        { id: "rb3", type: "mostCommented", label: "Trending Now", visible: true, title: "Trending Now", enabled: true, itemCount: 5, showDates: true },
        { id: "rb4", type: "topAuthors", label: "Top Authors", visible: true, title: "Top Authors", enabled: true, showImages: true, itemCount: 4 },
        { id: "rb5", type: "advertisement", label: "Advertisement", visible: true, enabled: true, title: "Advertisement", imageUrl: "", linkUrl: "", altText: "Advertisement", width: 0, height: 250 },
        { id: "rb6", type: "newsletter", label: "Newsletter", visible: false, enabled: false, title: "Newsletter" },
      ],

      // Layout
      maxWidth: 1600,
      columnGap: 24,
      bg: "#ffffff",
    }),
  },
  // ─── Template 2: Modern Magazine ───────────────────────────────────────────
  modernMagazineLayout: {
    type: "modernMagazineLayout",
    label: "Modern Magazine Layout",
    description: "Full Template 2 homepage: 75/25 layout, hero, top stories, sidebar, latest news, editor's picks, category grid & more",
    icon: LayoutPanelTop,
    defaultData: () => ({
      // Layout
      maxWidth: 1600,
      columnGap: 24,
      bg: "#ffffff",

      // Section 1: Hero
      heroEnabled: true,
      heroImage: "",
      heroOverlayOpacity: 55,
      heroCategory: "BUSINESS",
      heroHeadline: "Global Markets Rally As Inflation Fears Ease",
      heroDescription: "Central banks signal coordinated pause on rate hikes as economic outlook improves across major economies.",
      heroCtaLabel: "Read More",
      heroCtaUrl: "#",
      heroHeight: 420,
      heroTitleSize: 32,
      heroBg: "#1a1a2e",

      // Section 2: Top Stories
      topStoriesEnabled: true,
      topStoriesTitle: "Top Stories",
      topStoriesCount: 4,

      // Right Sidebar widgets
      sidebarWidgets: [
        { id: "sw1", type: "trending", label: "Trending Stories", enabled: true, title: "Trending Now", itemCount: 5, showImages: true, showTime: true },
        { id: "sw2", type: "popular", label: "Popular Articles", enabled: true, title: "Popular Articles", itemCount: 5, showNumbers: true },
        { id: "sw3", type: "newsletter", label: "Newsletter", enabled: true, title: "Stay updated", description: "Get the latest news and insights." },
        { id: "sw4", type: "advertisement", label: "Advertisement", enabled: true, size: "sidebar", imageUrl: "", linkUrl: "", altText: "Advertisement", width: 0, height: 0 },
      ],

      // Section 3: Latest News
      latestNewsEnabled: true,
      latestNewsTitle: "Latest News",
      latestNewsLimit: 8,

      // Section 4: Editor's Picks
      editorsPicksEnabled: true,
      editorsPicksTitle: "Editor's Picks",

      // Section 5: Category Grid
      categoryGridEnabled: true,
      categoryGridCategories: [
        { id: "cg1", categoryId: "", name: "Business", articleCount: 4 },
        { id: "cg2", categoryId: "", name: "Technology", articleCount: 4 },
        { id: "cg3", categoryId: "", name: "Politics", articleCount: 4 },
        { id: "cg4", categoryId: "", name: "Lifestyle", articleCount: 4 },
      ],

      // Section 6: Advertisement Banner
      adEnabled: true,
      adSize: "970x90",
      adImage: "",
      adLinkUrl: "",
      adAltText: "Advertisement",
      adWidth: 0,
      adHeight: 0,

      // Section 7: Latest Articles Grid
      latestGridEnabled: true,
      latestGridTitle: "Latest Articles",
      latestGridColumns: 3,
      latestGridLimit: 9,

      // Section 8: Newsletter
      newsletterEnabled: true,
      newsletterHeading: "Stay ahead of the story",
      newsletterSubheading: "Get the headlines that matter, every morning.",
      newsletterCtaLabel: "Subscribe",
      newsletterBg: "#f5f5f0",

      // Section 9: Load More
      loadMoreEnabled: true,
      loadMoreLabel: "Load More Articles",
      loadMoreColor: "#cc0000",
      loadMoreRadius: 6,
      loadMoreAction: "loadMore",
      loadMoreUrl: "",
      loadMoreIncrement: 3,
    }),
  },

  // ─── Template 3: Dark News ──────────────────────────────────────────────────
  darkNewsLayout: {
    type: "darkNewsLayout",
    label: "Dark News Layout",
    description: "Full Template 3 homepage: premium dark theme, 75/25 layout, hero, featured stories, most read, editor's choice & more",
    icon: Moon,
    defaultData: () => ({
      // Theme / Layout
      maxWidth: 1600,
      columnGap: 24,
      bg: "#111111",
      cardBg: "#1a1a1a",
      accentColor: "#cc0000",
      textColor: "#ffffff",

      // Section 1: Hero
      heroEnabled: true,
      heroImage: "",
      heroOverlayOpacity: 65,
      heroCategory: "TECHNOLOGY",
      heroHeadline: "The Future of AI: How Technology is Shaping Our World",
      heroDescription: "Artificial intelligence is transforming industries and redefining the future of humanity.",
      heroCtaLabel: "Read More",
      heroCtaUrl: "#",
      heroHeight: 460,
      heroTitleSize: 34,

      // Right Sidebar (after hero)
      sidebarWidgets: [
        { id: "dw1", type: "trending", label: "Trending Stories", enabled: true, title: "Trending Now", itemCount: 5, showImages: true, showTime: true },
        { id: "dw2", type: "newsletter", label: "Newsletter", enabled: true, title: "Stay informed", description: "Stay updated with the latest breaking news." },
        { id: "dw3", type: "advertisement", label: "Advertisement", enabled: true, size: "sidebar", imageUrl: "", linkUrl: "", altText: "Advertisement", width: 0, height: 0 },
      ],

      // Section 2: Featured Stories
      featuredStoriesEnabled: true,
      featuredStoriesTitle: "Featured Stories",
      featuredStoriesCount: 4,

      // Section 3: Latest News
      latestNewsEnabled: true,
      latestNewsTitle: "Latest News",
      latestNewsLimit: 6,

      // Section 4: Most Read
      mostReadEnabled: true,
      mostReadTitle: "Most Read",
      mostReadCount: 5,

      // Section 5: Editor's Choice
      editorsChoiceEnabled: true,
      editorsChoiceTitle: "Editor's Choice",
      editorsChoiceCount: 4,

      // Section 6: Category Blocks
      categoryBlocksEnabled: true,
      categoryBlocks: [
        { id: "db1", categoryId: "", name: "World", articleCount: 2 },
        { id: "db2", categoryId: "", name: "Business", articleCount: 2 },
        { id: "db3", categoryId: "", name: "Technology", articleCount: 2 },
      ],

      // Lower right sidebar (used in category blocks row)
      lowerSidebarWidgets: [
        { id: "lw1", type: "newsletter", label: "Newsletter", enabled: true, title: "Newsletter", description: "Stay updated with the latest breaking news." },
        { id: "lw2", type: "advertisement", label: "Advertisement", enabled: true, size: "sidebar", imageUrl: "", linkUrl: "", altText: "Advertisement", width: 0, height: 0 },
      ],

      // Section 7: Advertisement
      adEnabled: true,
      adSize: "728x90",
      adImage: "",
      adLinkUrl: "",
      adAltText: "Advertisement",
      adWidth: 0,
      adHeight: 0,

      // Section 8: Latest Articles
      latestGridEnabled: true,
      latestGridTitle: "Latest Articles",
      latestGridColumns: 3,
      latestGridLimit: 6,

      // Section 9: Newsletter
      newsletterEnabled: true,
      newsletterHeading: "Stay ahead of the story",
      newsletterSubheading: "Subscribe for the headlines that matter.",
      newsletterCtaLabel: "Subscribe",

      // Section 10: Load More
      loadMoreEnabled: true,
      loadMoreLabel: "Load More Articles",
      loadMoreColor: "#cc0000",
      loadMoreRadius: 6,
      loadMoreAction: "loadMore",
      loadMoreUrl: "",
      loadMoreIncrement: 3,
    }),
  },

  // ─── Template 7: Masonry Editorial Layout ──────────────────────────────────
  masonryEditorialLayout: {
    type: "masonryEditorialLayout",
    label: "Masonry Editorial Layout",
    description: "Full Template 7 homepage: hero masonry, editor's picks, latest+sidebar, category grid, trending, authors & more",
    icon: LayoutGrid,
    defaultData: () => ({
      // Layout
      maxWidth: 1600,
      columnGap: 24,
      padding: 24,
      bg: "#ffffff",

      // Section 1: Hero Masonry
      heroSource: "manual",
      heroCategory: "WORLD",
      heroHeadline: "Global economy outlook for the rest of 2026",
      heroDescription: "Experts predict steady growth despite inflation and geopolitical risks.",
      heroAuthor: "Anna Cole",
      heroDate: "2h ago",
      heroImage: "",
      heroImageHeight: 420,
      heroOverlayOpacity: 45,
      heroCtaLabel: "Read More",
      heroCtaUrl: "#",
      heroSmallStories: 2,

      // Section 2: Editor's Picks
      editorsPicksEnabled: true,
      editorsPicksTitle: "Editor's Picks",
      editorsPicksCount: 4,

      // Section 3: Latest News + Sidebar
      latestNewsEnabled: true,
      latestNewsTitle: "Latest News",
      latestNewsLimit: 6,
      sidebarWidgets: [
        { id: "mw1", type: "popular", label: "Popular Articles", enabled: true, title: "Popular Articles", itemCount: 5, showNumbers: false },
        { id: "mw2", type: "newsletter", label: "Newsletter", enabled: true, title: "Newsletter", description: "Stay updated with the latest news and insights." },
        { id: "mw4", type: "advertisement", label: "Advertisement", enabled: true, size: "sidebar", imageUrl: "", linkUrl: "", altText: "Advertisement", width: 0, height: 0 },
      ],

      // Section 4: More News Masonry Grid
      moreNewsEnabled: true,
      moreNewsTitle: "More News",
      moreNewsCount: 6,

      // Section 5: Category Grid
      categoryGridEnabled: true,
      categoryGridColumns: 4,
      categoryGridImageRatio: "4/3",
      categoryGridArticleCount: 4,
      categoryGridCategories: [
        { id: "mc1", categoryId: "", name: "Business", articleCount: 4 },
        { id: "mc2", categoryId: "", name: "Technology", articleCount: 4 },
        { id: "mc3", categoryId: "", name: "Politics", articleCount: 4 },
        { id: "mc4", categoryId: "", name: "World", articleCount: 4 },
        { id: "mc5", categoryId: "", name: "Sports", articleCount: 4 },
        { id: "mc6", categoryId: "", name: "Lifestyle", articleCount: 4 },
      ],

      // Section 6: Trending Stories
      trendingEnabled: true,
      trendingTitle: "Trending Stories",
      trendingCount: 6,

      // Section 7: Newsletter
      newsletterEnabled: true,
      newsletterHeading: "Stay updated with the latest news and insights.",
      newsletterSubheading: "We respect your privacy.",
      newsletterCtaLabel: "Subscribe",
      newsletterBg: "#f5f5f0",
      newsletterRadius: 12,

      // Section 8: Featured Authors
      authorsEnabled: true,
      authorsTitle: "Featured Authors",
      authorsCount: 4,

      // Section 9: Advertisement
      adEnabled: true,
      adSize: "970x250",
      adImage: "",
      adLinkUrl: "",
      adAltText: "Advertisement",
      adWidth: 0,
      adHeight: 0,

      // Section 10: Latest Articles Grid
      latestGridEnabled: true,
      latestGridTitle: "Latest Articles",
      latestGridLimit: 8,

      // Load More
      loadMoreEnabled: true,
      loadMoreLabel: "Load More Articles",
      loadMoreColor: "#cc0000",
      loadMoreRadius: 6,
      loadMoreAction: "loadMore",
      loadMoreUrl: "",
      loadMoreIncrement: 3,
    }),
  },
};

export const BLOCK_LIBRARY_ORDER = [
  "breakingNews",
  "heroStory",
  "threeColumnLayout",
  "newsFeed",
  "topStoriesGrid",
  "categorySection",
  "featuredStoriesRow",
  "opinion",
  "authorSpotlight",
  "video",
  "fullWidthBanner",
  "newsletter",
  "advertisement",
  "stickyNotice",
  "customHtml",
  "newspaperEditorial",
  "modernMagazineLayout",
  "darkNewsLayout",
  "masonryEditorialLayout",
];

// Palette cycled through when auto-generating a center-column category
// section for a real category (template apply, or the admin toggling a new
// category on in the settings panel) — matches the manual CATEGORY_COLORS
// list in BlockSettingsPanel so auto-added and manually-added sections look
// consistent.
export const CENTER_SECTION_COLOR_PALETTE = ["#dc2626", "#2563eb", "#059669", "#d97706", "#7c3aed", "#0891b2", "#db2777", "#65a30d"];

/** Builds a Newspaper Editorial "center section" object for one real
 *  category (from lib/categoriesArticlesApi's getCategories()). Used both
 *  when the template is first applied and when an admin toggles a category
 *  on in the Category Sections settings, so the two code paths always
 *  produce the same shape. */
export function makeCenterSectionForCategory(category, colorIndex = 0) {
  return {
    id: `cs_${category._id || category.slug || colorIndex}`,
    categoryId: category._id || "",
    category: String(category.name || category.title || "").toUpperCase(),
    color: CENTER_SECTION_COLOR_PALETTE[colorIndex % CENTER_SECTION_COLOR_PALETTE.length],
    stories: 3,
    imagePosition: colorIndex % 2 === 0 ? "top" : "left",
    showDesc: true,
    showDate: true,
    showAuthor: true,
  };
}

export function createBlock(type) {
  const def = BLOCK_DEFINITIONS[type];
  if (!def) throw new Error(`Unknown block type: ${type}`);
  return {
    id: `${type}_${Date.now().toString(36)}_${Math.floor(Math.random() * 1000)}`,
    type,
    data: def.defaultData(),
  };
}

// ─── Template 5: Newspaper Editorial block types ─────────────────────────────

// =============================================================================
// CATEGORY PAGE BUILDER — 4 standalone category-page templates
// =============================================================================
// These are intentionally separate from BLOCK_DEFINITIONS/createBlock above
// (which power the Homepage Builder's block library). A category page is
// always exactly ONE of these 4 full-page templates — never a mix of
// composable blocks — selected once and shared across every category on the
// site. No header/footer markup lives in these configs; only the dark
// category banner + content sections, per the category-builder spec.

export const CATEGORY_TEMPLATES = [
  {
    id: "sticky-editorial",
    name: "Sticky Sidebar Editorial",
    description: "Lead story + top stories grid + opinion strip + article list, with a sticky right sidebar (Most Read, Latest, Newsletter, Topics, Authors).",
    badge: "Template 1",
    color: "amber",
  },
  {
    id: "grid-2col",
    name: "Two-Column Grid",
    description: "Clean, uniform two-column article grid with Load More — no sidebar.",
    badge: "Template 2",
    color: "blue",
  },
  {
    id: "grid-3col",
    name: "Three-Column Grid",
    description: "Symmetric three-column article grid with Load More — no sidebar.",
    badge: "Template 3",
    color: "slate",
  },
  {
    id: "carousel-magazine",
    name: "Carousel Magazine",
    description: "Hero carousel + Top Stories carousel + Latest Updates grid + More From Category.",
    badge: "Template 4",
    color: "rose",
  },
];

function defaultCategoryBanner() {
  return {
    title: "Business",
    description: "Insights, analysis and key developments shaping the global business landscape.",
    bgImage: "",
    overlayOpacity: 70,
    showGlobeGraphic: true,
  };
}

export const CATEGORY_TEMPLATE_DEFAULTS = {
  "sticky-editorial": () => ({
    banner: defaultCategoryBanner(),
    // Hero / lead story — always resolved with client-news priority at
    // render time (see lib/articlesSource.js: resolveCategoryHero).
    hero: { showLiveBadge: true, showAuthor: true, showDate: true, showReadTime: true, showDescription: true },
    topStories: { title: "Top Stories", count: 3, showImage: true, showDescription: true, showAuthor: true, showDate: true, imageRatio: "16/9" },
    opinion: { enabled: true, title: "Opinion", count: 2 },
    articleList: { title: "More From Category", count: 12, showImage: true, showDescription: true, showAuthor: true, showDate: true, showReadTime: true },
    sidebar: {
      mostRead: { enabled: true, title: "Most Read", count: 3, showNumbers: true },
      latest: { enabled: true, title: "Latest Updates", count: 4 },
      newsletter: { enabled: true, heading: "World Briefing", subheading: "Our correspondents' dispatch, every morning at 7am.", ctaLabel: "Subscribe Free" },
      topics: { enabled: true, title: "Browse by Topic", tags: ["All", "Markets", "Economy", "Finance", "Technology", "Energy", "Crypto"] },
      authors: { enabled: true, title: "Correspondents", count: 4 },
    },
    card: { imageRatio: "16/9", borderEnabled: true, padding: 16 },
  }),
  "grid-2col": () => ({
    banner: defaultCategoryBanner(),
    hero: { showLiveBadge: true, showAuthor: true, showDate: true, showReadTime: true, showDescription: false },
    grid: { columns: 2, count: 12, showImage: true, showDescription: true, showAuthor: true, showDate: true, showReadTime: true, imageRatio: "16/9" },
    loadMore: { enabled: true, label: "Load More Articles", batchSize: 6 },
    card: { imageRatio: "16/9", borderEnabled: false, padding: 0 },
  }),
  "grid-3col": () => ({
    banner: defaultCategoryBanner(),
    hero: { showLiveBadge: true, showAuthor: true, showDate: true, showReadTime: true, showDescription: false },
    grid: { columns: 3, count: 9, showImage: true, showDescription: false, showAuthor: true, showDate: true, showReadTime: true, imageRatio: "16/9" },
    loadMore: { enabled: true, label: "Load More Articles", batchSize: 6 },
    card: { imageRatio: "16/9", borderEnabled: false, padding: 0 },
  }),
  "carousel-magazine": () => ({
    banner: defaultCategoryBanner(),
    hero: { autoplay: false, intervalMs: 6000, slideCount: 5, showAuthor: true, showDate: true, showReadTime: true, ctaLabel: "Read Full Story" },
    topStories: { title: "Top Stories", visibleCount: 5, totalSlides: 9, showDescription: false },
    latestUpdates: { title: "Latest Updates", count: 6, columns: 3 },
    moreFromCategory: { title: "More From Category", count: 6 },
    card: { imageRatio: "16/9", borderEnabled: false, padding: 0 },
  }),
};

export function createCategoryBlock(templateId) {
  const factory = CATEGORY_TEMPLATE_DEFAULTS[templateId];
  if (!factory) throw new Error(`Unknown category template: ${templateId}`);
  return factory();
}

// =============================================================================
// AUTHOR DETAIL PAGE BUILDER — 3 standalone author-profile templates
// =============================================================================
// Same philosophy as the category builder above: exactly ONE of these 3
// full-page templates is active at a time, shared across every author's
// profile page on the site — only the *content* (author bio, stats,
// articles) changes per author, never the structure.

export const AUTHOR_TEMPLATES = [
  {
    id: "sidebar-right",
    name: "Sticky Right Sidebar",
    description: "Profile header + stats strip + trust badges + 2-column article grid + about/topics, with a sticky right sidebar (About, Most Read, World Briefing).",
    badge: "Template 1",
    color: "amber",
  },
  {
    id: "hero-banner",
    name: "Hero Banner Layout",
    description: "Full-width dark gradient hero with portrait + bio, horizontal metrics strip, 3-column article grid, about/topics below — no sidebar.",
    badge: "Template 2",
    color: "blue",
  },
  {
    id: "sidebar-left",
    name: "Sticky Left Sidebar",
    description: "Sticky left profile panel (avatar, stats, badges, topics) beside a scrolling center column of articles, about section and most-read list.",
    badge: "Template 3",
    color: "slate",
  },
];

function defaultAuthorBadges() {
  return [
    { id: "b1", title: "Trusted Reporting", description: "Rigorous fact-checking and source verification.", enabled: true },
    { id: "b2", title: "Global Perspective", description: "In-depth coverage from conflict to boardrooms.", enabled: true },
    { id: "b3", title: "Independent Journalism", description: "No corporate influence, no hidden agenda.", enabled: true },
    { id: "b4", title: "Editorial Standards", description: "Committed to accuracy, fairness and transparency.", enabled: true },
  ];
}

function defaultAuthorSidebar() {
  return {
    about: { enabled: true, title: "About {name}" },
    mostRead: { enabled: true, title: "Most Read by {firstName}", count: 5, showNumbers: true },
    newsletter: { enabled: true, heading: "World Briefing", subheading: "Our correspondents' dispatch, every morning at 7am.", ctaLabel: "Subscribe Free" },
    advertisement: { enabled: false },
  };
}

export const AUTHOR_TEMPLATE_DEFAULTS = {
  "sidebar-right": () => ({
    stats: { enabled: true, showArticles: true, showExperience: true, showLocation: true, showAwards: false },
    badges: defaultAuthorBadges(),
    latestArticles: { title: "Latest Articles by {name}", count: 6, columns: 3, showImage: true, showCategory: true, showDescription: false, showDate: true, showReadTime: true, imageRatio: "16/9" },
    topics: { enabled: true, title: "Topics {firstName} Covers" },
    moreWriters: { enabled: true, title: "More Writers", count: 4 },
    sidebar: defaultAuthorSidebar(),
    card: { imageRatio: "16/9", borderEnabled: true, padding: 12 },
  }),
  "hero-banner": () => ({
    hero: { bg: "#0f1115", showSocial: true },
    stats: { enabled: true, showArticles: true, showExperience: true, showLocation: true, showAwards: true },
    latestArticles: { title: "Latest Articles by {name}", count: 6, columns: 3, showImage: true, showCategory: true, showDescription: false, showDate: true, showReadTime: true, imageRatio: "16/9" },
    about: { enabled: true, title: "About {name}" },
    topics: { enabled: true, title: "Topics {firstName} Covers" },
    card: { imageRatio: "16/9", borderEnabled: true, padding: 12 },
  }),
  "sidebar-left": () => ({
    stats: { enabled: true, showArticles: true, showExperience: true, showLocation: true, showAwards: false },
    badges: defaultAuthorBadges(),
    topics: { enabled: true, title: "Topics {firstName} Covers" },
    latestArticles: { title: "Latest Articles by {name}", count: 6, columns: 3, showImage: true, showCategory: true, showDescription: false, showDate: true, showReadTime: true, imageRatio: "16/9" },
    about: { enabled: true, title: "About {name}" },
    mostRead: { enabled: true, title: "Most Read by {firstName}", count: 5, showNumbers: true },
    card: { imageRatio: "16/9", borderEnabled: true, padding: 12 },
  }),
};

export function createAuthorBlock(templateId) {
  const factory = AUTHOR_TEMPLATE_DEFAULTS[templateId];
  if (!factory) throw new Error(`Unknown author template: ${templateId}`);
  return factory();
}

// =============================================================================
// ARTICLE DETAIL PAGE BUILDER — 3 standalone article-page templates
// =============================================================================
// Exactly ONE of these 3 templates is active at a time and renders every
// article's detail page on the site — only the article's own content
// (title, body, images, author) changes per page, never the structure.

export const ARTICLE_TEMPLATES = [
  {
    id: "sticky-sidebar",
    name: "Sticky Sidebar Editorial",
    description: "Classic single-column article — breadcrumb, hero image, drop-cap body, pull quotes, key points, about author, related grid — with a sticky right sidebar (Most Read, Most Commented, Ad slot).",
    badge: "Template 1",
    color: "slate",
  },
  {
    id: "full-hero",
    name: "Full-Width Hero Editorial",
    description: "Edge-to-edge hero image, breadcrumb + category tags below, title/subtitle, body, key points box, about author, previous/next navigation, related articles grid. No sidebar.",
    badge: "Template 2",
    color: "amber",
  },
  {
    id: "split-column",
    name: "Split Column Magazine",
    description: "Title, meta and byline in a left text column beside a large photo + author card + prev/next navigation on the right. Stacks to a single column on mobile.",
    badge: "Template 3",
    color: "blue",
  },
];

function defaultArticleTypography() {
  return { titleSize: 30, subtitleSize: 15, bodySize: 16, lineHeight: 1.7, fontWeight: 400 };
}

function defaultArticleWidgets() {
  return { mostRead: true, mostCommented: true, advertisement: true, authorCard: true };
}

/** Default settings for the sticky sidebar's "Subscribe / Newsletter" box —
 *  admin can enable/disable it, edit every piece of copy, and customize its
 *  background, text, title and button colors from the Article Detail Page
 *  Builder. Submissions post to the same POST /api/subscribers endpoint
 *  used by every other newsletter form on the site. */
function defaultArticleNewsletter() {
  return {
    enabled: true,
    title: "Stay Informed",
    description: "Get our top stories delivered to your inbox — incisive, informed, and never breathless.",
    placeholder: "Your email address",
    buttonText: "Subscribe Free →",
    successMessage: "You're subscribed! Please check your inbox.",
    bgColor: "#111111",
    titleColor: "#FAFAF8",
    textColor: "#888888",
    buttonColor: "#8B1A1A",
    buttonTextColor: "#ffffff",
  };
}

/** Default "Previous / Next article" navigation settings — admin can toggle
 *  visibility, the thumbnail, label text, font sizes, and every color
 *  (including the hover color of the article title) from the Article
 *  Detail Page Builder. Shared shape across all 3 templates. */
function defaultPrevNext() {
  return {
    enabled: true,
    showThumbnail: true,
    prevLabel: "Previous Article",
    nextLabel: "Next Article",
    labelSize: 10,
    titleSize: 12.5,
    labelColor: "#9ca3af",
    textColor: "#111827",
    hoverColor: "#dc2626",
    bgColor: "#f9fafb",
    hoverBgColor: "#f3f4f6",
    borderColor: "#f1f5f9",
    borderRadius: 10,
  };
}

export const ARTICLE_TEMPLATE_DEFAULTS = {
  "sticky-sidebar": () => ({
    typography: defaultArticleTypography(),
    hero: { enabled: true, ratio: "16/9" },
    header: { showBreadcrumb: true, showCategoryTags: true, showShare: true, sharePlatforms: ["facebook", "twitter", "linkedin", "copyLink"], showDate: true, showReadTime: true },
    body: { dropCap: true, showPullquotes: true, showKeyPoints: true, contentWidth: 720 },
    authorBox: { enabled: true },
    prevNext: defaultPrevNext(),
    relatedArticles: { enabled: true, title: "Related Articles", count: 3, columns: 3 },
    sidebar: {
      enabled: true,
      width: 280,
      sticky: true,
      widgets: defaultArticleWidgets(),
      mostReadCount: 5,
      mostCommentedCount: 4,
      newsletter: defaultArticleNewsletter(),
      ad: { imageUrl: "", linkUrl: "", altText: "Advertisement", width: 0, height: 250 },
    },
    card: { imageRatio: "4/3", borderEnabled: true },
  }),
  "full-hero": () => ({
    typography: { ...defaultArticleTypography(), titleSize: 34, subtitleSize: 17 },
    hero: { enabled: true, heightDesktop: 460, overlay: false, ratio: "21/9" },
    header: { showBreadcrumb: true, showCategoryTags: true, showShare: true, sharePlatforms: ["facebook", "twitter", "linkedin", "copyLink"], showDate: true, showReadTime: true },
    body: { dropCap: true, showPullquotes: true, showKeyPoints: true, contentWidth: 760 },
    authorBox: { enabled: true },
    prevNext: defaultPrevNext(),
    relatedArticles: { enabled: true, title: "Related Articles", count: 4, columns: 4 },
    card: { imageRatio: "4/3", borderEnabled: true },
  }),
  "split-column": () => ({
    typography: { ...defaultArticleTypography(), titleSize: 28 },
    hero: { enabled: true, ratio: "4/5" },
    header: { showBreadcrumb: true, showCategoryTags: true, showShare: true, sharePlatforms: ["facebook", "twitter", "linkedin", "copyLink"], showDate: true, showReadTime: true },
    body: { dropCap: false, showPullquotes: true, showKeyPoints: true, contentWidth: 680 },
    authorBox: { enabled: true },
    prevNext: defaultPrevNext(),
    relatedArticles: { enabled: true, title: "Related Articles", count: 3, columns: 3 },
    card: { imageRatio: "4/3", borderEnabled: true },
  }),
};

export function createArticleBlock(templateId) {
  const factory = ARTICLE_TEMPLATE_DEFAULTS[templateId];
  if (!factory) throw new Error(`Unknown article template: ${templateId}`);
  return factory();
}
