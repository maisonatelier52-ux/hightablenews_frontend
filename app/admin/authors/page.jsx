"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Plus, Edit2, Trash2, X, Save, AlertCircle, Search,
  Upload, Trash, UserRound, Link as LinkIcon, Twitter, Instagram, Linkedin,
  Facebook, Youtube, Globe, Mail,
} from "lucide-react";
import AdminShell from "@/components/layout/AdminShell";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { getCategories, preloadCategoriesAndArticles } from "@/lib/categoriesArticlesApi";
import {
  getAuthors, saveAuthor, deleteAuthor, toBase64, uploadImage, preloadAuthors,
  generateSlug, isValidSlug, SOCIAL_PLATFORMS, EMPTY_AUTHOR,
} from "@/lib/authorsApi";

const SOCIAL_ICONS = { twitter: Twitter, instagram: Instagram, linkedin: Linkedin, facebook: Facebook, youtube: Youtube, reddit: Globe, substack: Globe, medium: Globe, threads: Globe, website: Globe, email: Mail };

// ─── small shared bits ──────────────────────────────────────────────────────

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

// ─── MAIN PAGE ───────────────────────────────────────────────────────────────

export default function AuthorsPage() {
  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState(null);
  const [formData, setFormData] = useState(EMPTY_AUTHOR);
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  const [imagePreview, setImagePreview] = useState("");
  const [imageBase64, setImageBase64] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imageError, setImageError] = useState("");
  const [topicInput, setTopicInput] = useState("");

  const [confirm, setConfirm] = useState({ open: false, id: null, name: "" });

  const load = useCallback(async () => {
    setLoading(true);
    await Promise.all([preloadAuthors(), preloadCategoriesAndArticles()]);
    setAuthors(getAuthors());
    setCategories(getCategories());
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      q
        ? authors.filter(
            (a) =>
              a.name.toLowerCase().includes(q) ||
              a.location?.toLowerCase().includes(q) ||
              categoryName(a.categoryId).toLowerCase().includes(q)
          )
        : authors
    );
  }, [search, authors]); // eslint-disable-line react-hooks/exhaustive-deps

  function categoryName(id) {
    return categories.find((c) => c._id === id)?.name || "";
  }

  // ── image ─────────────────────────────────────────────────────────────────

  async function handleImageChange(e) {
    const f = e.target.files[0];
    e.target.value = "";
    if (!f) return;
    if (f.type !== "image/webp") { setImageError("Only .webp format is allowed."); return; }
    if (f.size > 200 * 1024) { setImageError("Image must be under 200 KB."); return; }
    setImageError("");
    const b64 = await toBase64(f);
    setImageBase64(b64);
    setImagePreview(b64);
    setImageFile(f);
  }
  function clearImage() { setImageBase64(""); setImagePreview(""); setImageFile(null); }

  // ── field helpers ───────────────────────────────────────────────────────

  function set(patch) {
    setFormData((p) => ({ ...p, ...patch }));
    Object.keys(patch).forEach((k) => {
      if (formErrors[k]) setFormErrors((p) => ({ ...p, [k]: "" }));
    });
  }

  function handleNameChange(value) {
    const patch = { name: value };
    if (!slugManuallyEdited) patch.slug = generateSlug(value);
    set(patch);
  }

  function handleSlugChange(value) {
    setSlugManuallyEdited(true);
    set({ slug: value.toLowerCase().replace(/[^a-z-]/g, "") });
  }

  function addTopic() {
    const v = topicInput.trim();
    if (!v || formData.topics.includes(v)) return;
    set({ topics: [...formData.topics, v] });
    setTopicInput("");
  }
  function removeTopic(t) { set({ topics: formData.topics.filter((x) => x !== t) }); }

  function addSocial() {
    set({ social: [...formData.social, { id: `soc_${Date.now()}`, platform: "twitter", url: "" }] });
  }
  function updateSocial(id, patch) {
    set({ social: formData.social.map((s) => (s.id === id ? { ...s, ...patch } : s)) });
  }
  function removeSocial(id) { set({ social: formData.social.filter((s) => s.id !== id) }); }

  // ── validate ─────────────────────────────────────────────────────────────

  function validate() {
    const e = {};
    if (!formData.name.trim()) e.name = "Name is required.";
    if (!formData.slug.trim()) e.slug = "Slug is required.";
    else if (!isValidSlug(formData.slug)) e.slug = "Only lowercase letters and hyphens allowed (e.g. \"john-doe\").";
    if (!formData.categoryId) e.categoryId = "Category is required.";
    if (!formData.role.trim()) e.role = "Role / title is required.";
    if (!formData.location.trim()) e.location = "Location is required.";
    if (!formData.bio.trim()) e.bio = "Short bio is required.";
    if (!formData.email.trim()) e.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = "Invalid email address.";
    formData.social.forEach((s) => {
      if (s.url && s.platform !== "email" && !/^https?:\/\/.+/.test(s.url)) e[`social_${s.id}`] = "Must start with http:// or https://";
    });
    setFormErrors(e);
    return Object.keys(e).length === 0;
  }

  // ── submit ───────────────────────────────────────────────────────────────

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      let profileImageUrl = editingAuthor?.profileImage ?? "";
      if (imageFile) {
        profileImageUrl = await uploadImage(imageFile);
      }
      const payload = {
        ...formData,
        profileImage: profileImageUrl,
        ...(editingAuthor ? { _id: editingAuthor._id } : {}),
      };
      await saveAuthor(payload);
      load();
      closeModal();
    } catch {
      setFormErrors({ api: "Failed to save author. Please try again." });
    } finally {
      setSaving(false);
    }
  }

  function openModal(author = null) {
    if (author) {
      setEditingAuthor(author);
      setFormData({ ...EMPTY_AUTHOR, ...author, social: author.social || [], topics: author.topics || [] });
      setImagePreview(author.profileImage || "");
      setImageBase64("");
      setImageFile(null);
      setSlugManuallyEdited(true);
    } else {
      setEditingAuthor(null);
      setFormData(EMPTY_AUTHOR);
      setImagePreview("");
      setImageBase64("");
      setImageFile(null);
      setSlugManuallyEdited(false);
    }
    setFormErrors({});
    setImageError("");
    setTopicInput("");
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditingAuthor(null);
    setFormData(EMPTY_AUTHOR);
    setImagePreview("");
    setImageBase64("");
    setImageFile(null);
    setFormErrors({});
    setImageError("");
  }

  async function handleDelete() {
    await deleteAuthor(confirm.id);
    setConfirm({ open: false, id: null, name: "" });
    load();
  }

  const inpCls = (key) =>
    `w-full rounded-lg border px-3 py-2.5 text-[13px] text-ink-900 bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-colors ${
      formErrors[key] ? "border-red-400" : "border-border"
    }`;

  return (
    <AdminShell title="Authors">
      <div className="p-4 lg:p-6 max-w-[1200px] mx-auto">
        <ConfirmDialog
          isOpen={confirm.open}
          title="Delete Author"
          message={`Delete "${confirm.name}"? This cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setConfirm({ open: false, id: null, name: "" })}
          confirmText="Delete"
        />

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-ink-900">Authors</h1>
            <p className="text-ink-500 mt-1 text-sm">Manage journalists, correspondents and contributors</p>
          </div>
          <button
            onClick={() => openModal()}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all cursor-pointer font-medium text-sm w-full sm:w-auto"
          >
            <Plus size={17} /> Add Author
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" size={15} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search authors by name, location, or category…"
            className="w-full border border-border rounded-lg pl-9 pr-4 py-2.5 text-[13px] text-ink-900 bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-colors"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-700 cursor-pointer">
              <X size={13} />
            </button>
          )}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-9 w-9 border-t-2 border-b-2 border-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-surface-soft rounded-2xl border border-border">
            {search ? (
              <p className="text-ink-400 text-sm">No authors match "{search}".</p>
            ) : (
              <div className="flex flex-col items-center">
                <div className="h-12 w-12 rounded-xl bg-primary-50 flex items-center justify-center text-primary mb-3">
                  <UserRound size={22} />
                </div>
                <p className="text-ink-700 font-medium text-sm">No authors yet</p>
                <p className="text-ink-400 text-xs mt-1">Click "Add Author" to create your first one.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((author) => (
              <AuthorCard
                key={author._id}
                author={author}
                categoryLabel={categoryName(author.categoryId)}
                onEdit={() => openModal(author)}
                onDelete={() => setConfirm({ open: true, id: author._id, name: author.name })}
              />
            ))}
          </div>
        )}

        {!loading && authors.length > 0 && (
          <p className="text-[11.5px] text-ink-400 mt-5 text-center">
            {authors.length} author{authors.length !== 1 ? "s" : ""} total{search && ` · ${filtered.length} shown`}
          </p>
        )}
      </div>

      {/* ══════════════════════════ MODAL ══════════════════════════ */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 overflow-y-auto z-50 p-3 sm:p-4" style={{ backdropFilter: "blur(2px)" }}>
          <div className="max-w-2xl mx-auto my-6 sm:my-10">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-border bg-white sticky top-0 z-10">
                <div className="flex items-center gap-2.5">
                  <div className="h-7 w-7 rounded-lg bg-primary-50 flex items-center justify-center">
                    <UserRound size={14} className="text-primary" />
                  </div>
                  <h2 className="text-[15px] font-bold text-ink-900">{editingAuthor ? "Edit Author" : "Add Author"}</h2>
                </div>
                <button onClick={closeModal} className="text-ink-400 hover:text-ink-700 cursor-pointer p-1 rounded-lg hover:bg-surface-soft">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="px-5 sm:px-6 pb-6 pt-5 space-y-6">
                {formErrors.api && (
                  <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-600 px-3 py-2.5 rounded-lg text-[13px]">
                    <AlertCircle size={14} className="shrink-0 mt-0.5" /><span>{formErrors.api}</span>
                  </div>
                )}

                {/* ── Basic Info ── */}
                <FormSection title="Basic Info">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField label="Name" required error={formErrors.name}>
                      <input type="text" value={formData.name} onChange={(e) => handleNameChange(e.target.value)} className={inpCls("name")} placeholder="Full name" />
                    </FormField>
                    <FormField label="Slug" required error={formErrors.slug} hint={formData.slug ? `/authors/${formData.slug}` : "Auto-generated from name"}>
                      <div className="relative">
                        <LinkIcon size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
                        <input type="text" value={formData.slug} onChange={(e) => handleSlugChange(e.target.value)} className={`${inpCls("slug")} pl-8`} placeholder="john-doe" />
                      </div>
                    </FormField>
                    <FormField label="Gender">
                      <select value={formData.gender} onChange={(e) => set({ gender: e.target.value })} className={inpCls("gender") + " cursor-pointer"}>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </FormField>
                    <FormField label="Location" required error={formErrors.location}>
                      <input type="text" value={formData.location} onChange={(e) => set({ location: e.target.value })} className={inpCls("location")} placeholder="e.g. Geneva, Switzerland" />
                    </FormField>
                    <FormField label="Email" required error={formErrors.email}>
                      <input type="email" value={formData.email} onChange={(e) => set({ email: e.target.value })} className={inpCls("email")} placeholder="author@example.com" />
                    </FormField>
                    <FormField label="Category" required error={formErrors.categoryId} hint="Articles in this category auto-fill this author">
                      <select value={formData.categoryId} onChange={(e) => set({ categoryId: e.target.value })} className={inpCls("categoryId") + " cursor-pointer"}>
                        <option value="">Select Category</option>
                        {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                      </select>
                    </FormField>
                    <div className="sm:col-span-2">
                      <FormField label="Role / Title" required error={formErrors.role}>
                        <input type="text" value={formData.role} onChange={(e) => set({ role: e.target.value })} className={inpCls("role")} placeholder="e.g. Chief Foreign Correspondent" />
                      </FormField>
                    </div>
                  </div>
                </FormSection>

                {/* ── Bio & About ── */}
                <FormSection title="Bio &amp; About">
                  <FormField label="Short Bio" required error={formErrors.bio} hint="2–3 lines, shown near the profile photo">
                    <textarea value={formData.bio} onChange={(e) => set({ bio: e.target.value })} rows={3} className={inpCls("bio")} placeholder="Short author biography…" />
                  </FormField>
                  <FormField label="About (long form)" hint="Shown in the About section on the profile page">
                    <textarea value={formData.aboutText} onChange={(e) => set({ aboutText: e.target.value })} rows={2} className={inpCls("aboutText")} placeholder="Longer bio for the About section…" />
                  </FormField>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField label="Specialization"><input type="text" value={formData.specialization} onChange={(e) => set({ specialization: e.target.value })} className={inpCls("specialization")} placeholder="Diplomacy, Global Economy…" /></FormField>
                    <FormField label="Education"><input type="text" value={formData.education} onChange={(e) => set({ education: e.target.value })} className={inpCls("education")} placeholder="Columbia University — MA…" /></FormField>
                    <FormField label="Experience"><input type="text" value={formData.experience} onChange={(e) => set({ experience: e.target.value })} className={inpCls("experience")} placeholder="18+ Years in Journalism" /></FormField>
                    <FormField label="Languages"><input type="text" value={formData.languages} onChange={(e) => set({ languages: e.target.value })} className={inpCls("languages")} placeholder="English, French, German" /></FormField>
                    <div className="sm:col-span-2">
                      <FormField label="Awards / Recognition"><input type="text" value={formData.awards} onChange={(e) => set({ awards: e.target.value })} className={inpCls("awards")} placeholder="Multiple Awards & Recognitions" /></FormField>
                    </div>
                  </div>
                </FormSection>

                {/* ── Topics ── */}
                <FormSection title="Topics Covered">
                  <div className="flex gap-2">
                    <input
                      type="text" value={topicInput} onChange={(e) => setTopicInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTopic(); } }}
                      placeholder="Add a topic and press Enter" className={inpCls("topicInput")}
                    />
                    <button type="button" onClick={addTopic} className="px-3 rounded-lg border border-border text-ink-600 hover:bg-surface-soft text-[12.5px] font-medium shrink-0">Add</button>
                  </div>
                  {formData.topics.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {formData.topics.map((t) => (
                        <span key={t} className="inline-flex items-center gap-1 text-[11.5px] bg-surface-soft border border-border rounded-full px-2.5 py-1 text-ink-700">
                          {t}
                          <button type="button" onClick={() => removeTopic(t)} className="text-ink-400 hover:text-red-500 cursor-pointer"><X size={11} /></button>
                        </span>
                      ))}
                    </div>
                  )}
                </FormSection>

                {/* ── Profile Image ── */}
                <FormSection title="Profile Image">
                  <p className="text-[11.5px] text-ink-400 -mt-1">Only .webp · Under 200 KB · Stored locally</p>
                  <div className="flex items-center gap-4 mt-2">
                    <label className="flex-1 cursor-pointer group">
                      <div className="border-2 border-dashed rounded-xl p-4 text-center transition-all bg-surface-soft group-hover:border-primary border-border">
                        <Upload className="mx-auto text-ink-400 mb-1" size={18} />
                        <span className="text-ink-400 text-[12px]">{imagePreview ? "Replace image" : "Upload .webp photo"}</span>
                      </div>
                      <input type="file" accept=".webp,image/webp" onChange={handleImageChange} className="hidden" />
                    </label>
                    {imagePreview && (
                      <div className="relative shrink-0">
                        <img src={imagePreview} alt="preview" className="w-16 h-16 rounded-full object-cover border border-border" />
                        <button type="button" onClick={clearImage} className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-red-600">
                          <Trash size={9} />
                        </button>
                      </div>
                    )}
                  </div>
                  <ImageError message={imageError} onClose={() => setImageError("")} />
                </FormSection>

                {/* ── Social Links ── */}
                <FormSection title="Social Links">
                  <div className="space-y-3">
                    {formData.social.map((s) => {
                      const Icon = SOCIAL_ICONS[s.platform] || Globe;
                      return (
                        <div key={s.id}>
                          <div className="flex items-center gap-2">
                            <Icon size={15} className="text-ink-400 shrink-0" />
                            <select
                              value={s.platform}
                              onChange={(e) => updateSocial(s.id, { platform: e.target.value })}
                              className="rounded-lg border border-border bg-surface-soft px-2 py-2 text-[12.5px] text-ink-700 focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer shrink-0"
                            >
                              {SOCIAL_PLATFORMS.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
                            </select>
                            <input
                              type="text" value={s.url} onChange={(e) => updateSocial(s.id, { url: e.target.value })}
                              placeholder={s.platform === "email" ? "author@example.com" : "https://…"}
                              className={`flex-1 bg-white border rounded-lg px-3 py-2 text-[12.5px] text-ink-900 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors ${formErrors[`social_${s.id}`] ? "border-red-400" : "border-border"}`}
                            />
                            <button type="button" onClick={() => removeSocial(s.id)} className="shrink-0 text-ink-300 hover:text-red-500 cursor-pointer"><Trash2 size={14} /></button>
                          </div>
                          {formErrors[`social_${s.id}`] && <p className="text-[11px] text-red-500 mt-1 ml-6">{formErrors[`social_${s.id}`]}</p>}
                        </div>
                      );
                    })}
                  </div>
                  <button type="button" onClick={addSocial} className="w-full flex items-center justify-center gap-1.5 text-[12px] font-medium text-primary border border-dashed border-primary/30 rounded-lg py-2 hover:bg-primary-50 transition-colors">
                    <Plus size={13} /> Add social link
                  </button>
                </FormSection>

                {/* ── Actions ── */}
                <div className="flex gap-3 pt-1">
                  <button type="button" onClick={closeModal} disabled={saving} className="flex-1 py-2.5 border border-border text-ink-600 rounded-lg hover:bg-surface-soft transition-all cursor-pointer text-sm">
                    Cancel
                  </button>
                  <button type="submit" disabled={saving} className="flex-1 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50 cursor-pointer font-semibold text-sm flex items-center justify-center gap-2">
                    <Save size={14} />
                    {saving ? "Saving…" : editingAuthor ? "Update" : "Save Author"}
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

// ─── Author Card ─────────────────────────────────────────────────────────────

function AuthorCard({ author, categoryLabel, onEdit, onDelete }) {
  return (
    <div className="bg-white border border-border rounded-2xl p-4 sm:p-5 hover:border-primary/30 hover:shadow-md transition-all duration-200">
      <div className="flex items-start gap-3 mb-3">
        {author.profileImage ? (
          <img src={author.profileImage} alt={author.name} className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover shrink-0" />
        ) : (
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary-50 flex items-center justify-center shrink-0">
            <UserRound className="text-primary" size={20} />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-ink-900 text-[15px] font-bold truncate">{author.name}</h3>
          <p className="text-primary text-[11.5px] font-medium mt-0.5 truncate">{author.role}</p>
          {categoryLabel && <p className="text-ink-400 text-[11px] mt-0.5">{categoryLabel}</p>}
        </div>
        <div className="flex gap-1 shrink-0">
          <button onClick={onEdit} className="p-1.5 text-primary hover:bg-primary-50 rounded-lg cursor-pointer"><Edit2 size={15} /></button>
          <button onClick={onDelete} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"><Trash2 size={15} /></button>
        </div>
      </div>
      <p className="text-ink-500 text-[12px] line-clamp-2 mb-3">{author.bio}</p>
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <span className="text-ink-400 text-[11px]">{author.location}</span>
        {author.social?.length > 0 && (
          <div className="flex gap-1.5">
            {author.social.slice(0, 4).map((s) => {
              const Icon = SOCIAL_ICONS[s.platform] || Globe;
              return <Icon key={s.id} size={12} className="text-ink-400" />;
            })}
          </div>
        )}
      </div>
    </div>
  );
}
