"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params as { id: string };
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    brand: "",
    imageUrl: "",
    stock: "",
    specifications: "", // Add specifications field
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) throw new Error("Produto não encontrado");
        const data = await res.json();
        setForm({
          name: data.name || "",
          description: data.description || "",
          price: data.price?.toString() || "",
          category: data.category || "",
          brand: data.brand || "",
          imageUrl: data.imageUrl || "",
          stock: data.stock?.toString() || "",
          specifications: typeof data.specifications === "string" ? data.specifications : JSON.stringify(data.specifications || ""),
        });
      } catch (err) {
        setError("Produto não encontrado.");
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: parseFloat(form.price),
          stock: parseInt(form.stock, 10),
          specifications: (() => {
            try {
              return JSON.parse(form.specifications);
            } catch {
              return form.specifications;
            }
          })(),
        }),
      });
      if (!res.ok) throw new Error("Erro ao atualizar produto");
      router.push("/admin/products");
    } catch (err) {
      setError("Erro ao atualizar produto. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-8">Carregando...</div>;
  if (error) return <div className="text-center text-red-600 py-8">{error}</div>;

  return (
    <div className="max-w-xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Editar Produto</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" value={form.name} onChange={handleChange} placeholder="Nome" className="w-full border px-3 py-2 rounded" required />
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Descrição" className="w-full border px-3 py-2 rounded" required />
        <input name="price" value={form.price} onChange={handleChange} placeholder="Preço" type="number" step="0.01" className="w-full border px-3 py-2 rounded" required />
        <input name="category" value={form.category} onChange={handleChange} placeholder="Categoria" className="w-full border px-3 py-2 rounded" required />
        <input name="brand" value={form.brand} onChange={handleChange} placeholder="Marca" className="w-full border px-3 py-2 rounded" required />
        <input name="imageUrl" value={form.imageUrl} onChange={handleChange} placeholder="URL da Imagem (opcional)" className="w-full border px-3 py-2 rounded" />
        <input name="stock" value={form.stock} onChange={handleChange} placeholder="Estoque" type="number" className="w-full border px-3 py-2 rounded" required />
        <textarea name="specifications" value={form.specifications} onChange={handleChange} placeholder="Especificações (JSON ou texto)" className="w-full border px-3 py-2 rounded" required />
        {error && <div className="text-red-600">{error}</div>}
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={saving}>
          {saving ? "Salvando..." : "Salvar"}
        </button>
      </form>
    </div>
  );
}
