"use client";
import { BookOpen, ArrowRight, Trash2 } from "lucide-react";
import { useState, type CSSProperties } from "react";
import type { SavedBook } from "@/lib/book-shelf";
import { levels } from "@/lib/stories";

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
  const [confirmClear, setConfirmClear] = useState(false);
  const [removing, setRemoving] = useState<string | null>(null);
  return (
    <section className="saved-books" aria-labelledby="saved-books-title">
      <div className="shelf-heading">
        <div>
          <h2 id="saved-books-title">Mis libros recientes</h2>
          <p>Hasta seis libros, disponibles siete días en este dispositivo.</p>
        </div>
        {books.length ? (
          <button
            type="button"
            className="text-button"
            onClick={() => setConfirmClear(true)}
          >
            <Trash2 size={16} aria-hidden="true" />
            Borrar todos
          </button>
        ) : null}
      </div>
      {confirmClear ? (
        <div
          className="shelf-confirm"
          role="group"
          aria-label="Confirmar borrado"
        >
          <p>¿Borrar los libros guardados en este dispositivo?</p>
          <button
            className="button"
            type="button"
            onClick={async () => {
              await onClear();
              setConfirmClear(false);
            }}
          >
            Sí, borrar los libros
          </button>
          <button
            className="text-button"
            type="button"
            onClick={() => setConfirmClear(false)}
          >
            Conservarlos
          </button>
        </div>
      ) : null}
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
                  {book.cover ? (
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
                disabled={removing === book.id}
                aria-label={`Borrar ${book.story.title}`}
                onClick={async () => {
                  setRemoving(book.id);
                  await onRemove(book.id);
                  setRemoving(null);
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
          <BookOpen size={42} aria-hidden="true" />
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
