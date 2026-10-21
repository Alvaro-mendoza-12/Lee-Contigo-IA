import Link from "next/link";
import { BookOpen, Leaf, ArrowUpRight } from "lucide-react";
export function Logo() {
  return (
    <span className="brand">
      <span className="brand-mark">
        <BookOpen size={25} strokeWidth={1.8} />
        <Leaf className="brand-leaf" size={13} />
      </span>
      <span>
        LeeContigo<span className="brand-ai"> IA</span>
      </span>
    </span>
  );
}
export function Header() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" aria-label="LeeContigo IA, inicio">
          <Logo />
        </Link>
        <nav aria-label="Navegación principal">
          <Link href="/biblioteca">Las historias</Link>
          <Link href="/acompanar">Para acompañar</Link>
        </nav>
        <Link href="/biblioteca" className="button button-small header-cta">
          Vamos a leer <ArrowUpRight size={17} />
        </Link>
      </div>
    </header>
  );
}
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <Logo />
        <span>Pequeñas lecturas. Grandes descubrimientos.</span>
        <div>
          <Link href="/acompanar">Guía para adultos</Link>
          <Link href="/privacidad">Privacidad</Link>
        </div>
      </div>
      <p className="footer-note">
        Prototipo educativo · Equipo LeeContigo · Textos originales de
        demostración
      </p>
    </footer>
  );
}
