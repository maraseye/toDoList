import { Droppable } from "@hello-pangea/dnd";
import TodoItem from "./TodoItem";
import { ClipboardList } from "lucide-react";

/**
 * Liste des tâches avec zone de dépôt pour le drag & drop (@hello-pangea/dnd).
 */
export default function TodoList({ todos, onToggle, onDelete, onUpdate }) {
  if (todos.length === 0) {
    return (
      <div className="todo-empty" role="status">
        <ClipboardList size={48} strokeWidth={1.25} className="todo-empty__icon" />
        <p>Aucune tâche ici pour l’instant.</p>
        <p className="todo-empty__hint">Ajoutez-en une ci-dessus ou changez de filtre.</p>
      </div>
    );
  }

  return (
    <Droppable droppableId="todo-list">
      {(provided, snapshot) => (
        <ul
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`todo-list${snapshot.isDraggingOver ? " todo-list--over" : ""}`}
        >
          {todos.map((todo, index) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              index={index}
              onToggle={onToggle}
              onDelete={onDelete}
              onUpdate={onUpdate}
            />
          ))}
          {provided.placeholder}
        </ul>
      )}
    </Droppable>
  );
}
