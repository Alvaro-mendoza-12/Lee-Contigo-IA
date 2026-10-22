import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import { Header, Footer } from "@/components/shell";
import "./globals.css";
import "./book.css";
const nunito = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});
export const metadata: Metadata = {
  title: {
    default: "LeeContigo IA · Un mundo en cada historia",
    template: "%s · LeeContigo IA",
  },
  description:
    "Un espacio tranquilo para leer, descubrir y practicar la comprensión con pistas a tu ritmo. Sin cuentas ni registros.",
  applicationName: "LeeContigo IA",
  robots: { index: true, follow: true },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" data-scroll-behavior="smooth">
      <body className={nunito.variable}>
        <a className="skip-link" href="#contenido">
          Saltar al contenido
        </a>
        <Header />
        <main id="contenido">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
