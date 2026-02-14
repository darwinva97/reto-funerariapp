"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Memorial } from "@/types/memorial";

export default function ConsultaMemorial() {
  const params = useParams();
  const rut = decodeURIComponent(params.rut as string);

  const [memorial, setMemorial] = useState<Memorial | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMemorial() {
      try {
        const res = await fetch(
          `/api/memoriales?rut=${encodeURIComponent(rut)}`
        );
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Memorial no encontrado");
        }
        const data: Memorial = await res.json();
        setMemorial(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error al buscar el memorial"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchMemorial();
  }, [rut]);

  if (loading) {
    return (
      <div className="flex items-center justify-center pt-20">
        <p className="text-stone-400">Buscando memorial...</p>
      </div>
    );
  }

  if (error || !memorial) {
    return (
      <div className="flex flex-col items-center pt-20">
        <div className="rounded-lg bg-stone-100 px-8 py-6 text-center">
          <p className="text-stone-600">
            {error || "No hemos encontrado un memorial asociado a este RUT"}
          </p>
          <Link
            href="/"
            className="mt-4 inline-block text-sm text-stone-500 underline transition-colors hover:text-stone-800"
          >
            Volver al buscador
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* Perfil */}
      <div className="flex flex-col items-center text-center">
        {memorial.foto_perfil && (
          <div className="relative h-40 w-40 overflow-hidden rounded-full border-4 border-white shadow-lg">
            <Image
              src={memorial.foto_perfil}
              alt={memorial.nombre}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        )}

        <h1 className="mt-6 text-2xl font-light tracking-tight text-stone-800">
          {memorial.nombre}
        </h1>

        {memorial.ubicacion && (
          <p className="mt-1 text-sm text-stone-500">{memorial.ubicacion}</p>
        )}

        {memorial.frase && (
          <blockquote className="mt-6 max-w-lg border-l-2 border-stone-300 pl-4 text-left italic text-stone-600">
            &ldquo;{memorial.frase}&rdquo;
          </blockquote>
        )}
      </div>

      {/* Galeria */}
      {memorial.fotos_recuerdo && memorial.fotos_recuerdo.length > 0 && (
        <div className="mt-12">
          <h2 className="mb-6 text-center text-lg font-light text-stone-700">
            Galeria de Recuerdos
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {memorial.fotos_recuerdo.map((foto, index) => (
              <div
                key={index}
                className="relative aspect-square overflow-hidden rounded-lg shadow-sm"
              >
                <Image
                  src={foto}
                  alt={`Recuerdo ${index + 1}`}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-12 text-center">
        <Link
          href="/"
          className="text-sm text-stone-500 underline transition-colors hover:text-stone-800"
        >
          Volver al buscador
        </Link>
      </div>
    </div>
  );
}
