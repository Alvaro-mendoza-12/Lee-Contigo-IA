"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Lightbulb, X, LoaderCircle, ArrowRight } from "lucide-react";
import type { Level, StoryId } from "@/lib/stories";
import type { ReadingHelpInput, ReadingHelpOutput } from "@/lib/reading-help";
import { ReadFeedback } from "./answer-audio";
import { BarraXP } from "./barra-xp";
import {
  preparedReadingHelp,
  helpNarrationText,
} from "@/lib/reading-help-copy";

type Target = {
  paragraph: number;
  mode: "selection" | "paragraph";
  start?: number;
  end?: number;
  text: string;
};
type Result = ReadingHelpOutput & {
  source: "ai" | "prepared";
  audioAuthorization?: string;
};
export function ReadingHelp({
  paragraphs,
  paragraph,
  pageKey,
  level,
  storyId,
  authorizations = [],
  onOpen,
  children,
}: {
  paragraphs: string[];
  paragraph: number;
  pageKey: string;
  level: Level;
  storyId?: StoryId;
  authorizations?: string[];
  onOpen?: () => void;
  children?: ReactNode;
}) {
  const [selection, setSelection] = useState<Target | null>(null);
  const [target, setTarget] = useState<Target | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [stage, setStage] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  const paragraphButton = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);
  const abort = useRef<AbortController | null>(null);
  const generation = useRef(0);

  useEffect(() => {
    const coarsePointer = window.matchMedia("(pointer: coarse)");
    function update() {
      if (coarsePointer.matches) {
        setSelection(null);
        setNotice("");
        return;
      }
      const selection = window.getSelection();
      if (!selection?.rangeCount || selection.isCollapsed) {
        setSelection(null);
        return;
      }
      const range = selection.getRangeAt(0);
      const node = range.commonAncestorContainer;
      const element =
        node.nodeType === Node.ELEMENT_NODE
          ? (node as Element)
          : node.parentElement;
      const textElement = element?.closest<HTMLElement>(
        ".paper-spread .book-page-text, .book-full-text p[data-help-paragraph]",
      );
      if (
        !textElement ||
        textElement.closest("[inert], [aria-hidden='true']") ||
        !textElement.contains(range.startContainer) ||
        !textElement.contains(range.endContainer)
      ) {
        setSelection(null);
        return;
      }
      const selected = range.toString();
      if (!selected.trim()) {
        setSelection(null);
        return;
      }
      if (
        selected.trim().length > 180 ||
        selected.trim().split(/\s+/).length > 35
      ) {
        setSelection(null);
        setNotice(
          "Marca una palabra o una frase corta, o pide ayuda para el párrafo.",
        );
        return;
      }
      const index = Number(textElement.dataset.helpParagraph ?? paragraph);
      const words = paragraphs[index]?.trim().split(/\s+/);
      if (!words) return;
      const wordStart = Number(textElement.dataset.helpStart ?? 0);
      const before = range.cloneRange();
      before.selectNodeContents(textElement);
      before.setEnd(range.startContainer, range.startOffset);
      const base = wordStart
        ? words.slice(0, wordStart).join(" ").length + 1
        : 0;
      const start =
        base +
        before.toString().length +
        selected.length -
        selected.trimStart().length;
      const end = start + selected.trim().length;
      setSelection({
        paragraph: index,
        mode: "selection",
        start,
        end,
        text: selected.trim(),
      });
      setNotice("");
    }
    document.addEventListener("selectionchange", update);
    coarsePointer.addEventListener("change", update);
    // Selection can precede hydration installing this listener.
    update();
    return () => {
      document.removeEventListener("selectionchange", update);
      coarsePointer.removeEventListener("change", update);
    };
  }, [paragraphs, paragraph]);

  useEffect(() => {
    generation.current++;
    abort.current?.abort();
    setSelection(null);
    setOpen(false);
    setResult(null);
    setNotice("");
    return () => {
      generation.current++;
      abort.current?.abort();
    };
  }, [pageKey]);
  useEffect(() => {
    if (!open) {
      dialog.current?.close();
      if (wasOpen.current) {
        wasOpen.current = false;
        const frame = requestAnimationFrame(() =>
          paragraphButton.current?.focus({ preventScroll: true }),
        );
        return () => cancelAnimationFrame(frame);
      }
      return;
    }
    wasOpen.current = true;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.current?.showModal();
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [open]);

  async function requestHelp(next: Target, nextStage: number) {
    onOpen?.();
    const id = ++generation.current;
    abort.current?.abort();
    const controller = new AbortController();
    abort.current = controller;
    setTarget(next);
    setStage(nextStage);
    setOpen(true);
    setLoading(true);
    setResult(null);
    const range =
      next.mode === "selection" ? { start: next.start!, end: next.end! } : {};
    let input: ReadingHelpInput | undefined;
    if (storyId)
      input = {
        source: "catalogue",
        storyId,
        level,
        paragraph: next.paragraph,
        mode: next.mode,
        stage: nextStage,
        ...range,
      };
    else if (authorizations[next.paragraph])
      input = {
        source: "generated",
        level,
        paragraphText: paragraphs[next.paragraph],
        authorization: authorizations[next.paragraph],
        mode: next.mode,
        stage: nextStage,
        ...range,
      };
    try {
      if (!input) throw new Error("LegacyBook");
      const response = await fetch("/api/lectura/ayuda", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
        signal: AbortSignal.any([
          controller.signal,
          AbortSignal.timeout(22000),
        ]),
      });
      if (!response.ok) throw new Error("HelpUnavailable");
      const data = (await response.json()) as Result;
      if (
        ![data.explanation, data.example, data.reflection].every(
          (value) => typeof value === "string",
        ) ||
        !["ai", "prepared"].includes(data.source)
      )
        throw new Error("InvalidHelp");
      if (generation.current === id) setResult(data);
    } catch {
      if (generation.current === id)
        setResult({
          source: "prepared",
          ...preparedReadingHelp(next.text, nextStage),
        });
    } finally {
      if (generation.current === id) setLoading(false);
    }
  }
  function close() {
    generation.current++;
    abort.current?.abort();
    setLoading(false);
    setOpen(false);
  }
  return (
    <div className="reading-help-controls">
      <button
        className="text-button paragraph-help"
        type="button"
        ref={paragraphButton}
        onClick={() =>
          void requestHelp(
            { paragraph, mode: "paragraph", text: paragraphs[paragraph] },
            0,
          )
        }
      >
        <Lightbulb size={18} aria-hidden="true" /> No entendí
      </button>
      {children}
      <BarraXP variante="compacta" />
      <span className="sr-only" role="status">
        {notice ||
          (selection
            ? "Parte seleccionada. Puedes pedir ayuda con esta parte."
            : "")}
      </span>
      {selection && !open ? (
        <button
          className="selection-help-button"
          type="button"
          onPointerDown={(event) => event.preventDefault()}
          onClick={() => void requestHelp(selection, 0)}
        >
          <Lightbulb size={19} aria-hidden="true" />
          <span>
            Ayúdame con esta parte
            <small>
              «
              {selection.text.length > 50
                ? selection.text.slice(0, 50) + "…"
                : selection.text}
              »
            </small>
          </span>
        </button>
      ) : null}
      <dialog
        className="reading-help-dialog"
        ref={dialog}
        aria-labelledby="reading-help-title"
        onCancel={close}
        onClose={() => {
          if (open) close();
        }}
      >
        <div className="reading-help-heading">
          <h2 id="reading-help-title">Lo pensamos juntos</h2>
          <button
            type="button"
            className="text-button"
            aria-label="Cerrar ayuda y volver al libro"
            onClick={close}
          >
            <X size={23} aria-hidden="true" />
          </button>
        </div>
        {target?.mode === "paragraph" ? (
          <details className="help-passage">
            <summary>Ver el texto</summary>
            <blockquote className="help-selected-quote">
              {target.text}
            </blockquote>
          </details>
        ) : (
          <blockquote className="help-selected-quote">
            {target?.text}
          </blockquote>
        )}
        <div
          className="help-response"
          role="status"
          aria-live="polite"
          aria-busy={loading}
        >
          {loading ? (
            <p>
              <LoaderCircle className="spin" size={20} aria-hidden="true" />{" "}
              Preparando una ayuda…
            </p>
          ) : result ? (
            <>
              <span className="help-source">
                {result.source === "ai" ? "Ayuda con IA" : "Ayuda preparada"} ·
                Paso {stage + 1} de 3
              </span>
              <p className="help-explanation">{result.explanation}</p>
              <details className="help-example" key={`${pageKey}-${stage}`}>
                <summary>Ver un ejemplo</summary>
                <p>{result.example}</p>
              </details>
              <div className="help-reflection">
                <strong>Piensa</strong>
                <p>{result.reflection}</p>
              </div>
            </>
          ) : null}
        </div>
        {open && result ? (
          <ReadFeedback
            text={helpNarrationText(result)}
            authorization={result.audioAuthorization}
          />
        ) : null}
        <div className="help-actions">
          {stage < 2 ? (
            <button
              className="button button-outline"
              disabled={loading}
              type="button"
              onClick={() => target && void requestHelp(target, stage + 1)}
            >
              Necesito otra pista
            </button>
          ) : (
            <p>Lee el párrafo una vez más, a tu ritmo.</p>
          )}
          <button className="button" type="button" onClick={close}>
            Seguir leyendo <ArrowRight size={17} aria-hidden="true" />
          </button>
        </div>
      </dialog>
    </div>
  );
}
