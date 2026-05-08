"use client";

import { useEffect, useState } from "react";
import type { Product, ProductCategory } from "@/lib/types";

const CATEGORIES: ProductCategory[] = ["top", "bottom", "dress", "outerwear"];
const SIZE_PRESETS = {
  standard: "XS, S, M, L, XL",
  numeric: "36, 38, 40, 42, 44",
};

interface AdminProduct extends Product {
  _static?: boolean;
}

const empty = {
  name: "",
  price: "",
  category: "top" as ProductCategory,
  colors: "",
  sizes: SIZE_PRESETS.standard,
  description: "",
  material: "",
  image1: "",
  image2: "",
};

export function AdminDashboard() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [tab, setTab] = useState<"list" | "add">("list");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/products");
    const data = await res.json();
    setProducts(data.products ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function fieldOf(p: AdminProduct) {
    return {
      name: p.name,
      price: String(p.price),
      category: p.category,
      colors: p.colors.join(", "),
      sizes: p.sizes.join(", "),
      description: p.description,
      material: p.material,
      image1: p.images[0] ?? "",
      image2: p.images[1] ?? "",
    };
  }

  function startEdit(p: AdminProduct) {
    setForm(fieldOf(p));
    setEditId(p.id);
    setTab("add");
    setError(null);
    setSuccess(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setForm(empty);
    setEditId(null);
    setError(null);
    setSuccess(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    const payload = {
      name: form.name,
      price: Number(form.price),
      category: form.category,
      colors: form.colors,
      sizes: form.sizes,
      description: form.description,
      material: form.material,
      images: [form.image1, form.image2].filter(Boolean),
    };

    const url = editId ? `/api/admin/products/${editId}` : "/api/admin/products";
    const method = editId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSaving(false);

    if (!res.ok) {
      const d = await res.json();
      setError(d.error ?? "Something went wrong.");
      return;
    }

    setSuccess(true);
    setForm(empty);
    setEditId(null);
    await load();
    setTimeout(() => { setTab("list"); setSuccess(false); }, 800);
  }

  async function handleDelete(id: string) {
    setDeleting(id);
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    setDeleting(null);
    await load();
  }

  async function handleLogout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    window.location.href = "/admin/login";
  }

  return (
    <div className="max-w-6xl mx-auto px-6 md:px-10 py-12">
      {/* Header */}
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-xs uppercase tracking-wider-2 text-ink/60 mb-2">Admin</p>
          <h1 className="font-display text-5xl tracking-wider-2">Product Dashboard</h1>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => { setTab("list"); cancelEdit(); }}
            className={`text-xs uppercase tracking-wider-2 px-5 py-2.5 border transition-colors ${
              tab === "list" ? "bg-ink text-sand border-ink" : "border-ink/30 text-ink/60 hover:border-ink"
            }`}
          >
            All Products ({products.length})
          </button>
          <button
            onClick={() => { setTab("add"); cancelEdit(); }}
            className={`text-xs uppercase tracking-wider-2 px-5 py-2.5 border transition-colors ${
              tab === "add" && !editId ? "bg-terracotta text-sand border-terracotta" : "border-ink/30 text-ink/60 hover:border-ink"
            }`}
          >
            + Add Product
          </button>
          <button
            onClick={handleLogout}
            className="text-xs uppercase tracking-wider-2 px-5 py-2.5 border border-ink/30 text-ink/60 hover:border-ink hover:text-ink transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* LIST TAB */}
      {tab === "list" && (
        <div>
          {loading ? (
            <p className="text-sm text-ink/50 py-12 text-center">Loading…</p>
          ) : (
            <ProductTable
              products={products}
              onEdit={startEdit}
              onDelete={handleDelete}
              deleting={deleting}
            />
          )}
        </div>
      )}

      {/* ADD / EDIT TAB */}
      {tab === "add" && (
        <form onSubmit={handleSubmit} className="max-w-2xl space-y-7">
          <p className="text-xs uppercase tracking-wider-2 text-ink/60 -mb-3">
            {editId ? `Editing: ${form.name}` : "New Product"}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Product name *">
              <input
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Linen Camisa"
                className={inputCls}
              />
            </Field>

            <Field label="Price (€) *">
              <input
                required
                type="number"
                min={1}
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                placeholder="120"
                className={inputCls}
              />
            </Field>
          </div>

          <Field label="Category *">
            <div className="flex gap-3 flex-wrap">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, category: c }))}
                  className={`text-xs uppercase tracking-wider-2 px-4 py-2 border transition-colors ${
                    form.category === c
                      ? "bg-ink text-sand border-ink"
                      : "border-ink/30 text-ink/60 hover:border-ink"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Colors (comma-separated) *">
              <input
                required
                value={form.colors}
                onChange={(e) => setForm((f) => ({ ...f, colors: e.target.value }))}
                placeholder="White, Sand, Navy"
                className={inputCls}
              />
            </Field>

            <Field label="Sizes (comma-separated) *">
              <div className="flex gap-2 mb-2">
                {Object.entries(SIZE_PRESETS).map(([k, v]) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, sizes: v }))}
                    className="text-[10px] uppercase tracking-wider-2 px-2 py-1 border border-ink/20 text-ink/50 hover:border-ink hover:text-ink transition-colors"
                  >
                    {k}
                  </button>
                ))}
              </div>
              <input
                required
                value={form.sizes}
                onChange={(e) => setForm((f) => ({ ...f, sizes: e.target.value }))}
                placeholder="XS, S, M, L, XL"
                className={inputCls}
              />
            </Field>
          </div>

          <Field label="Material *">
            <input
              required
              value={form.material}
              onChange={(e) => setForm((f) => ({ ...f, material: e.target.value }))}
              placeholder="100% European linen"
              className={inputCls}
            />
          </Field>

          <Field label="Description *">
            <textarea
              required
              rows={3}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="A featherweight linen shirt cut for the heat…"
              className={`${inputCls} resize-none`}
            />
          </Field>

          <Field label="Image 1 URL *">
            <input
              required
              type="url"
              value={form.image1}
              onChange={(e) => setForm((f) => ({ ...f, image1: e.target.value }))}
              placeholder="https://images.unsplash.com/photo-..."
              className={inputCls}
            />
            {form.image1 && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={form.image1} alt="" className="mt-2 w-24 h-32 object-cover bg-mist border border-mist" />
            )}
          </Field>

          <Field label="Image 2 URL (optional)">
            <input
              type="url"
              value={form.image2}
              onChange={(e) => setForm((f) => ({ ...f, image2: e.target.value }))}
              placeholder="https://images.unsplash.com/photo-..."
              className={inputCls}
            />
            {form.image2 && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={form.image2} alt="" className="mt-2 w-24 h-32 object-cover bg-mist border border-mist" />
            )}
          </Field>

          {error && (
            <div className="bg-terracotta/10 border border-terracotta px-4 py-3 text-sm text-ink">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-sea/10 border border-sea px-4 py-3 text-sm text-ink">
              {editId ? "Product updated!" : "Product added!"} Redirecting…
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center bg-terracotta text-sand uppercase tracking-wider-2 text-xs px-8 py-4 hover:brightness-95 transition disabled:opacity-40"
            >
              {saving ? "Saving…" : editId ? "Save Changes" : "Add Product"}
            </button>
            {editId && (
              <button
                type="button"
                onClick={() => { cancelEdit(); setTab("list"); }}
                className="inline-flex items-center justify-center border border-ink/30 text-ink/60 uppercase tracking-wider-2 text-xs px-8 py-4 hover:border-ink hover:text-ink transition"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
}

/* ── Sub-components ──────────────────────────────────────────────────── */

function ProductTable({
  products,
  onEdit,
  onDelete,
  deleting,
}: {
  products: AdminProduct[];
  onEdit: (p: AdminProduct) => void;
  onDelete: (id: string) => void;
  deleting: string | null;
}) {
  function confirmDelete(p: AdminProduct) {
    if (window.confirm(`Delete "${p.name}"? This cannot be undone.`)) {
      onDelete(p.id);
    }
  }

  if (products.length === 0) {
    return <p className="text-sm text-ink/40 py-10 text-center">No products yet.</p>;
  }

  return (
    <div className="border border-mist">
      {products.map((p) => (
        <div key={p.id} className="border-b border-mist last:border-0">
          {/* Top row: image + name + price + actions */}
          <div className="flex items-stretch">
            {/* Thumbnail */}
            <div className="flex-shrink-0 w-14">
              {p.images[0] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.images[0]} alt="" className="w-14 h-full min-h-[72px] object-cover bg-mist" />
              ) : (
                <div className="w-14 min-h-[72px] bg-mist border-r border-mist" />
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 px-3 py-2.5">
              <p className="font-medium text-sm leading-snug truncate">{p.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] uppercase tracking-wider-2 px-1.5 py-0.5 bg-mist border border-ink/10 text-ink/60 flex-shrink-0">
                  {p.category}
                </span>
                <span className="text-xs text-ink/50 tabular-nums flex-shrink-0">€{p.price}</span>
              </div>
            </div>

            {/* Actions — fixed width column, always on screen */}
            <div className="flex-shrink-0 flex flex-col justify-center gap-1.5 pr-3 pl-2 py-2">
              <button
                onClick={() => onEdit(p)}
                className="text-[10px] uppercase tracking-wider-2 px-2.5 py-1 border border-ink/30 text-ink/60 hover:border-ink hover:text-ink transition-colors whitespace-nowrap"
              >
                Edit
              </button>
              <button
                onClick={() => confirmDelete(p)}
                disabled={deleting === p.id}
                className="text-[10px] uppercase tracking-wider-2 px-2.5 py-1 border border-terracotta/30 text-terracotta/60 hover:border-terracotta hover:text-terracotta transition-colors disabled:opacity-40 whitespace-nowrap"
              >
                {deleting === p.id ? "…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-wider-2 text-ink/60 mb-2">{label}</label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full bg-transparent border border-ink/20 focus:border-ink px-3 py-2.5 text-sm outline-none transition-colors";
