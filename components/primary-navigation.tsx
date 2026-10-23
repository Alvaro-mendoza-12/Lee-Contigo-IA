"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Sparkles } from "lucide-react";

export function PrimaryNavigation() {
  const path = usePathname();
  return (
    <nav aria-label="Navegación principal">
      <Link
        href="/biblioteca"
        aria-current={path === "/biblioteca" ? "page" : undefined}
        className={
          path.startsWith("/leer/") || path.startsWith("/practicar/")
            ? "nav-reading"
            : undefined
        }
      >
        <BookOpen size={18} aria-hidden="true" /> Cuentos
      </Link>
      <Link href="/crear" aria-current={path === "/crear" ? "page" : undefined}>
        <Sparkles size={18} aria-hidden="true" /> Crear
      </Link>
    </nav>
  );
}
