"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, HeartHandshake, Sparkles } from "lucide-react";

export function PrimaryNavigation() {
  const path = usePathname();
  const inStories =
    path === "/" ||
    path === "/biblioteca" ||
    path.startsWith("/leer/") ||
    path.startsWith("/practicar/");
  return (
    <nav aria-label="Navegación principal" className="kid-nav">
      <Link href="/" aria-current={inStories ? "page" : undefined}>
        <BookOpen size={18} aria-hidden="true" /> Cuentos
      </Link>
      <Link href="/crear" aria-current={path === "/crear" ? "page" : undefined}>
        <Sparkles size={18} aria-hidden="true" /> Crear
      </Link>
      <Link
        href="/acompanar"
        aria-current={path === "/acompanar" ? "page" : undefined}
      >
        <HeartHandshake size={18} aria-hidden="true" /> Acompañar
      </Link>
    </nav>
  );
}
