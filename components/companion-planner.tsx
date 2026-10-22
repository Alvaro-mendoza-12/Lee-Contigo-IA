"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, HeartHandshake } from "lucide-react";
import { levels, type Level } from "@/lib/stories";
import { readingGoals, type ReadingGoal } from "@/lib/reading";

export function CompanionPlanner({
  stories,
}: {
  stories: { id: string; title: string }[];
}) {
  const [storyId, setStoryId] = useState(stories[0].id);
  const [level, setLevel] = useState<Level>("paso");
  const [goal, setGoal] = useState<ReadingGoal>("imaginar");
  const [step, setStep] = useState(0);
  const steps = ["Antes de leer", "Durante la lectura", "Al terminar"];
  const prompts = [
    readingGoals[goal].prompts[0],
    readingGoals[goal].prompts[2],
    readingGoals[goal].prompts[3],
  ];
  return (
    <section className="companion-planner" aria-labelledby="plan-title">
      <div className="planner-heading">
        <HeartHandshake size={29} aria-hidden="true" />
        <div>
          <span className="small-label">UNA LECTURA EN EQUIPO</span>
          <h2 id="plan-title">Preparen su momento juntos</h2>
          <p>
            Elijan una historia y una pequeña misión. La guía los acompañará
            página a página.
          </p>
        </div>
      </div>
      <div className="planner-layout">
        <div className="planner-choices">
          <label htmlFor="plan-story">¿Qué historia van a leer?</label>
          <select
            id="plan-story"
            value={storyId}
            onChange={(e) => setStoryId(e.target.value)}
          >
            {stories.map((story) => (
              <option key={story.id} value={story.id}>
                {story.title}
              </option>
            ))}
          </select>
          <fieldset className="planner-fieldset">
            <legend>Nivel de práctica</legend>
            <div className="planner-levels">
              {(["paso", "reto"] as const).map((id) => (
                <label key={id}>
                  <input
                    type="radio"
                    name="plan-level"
                    value={id}
                    checked={level === id}
                    onChange={() => setLevel(id)}
                  />
                  {levels[id].label}
                </label>
              ))}
            </div>
          </fieldset>
          <fieldset className="planner-fieldset">
            <legend>¿Qué quieren practicar?</legend>
            <div className="planner-goals">
              {(
                Object.entries(readingGoals) as [
                  ReadingGoal,
                  (typeof readingGoals)[ReadingGoal],
                ][]
              ).map(([id, item]) => (
                <label key={id} className={goal === id ? "selected" : ""}>
                  <input
                    type="radio"
                    name="plan-goal"
                    value={id}
                    checked={goal === id}
                    onChange={() => {
                      setGoal(id);
                      setStep(0);
                    }}
                  />
                  <span>
                    <strong>{item.title}</strong>
                    <small>{item.description}</small>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>
        <div className="planner-preview">
          <span className="small-label">ASÍ PUEDEN ACOMPAÑAR</span>
          <div
            className="planner-stages"
            role="group"
            aria-label="Momentos de la lectura"
          >
            {steps.map((label, index) => (
              <button
                type="button"
                key={label}
                aria-pressed={step === index}
                onClick={() => setStep(index)}
              >
                {index + 1}. {label}
              </button>
            ))}
          </div>
          <div className="planner-conversation" aria-live="polite">
            <span>{steps[step]}</span>
            <h3>{prompts[step]}</h3>
            <p>
              Escuchen la explicación y conversen. No hace falta acertar a la
              primera.
            </p>
          </div>
          <p className="planner-summary">
            <Check size={17} aria-hidden="true" />
            {levels[level].label} · {readingGoals[goal].title}
          </p>
          <Link
            className="button full-width"
            href={`/leer/${storyId}?nivel=${level}&juntos=1&objetivo=${goal}`}
          >
            Empezar lectura acompañada{" "}
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
          <small>
            Las preguntas de conversación están preparadas. Las pistas con IA se
            encuentran en la práctica.
          </small>
        </div>
      </div>
    </section>
  );
}
