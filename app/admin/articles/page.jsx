"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Plus, Edit2, Trash2, X, Save, AlertCircle, Search,
  Upload, Trash, Eye, FileText, Hash, Image, AlignLeft,
  Calendar, Clock, List, HelpCircle, Newspaper, ChevronUp, ChevronDown,
  ChevronLeft, ChevronRight,
} from "lucide-react";
import AdminShell from "@/components/layout/AdminShell";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import {
  getCategories, getArticles, saveArticle, deleteArticle, toBase64, uploadImage,
  preloadCategoriesAndArticles,
} from "@/lib/categoriesArticlesApi";
import { getAuthorByCategory } from "@/lib/authorsApi";

// ─── helpers ─────────────────────────────────────────────────────────────────

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function countWords(text) {
  if (!text) return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function isValidSlug(slug) {
  return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug);
}

function resolveImg(src) {
  return src || "";
}

// ─── small UI pieces ──────────────────────────────────────────────────────────

function ImageError({ message, onClose }) {
  if (!message) return null;
  return (
    <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-600 px-3 py-2.5 rounded-lg text-xs mt-2">
      <AlertCircle size={13} className="shrink-0 mt-0.5" />
      <span className="flex-1">{message}</span>
      <button type="button" onClick={onClose} className="shrink-0 hover:text-red-800 cursor-pointer"><X size={11} /></button>
    </div>
  );
}

function SectionHeader({ icon: Icon, title }) {
  return (
    <div className="flex items-center gap-2 pb-2 border-b border-border">
      {Icon && <Icon size={14} className="text-primary" />}
      <p className="text-[11px] font-bold uppercase tracking-widest text-primary">{title}</p>
    </div>
  );
}

function FormField({ label, required, error, hint, children }) {
  return (
    <div>
      <label className="block text-[12px] font-medium text-ink-700 mb-1.5">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-[11px] text-ink-400 mt-1">{hint}</p>}
      {error && <p className="text-[11px] text-red-500 mt-1">{error}</p>}
    </div>
  );
}

// ─── At a Glance block editor ─────────────────────────────────────────────────

function AtAGlanceEditor({ block, index, onUpdate }) {
  const inp = "w-full border border-border rounded-lg px-3 py-2 text-[12.5px] text-ink-900 bg-surface-soft focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-colors";

  function addRow() {
    onUpdate(index, "glanceRows", [...(block.glanceRows || []), { label: "", value: "" }]);
  }
  function updateRow(ri, field, val) {
    const rows = (block.glanceRows || []).map((r, i) => i === ri ? { ...r, [field]: val } : r);
    onUpdate(index, "glanceRows", rows);
  }
  function removeRow(ri) {
    onUpdate(index, "glanceRows", (block.glanceRows || []).filter((_, i) => i !== ri));
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] text-ink-500 mb-1">Section title</label>
          <input type="text" value={block.glanceTitle || "At a glance"}
            onChange={e => onUpdate(index, "glanceTitle", e.target.value)} className={inp} placeholder="At a glance" />
        </div>
        <div>
          <label className="block text-[11px] text-ink-500 mb-1">Subtitle (optional)</label>
          <input type="text" value={block.glanceSubtitle || ""}
            onChange={e => onUpdate(index, "glanceSubtitle", e.target.value)} className={inp} />
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-[11px] text-ink-500">Rows</label>
          <span className="text-[11px] text-ink-400">{(block.glanceRows || []).length} row(s)</span>
        </div>
        <div className="space-y-2">
          {(block.glanceRows || []).map((row, ri) => (
            <div key={ri} className="flex items-center gap-2">
              <input type="text" value={row.label}
                onChange={e => updateRow(ri, "label", e.target.value)}
                placeholder="Label" className={`flex-1 ${inp}`} />
              <input type="text" value={row.value}
                onChange={e => updateRow(ri, "value", e.target.value)}
                placeholder="Value" className={`flex-[2] ${inp}`} />
              <button type="button" onClick={() => removeRow(ri)}
                className="p-1.5 text-red-400 hover:bg-red-50 rounded cursor-pointer shrink-0"><Trash size={12} /></button>
            </div>
          ))}
        </div>
        <button type="button" onClick={addRow}
          className="mt-2 text-[11.5px] text-primary hover:underline cursor-pointer flex items-center gap-1">
          <Plus size={11} /> Add row
        </button>
      </div>
    </div>
  );
}

// ─── FAQ block editor ─────────────────────────────────────────────────────────

function FaqEditor({ block, index, onUpdate }) {
  const inp = "w-full border border-border rounded-lg px-3 py-2 text-[12.5px] text-ink-900 bg-surface-soft focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-colors";

  function addItem() {
    onUpdate(index, "faqItems", [...(block.faqItems || []), { question: "", answer: "" }]);
  }
  function updateItem(ii, field, val) {
    const items = (block.faqItems || []).map((item, i) => i === ii ? { ...item, [field]: val } : item);
    onUpdate(index, "faqItems", items);
  }
  function removeItem(ii) {
    onUpdate(index, "faqItems", (block.faqItems || []).filter((_, i) => i !== ii));
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-[11px] text-ink-500 mb-1">Section title</label>
        <input type="text" value={block.faqTitle || "Frequently asked questions"}
          onChange={e => onUpdate(index, "faqTitle", e.target.value)} className={inp} />
      </div>
      <div className="space-y-3">
        {(block.faqItems || []).map((item, ii) => (
          <div key={ii} className="border border-border rounded-xl p-3 space-y-2 bg-surface-soft">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-ink-500 font-medium">Q{ii + 1}</span>
              <button type="button" onClick={() => removeItem(ii)}
                className="p-1 text-red-400 hover:bg-red-50 rounded cursor-pointer"><Trash size={12} /></button>
            </div>
            <input type="text" value={item.question}
              onChange={e => updateItem(ii, "question", e.target.value)}
              placeholder="Question" className={inp} />
            <textarea value={item.answer}
              onChange={e => updateItem(ii, "answer", e.target.value)}
              placeholder="Answer" rows={2} className={inp} />
          </div>
        ))}
      </div>
      <button type="button" onClick={addItem}
        className="text-[11.5px] text-primary hover:underline cursor-pointer flex items-center gap-1">
        <Plus size={11} /> Add question
      </button>
    </div>
  );
}

// ─── Content block ────────────────────────────────────────────────────────────

const BLOCK_STYLES = {
  paragraph:    "bg-primary-50 text-primary-600 border-primary-200",
  subheading:   "bg-purple-50 text-purple-600 border-purple-200",
  pullquote:    "bg-green-50 text-green-600 border-green-200",
  image:        "bg-orange-50 text-orange-500 border-orange-200",
  at_a_glance:  "bg-yellow-50 text-yellow-600 border-yellow-200",
  faq:          "bg-pink-50 text-pink-600 border-pink-200",
};
const BLOCK_LABELS = {
  paragraph: "Paragraph", subheading: "Subheading", pullquote: "Pull Quote",
  image: "Image", at_a_glance: "At a Glance", faq: "FAQ",
};

function ContentBlock({ block, index, total, onUpdate, onRemove, onMove, onImagePick, onImageClear, errors }) {
  const inp = (hasErr) =>
    `w-full border rounded-lg px-3 py-2 text-[12.5px] text-ink-900 bg-surface-soft focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-colors ${
      hasErr ? "border-red-400 bg-red-50" : "border-border"
    }`;
  const blockErr = errors?.[index] || {};

  return (
    <div className="rounded-xl border border-border bg-white overflow-hidden shadow-soft">
      {/* header bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-surface-soft border-b border-border">
        <span className={`text-[10.5px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${BLOCK_STYLES[block.type] || "bg-gray-100 text-gray-500 border-gray-200"}`}>
          {BLOCK_LABELS[block.type] || block.type}
        </span>
        <div className="flex items-center gap-0.5">
          <button type="button" onClick={() => onMove(index, -1)} disabled={index === 0}
            className="w-6 h-6 flex items-center justify-center text-ink-400 hover:text-ink-700 disabled:opacity-20 cursor-pointer rounded">
            <ChevronUp size={14} />
          </button>
          <button type="button" onClick={() => onMove(index, 1)} disabled={index === total - 1}
            className="w-6 h-6 flex items-center justify-center text-ink-400 hover:text-ink-700 disabled:opacity-20 cursor-pointer rounded">
            <ChevronDown size={14} />
          </button>
          <button type="button" onClick={() => onRemove(index)}
            className="w-6 h-6 flex items-center justify-center text-red-400 hover:text-red-600 cursor-pointer rounded ml-1">
            <Trash size={13} />
          </button>
        </div>
      </div>

      {/* body */}
      <div className="p-3 space-y-2">
        {block.type === "paragraph" && (
          <>
            <textarea value={block.text}
              onChange={e => onUpdate(index, "text", e.target.value)}
              placeholder="Enter paragraph text…" rows={3}
              className={inp(!!blockErr.text)} />
            {blockErr.text && <p className="text-red-500 text-[11px]">{blockErr.text}</p>}
          </>
        )}

        {block.type === "subheading" && (
          <>
            <input type="text" value={block.text}
              onChange={e => onUpdate(index, "text", e.target.value)}
              placeholder="Enter subheading…" className={inp(!!blockErr.text)} />
            {blockErr.text && <p className="text-red-500 text-[11px]">{blockErr.text}</p>}
          </>
        )}

        {block.type === "pullquote" && (
          <>
            <textarea value={block.text}
              onChange={e => onUpdate(index, "text", e.target.value)}
              placeholder="Quote text…" rows={2}
              className={inp(!!blockErr.text)} />
            {blockErr.text && <p className="text-red-500 text-[11px]">{blockErr.text}</p>}
            <input type="text" value={block.attribution}
              onChange={e => onUpdate(index, "attribution", e.target.value)}
              placeholder="Attribution (optional)" className={inp(false)} />
          </>
        )}

        {block.type === "image" && (
          <div className="space-y-2">
            <p className="text-[11px] text-ink-400">Only .webp · Under 300 KB</p>
            <div className="flex items-center gap-3">
              <label className="flex-1 cursor-pointer">
                <div className={`border-2 border-dashed rounded-xl p-3 text-center transition-all bg-surface-soft hover:border-primary ${blockErr.src ? "border-red-400 bg-red-50" : "border-border"}`}>
                  <Upload className="mx-auto text-ink-400 mb-1" size={15} />
                  <span className="text-ink-400 text-[11px]">{block.imagePreview ? "Replace" : "Upload .webp"}</span>
                </div>
                <input type="file" accept=".webp,image/webp"
                  onChange={e => { if (e.target.files[0]) onImagePick(index, e.target.files[0]); e.target.value = ""; }}
                  className="hidden" />
              </label>
              {block.imagePreview && (
                <div className="relative shrink-0">
                  <img src={block.imagePreview} alt="preview" className="w-16 h-16 rounded-lg object-cover border border-border" />
                  <button type="button" onClick={() => onImageClear(index)}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-red-600">
                    <X size={9} />
                  </button>
                </div>
              )}
            </div>
            {blockErr.src && <p className="text-red-500 text-[11px]">{blockErr.src}</p>}
            <input type="text" value={block.alt}
              onChange={e => onUpdate(index, "alt", e.target.value)}
              placeholder="Alt text (SEO)" className={inp(false)} />
            <input type="text" value={block.caption}
              onChange={e => onUpdate(index, "caption", e.target.value)}
              placeholder="Caption (optional)" className={inp(false)} />
          </div>
        )}

        {block.type === "at_a_glance" && (
          <AtAGlanceEditor block={block} index={index} onUpdate={onUpdate} />
        )}

        {block.type === "faq" && (
          <FaqEditor block={block} index={index} onUpdate={onUpdate} />
        )}
      </div>
    </div>
  );
}

// ─── Block type buttons config ────────────────────────────────────────────────

const BLOCK_TYPES = [
  { type: "paragraph",   label: "Paragraph",   icon: AlignLeft,  cls: "bg-primary hover:bg-primary-700" },
  { type: "subheading",  label: "Subheading",  icon: FileText,   cls: "bg-purple-600 hover:bg-purple-700" },
  { type: "pullquote",   label: "Pull Quote",  icon: Hash,       cls: "bg-green-600 hover:bg-green-700" },
  { type: "image",       label: "Image",       icon: Image,      cls: "bg-orange-500 hover:bg-orange-600" },
  { type: "at_a_glance", label: "At a Glance", icon: List,       cls: "bg-yellow-500 hover:bg-yellow-600" },
  { type: "faq",         label: "FAQ",         icon: HelpCircle, cls: "bg-pink-600 hover:bg-pink-700" },
];

const BLOCK_DEFAULTS = {
  paragraph:   { type: "paragraph",   text: "" },
  subheading:  { type: "subheading",  text: "" },
  pullquote:   { type: "pullquote",   text: "", attribution: "" },
  image:       { type: "image",       src: "", imageFile: null, imagePreview: "", alt: "", caption: "" },
  at_a_glance: { type: "at_a_glance", glanceTitle: "At a glance", glanceSubtitle: "", glanceRows: [{ label: "", value: "" }] },
  faq:         { type: "faq",         faqTitle: "Frequently asked questions", faqItems: [{ question: "", answer: "" }] },
};

// ─── Empty form ───────────────────────────────────────────────────────────────

const EMPTY_FORM = {
  title: "", slug: "", metaTitle: "", metaDescription: "", excerpt: "",
  categoryId: "", authorId: "", author: "", newsType: "news", type: "normal",
  date: new Date().toISOString().split("T")[0],
  readTime: "", isPublished: true, imageAlt: "", keywords: "", tags: "",
};

// Resolves the author auto-assigned to a category (one primary author per
// beat, managed on the Authors admin page). Used to keep the article's
// (read-only) Author field always in sync with the chosen category.
function resolveAuthorForCategory(categoryId) {
  const author = getAuthorByCategory(categoryId);
  return { authorId: author?._id || "", author: author?.name || "" };
}

// ─── Pagination config ─────────────────────────────────────────────────────

const ARTICLES_PER_PAGE = 10;

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function ArticlesPage() {
  const [articles,       setArticles]       = useState([]);
  const [filtered,       setFiltered]       = useState([]);
  const [search,         setSearch]         = useState("");
  const [categories,     setCategories]     = useState([]);
  const [selectedCat,    setSelectedCat]    = useState("");
  const [loading,        setLoading]        = useState(true);

  // pagination
  const [currentPage,    setCurrentPage]    = useState(1);

  // modal
  const [showModal,      setShowModal]      = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [formData,       setFormData]       = useState(EMPTY_FORM);
  const [formErrors,     setFormErrors]     = useState({});
  const [saving,         setSaving]         = useState(false);

  // images
  const [mainImgPreview, setMainImgPreview] = useState("");
  const [mainImgBase64,  setMainImgBase64]  = useState("");
  const [mainImgFile,    setMainImgFile]    = useState(null);
  const [imageToast,     setImageToast]     = useState("");

  // content blocks
  const [contentBlocks,  setContentBlocks]  = useState([]);
  const [contentErrors,  setContentErrors]  = useState({});

  // confirm
  const [confirm, setConfirm] = useState({ open: false, id: null, title: "" });

  // ── load ──────────────────────────────────────────────────────────────────

  const loadAll = useCallback(async () => {
    setLoading(true);
    await preloadCategoriesAndArticles();
    setCategories(getCategories());
    const arts = getArticles(selectedCat);
    setArticles(arts);
    setLoading(false);
  }, [selectedCat]);

  useEffect(() => { loadAll(); }, [loadAll]);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      q
        ? articles.filter(
            (a) =>
              a.title?.toLowerCase().includes(q) ||
              a.excerpt?.toLowerCase().includes(q) ||
              a.slug?.toLowerCase().includes(q)
          )
        : articles
    );
  }, [search, articles]);

  // reset to page 1 whenever the visible article set changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedCat, articles]);

  // ── pagination derived values ────────────────────────────────────────────

  const totalPages = Math.max(1, Math.ceil(filtered.length / ARTICLES_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedArticles = filtered.slice(
    (safePage - 1) * ARTICLES_PER_PAGE,
    safePage * ARTICLES_PER_PAGE
  );

  function goToPage(p) {
    const clamped = Math.max(1, Math.min(totalPages, p));
    setCurrentPage(clamped);
    // scroll list into view on page change (nice on mobile)
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function getPageNumbers() {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
      .filter((p) => p === 1 || p === totalPages || Math.abs(p - safePage) <= 1)
      .reduce((acc, p, idx, arr) => {
        if (idx > 0 && p - arr[idx - 1] > 1) acc.push("…");
        acc.push(p);
        return acc;
      }, []);
  }

  // ── helpers ───────────────────────────────────────────────────────────────

  function set(patch) {
    setFormData((p) => ({ ...p, ...patch }));
    const keys = Object.keys(patch);
    if (keys.some((k) => formErrors[k]))
      setFormErrors((p) => {
        const n = { ...p };
        keys.forEach((k) => { n[k] = ""; });
        return n;
      });
  }

  const inpCls = (key) =>
    `w-full rounded-lg border px-3 py-2.5 text-[13px] text-ink-900 bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-colors ${
      formErrors[key] ? "border-red-400" : "border-border"
    }`;

  function getCategoryName(id) {
    return categories.find((c) => c._id === id)?.name || "—";
  }

  // ── main image ────────────────────────────────────────────────────────────

  async function handleMainImg(e) {
    const f = e.target.files[0];
    e.target.value = "";
    if (!f) return;
    if (f.type !== "image/webp") { setImageToast("Only .webp format is allowed."); return; }
    if (f.size > 300 * 1024) { setImageToast("Image must be under 300 KB."); return; }
    setImageToast("");
    const b64 = await toBase64(f);
    setMainImgBase64(b64);
    setMainImgPreview(b64);
    setMainImgFile(f);
    if (formErrors.mainImage) setFormErrors((p) => ({ ...p, mainImage: "" }));
  }

  // ── content blocks ────────────────────────────────────────────────────────

  function addBlock(type) {
    setContentBlocks((p) => [...p, { ...BLOCK_DEFAULTS[type] }]);
    if (formErrors.content) setFormErrors((p) => ({ ...p, content: "" }));
  }

  function updateBlock(i, key, val) {
    setContentBlocks((p) => p.map((b, idx) => idx === i ? { ...b, [key]: val } : b));
    if (contentErrors[i]?.[key])
      setContentErrors((p) => ({ ...p, [i]: { ...p[i], [key]: "" } }));
  }

  async function pickBlockImage(i, file) {
    if (file.type !== "image/webp") { setImageToast("Only .webp format is allowed."); return; }
    if (file.size > 300 * 1024) { setImageToast("Image must be under 300 KB."); return; }
    setImageToast("");
    const b64 = await toBase64(file);
    setContentBlocks((p) =>
      p.map((b, idx) =>
        idx === i ? { ...b, imageFile: file, imagePreview: b64, src: b64 } : b
      )
    );
    if (contentErrors[i]?.src)
      setContentErrors((p) => ({ ...p, [i]: { ...p[i], src: "" } }));
  }

  function clearBlockImage(i) {
    setContentBlocks((p) =>
      p.map((b, idx) =>
        idx === i ? { ...b, imageFile: null, imagePreview: "", src: "" } : b
      )
    );
  }

  function removeBlock(i) {
    setContentBlocks((p) => p.filter((_, idx) => idx !== i));
    setContentErrors((prev) => {
      const n = {};
      Object.keys(prev).forEach((k) => {
        const ki = parseInt(k);
        if (ki < i)       n[ki]     = prev[k];
        else if (ki > i)  n[ki - 1] = prev[k];
      });
      return n;
    });
  }

  function moveBlock(i, dir) {
    const to = i + dir;
    if (to < 0 || to >= contentBlocks.length) return;
    setContentBlocks((p) => {
      const arr = [...p];
      [arr[i], arr[to]] = [arr[to], arr[i]];
      return arr;
    });
  }

  // ── validate ──────────────────────────────────────────────────────────────

  function validateContentBlocks() {
    const errs = {};
    let hasValidParagraph = false;
    contentBlocks.forEach((b, idx) => {
      const be = {};
      if (b.type === "paragraph") {
        if (!b.text?.trim()) be.text = "Paragraph text is required.";
        else hasValidParagraph = true;
      }
      if (b.type === "subheading" && !b.text?.trim()) be.text = "Subheading text is required.";
      if (b.type === "pullquote" && !b.text?.trim())  be.text = "Quote text is required.";
      if (b.type === "image" && !b.src)               be.src  = "Image is required.";
      if (b.type === "at_a_glance" && !(b.glanceRows || []).some((r) => r.label?.trim() && r.value?.trim()))
        be.glanceRows = "Add at least one row with label and value.";
      if (b.type === "faq" && !(b.faqItems || []).some((f) => f.question?.trim() && f.answer?.trim()))
        be.faqItems = "Add at least one question and answer.";
      if (Object.keys(be).length) errs[idx] = be;
    });
    setContentErrors(errs);
    return { hasValidParagraph, hasErrors: Object.keys(errs).length > 0 };
  }

  function validate() {
    const { hasValidParagraph, hasErrors } = validateContentBlocks();
    const e = {};
    if (!formData.title.trim())                             e.title           = "Title is required.";
    if (!formData.slug.trim())                              e.slug            = "Slug is required.";
    else if (!isValidSlug(formData.slug))                   e.slug            = "Slug: only lowercase letters and hyphens.";
    if (!formData.categoryId)                               e.categoryId      = "Category is required.";
    if (!formData.excerpt.trim())                           e.excerpt         = "Excerpt is required.";
    else if (countWords(formData.excerpt) < 20)             e.excerpt         = `Excerpt needs at least 20 words (currently ${countWords(formData.excerpt)}).`;
    if (!formData.readTime.trim())                          e.readTime        = "Read time is required.";
    if (!formData.metaTitle.trim())                         e.metaTitle       = "Meta title is required.";
    if (!formData.metaDescription.trim())                   e.metaDescription = "Meta description is required.";
    if (!formData.imageAlt.trim())                          e.imageAlt        = "Image alt text is required.";
    if (!formData.keywords.trim())                          e.keywords        = "Keywords are required.";
    if (!formData.tags.trim())                              e.tags            = "Tags are required.";
    if (!editingArticle && !mainImgBase64)                  e.mainImage       = "Featured image is required.";
    if (contentBlocks.length === 0)                         e.content         = "Add at least one content block.";
    else if (!hasValidParagraph)                            e.content         = "At least one paragraph block with text is required.";
    if (hasErrors && !e.content)                            e.content         = "Fix errors in content blocks above.";
    setFormErrors(e);
    return Object.keys(e).length === 0 && !hasErrors;
  }

  // ── submit ────────────────────────────────────────────────────────────────

  async function handleSubmit(evt) {
    evt.preventDefault();
    if (!validate()) {
      setTimeout(() => {
        const el = document.querySelector("[data-first-error]");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 50);
      return;
    }
    setSaving(true);
    try {
      // Upload any newly-picked images to the backend (Cloudinary, WEBP,
      // compressed under 100KB) and swap the local base64 preview for the
      // real hosted URL before saving.
      let mainImageUrl = editingArticle?.mainImage ?? "";
      if (mainImgFile) {
        mainImageUrl = await uploadImage(mainImgFile);
      }

      const cleanContent = [];
      for (const block of contentBlocks) {
        if (block.type === "image" && block.imageFile) {
          const url = await uploadImage(block.imageFile);
          const { imageFile, imagePreview, ...rest } = block;
          cleanContent.push({ ...rest, src: url });
        } else {
          const { imageFile, imagePreview, ...rest } = block;
          cleanContent.push(rest);
        }
      }

      const payload = {
        ...formData,
        mainImage: mainImageUrl,
        content: cleanContent,
        keywords: formData.keywords.split(",").map((k) => k.trim()).filter(Boolean),
        tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean),
        ...(editingArticle ? { _id: editingArticle._id } : {}),
      };
      await saveArticle(payload);
      loadAll();
      closeModal();
    } catch {
      setFormErrors({ api: "Failed to save article. Please try again." });
    } finally {
      setSaving(false);
    }
  }

  // ── open/close modal ──────────────────────────────────────────────────────

  function openModal(article = null) {
    if (article) {
      setEditingArticle(article);
      setFormData({
        title:            article.title || "",
        slug:             article.slug || "",
        metaTitle:        article.metaTitle || "",
        metaDescription:  article.metaDescription || "",
        excerpt:          article.excerpt || "",
        categoryId:       article.categoryId || "",
        ...resolveAuthorForCategory(article.categoryId || ""),
        newsType:         article.newsType || "news",
        type:             article.type || "normal",
        // article.date comes back as a full ISO datetime string
        // (e.g. "2026-07-06T00:00:00.000Z"); <input type="date"> only
        // accepts "YYYY-MM-DD", so without this slice it silently renders
        // as an empty/missing field.
        date:             article.date ? String(article.date).split("T")[0] : new Date().toISOString().split("T")[0],
        readTime:         article.readTime || "",
        isPublished:      article.isPublished ?? true,
        imageAlt:         article.imageAlt || "",
        keywords:         (article.keywords || []).join(", "),
        tags:             (article.tags || []).join(", "),
      });
      setContentBlocks(
        (article.content || []).map((b) =>
          b.type === "image" ? { ...b, imageFile: null, imagePreview: b.src || "" } : { ...b }
        )
      );
      setMainImgPreview(article.mainImage || "");
      setMainImgBase64("");
      setMainImgFile(null);
    } else {
      setEditingArticle(null);
      setFormData(EMPTY_FORM);
      setContentBlocks([]);
      setMainImgPreview("");
      setMainImgBase64("");
      setMainImgFile(null);
    }
    setFormErrors({});
    setContentErrors({});
    setImageToast("");
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditingArticle(null);
    setFormData(EMPTY_FORM);
    setContentBlocks([]);
    setMainImgPreview("");
    setMainImgBase64("");
    setMainImgFile(null);
    setFormErrors({});
    setContentErrors({});
    setImageToast("");
    setSaving(false);
  }

  // ── filter ────────────────────────────────────────────────────────────────

  function filterCategory(catId) {
    setSelectedCat(catId);
    setSearch("");
    setLoading(true);
    const arts = getArticles(catId);
    setArticles(arts);
    setLoading(false);
  }

  // ─── render ────────────────────────────────────────────────────────────────

  return (
    <AdminShell title="Articles">
      <div className="p-4 lg:p-6 max-w-[1200px] mx-auto">

        <ConfirmDialog
          isOpen={confirm.open}
          title="Delete Article"
          message={`Delete "${confirm.title}"? This cannot be undone.`}
          onConfirm={async () => {
            await deleteArticle(confirm.id);
            setConfirm({ open: false, id: null, title: "" });
            loadAll();
          }}
          onCancel={() => setConfirm({ open: false, id: null, title: "" })}
          confirmText="Delete"
        />

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-ink-900">Articles</h1>
            <p className="text-ink-500 mt-1 text-sm">Manage your news articles</p>
          </div>
          <button
            onClick={() => openModal()}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all cursor-pointer font-medium text-sm w-full sm:w-auto"
          >
            <Plus size={17} /> Add Article
          </button>
        </div>

        {/* ── Category tabs ── */}
        {categories.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-2 mb-4 no-scrollbar">
            {[{ _id: "", name: "All" }, ...categories].map((c) => (
              <button
                key={c._id}
                onClick={() => filterCategory(c._id)}
                className={`px-3 py-1.5 rounded-lg text-[12.5px] whitespace-nowrap cursor-pointer transition-all font-medium ${
                  selectedCat === c._id
                    ? "bg-primary text-white"
                    : "bg-white border border-border text-ink-600 hover:bg-surface-soft"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        )}

        {/* ── Search ── */}
        <div className="relative mb-5">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" size={15} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search articles by title, excerpt, or slug…"
            className="w-full border border-border rounded-lg pl-9 pr-10 py-2.5 text-[13px] text-ink-900 bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-colors"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-700 cursor-pointer">
              <X size={13} />
            </button>
          )}
        </div>

        {search && (
          <p className="text-ink-400 text-[12px] mb-4">
            {filtered.length} result{filtered.length !== 1 ? "s" : ""} for "{search}"
          </p>
        )}

        {/* ── Article list ── */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-9 w-9 border-t-2 border-b-2 border-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-surface-soft rounded-2xl border border-border">
            {search ? (
              <p className="text-ink-400 text-sm">No articles match "{search}".</p>
            ) : (
              <div className="flex flex-col items-center">
                <div className="h-12 w-12 rounded-xl bg-primary-50 flex items-center justify-center text-primary mb-3">
                  <Newspaper size={22} />
                </div>
                <p className="text-ink-700 font-medium text-sm">No articles yet</p>
                <p className="text-ink-400 text-xs mt-1">Click "Add Article" to write your first one.</p>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {paginatedArticles.map((article) => (
                <ArticleRow
                  key={article._id}
                  article={article}
                  getCategoryName={getCategoryName}
                  onEdit={() => openModal(article)}
                  onDelete={() => setConfirm({ open: true, id: article._id, title: article.title })}
                />
              ))}
            </div>

            {/* ── Pagination controls ── */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1.5 mt-6">
                <button
                  onClick={() => goToPage(safePage - 1)}
                  disabled={safePage === 1}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-border text-ink-600 hover:bg-surface-soft disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all"
                  aria-label="Previous page"
                >
                  <ChevronLeft size={15} />
                </button>

                {getPageNumbers().map((p, i) =>
                  p === "…" ? (
                    <span key={`dots-${i}`} className="px-1.5 text-ink-400 text-[12.5px]">…</span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => goToPage(p)}
                      className={`w-8 h-8 rounded-lg text-[12.5px] font-medium cursor-pointer transition-all ${
                        p === safePage
                          ? "bg-primary text-white"
                          : "border border-border text-ink-600 hover:bg-surface-soft"
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}

                <button
                  onClick={() => goToPage(safePage + 1)}
                  disabled={safePage === totalPages}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-border text-ink-600 hover:bg-surface-soft disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all"
                  aria-label="Next page"
                >
                  <ChevronRight size={15} />
                </button>
              </div>
            )}
          </>
        )}

        {!loading && filtered.length > 0 && (
          <p className="text-[11.5px] text-ink-400 mt-5 text-center">
            Showing {(safePage - 1) * ARTICLES_PER_PAGE + 1}–
            {Math.min(safePage * ARTICLES_PER_PAGE, filtered.length)} of {filtered.length} article
            {filtered.length !== 1 ? "s" : ""}
            {selectedCat && ` in ${getCategoryName(selectedCat)}`}
          </p>
        )}
      </div>

      {/* ══════════════════════════ MODAL ══════════════════════════ */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 overflow-y-auto z-50 p-2 sm:p-4" style={{ backdropFilter: "blur(2px)" }}>
          <div className="max-w-4xl mx-auto my-4 sm:my-8">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">

              {/* sticky modal header */}
              <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-border bg-white sticky top-0 z-10">
                <div className="flex items-center gap-2.5">
                  <div className="h-7 w-7 rounded-lg bg-primary-50 flex items-center justify-center">
                    <Newspaper size={14} className="text-primary" />
                  </div>
                  <h2 className="text-[15px] font-bold text-ink-900">
                    {editingArticle ? "Edit Article" : "Add Article"}
                  </h2>
                </div>
                <button onClick={closeModal} className="text-ink-400 hover:text-ink-700 cursor-pointer p-1 rounded-lg hover:bg-surface-soft">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="px-5 sm:px-6 pb-0 pt-5 space-y-6">

                {formErrors.api && (
                  <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-600 px-3 py-2.5 rounded-lg text-[13px]" data-first-error>
                    <AlertCircle size={14} className="shrink-0 mt-0.5" /><span>{formErrors.api}</span>
                  </div>
                )}

                {/* ── Basic Info ── */}
                <div className="space-y-4">
                  <SectionHeader icon={FileText} title="Basic Information" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField label="Title" required error={formErrors.title}>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => {
                          const v = e.target.value;
                          set({ title: v, slug: slugify(v) });
                        }}
                        className={inpCls("title")}
                        placeholder="Article headline"
                        data-first-error={formErrors.title ? "" : undefined}
                      />
                    </FormField>
                    <FormField label="Slug" required error={formErrors.slug} hint="Only lowercase letters and hyphens">
                      <input type="text" value={formData.slug}
                        onChange={(e) => set({ slug: e.target.value })}
                        className={inpCls("slug")} placeholder="my-article-title" />
                    </FormField>
                    <FormField label="Category" required error={formErrors.categoryId}>
                      <select
                        value={formData.categoryId}
                        onChange={(e) => set({ categoryId: e.target.value, ...resolveAuthorForCategory(e.target.value) })}
                        className={inpCls("categoryId") + " cursor-pointer"}
                      >
                        <option value="">Select Category</option>
                        {categories.map((c) => (
                          <option key={c._id} value={c._id}>{c.name}</option>
                        ))}
                      </select>
                    </FormField>
                    <FormField label="Author" hint="Auto-assigned from the author linked to this category">
                      <div className="w-full rounded-lg border border-border bg-surface-soft px-3 py-2.5 text-[13px] text-ink-700 flex items-center gap-2 min-h-[42px]">
                        {formData.author ? (
                          <span className="font-medium text-ink-900">{formData.author}</span>
                        ) : (
                          <span className="text-ink-400 italic">
                            {formData.categoryId ? "No author assigned to this category yet" : "Select a category first"}
                          </span>
                        )}
                      </div>
                    </FormField>
                    <FormField label="News Type">
                      <select value={formData.newsType}
                        onChange={(e) => set({ newsType: e.target.value })}
                        className={inpCls("newsType") + " cursor-pointer"}>
                        <option value="news">News</option>
                        <option value="client news">Client News</option>
                        <option value="featured">Featured</option>
                        <option value="opinion">Opinion</option>
                      </select>
                    </FormField>
                    <FormField label="Article Type">
                      <select value={formData.type}
                        onChange={(e) => set({ type: e.target.value })}
                        className={inpCls("type") + " cursor-pointer"}>
                        <option value="normal">Normal</option>
                        <option value="featured">Featured</option>
                        <option value="breaking">Breaking</option>
                        <option value="exclusive">Exclusive</option>
                      </select>
                    </FormField>
                    <FormField label="Date">
                      <input type="date" value={formData.date}
                        onChange={(e) => set({ date: e.target.value })}
                        className={inpCls("date") + " cursor-pointer"} />
                    </FormField>
                    <FormField label="Read Time" required error={formErrors.readTime}>
                      <input type="text" value={formData.readTime}
                        onChange={(e) => set({ readTime: e.target.value })}
                        placeholder="e.g. 5 Min Read" className={inpCls("readTime")} />
                    </FormField>
                    <FormField label="Status">
                      <select value={String(formData.isPublished)}
                        onChange={(e) => set({ isPublished: e.target.value === "true" })}
                        className={inpCls("isPublished") + " cursor-pointer"}>
                        <option value="true">Published</option>
                        <option value="false">Draft</option>
                      </select>
                    </FormField>
                  </div>
                </div>

                {/* ── SEO ── */}
                <div className="space-y-4">
                  <SectionHeader icon={Hash} title="SEO" />
                  <FormField label="Meta Title" required error={formErrors.metaTitle}>
                    <input type="text" value={formData.metaTitle}
                      onChange={(e) => set({ metaTitle: e.target.value })}
                      className={inpCls("metaTitle")} />
                  </FormField>
                  <FormField label="Meta Description" required error={formErrors.metaDescription}>
                    <textarea value={formData.metaDescription}
                      onChange={(e) => set({ metaDescription: e.target.value })}
                      rows={2} className={inpCls("metaDescription")} />
                  </FormField>
                  <FormField label="Excerpt" required error={formErrors.excerpt}>
                    <textarea
                      value={formData.excerpt}
                      rows={3}
                      className={inpCls("excerpt")}
                      onChange={(e) => set({ excerpt: e.target.value })}
                      placeholder="Minimum 20 words required"
                    />
                    {formData.excerpt && (
                      <p className={`text-[11px] mt-1 ${countWords(formData.excerpt) >= 20 ? "text-green-600" : "text-yellow-600"}`}>
                        {countWords(formData.excerpt)} / 20 words minimum
                      </p>
                    )}
                  </FormField>
                </div>

                {/* ── Keywords & Tags ── */}
                <div className="space-y-4">
                  <SectionHeader icon={Hash} title="Keywords & Tags" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField label="Keywords (comma-separated)" required error={formErrors.keywords}>
                      <input type="text" value={formData.keywords}
                        onChange={(e) => set({ keywords: e.target.value })}
                        placeholder="keyword1, keyword2" className={inpCls("keywords")} />
                    </FormField>
                    <FormField label="Tags (comma-separated)" required error={formErrors.tags}>
                      <input type="text" value={formData.tags}
                        onChange={(e) => set({ tags: e.target.value })}
                        placeholder="tag1, tag2" className={inpCls("tags")} />
                    </FormField>
                  </div>
                </div>

                {/* ── Featured Image ── */}
                <div className="space-y-4">
                  <SectionHeader icon={Image} title="Featured Image" />
                  <p className="text-[11.5px] text-ink-400 -mt-2">Only .webp · Under 300 KB</p>
                  <div className="flex items-center gap-4">
                    <label className="flex-1 cursor-pointer group">
                      <div className={`border-2 border-dashed rounded-xl p-4 text-center transition-all bg-surface-soft group-hover:border-primary ${formErrors.mainImage ? "border-red-400 bg-red-50" : "border-border"}`}>
                        <Upload className="mx-auto text-ink-400 mb-2" size={20} />
                        <p className="text-ink-400 text-[12.5px]">Click to upload .webp image</p>
                      </div>
                      <input type="file" accept=".webp,image/webp" onChange={handleMainImg} className="hidden" />
                    </label>
                    {mainImgPreview && (
                      <div className="relative shrink-0">
                        <img src={mainImgPreview} alt="preview" className="w-24 h-24 rounded-xl object-cover border border-border" />
                        <button type="button"
                          onClick={() => { setMainImgBase64(""); setMainImgPreview(""); setMainImgFile(null); }}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-red-600">
                          <Trash size={11} />
                        </button>
                      </div>
                    )}
                  </div>
                  {formErrors.mainImage && <p className="text-[11px] text-red-500">{formErrors.mainImage}</p>}
                  <ImageError message={imageToast} onClose={() => setImageToast("")} />
                  <FormField label="Image Alt Text" required error={formErrors.imageAlt}>
                    <input type="text" value={formData.imageAlt}
                      onChange={(e) => set({ imageAlt: e.target.value })}
                      className={inpCls("imageAlt")} />
                  </FormField>
                </div>

                {/* ── Content Blocks ── */}
                <div className="space-y-4">
                  <SectionHeader icon={AlignLeft} title="Content" />
                  {formErrors.content && (
                    <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-500 px-3 py-2.5 rounded-lg text-[12.5px]">
                      <AlertCircle size={13} />{formErrors.content}
                    </div>
                  )}

                  <div className="space-y-3">
                    {contentBlocks.length === 0 ? (
                      <div className={`text-center py-10 border-2 border-dashed rounded-xl ${formErrors.content ? "border-red-300 bg-red-50" : "border-border bg-surface-soft"}`}>
                        <p className="text-ink-400 text-[13px]">No content blocks yet — use the buttons below to add content.</p>
                      </div>
                    ) : (
                      contentBlocks.map((block, i) => (
                        <ContentBlock
                          key={i} block={block} index={i} total={contentBlocks.length}
                          onUpdate={updateBlock} onRemove={removeBlock} onMove={moveBlock}
                          onImagePick={pickBlockImage} onImageClear={clearBlockImage}
                          errors={contentErrors}
                        />
                      ))
                    )}
                  </div>

                  {/* Block add buttons */}
                  <div className="flex gap-2 flex-wrap pt-1">
                    {BLOCK_TYPES.map(({ type, label, icon: Icon, cls }) => (
                      <button key={type} type="button" onClick={() => addBlock(type)}
                        className={`${cls} text-white px-3 py-1.5 rounded-lg text-[12px] font-medium cursor-pointer transition-all flex items-center gap-1.5`}>
                        <Icon size={12} />+ {label}
                      </button>
                    ))}
                  </div>

                  <ImageError message={imageToast} onClose={() => setImageToast("")} />
                </div>

                {/* ── Sticky footer ── */}
                <div className="sticky bottom-0 bg-white/95 backdrop-blur border-t border-border -mx-5 sm:-mx-6 px-5 sm:px-6 py-4 flex gap-3 rounded-b-2xl">
                  <button type="button" onClick={closeModal} disabled={saving}
                    className="flex-1 py-2.5 border border-border text-ink-600 rounded-lg hover:bg-surface-soft transition-all cursor-pointer text-[13px]">
                    Cancel
                  </button>
                  <button type="submit" disabled={saving}
                    className="flex-1 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all font-semibold disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 text-[13px]">
                    <Save size={14} />
                    {saving ? "Saving…" : editingArticle ? "Update Article" : "Save Article"}
                  </button>
                </div>

                {/* spacer so footer doesn't cover last field */}
                <div className="h-4" />
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}

// ─── Article row card ─────────────────────────────────────────────────────────

function ArticleRow({ article, getCategoryName, onEdit, onDelete }) {
  return (
    <div className="bg-white border border-border rounded-xl p-4 hover:border-primary/30 hover:shadow-sm transition-all">
      <div className="flex flex-col sm:flex-row gap-4">
        {article.mainImage && (
          <div className="sm:w-32 h-24 sm:h-20 rounded-lg overflow-hidden shrink-0">
            <img src={article.mainImage} alt={article.imageAlt || article.title}
              className="w-full h-full object-cover" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap gap-2 mb-1.5">
                <span className="text-[11px] px-2 py-0.5 bg-primary/10 text-primary rounded-full font-medium">
                  {getCategoryName(article.categoryId)}
                </span>
                <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                  article.isPublished ? "bg-green-100 text-green-700" : "bg-gray-100 text-ink-500"
                }`}>
                  {article.isPublished ? "Published" : "Draft"}
                </span>
                {article.type && article.type !== "normal" && (
                  <span className="text-[11px] px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full font-medium capitalize">
                    {article.type}
                  </span>
                )}
              </div>
              <h3 className="text-ink-900 text-[14px] font-semibold mb-1 line-clamp-2 leading-snug">{article.title}</h3>
              {article.excerpt && (
                <p className="text-ink-500 text-[12.5px] line-clamp-1 hidden sm:block">{article.excerpt}</p>
              )}
              <div className="flex flex-wrap gap-3 mt-1.5 text-ink-400 text-[11.5px]">
                {article.date && (
                  <span className="flex items-center gap-1">
                    <Calendar size={10} />{new Date(article.date).toLocaleDateString()}
                  </span>
                )}
                {article.readTime && (
                  <span className="flex items-center gap-1"><Clock size={10} />{article.readTime}</span>
                )}
              </div>
            </div>
            <div className="flex gap-1 shrink-0">
              <button onClick={onEdit}
                className="p-1.5 text-primary hover:bg-primary-50 rounded-lg transition-all cursor-pointer">
                <Edit2 size={15} />
              </button>
              <button onClick={onDelete}
                className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer">
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}