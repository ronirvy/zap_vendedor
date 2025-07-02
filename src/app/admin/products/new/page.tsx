"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewProductPage() {
  const router = useRouter();
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: parseFloat(form.price),
          stock: parseInt(form.stock, 10),
        }),
      });
      if (!res.ok) throw new Error("Failed to create product");
      router.push("/admin/products");
    } catch (err) {
      setError("Erro ao criar produto. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Adicionar Novo Produto</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" value={form.name} onChange={handleChange} placeholder="Nome" className="w-full border px-3 py-2 rounded" required />
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Descrição" className="w-full border px-3 py-2 rounded" required />
        <input name="price" value={form.price} onChange={handleChange} placeholder="Preço" type="number" step="0.01" className="w-full border px-3 py-2 rounded" required />
        <input name="category" value={form.category} onChange={handleChange} placeholder="Categoria" className="w-full border px-3 py-2 rounded" required />
        <input name="brand" value={form.brand} onChange={handleChange} placeholder="Marca" className="w-full border px-3 py-2 rounded" required />
        <input name="imageUrl" value={form.imageUrl} onChange={handleChange} placeholder="URL da Imagem (opcional)" className="w-full border px-3 py-2 rounded" />
        <input name="stock" value={form.stock} onChange={handleChange} placeholder="Estoque" type="number" className="w-full border px-3 py-2 rounded" required />
        <textarea name="specifications" value={form.specifications} onChange={handleChange} placeholder="Especificações" className="w-full border px-3 py-2 rounded" required />
        {error && <div className="text-red-600">{error}</div>}
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={loading}>
          {loading ? "Salvando..." : "Salvar"}
        </button>
      </form>
    </div>
  );
}
