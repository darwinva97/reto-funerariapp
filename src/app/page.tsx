"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [rut, setRut] = useState("");
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = rut.trim();
    if (!trimmed) return;
    router.push(`/consulta/${encodeURIComponent(trimmed)}`);
  }

  return (
    <div className="flex flex-col items-center pt-20">
      <h1 className="text-3xl font-light tracking-tight text-stone-800">
        Memoriales Digitales
      </h1>
      <p className="mt-3 max-w-md text-center text-stone-500">
        Busca el memorial de un ser querido ingresando su RUT.
      </p>

      <form onSubmit={handleSubmit} className="mt-10 flex w-full max-w-md gap-3">
        <input
          type="text"
          placeholder="Ej: 6.543.210-K"
          value={rut}
          onChange={(e) => setRut(e.target.value)}
          className="flex-1 rounded-lg border border-stone-300 bg-white px-4 py-3 text-stone-800 placeholder-stone-400 outline-none transition-colors focus:border-stone-500"
        />
        <button
          type="submit"
          className="rounded-lg bg-stone-800 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-stone-700"
        >
          Buscar
        </button>
      </form>
    </div>
  );
}
