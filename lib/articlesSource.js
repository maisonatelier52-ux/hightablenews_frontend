// lib/articlesSource.js
// Bridges the real Articles data (created on the Articles page) into the
// Homepage Builder so templates/blocks can show real, live news instead of
// placeholder copy — always ordered with the newest article first.

import { getArticles, getCategories } from "./categoriesArticlesApi";
import { getAuthors } from "./authorsApi";

const CATEGORY_COLOR_PALETTE = [
  "#7c3aed", "#059669", "#d97706", "#dc2626",
  "#2563eb", "#0891b2", "#db2777", "#65a30d",
];

function colorForCategory(name) {
  const key = String(name || "general");
  let hash = 0;
  for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  return CATEGORY_COLOR_PALETTE[hash % CATEGORY_COLOR_PALETTE.length];
}

function timestampOf(article) {
  // Prefer the editorial "date" field set on the Articles page, fall back to
  // createdAt/updatedAt so articles without an explicit date still sort sanely.
  const raw = article.date || article.createdAt || article.updatedAt;
  const t = raw ? new Date(raw).getTime() : 0;
  return Number.isFinite(t) ? t : 0;
}

function relativeDate(article) {
  const raw = article.date || article.createdAt;
  if (!raw) return "";
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return "";
  const diffMs = Date.now() - d.getTime();
  const diffH = Math.round(diffMs / 36e5);
  if (diffH < 1) return "Just now";
  if (diffH < 24) return `${diffH}h ago`;
  const diffD = Math.round(diffH / 24);
  if (diffD < 7) return `${diffD}d ago`;
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

/** Map a raw article record (from categoriesArticlesApi) into the shape the
 *  preview/render components expect (id, category, categoryColor, title,
 *  excerpt, date, img, slug). */
export function toPreviewArticle(article, categoriesById, authorsById, categorySlugsById) {
  const categoryName =
    (categoriesById && categoriesById[article.categoryId]) ||
    article.categoryName ||
    "News";
  const linkedAuthor = authorsById && article.authorId ? authorsById[article.authorId] : null;
  return {
    id: article._id,
    slug: article.slug || "",
    categoryId: article.categoryId || "",
    categorySlug: (categorySlugsById && categorySlugsById[article.categoryId]) || "",
    category: String(categoryName).toUpperCase(),
    categoryColor: colorForCategory(categoryName),
    title: article.title || "Untitled article",
    excerpt: article.excerpt || "",
    authorId: article.authorId || "",
    author: linkedAuthor?.name || article.author || "",
    authorSlug: linkedAuthor?.slug || "",
    authorImage: linkedAuthor?.profileImage || "",
    authorRole: linkedAuthor?.role || "",
    readTime: article.readTime || "",
    date: relativeDate(article),
    img: article.mainImage || null,
    newsType: article.newsType || "news",
    views: Number(article.views) || 0,
    featured: false,
    _raw: article,
  };
}

/** All published articles, newest first, already mapped for preview/render use. */
export function getAllPreviewArticlesSorted() {
  if (typeof window === "undefined") return [];
  const categories = getCategories();
  const categoriesById = Object.fromEntries(categories.map((c) => [c._id, c.name || c.title]));
  const categorySlugsById = Object.fromEntries(categories.map((c) => [c._id, c.slug || ""]));
  const authorsById = Object.fromEntries(getAuthors().map((a) => [a._id, a]));
  const articles = getArticles().filter((a) => a.isPublished !== false);
  const sorted = [...articles].sort((a, b) => timestampOf(b) - timestampOf(a));
  return sorted.map((a) => toPreviewArticle(a, categoriesById, authorsById, categorySlugsById));
}

// ─── URL helpers ────────────────────────────────────────────────────────────
// Centralized so every card/template across the site links to the same real
// public URLs instead of "#" placeholders. Returns null when there isn't
// enough data yet (e.g. sample/placeholder content with no real slug) so
// callers can render plain, non-clickable content instead of a dead link.

/** Public URL for an article, e.g. /business/my-article-slug. Falls back to
 *  a generic "news" category segment if the article's category has no slug
 *  yet, since the [category]/[slug] route only ever matches on the article
 *  slug itself. */
export function articleHref(article) {
  if (!article || !article.slug) return null;
  const cat = article.categorySlug || "news";
  return `/${cat}/${article.slug}`;
}

/** Public URL for a category page, e.g. /technology. */
export function categoryHref(category) {
  if (!category) return null;
  const slug = typeof category === "string" ? category : category.slug;
  if (!slug) return null;
  return `/${slug}`;
}

/** Public URL for an author page, e.g. /author/jane-doe. */
export function authorHref(author) {
  if (!author) return null;
  const slug = typeof author === "string" ? author : author.slug;
  if (!slug) return null;
  return `/author/${slug}`;
}

/** Search published articles by title (case-insensitive, substring match). */
export function searchArticlesByTitle(query) {
  const all = getAllPreviewArticlesSorted();
  const q = (query || "").trim().toLowerCase();
  if (!q) return all;
  return all.filter((a) => a.title.toLowerCase().includes(q));
}

export function getPreviewArticleById(id) {
  return getAllPreviewArticlesSorted().find((a) => a.id === id) || null;
}

/**
 * Resolve the list of articles a block/section should display.
 *
 * data[idsKey] is a *per-card, position-aligned* array of article ids:
 *   data[idsKey][i] = "<articleId>"  -> that card is pinned to that article
 *   data[idsKey][i] = null/undefined -> that card auto-fills with the next
 *                                       latest unused article
 *
 * This means a template can be 100% automatic by default (empty/short array
 * -> every card auto-fills with the newest articles first), while letting an
 * admin pin an individual card to a specific article via the "+" picker on
 * that card, without disturbing the other (still-automatic) cards. Pinned
 * articles are always removed from the auto-fill pool first, so the same
 * article can never appear twice in one block.
 *
 * Falls back to the provided sampleFallback array when no real articles exist
 * yet (e.g. brand-new site with nothing published), so previews never look broken.
 */
export function resolveArticlesForBlock(data, count, { idsKey = "articleIds", sampleFallback = [], excludeIds = [], usageCounts = null } = {}) {
  const real = getAllPreviewArticlesSorted();
  if (real.length === 0) return sampleFallback.slice(0, count);

  const byId = Object.fromEntries(real.map((a) => [a.id, a]));
  const pins = Array.isArray(data?.[idsKey]) ? data[idsKey] : [];
  const pinnedIds = new Set(pins.filter(Boolean));
  // Ids already shown elsewhere on the page (e.g. by an earlier section in
  // the same template) — excluded from the PRIMARY auto-fill pool only; an
  // article explicitly pinned to this exact card always wins regardless.
  const externallyUsed = new Set(excludeIds.filter(Boolean));

  // Primary pool: articles not shown anywhere else on the page yet.
  const autoPool = real.filter((a) => !pinnedIds.has(a.id) && !externallyUsed.has(a.id));
  let poolCursor = 0;

  // Reuse pool: every real article not pinned *in this block*. Only reached
  // once the primary (unused) pool runs dry, so a section on a site with
  // few articles still shows something instead of an empty slot. Picks
  // favor whichever article has been shown the fewest times so far
  // (tracked globally via `usageCounts`), so if the page has to repeat a
  // story it spreads that repetition across many articles instead of the
  // same one or two stories showing up everywhere.
  const reusePool = real.filter((a) => !pinnedIds.has(a.id));
  const counts = usageCounts || new Map();
  const chosenHere = new Set();

  const result = [];
  for (let i = 0; i < count; i++) {
    const pinnedArticle = pins[i] ? byId[pins[i]] : null;
    if (pinnedArticle) {
      result.push(pinnedArticle);
      chosenHere.add(pinnedArticle.id);
      continue;
    }
    if (autoPool[poolCursor]) {
      const a = autoPool[poolCursor];
      poolCursor += 1;
      result.push(a);
      chosenHere.add(a.id);
      continue;
    }
    const reused = pickLeastShown(reusePool, counts, chosenHere);
    if (reused) {
      result.push(reused);
      chosenHere.add(reused.id);
    }
  }
  return result.filter(Boolean);
}

/**
 * Returns a state patch that pins `articleId` to card index `index` inside a
 * block's per-card id array (`idsKey`), padded out to `count` slots. The same
 * article is automatically un-pinned from any other slot first, so a single
 * article can never be pinned to two cards in the same block at once.
 */
export function pinArticleAtIndex(data, idsKey, index, articleId, count) {
  const current = Array.isArray(data?.[idsKey]) ? [...data[idsKey]] : [];
  while (current.length < count) current.push(null);
  for (let i = 0; i < current.length; i++) {
    if (i !== index && current[i] === articleId) current[i] = null;
  }
  current[index] = articleId;
  return { [idsKey]: current };
}

/** Clears a single card's pin, returning that card to auto (latest-first) mode. */
export function clearArticlePin(data, idsKey, index, count) {
  const current = Array.isArray(data?.[idsKey]) ? [...data[idsKey]] : [];
  while (current.length < count) current.push(null);
  current[index] = null;
  return { [idsKey]: current };
}

/**
 * Resolve a single article (e.g. for a Hero Story block). When nothing is
 * explicitly pinned, the newest article tagged newsType === "client news"
 * always wins the slot (client news must always lead); if there isn't one,
 * falls back to the newest article overall.
 */
export function resolveSingleArticle(data, { idKey = "articleId", sampleFallback = null, excludeIds = [], usageCounts = null } = {}) {
  const real = getAllPreviewArticlesSorted();
  if (real.length === 0) return sampleFallback;
  if (data?.[idKey]) {
    const found = real.find((a) => a.id === data[idKey]);
    if (found) return found;
  }
  const exclude = new Set(excludeIds.filter(Boolean));
  const available = real.filter((a) => !exclude.has(a.id));
  const clientNews = available.find((a) => a.newsType === "client news");
  if (clientNews) return clientNews;
  if (available[0]) return available[0];
  // Nothing left unused — reuse whichever article has been shown the
  // fewest times so far rather than leaving this slot empty.
  const counts = usageCounts || new Map();
  return pickLeastShown(real, counts, new Set()) || real[0] || null;
}

/**
 * Looks up a real category by display name (case-insensitive, exact match
 * first, then "starts with"/"contains" as a loose fallback) so a homepage
 * section labeled e.g. "ECONOMY" can be matched against whatever categories
 * the admin actually created (which may be named/cased differently).
 */
export function findCategoryByName(name) {
  if (typeof window === "undefined" || !name) return null;
  const target = String(name).trim().toLowerCase();
  const categories = getCategories();
  const exact = categories.find((c) => String(c.name || c.title || "").trim().toLowerCase() === target);
  if (exact) return exact;
  return (
    categories.find((c) => {
      const n = String(c.name || c.title || "").trim().toLowerCase();
      return n && (n.startsWith(target) || target.startsWith(n) || n.includes(target) || target.includes(n));
    }) || null
  );
}

/**
 * Resolves the articles for a *category-labeled* homepage section (e.g. the
 * "ECONOMY" / "CULTURE" / "BUSINESS" blocks on the Newspaper Editorial
 * template). Only real articles that actually belong to the matching
 * category (by category id, not just the label string) are ever returned,
 * newest first — never topped up with articles from other categories. If
 * that category doesn't have enough published articles yet, fewer cards
 * are returned rather than mixing in unrelated categories.
 *
 * `idsKey` still supports per-card pinning exactly like `resolveArticlesForBlock`.
 */
export function resolveArticlesByCategoryName(categoryName, count, { data = {}, idsKey = "articleIds", excludeIds = [], sampleFallback = [], categoryId = null, usageCounts = null } = {}) {
  const real = getAllPreviewArticlesSorted();
  if (real.length === 0) return sampleFallback.slice(0, count);

  const byId = Object.fromEntries(real.map((a) => [a.id, a]));
  const pins = Array.isArray(data?.[idsKey]) ? data[idsKey] : [];
  const pinnedIds = new Set(pins.filter(Boolean));
  const externallyUsed = new Set(excludeIds.filter(Boolean));
  const notPinned = (a) => !pinnedIds.has(a.id);

  // Prefer matching by the real category's stable _id when the caller has
  // it (see NewspaperEditorial's per-category toggles); falls back to the
  // old loose name match for legacy sections that only stored a label.
  const resolvedCategoryId = categoryId || findCategoryByName(categoryName)?._id || null;
  // Strictly this category's own articles only — a category section (e.g.
  // "Technology") must never be topped up with articles from unrelated
  // categories (e.g. Media, Companies) just because it's short on its own.
  const inCategory = resolvedCategoryId ? real.filter((a) => a.categoryId === resolvedCategoryId) : [];

  const pool = inCategory.filter((a) => notPinned(a) && !externallyUsed.has(a.id));
  let poolCursor = 0;

  // Reuse pool: still this category only. Reached once the category's
  // unused articles run dry, so the section shows repeats of its own
  // category's stories (favoring whichever has been shown fewest times)
  // rather than sitting empty or borrowing from another category.
  const reusePool = inCategory.filter(notPinned);
  const counts = usageCounts || new Map();
  const chosenHere = new Set();

  const result = [];
  for (let i = 0; i < count; i++) {
    const pinnedArticle = pins[i] ? byId[pins[i]] : null;
    if (pinnedArticle) {
      result.push(pinnedArticle);
      chosenHere.add(pinnedArticle.id);
      continue;
    }
    if (pool[poolCursor]) {
      const a = pool[poolCursor];
      poolCursor += 1;
      result.push(a);
      chosenHere.add(a.id);
      continue;
    }
    const reused = pickLeastShown(reusePool, counts, chosenHere);
    if (reused) {
      result.push(reused);
      chosenHere.add(reused.id);
    }
  }
  return result.filter(Boolean);
}

/**
 * Resolves a "trending" list of real articles ranked by view count (most
 * viewed first), falling back to newest-first for articles with equal (e.g.
 * zero) views. Used for widgets like "Most Commented"/"Trending" where the
 * Article model has no comment-count field but does track `views`.
 */
export function resolveTrendingArticles(count, { excludeIds = [], sampleFallback = [], usageCounts = null } = {}) {
  const real = getAllPreviewArticlesSorted(); // already newest-first
  if (real.length === 0) return sampleFallback.slice(0, count);
  const exclude = new Set(excludeIds.filter(Boolean));
  const available = real.filter((a) => !exclude.has(a.id));
  const ranked = [...available].sort((a, b) => (b.views || 0) - (a.views || 0));
  if (ranked.length >= count) return ranked.slice(0, count);
  // Not enough unused articles to fill the widget — top up with whichever
  // remaining articles (ranked by views) have been shown the fewest times
  // elsewhere on the page, so it never sits emptier than it needs to.
  const counts = usageCounts || new Map();
  const chosenHere = new Set(ranked.map((a) => a.id));
  const byViews = [...real].sort((a, b) => (b.views || 0) - (a.views || 0));
  const result = [...ranked];
  while (result.length < count) {
    const reused = pickLeastShown(byViews, counts, chosenHere);
    if (!reused) break;
    result.push(reused);
    chosenHere.add(reused.id);
  }
  return result;
}

/**
 * Small helper for renderers that show many sections on one page: tracks how
 * many times each article id has already been placed by earlier sections so
 * later `resolveArticlesForBlock`/`resolveSingleArticle`/etc. calls can (a)
 * exclude them from the "unused" pool so the page stays as varied as
 * possible, and (b) when the site doesn't have enough unique articles to
 * fill every slot, fall back to *reusing* the article(s) shown the fewest
 * times so far — spreading repeats across many stories instead of the same
 * one or two articles reappearing in every widget.
 */
export function createArticleUsageTracker() {
  const counts = new Map();
  return {
    exclude: () => Array.from(counts.keys()),
    counts: () => counts,
    track(articleOrArticles) {
      const list = Array.isArray(articleOrArticles) ? articleOrArticles : [articleOrArticles];
      list.forEach((a) => a && a.id != null && counts.set(a.id, (counts.get(a.id) || 0) + 1));
      return articleOrArticles;
    },
  };
}

/**
 * From `pool` (newest-first), pick the article shown the fewest times
 * according to `usageCounts`, skipping anything already in `chosenIds`
 * (so one resolve call never picks the very same article for two of its
 * own slots). Ties go to whichever is newest (pool order). Returns null
 * if `pool` has nothing left to give.
 */
function pickLeastShown(pool, usageCounts, chosenIds) {
  let best = null;
  let bestCount = Infinity;
  for (const a of pool) {
    if (chosenIds.has(a.id)) continue;
    const c = usageCounts.get(a.id) || 0;
    if (c < bestCount) {
      bestCount = c;
      best = a;
      if (c === 0) break; // can't do better than "never shown"
    }
  }
  return best;
}

// ─── Category-page helpers ─────────────────────────────────────────────────

/** All published articles belonging to one category (by category _id), newest first. */
export function getArticlesForCategory(categoryId) {
  if (!categoryId) return [];
  return getAllPreviewArticlesSorted().filter((a) => a.categoryId === categoryId);
}

/**
 * Resolve the hero/lead article for a category page.
 *
 * Rule: any article in this category tagged newsType === "client news" must
 * always win the hero slot — newest client-news article first. If none
 * exists, falls back to the newest article in the category overall (any
 * type), then to the sample fallback so previews never look empty before
 * any articles exist.
 */
export function resolveCategoryHero(categoryId, { sampleFallback = null } = {}) {
  const inCategory = getArticlesForCategory(categoryId);
  if (inCategory.length === 0) return sampleFallback;
  const clientNews = inCategory.find((a) => a.newsType === "client news");
  return clientNews || inCategory[0];
}

/**
 * Resolve a list of articles for a category-page block (grid/list/etc).
 * Excludes whichever article id is currently used as the hero so the same
 * story never appears twice on the page, then fills with the newest
 * remaining articles in that category.
 */
export function resolveCategoryArticles(categoryId, count, { excludeIds = [], sampleFallback = [] } = {}) {
  const inCategory = getArticlesForCategory(categoryId);
  if (inCategory.length === 0) return sampleFallback.slice(0, count);
  const exclude = new Set(excludeIds.filter(Boolean));
  return inCategory.filter((a) => !exclude.has(a.id)).slice(0, count);
}

// ─── Author-page helpers ────────────────────────────────────────────────────

/** All published articles written by one author (matched by authorId, with a
 *  legacy fallback to matching on the author's name string), newest first. */
export function getArticlesForAuthor(author) {
  if (!author) return [];
  const all = getAllPreviewArticlesSorted();
  return all.filter(
    (a) => (author._id && a.authorId === author._id) || (a.author && author.name && a.author === author.name)
  );
}

/** Resolve N most-recent examples used to populate a live preview: N-1
 *  distinct published articles, newest first, falling back to sample
 *  content when nothing (or not enough) exists yet. */
export function resolveAuthorArticles(author, count, { excludeIds = [], sampleFallback = [] } = {}) {
  const byAuthor = getArticlesForAuthor(author);
  if (byAuthor.length === 0) return sampleFallback.slice(0, count);
  const exclude = new Set(excludeIds.filter(Boolean));
  return byAuthor.filter((a) => !exclude.has(a.id)).slice(0, count);
}

// ─── Article-detail-page helpers ────────────────────────────────────────────

/** Full published article by id, including raw content blocks (`_raw.content`)
 *  needed to render the article body — same shape as everywhere else
 *  (toPreviewArticle) so builder/preview components share one data path. */
export function getFullArticleById(id) {
  return getAllPreviewArticlesSorted().find((a) => a.id === id) || null;
}

/** Articles in the same category as `article`, excluding itself and any ids
 *  already used elsewhere on the page, newest first. */
export function getRelatedArticles(article, count, { excludeIds = [] } = {}) {
  if (!article) return [];
  const exclude = new Set([article.id, ...excludeIds].filter(Boolean));
  const all = getAllPreviewArticlesSorted();
  const sameCategory = all.filter((a) => a.categoryId === article.categoryId && !exclude.has(a.id));
  if (sameCategory.length >= count) return sameCategory.slice(0, count);
  // Not enough in the same category — top up with the newest other articles.
  const rest = all.filter((a) => !exclude.has(a.id) && !sameCategory.some((s) => s.id === a.id));
  return [...sameCategory, ...rest].slice(0, count);
}

/** The previous/next article WITHIN THE SAME CATEGORY as `article` (by
 *  editorial date, newest first) — used for "Previous / Next article"
 *  navigation cards. If the current article is the newest in its category
 *  there is no "previous"; if it's the oldest there is no "next". Articles
 *  from other categories are never mixed in, and either side is simply
 *  omitted (not padded with a fallback) when it doesn't exist. */
export function getPrevNextArticle(article) {
  if (!article) return { previous: null, next: null };
  const all = getAllPreviewArticlesSorted(); // newest first
  const sameCategory = all.filter((a) => a.categoryId && a.categoryId === article.categoryId);
  const idx = sameCategory.findIndex((a) => a.id === article.id);
  if (idx === -1) return { previous: null, next: null };
  // "Next" chronologically = older = later in this newest-first array.
  return { previous: sameCategory[idx - 1] || null, next: sameCategory[idx + 1] || null };
}
