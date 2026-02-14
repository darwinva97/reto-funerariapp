"use client";

import { useState } from "react";

export default function CrearMemorial() {
  const [form, setForm] = useState({
    rut: "",
    nombre: "",
    ubicacion: "",
    frase: "",
    foto_perfil: "",
  });
  const [fotosRecuerdo, setFotosRecuerdo] = useState([""]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleFotoChange(index: number, value: string) {
    const updated = [...fotosRecuerdo];
    updated[index] = value;
    setFotosRecuerdo(updated);
  }

  function addFotoField() {
    setFotosRecuerdo([...fotosRecuerdo, ""]);
  }

  function removeFotoField(index: number) {
    setFotosRecuerdo(fotosRecuerdo.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const payload = {
      ...form,
      fotos_recuerdo: fotosRecuerdo.filter((url) => url.trim() !== ""),
    };

    try {
      const res = await fetch("/api/memoriales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al crear el memorial");
      }

      setMessage({ type: "success", text: "Memorial creado exitosamente." });
      setForm({ rut: "", nombre: "", ubicacion: "", frase: "", foto_perfil: "" });
      setFotosRecuerdo([""]);
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Error inesperado",
      });
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-stone-300 bg-white px-4 py-3 text-stone-800 placeholder-stone-400 outline-none transition-colors focus:border-stone-500";

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-2xl font-light tracking-tight text-stone-800">
        Crear Memorial
      </h1>
      <p className="mt-2 text-sm text-stone-500">
        Completa el formulario para crear un nuevo memorial digital.
      </p>

      {message && (
        <div
          className={`mt-6 rounded-lg px-4 py-3 text-sm ${
            message.type === "success"
              ? "bg-green-50 text-green-800"
              : "bg-red-50 text-red-800"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-stone-700">
            RUT
          </label>
          <input
            type="text"
            name="rut"
            placeholder="Ej: 6.543.210-K"
            value={form.rut}
            onChange={handleChange}
            required
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-stone-700">
            Nombre
          </label>
          <input
            type="text"
            name="nombre"
            placeholder="Nombre completo"
            value={form.nombre}
            onChange={handleChange}
            required
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-stone-700">
            Ubicacion
          </label>
          <input
            type="text"
            name="ubicacion"
            placeholder="Ciudad, Pais"
            value={form.ubicacion}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-stone-700">
            Frase conmemorativa
          </label>
          <textarea
            name="frase"
            placeholder="Una frase en su memoria..."
            value={form.frase}
            onChange={handleChange}
            rows={3}
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-stone-700">
            URL Foto de Perfil
          </label>
          <input
            type="url"
            name="foto_perfil"
            placeholder="https://..."
            value={form.foto_perfil}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-stone-700">
            Fotos de Recuerdo (URLs)
          </label>
          <div className="space-y-3">
            {fotosRecuerdo.map((foto, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://..."
                  value={foto}
                  onChange={(e) => handleFotoChange(index, e.target.value)}
                  className={inputClass}
                />
                {fotosRecuerdo.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeFotoField(index)}
                    className="shrink-0 rounded-lg border border-stone-300 px-3 text-stone-400 transition-colors hover:border-red-300 hover:text-red-500"
                  >
                    X
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addFotoField}
            className="mt-3 text-sm text-stone-500 transition-colors hover:text-stone-800"
          >
            + Agregar otra foto
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-stone-800 py-3 text-sm font-medium text-white transition-colors hover:bg-stone-700 disabled:opacity-50"
        >
          {loading ? "Guardando..." : "Crear Memorial"}
        </button>
      </form>
    </div>
  );
}
