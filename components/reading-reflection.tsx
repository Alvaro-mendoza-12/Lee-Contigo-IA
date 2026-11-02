import { MessageCircle } from "lucide-react";
import type { Level } from "@/lib/stories";
import styles from "./learning-support.module.css";

export function ReadingReflection({ level }: { level: Level }) {
  return (
    <details className={styles.reflection}>
      <summary>
        <MessageCircle size={20} aria-hidden="true" />
        Cuéntalo a tu manera
      </summary>
      <div>
        <p>
          {level === "paso"
            ? "¿Qué pasó al principio? ¿Y al final?"
            : "¿Qué cambió en la historia? Cuenta qué parte te ayuda a explicarlo."}
        </p>
        <p>Puedes contarlo en voz alta o dibujarlo.</p>
      </div>
    </details>
  );
}
