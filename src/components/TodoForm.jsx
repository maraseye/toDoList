import { useState } from "react";
import { Plus } from "lucide-react";
import { CATEGORIES } from "../constants/categories";

/**
 * Formulaire pour ajouter une nouvelle tâche (texte, catégorie, date de rappel optionnelle).
 */
export default function TodoForm({ onAdd }) {
  const [text, setText] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0].id);
  const [dueDate, setDueDate] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onAdd({
      text: trimmed,
      category,
      dueDate: dueDate || null,
    });
    setText("");
    setDueDate("");
    setCategory(CATEGORIES[0].id);
  }

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <div className="todo-form__row">
        <input
          className="todo-form__input"
          type="text"
          placeholder="Nouvelle tâche…"
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={200}
          aria-label="Libellé de la tâche"
        />
      </div>
      <div className="todo-form__row todo-form__row--meta">
        <select
          className="todo-form__select"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-label="Catégorie"
        >
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.emoji} {c.label}
            </option>
          ))}
        </select>
        <input
          className="todo-form__date"
          type="datetime-local"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          aria-label="Date ou rappel"
        />
        <button type="submit" className="btn btn-primary todo-form__submit">
          <Plus size={20} strokeWidth={2.5} />
          <span>Ajouter</span>
        </button>
      </div>
    </form>
  );
}
