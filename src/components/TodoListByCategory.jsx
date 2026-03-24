import { Droppable } from "@hello-pangea/dnd";
import TodoItem from "./TodoItem";
import { ClipboardList } from "lucide-react";
import { CATEGORIES, getCategoryLabel } from "../constants/categories";

/**
 * Tâches regroupées par catégorie (sections distinctes, pas une seule liste).
 */
export default function TodoListByCategory({
  todosByCategory,
  onToggle,
  onDelete,
  onUpdate,
}) {
  const hasAny = CATEGORIES.some((c) => (todosByCategory[c.id] ?? []).length > 0);

  if (!hasAny) {
    return (
      <div className="todo-empty" role="status">
        <ClipboardList size={48} strokeWidth={1.25} className="todo-empty__icon" />
        <p>Aucune tâche ici pour l’instant.</p>
        <p className="todo-empty__hint">Ajoutez-en une ci-dessus ou changez de filtre.</p>
      </div>
    );
  }

  return (
    <div className="todo-by-category">
      {CATEGORIES.map((cat) => {
        const list = todosByCategory[cat.id] ?? [];
        if (list.length === 0) return null;

        return (
          <section key={cat.id} className="todo-category">
            <h2 className="todo-category__title">{getCategoryLabel(cat.id)}</h2>
            <Droppable droppableId={cat.id}>
              {(provided, snapshot) => (
                <ul
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`todo-list${snapshot.isDraggingOver ? " todo-list--over" : ""}`}
                >
                  {list.map((todo, index) => (
                    <TodoItem
                      key={todo.id}
                      todo={todo}
                      index={index}
                      grouped
                      onToggle={onToggle}
                      onDelete={onDelete}
                      onUpdate={onUpdate}
                    />
                  ))}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </section>
        );
      })}
    </div>
  );
}
