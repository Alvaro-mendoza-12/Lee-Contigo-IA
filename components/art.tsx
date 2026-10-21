import Image from "next/image";
import forest from "@/public/images/bosque-luciernaga.png";
import seed from "@/public/images/semilla-ventana.png";
export function StoryArt({
  variant,
  className = "",
  priority = false,
}: {
  variant: "night" | "seed";
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={variant === "night" ? forest : seed}
      alt={variant === "night"
        ? "Lina, una luciérnaga, ilumina las piedras de un río para ayudar a un grillo a cruzar."
        : "Un brote crece en una maceta junto a una ventana, con las raíces bajo la tierra."}
      className={className}
      sizes="(max-width: 760px) 100vw, (max-width: 1100px) 65vw, 700px"
      preload={priority}
      placeholder="blur"
    />
  );
}
