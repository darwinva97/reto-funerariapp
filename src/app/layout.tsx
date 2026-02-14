import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Memoriales Digitales | Funerariapp",
  description:
    "Honra la memoria de tus seres queridos con un memorial digital permanente.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} antialiased`}>
        <nav className="border-b border-stone-200 bg-white/80 backdrop-blur-sm">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
            <Link href="/" className="text-lg font-semibold tracking-tight text-stone-800">
              Funerariapp
            </Link>
            <div className="flex gap-6 text-sm">
              <Link
                href="/"
                className="text-stone-500 transition-colors hover:text-stone-800"
              >
                Buscar Memorial
              </Link>
              <Link
                href="/crear"
                className="text-stone-500 transition-colors hover:text-stone-800"
              >
                Crear Memorial
              </Link>
            </div>
          </div>
        </nav>
        <main className="mx-auto max-w-5xl px-6 py-12">{children}</main>
      </body>
    </html>
  );
}
