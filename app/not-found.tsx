import Link from "next/link";
import { BookOpen, ArrowLeft } from "lucide-react";
export default function NotFound() {
  return (
    <div className="container empty-page">
      <BookOpen size={44} />
      <h1>Esta página se nos perdió entre los libros.</h1>
      <p>¡Hay 10 cuentos esperándote!</p>
      <Link href="/" className="button">
        <ArrowLeft size={18} />
        Volver a las historias
      </Link>
    </div>
  );
}
