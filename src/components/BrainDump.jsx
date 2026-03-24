import { useState } from "react";
import { Brain, Plus, Trash2, ArrowRightCircle } from "lucide-react";

/**
 * Zone « vide-tête » : idées rapides, séparées des tâches structurées.
 * Chaque note peut être envoyée vers la liste principale (préremplit une future tâche).
 */
export default function BrainDump({ items, onAdd, onDelete, onPromote }) {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(true);

  function submit(e) {
    e.preventDefault();
    const t = text.trim();
    if (!t) return;
    onAdd(t);
    setText("");
  }

  return (
    <section className="brain-dump" aria-labelledby="brain-dump-heading">
      <button
        type="button"
        className="brain-dump__toggle"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        id="brain-dump-heading"
      >
        <Brain size={22} />
        <span>Brain dump</span>
        <span className="brain-dump__badge">{items.length}</span>
      </button>

      {open && (
        <div className="brain-dump__panel">
          <p className="brain-dump__hint">
            Notez tout ce qui vous traverse l’esprit — classez plus tard en tâche.
          </p>
          <form className="brain-dump__form" onSubmit={submit}>
            <input
              className="brain-dump__input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Idée, souci, à ne pas oublier…"
              maxLength={300}
              aria-label="Nouvelle note brain dump"
            />
            <button type="submit" className="btn btn-primary brain-dump__add">
              <Plus size={18} />
              Noter
            </button>
          </form>

          {items.length === 0 ? (
            <p className="brain-dump__empty">Rien pour le moment.</p>
          ) : (
            <ul className="brain-dump__list">
              {items.map((note) => (
                <li key={note.id} className="brain-dump__item">
                  <p className="brain-dump__text">{note.text}</p>
                  <div className="brain-dump__actions">
                    <button
                      type="button"
                      className="btn-icon brain-dump__promote"
                      title="Créer une tâche à partir de cette note"
                      aria-label="Promouvoir en tâche"
                      onClick={() => onPromote(note)}
                    >
                      <ArrowRightCircle size={18} />
                    </button>
                    <button
                      type="button"
                      className="btn-icon btn-icon--danger"
                      title="Supprimer"
                      aria-label="Supprimer la note"
                      onClick={() => onDelete(note.id)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  );
}
