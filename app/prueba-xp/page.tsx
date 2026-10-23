import { redirect } from "next/navigation";
import PruebaXP from "@/components/prueba-xp";

export default async function PruebaXPPage({
  searchParams,
}: {
  searchParams: Promise<{ demo?: string }>;
}) {
  const { demo } = await searchParams;

  // La página puede sumar o borrar XP: siempre debe usar la clave de demo.
  if (demo !== "1") redirect("/prueba-xp?demo=1");

  return <PruebaXP />;
}
