import Link from "next/link";
import { BookOpen, Leaf } from "lucide-react";
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
        <nav aria-label="Navegación principal" className="kid-nav">
          <Link href="/">
            <span aria-hidden="true">📚</span> Cuentos
          </Link>
          <Link href="/crear">
            <span aria-hidden="true">✨</span> Crear
          </Link>
        </nav>
      </div>
    </header>
  );
}
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <Logo />
        <div>
          <Link href="/acompanar">Para adultos</Link>
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
