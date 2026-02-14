import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import type { Memorial } from "@/types/memorial";

const COLLECTION_PATH = "Funerariapp-Memorial/memoriales/pre-cargados";

// POST - Crear memorial
export async function POST(request: NextRequest) {
  try {
    const body: Memorial = await request.json();

    if (!body.rut || !body.nombre) {
      return NextResponse.json(
        { error: "RUT y nombre son obligatorios" },
        { status: 400 }
      );
    }

    const colRef = collection(db, COLLECTION_PATH);
    const docRef = await addDoc(colRef, {
      rut: body.rut,
      nombre: body.nombre,
      ubicacion: body.ubicacion || "",
      frase: body.frase || "",
      foto_perfil: body.foto_perfil || "",
      fotos_recuerdo: body.fotos_recuerdo || [],
    });

    return NextResponse.json(
      { message: "Memorial creado exitosamente", id: docRef.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error al crear memorial:", error);
    return NextResponse.json(
      { error: "Error al crear el memorial" },
      { status: 500 }
    );
  }
}

// GET - Consultar memorial por RUT
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const rut = searchParams.get("rut");

    if (!rut) {
      return NextResponse.json(
        { error: "El parámetro RUT es obligatorio" },
        { status: 400 }
      );
    }

    const colRef = collection(db, COLLECTION_PATH);
    const q = query(colRef, where("rut", "==", rut));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return NextResponse.json(
        { error: "No hemos encontrado un memorial asociado a este RUT" },
        { status: 404 }
      );
    }

    const doc = snapshot.docs[0];
    const memorial = { id: doc.id, ...doc.data() } as Memorial & { id: string };

    return NextResponse.json(memorial);
  } catch (error) {
    console.error("Error al consultar memorial:", error);
    return NextResponse.json(
      { error: "Error al consultar el memorial" },
      { status: 500 }
    );
  }
}
