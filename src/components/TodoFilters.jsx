import { LayoutList, CheckCircle2, Circle } from "lucide-react";

const FILTERS = [
  { id: "all", label: "Toutes", Icon: LayoutList },
  { id: "active", label: "À faire", Icon: Circle },
  { id: "completed", label: "Terminées", Icon: CheckCircle2 },
];

/**
 * Segmented control pour filtrer les tâches affichées.
 */
export default function TodoFilters({ filter, onFilterChange, counts }) {
  return (
    <div className="todo-filters" role="tablist" aria-label="Filtrer les tâches">
      {FILTERS.map(({ id, label, Icon }) => {
        const active = filter === id;
        const count =
          id === "all"
            ? counts.all
            : id === "active"
              ? counts.active
              : counts.completed;
        return (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={active}
            className={`todo-filters__btn${active ? " todo-filters__btn--active" : ""}`}
            onClick={() => onFilterChange(id)}
          >
            <Icon size={18} strokeWidth={active ? 2.5 : 2} />
            <span>{label}</span>
            <span className="todo-filters__count">{count}</span>
          </button>
        );
      })}
    </div>
  );
}
