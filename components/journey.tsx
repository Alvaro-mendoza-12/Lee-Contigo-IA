import { Check } from "lucide-react";
export function Journey({ current }: { current: number }) {
  return (
    <ol className="journey" aria-label="Tu recorrido de lectura">
      {["Elige", "Lee", "Piensa"].map((label, index) => (
        <li
          key={label}
          className={
            index + 1 === current
              ? "current"
              : index + 1 < current
                ? "done"
                : ""
          }
          aria-current={index + 1 === current ? "step" : undefined}
        >
          <span className="step-number">
            {index + 1 < current ? <Check size={15} /> : index + 1}
          </span>
          <span>{label}</span>
        </li>
      ))}
    </ol>
  );
}
