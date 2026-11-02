"use client";
import { BookOpen, ArrowRight, Trash2 } from "lucide-react";
import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import type { SavedBook } from "@/lib/book-shelf";
import { levels } from "@/lib/story-metadata";
import { GeneratedScene } from "./generated-scene";
import { ReadingFriend } from "./reading-friend";
import styles from "./learning-support.module.css";

export function BookShelf({
  books,
  onOpen,
  onRemove,
  onClear,
  onCreate,
}: {
  books: SavedBook[];
  onOpen: (book: SavedBook) => void;
  onRemove: (id: string) => Promise<void>;
  onClear: () => Promise<void>;
  onCreate: () => void;
}) {
  const [pending, setPending] = useState<
    { id: string; title: string } | "all" | null
  >(null);
  const [removing, setRemoving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  const cancel = useRef<HTMLButtonElement>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const id = useId();

  useEffect(() => {
    if (!pending) return;
    const element = dialog.current;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    element?.showModal();
    const frame = requestAnimationFrame(() => cancel.current?.focus());
    return () => {
      cancelAnimationFrame(frame);
      element?.close();
      document.body.style.overflow = previous;
    };
  }, [pending]);

  function close() {
    dialog.current?.close();
    setPending(null);
    requestAnimationFrame(() => {
      const destination = trigger.current?.isConnected
        ? trigger.current
        : heading.current;
      destination?.focus({ preventScroll: true });
    });
  }

  async function confirmDeletion() {
    if (!pending || removing) return;
    setRemoving(true);
    setError("");
    try {
      if (pending === "all") await onClear();
      else await onRemove(pending.id);
      setMessage(pending === "all" ? "Libros borrados." : "Libro borrado.");
      close();
    } catch {
      setError("No se pudo borrar. Inténtalo otra vez.");
    } finally {
      setRemoving(false);
    }
  }
  return (
    <section className="saved-books" aria-labelledby="saved-books-title">
      <div className="shelf-heading">
        <div>
          <h2 id="saved-books-title" ref={heading} tabIndex={-1}>
            Mis libros
          </h2>
          <p>7 días · En este dispositivo</p>
        </div>
        {books.length ? (
          <button
            type="button"
            className="text-button"
            disabled={removing}
            onClick={(event) => {
              trigger.current = event.currentTarget;
              setError("");
              setPending("all");
            }}
          >
            <Trash2 size={16} aria-hidden="true" />
            Borrar todos
          </button>
        ) : null}
      </div>
      <dialog
        ref={dialog}
        className={styles.confirmDialog}
        aria-labelledby={`${id}-title`}
        aria-describedby={`${id}-description`}
        onCancel={(event) => {
          event.preventDefault();
          if (!removing) close();
        }}
      >
        <h2 id={`${id}-title`}>
          {pending === "all" ? "¿Borrar tus libros?" : "¿Borrar este libro?"}
        </h2>
        <p id={`${id}-description`}>
          {pending === "all"
            ? "Se quitarán todos los libros de este navegador."
            : pending
              ? `«${pending.title}» se quitará de este navegador.`
              : ""}
        </p>
        <p>
          {pending === "all"
            ? "No podrás recuperarlos aquí."
            : "No podrás recuperarlo aquí."}
        </p>
        {error ? <p role="alert">{error}</p> : null}
        <div className={styles.confirmActions}>
          <button
            ref={cancel}
            className="button button-outline"
            type="button"
            disabled={removing}
            onClick={close}
          >
            No, conservar
          </button>
          <button
            className="button"
            type="button"
            disabled={removing}
            onClick={confirmDeletion}
          >
            {removing
              ? "Borrando…"
              : pending === "all"
                ? "Sí, borrar los libros"
                : "Sí, borrar el libro"}
          </button>
        </div>
      </dialog>
      <p className={styles.confirmStatus} role="status">
        {message}
      </p>
      {books.length ? (
        <div className="shelf-grid">
          {books.map((book) => (
            <article key={book.id} className="saved-book-card">
              <button
                className="saved-book-open"
                type="button"
                onClick={() => onOpen(book)}
                aria-label={`Abrir ${book.story.title}`}
              >
                <div className="saved-book-art">
                  {book.illustrationPlan ? (
                    <GeneratedScene
                      plan={book.illustrationPlan}
                      images={book.pageImages}
                      showFallback={false}
                    />
                  ) : book.cover ? (
                    <div
                      className="story-art"
                      style={
                        {
                          "--atlas-columns": book.atlas ? 2 : 1,
                          "--atlas-rows": book.atlas ? 2 : 1,
                        } as CSSProperties
                      }
                    >
                      <div className="art-camera">
                        <img
                          src={book.cover}
                          width={500}
                          height={500}
                          alt=""
                          loading="lazy"
                        />
                      </div>
                    </div>
                  ) : (
                    <BookOpen size={38} aria-hidden="true" />
                  )}
                  <span>{levels[book.level].label}</span>
                </div>
                <div className="saved-book-title">
                  <h3>{book.story.title}</h3>
                  <span>
                    Volver a leer <ArrowRight size={16} aria-hidden="true" />
                  </span>
                </div>
              </button>
              <button
                type="button"
                className="saved-book-remove"
                disabled={removing}
                aria-label={`Borrar ${book.story.title}`}
                onClick={(event) => {
                  trigger.current = event.currentTarget;
                  setError("");
                  setPending({ id: book.id, title: book.story.title });
                }}
              >
                <Trash2 size={16} aria-hidden="true" />
                Borrar
              </button>
            </article>
          ))}
        </div>
      ) : (
        <div className="shelf-empty">
          <ReadingFriend />
          <h3>Aquí vivirán tus historias</h3>
          <p>Crea tu primer cuento y podrás volver a abrirlo después.</p>
          <button type="button" className="button" onClick={onCreate}>
            Imaginar un cuento <ArrowRight size={17} aria-hidden="true" />
          </button>
        </div>
      )}
    </section>
  );
}
