"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Plus, Edit2, Trash2, X, Save, AlertCircle, Search,
  Upload, Trash, Eye, EyeOff, FolderTree, ChevronDown, ChevronUp,
} from "lucide-react";
import AdminShell from "@/components/layout/AdminShell";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import {
  getCategories, saveCategory, deleteCategory, toBase64, uploadImage,
  preloadCategoriesAndArticles,
} from "@/lib/categoriesArticlesApi";

// ─── helpers ────────────────────────────────────────────────────────────────

function slugify(str) {
  return str.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

function countWords(text) {
  if (!text) return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
}

// ─── sub-components ──────────────────────────────────────────────────────────

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

function FormSection({ title, children }) {
  return (
    <div className="space-y-3">
      <p className="text-[11px] font-bold uppercase tracking-widest text-primary border-b border-border pb-2">{title}</p>
      {children}
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

const EMPTY_FORM = {
  name: "", slug: "", description: "", position: 99,
  isVisible: true, showInTopNav: true,
  seoTitle: "", seoDescription: "", bannerImageAlt: "",
};

// ─── MAIN PAGE ───────────────────────────────────────────────────────────────

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [filtered,   setFiltered]   = useState([]);
  const [search,     setSearch]     = useState("");
  const [loading,    setLoading]    = useState(true);

  // modal state
  const [showModal, setShowModal]           = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData,  setFormData]            = useState(EMPTY_FORM);
  const [formErrors, setFormErrors]         = useState({});
  const [saving,    setSaving]              = useState(false);

  // image state
  const [bannerPreview, setBannerPreview]   = useState("");
  const [bannerBase64,  setBannerBase64]    = useState("");
  const [bannerFile,    setBannerFile]      = useState(null);
  const [imageError,    setImageError]      = useState("");

  // confirm delete
  const [confirm, setConfirm] = useState({ open: false, id: null, name: "" });

  // load
  const loadCategories = useCallback(async () => {
    setLoading(true);
    await preloadCategoriesAndArticles();
    const data = getCategories();
    setCategories(data);
    setFiltered(data);
    setLoading(false);
  }, []);

  useEffect(() => { loadCategories(); }, [loadCategories]);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      q
        ? categories.filter(
            (c) =>
              c.name.toLowerCase().includes(q) ||
              c.slug.toLowerCase().includes(q)
          )
        : categories
    );
  }, [search, categories]);

  // ── image handling ────────────────────────────────────────────────────────

  async function handleBannerImage(e) {
    const f = e.target.files[0];
    e.target.value = "";
    if (!f) return;
    if (f.type !== "image/webp") {
      setImageError("Only .webp format is allowed.");
      return;
    }
    if (f.size > 300 * 1024) {
      setImageError("Image must be under 300 KB.");
      return;
    }
    setImageError("");
    const b64 = await toBase64(f);
    setBannerBase64(b64);
    setBannerPreview(b64);
    setBannerFile(f);
    if (formErrors.bannerImage) setFormErrors((p) => ({ ...p, bannerImage: "" }));
  }

  function clearBanner() {
    setBannerBase64("");
    setBannerPreview("");
  }

  // ── form field helper ─────────────────────────────────────────────────────

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

  // ── validate ──────────────────────────────────────────────────────────────

  function validate() {
    const e = {};
    if (!formData.name.trim())            e.name            = "Category name is required.";
    if (!formData.slug.trim())            e.slug            = "Slug is required.";
    if (!formData.description.trim())     e.description     = "Description is required.";
    if (!formData.seoTitle.trim())        e.seoTitle        = "SEO title is required.";
    if (!formData.seoDescription.trim())  e.seoDescription  = "SEO description is required.";
    setFormErrors(e);
    return Object.keys(e).length === 0;
  }

  // ── submit ────────────────────────────────────────────────────────────────

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      let bannerImageUrl = editingCategory?.bannerImage ?? "";
      if (bannerFile) {
        bannerImageUrl = await uploadImage(bannerFile);
      }
      const payload = {
        ...formData,
        bannerImage: bannerImageUrl,
        ...(editingCategory ? { _id: editingCategory._id } : {}),
      };
      await saveCategory(payload);
      loadCategories();
      closeModal();
    } catch {
      setFormErrors({ api: "Failed to save category. Please try again." });
    } finally {
      setSaving(false);
    }
  }

  // ── open / close modal ────────────────────────────────────────────────────

  function openModal(category = null) {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name:            category.name,
        slug:            category.slug,
        description:     category.description || "",
        position:        category.position ?? 99,
        isVisible:       category.isVisible !== false,
        showInTopNav:    category.showInTopNav !== false,
        seoTitle:        category.seoTitle || "",
        seoDescription:  category.seoDescription || "",
        bannerImageAlt:  category.bannerImageAlt || "",
      });
      setBannerPreview(category.bannerImage || "");
      setBannerBase64("");
      setBannerFile(null);
    } else {
      setEditingCategory(null);
      setFormData(EMPTY_FORM);
      setBannerPreview("");
      setBannerBase64("");
      setBannerFile(null);
    }
    setFormErrors({});
    setImageError("");
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditingCategory(null);
    setFormData(EMPTY_FORM);
    setBannerPreview("");
    setBannerBase64("");
    setBannerFile(null);
    setFormErrors({});
    setImageError("");
  }

  // ── delete ────────────────────────────────────────────────────────────────

  async function handleDelete() {
    await deleteCategory(confirm.id);
    setConfirm({ open: false, id: null, name: "" });
    loadCategories();
  }

  // ─── field class helper ────────────────────────────────────────────────────

  const inpCls = (key) =>
    `w-full rounded-lg border px-3 py-2.5 text-[13px] text-ink-900 bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-colors ${
      formErrors[key] ? "border-red-400" : "border-border"
    }`;

  // ─── render ────────────────────────────────────────────────────────────────

  return (
    <AdminShell title="Categories">
      <div className="p-4 lg:p-6 max-w-[1100px] mx-auto">

        <ConfirmDialog
          isOpen={confirm.open}
          title="Delete Category"
          message={`Are you sure you want to delete "${confirm.name}"? All articles in this category will also be deleted.`}
          onConfirm={handleDelete}
          onCancel={() => setConfirm({ open: false, id: null, name: "" })}
          confirmText="Delete"
        />

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-ink-900">Categories</h1>
            <p className="text-ink-500 mt-1 text-sm">Manage categories, visibility, and SEO</p>
          </div>
          <button
            onClick={() => openModal()}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all cursor-pointer font-medium text-sm w-full sm:w-auto"
          >
            <Plus size={17} /> Add Category
          </button>
        </div>

        {/* ── Search ── */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" size={15} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search categories by name or slug…"
            className="w-full border border-border rounded-lg pl-9 pr-4 py-2.5 text-[13px] text-ink-900 bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-700 cursor-pointer"
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* ── Grid ── */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-9 w-9 border-t-2 border-b-2 border-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-surface-soft rounded-2xl border border-border">
            {search ? (
              <p className="text-ink-400 text-sm">No categories match "{search}".</p>
            ) : (
              <div className="flex flex-col items-center">
                <div className="h-12 w-12 rounded-xl bg-primary-50 flex items-center justify-center text-primary mb-3">
                  <FolderTree size={22} />
                </div>
                <p className="text-ink-700 font-medium text-sm">No categories yet</p>
                <p className="text-ink-400 text-xs mt-1">Click "Add Category" to create your first one.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((cat) => (
              <CategoryCard
                key={cat._id}
                category={cat}
                onEdit={() => openModal(cat)}
                onDelete={() => setConfirm({ open: true, id: cat._id, name: cat.name })}
              />
            ))}
          </div>
        )}

        {/* ── Summary strip ── */}
        {!loading && categories.length > 0 && (
          <p className="text-[11.5px] text-ink-400 mt-5 text-center">
            {categories.length} categor{categories.length !== 1 ? "ies" : "y"} total
            {search && ` · ${filtered.length} shown`}
          </p>
        )}
      </div>

      {/* ══════════════════════════ MODAL ══════════════════════════ */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 overflow-y-auto z-50 p-3 sm:p-4" style={{ backdropFilter: "blur(2px)" }}>
          <div className="max-w-2xl mx-auto my-6 sm:my-10">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">

              {/* sticky header */}
              <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-border bg-white sticky top-0 z-10">
                <div className="flex items-center gap-2.5">
                  <div className="h-7 w-7 rounded-lg bg-primary-50 flex items-center justify-center">
                    <FolderTree size={14} className="text-primary" />
                  </div>
                  <h2 className="text-[15px] font-bold text-ink-900">
                    {editingCategory ? "Edit Category" : "Add Category"}
                  </h2>
                </div>
                <button onClick={closeModal} className="text-ink-400 hover:text-ink-700 cursor-pointer p-1 rounded-lg hover:bg-surface-soft">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="px-5 sm:px-6 pb-6 pt-5 space-y-6">
                {formErrors.api && (
                  <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-600 px-3 py-2.5 rounded-lg text-[13px]">
                    <AlertCircle size={14} className="shrink-0 mt-0.5" />
                    <span>{formErrors.api}</span>
                  </div>
                )}

                {/* ── Basic Info ── */}
                <FormSection title="Basic Info">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField label="Category Name" required error={formErrors.name}>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => {
                          const name = e.target.value;
                          set({ name, slug: slugify(name) });
                        }}
                        className={inpCls("name")}
                        placeholder="e.g. Technology"
                      />
                    </FormField>
                    <FormField label="Slug" required error={formErrors.slug} hint="URL-safe, auto-generated from name">
                      <input
                        type="text"
                        value={formData.slug}
                        onChange={(e) => set({ slug: e.target.value })}
                        className={inpCls("slug")}
                        placeholder="e.g. technology"
                      />
                    </FormField>
                    <div className="sm:col-span-2">
                      <FormField label="Description" required error={formErrors.description}>
                        <textarea
                          value={formData.description}
                          onChange={(e) => set({ description: e.target.value })}
                          rows={2}
                          className={inpCls("description")}
                          placeholder="Short description of this category…"
                        />
                      </FormField>
                    </div>
                    <FormField label="Position (nav ordering)" hint="Lower = higher in nav. Must be unique.">
                      <input
                        type="number"
                        value={formData.position}
                        onChange={(e) => set({ position: parseInt(e.target.value) || 99 })}
                        className={inpCls("position")}
                        min={0}
                        placeholder="99"
                      />
                    </FormField>

                    {/* Visibility toggles */}
                    <div className="space-y-3 pt-1">
                      <p className="text-[12px] font-medium text-ink-700">Visibility</p>
                      <VisibilityToggle
                        checked={formData.isVisible}
                        onChange={(v) => set({ isVisible: v })}
                        labelOn="Visible on public site"
                        labelOff="Hidden from public site"
                        iconOn={<Eye size={13} className="text-green-500" />}
                        iconOff={<EyeOff size={13} className="text-red-400" />}
                      />
                      <VisibilityToggle
                        checked={formData.showInTopNav}
                        onChange={(v) => set({ showInTopNav: v })}
                        labelOn="Show in top navigation"
                        labelOff="Hidden from top navigation"
                      />
                    </div>
                  </div>
                </FormSection>

                {/* ── Banner Image ── */}
                <FormSection title="Banner Image">
                  <p className="text-[11.5px] text-ink-400 -mt-1">Only .webp · Under 300 KB · Stored locally · Optional</p>
                  <div className="flex items-center gap-4 mt-2">
                    <label className="flex-1 cursor-pointer group">
                      <div className={`border-2 border-dashed rounded-xl p-4 text-center transition-all bg-surface-soft group-hover:border-primary ${formErrors.bannerImage ? "border-red-400 bg-red-50" : "border-border"}`}>
                        <Upload className="mx-auto text-ink-400 mb-1" size={18} />
                        <span className="text-ink-400 text-[12px]">{bannerPreview ? "Replace image" : "Upload .webp banner"}</span>
                      </div>
                      <input type="file" accept=".webp,image/webp" onChange={handleBannerImage} className="hidden" />
                    </label>
                    {bannerPreview && (
                      <div className="relative shrink-0">
                        <img src={bannerPreview} alt="preview" className="w-24 h-16 rounded-xl object-cover border border-border" />
                        <button
                          type="button"
                          onClick={clearBanner}
                          className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-red-600"
                        >
                          <Trash size={9} />
                        </button>
                      </div>
                    )}
                  </div>
                  {formErrors.bannerImage && <p className="text-[11px] text-red-500 mt-1">{formErrors.bannerImage}</p>}
                  <ImageError message={imageError} onClose={() => setImageError("")} />

                  <div className="mt-3">
                    <FormField label="Banner Alt Text" error={formErrors.bannerImageAlt}>
                      <input
                        type="text"
                        value={formData.bannerImageAlt}
                        onChange={(e) => set({ bannerImageAlt: e.target.value })}
                        className={inpCls("bannerImageAlt")}
                        placeholder="Describe the banner image for accessibility"
                      />
                    </FormField>
                  </div>
                </FormSection>

                {/* ── SEO ── */}
                <FormSection title="SEO Settings">
                  <FormField label="SEO Title" required error={formErrors.seoTitle}>
                    <input
                      type="text"
                      value={formData.seoTitle}
                      onChange={(e) => set({ seoTitle: e.target.value })}
                      className={inpCls("seoTitle")}
                      placeholder="Custom page title for search engines"
                    />
                  </FormField>
                  <FormField label="SEO Description" required error={formErrors.seoDescription}>
                    <textarea
                      value={formData.seoDescription}
                      onChange={(e) => set({ seoDescription: e.target.value })}
                      rows={2}
                      className={inpCls("seoDescription")}
                      placeholder="Custom meta description for this category page"
                    />
                  </FormField>
                </FormSection>

                {/* ── Actions ── */}
                <div className="flex gap-3 pt-1">
                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={saving}
                    className="flex-1 py-2.5 border border-border text-ink-600 rounded-lg hover:bg-surface-soft transition-all cursor-pointer text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50 cursor-pointer font-semibold text-sm flex items-center justify-center gap-2"
                  >
                    <Save size={14} />
                    {saving ? "Saving…" : editingCategory ? "Update" : "Save Category"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}

// ─── Category Card ────────────────────────────────────────────────────────────

function CategoryCard({ category, onEdit, onDelete }) {
  return (
    <div className="bg-white border border-border rounded-2xl overflow-hidden hover:border-primary/30 hover:shadow-md transition-all duration-200">
      {category.bannerImage ? (
        <div className="h-28 overflow-hidden relative">
          <img
            src={category.bannerImage}
            alt={category.bannerImageAlt || category.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        </div>
      ) : (
        <div className="h-8 bg-gradient-to-r from-primary-50 to-primary/10" />
      )}
      <div className="p-4 sm:p-5">
        <div className="flex justify-between items-start mb-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="text-ink-900 text-[15px] font-bold truncate">{category.name}</h3>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${
                category.isVisible !== false
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-600"
              }`}>
                {category.isVisible !== false ? "Visible" : "Hidden"}
              </span>
            </div>
            <p className="text-ink-400 text-[12px] truncate">/{category.slug}</p>
            {category.description && (
              <p className="text-ink-500 text-[12px] mt-1.5 line-clamp-2 leading-snug">{category.description}</p>
            )}
          </div>
          <div className="flex gap-1 ml-2 shrink-0">
            <button
              onClick={onEdit}
              className="p-1.5 text-primary hover:bg-primary-50 rounded-lg transition-all cursor-pointer"
            >
              <Edit2 size={15} />
            </button>
            <button
              onClick={onDelete}
              className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 pt-3 border-t border-border mt-2">
          <span className="text-ink-400 text-[11px]">Position: {category.position ?? 99}</span>
          {category.showInTopNav !== false && (
            <span className="text-primary text-[11px] font-medium">· In Nav</span>
          )}
          {category.seoTitle && (
            <span className="text-primary-500 text-[11px]">· Has SEO</span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── VisibilityToggle ─────────────────────────────────────────────────────────

function VisibilityToggle({ checked, onChange, labelOn, labelOff, iconOn, iconOff }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${checked ? "bg-primary" : "bg-ink-300"}`}
      >
        <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${checked ? "translate-x-[18px]" : "translate-x-[2px]"}`} />
      </button>
      <span className="flex items-center gap-1.5 text-[12.5px] text-ink-600">
        {checked ? iconOn : iconOff}
        {checked ? labelOn : labelOff}
      </span>
    </label>
  );
}
