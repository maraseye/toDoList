import { useState } from "react";
import { Plus } from "lucide-react";
import { CATEGORIES } from "../constants/categories";
import {
  PRIORITIES,
  GOAL_HORIZONS,
  RECURRENCE_TYPES,
  WEEKDAYS,
} from "../constants/taskOptions";

/**
 * Formulaire : tâche, catégorie (travail / études séparés), priorité, horizon,
 * récurrence (chaque jour ou jours de la semaine), date optionnelle.
 */
export default function TodoForm({ onAdd }) {
  const [text, setText] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0].id);
  const [priority, setPriority] = useState("normale");
  const [goalHorizon, setGoalHorizon] = useState("court_terme");
  const [recurrenceType, setRecurrenceType] = useState("none");
  const [weekdays, setWeekdays] = useState([1, 2, 3, 4, 5]);
  const [dueDate, setDueDate] = useState("");

  function toggleWeekday(d) {
    setWeekdays((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d].sort((a, b) => a - b)
    );
  }

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;

    const recurrence =
      recurrenceType === "none"
        ? { type: "none", weekdays: [] }
        : recurrenceType === "daily"
          ? { type: "daily", weekdays: [] }
          : { type: "weekly", weekdays: weekdays.length ? weekdays : [1, 2, 3, 4, 5] };

    onAdd({
      text: trimmed,
      category,
      priority,
      goalHorizon,
      recurrence,
      dueDate: dueDate || null,
    });
    setText("");
    setDueDate("");
    setCategory(CATEGORIES[0].id);
    setPriority("normale");
    setGoalHorizon("court_terme");
    setRecurrenceType("none");
    setWeekdays([1, 2, 3, 4, 5]);
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

      <div className="todo-form__grid">
        <label className="todo-form__field">
          <span className="todo-form__label">Catégorie</span>
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
        </label>

        <label className="todo-form__field">
          <span className="todo-form__label">Priorité</span>
          <select
            className="todo-form__select"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            aria-label="Priorité"
          >
            {PRIORITIES.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </label>

        <label className="todo-form__field todo-form__field--wide">
          <span className="todo-form__label">Type d’objectif</span>
          <select
            className="todo-form__select"
            value={goalHorizon}
            onChange={(e) => setGoalHorizon(e.target.value)}
            aria-label="Court ou long terme"
          >
            {GOAL_HORIZONS.map((g) => (
              <option key={g.id} value={g.id}>
                {g.label} — {g.hint}
              </option>
            ))}
          </select>
        </label>

        <label className="todo-form__field todo-form__field--wide">
          <span className="todo-form__label">Récurrence</span>
          <select
            className="todo-form__select"
            value={recurrenceType}
            onChange={(e) => setRecurrenceType(e.target.value)}
            aria-label="Récurrence"
          >
            {RECURRENCE_TYPES.map((r) => (
              <option key={r.id} value={r.id}>
                {r.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {recurrenceType === "weekly" && (
        <div className="todo-form__weekdays">
          <span className="todo-form__label">Jours</span>
          <div className="todo-form__chips" role="group" aria-label="Jours de la semaine">
            {WEEKDAYS.map((d) => (
              <button
                key={d.id}
                type="button"
                className={`todo-form__chip${weekdays.includes(d.id) ? " todo-form__chip--on" : ""}`}
                onClick={() => toggleWeekday(d.id)}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="todo-form__row todo-form__row--meta">
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
