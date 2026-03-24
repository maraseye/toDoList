import { useState, useEffect, useRef } from "react";
import { Draggable } from "@hello-pangea/dnd";
import { GripVertical, Pencil, Trash2, Calendar } from "lucide-react";
import { getCategoryLabel } from "../constants/categories";

function formatDue(iso) {
  if (!iso) return null;
  try {
    const d = new Date(iso);
    return new Intl.DateTimeFormat("fr-FR", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(d);
  } catch {
    return iso;
  }
}

/**
 * Une ligne de tâche : case à cocher, texte (éditable), catégorie, date, actions.
 */
export default function TodoItem({ todo, index, onToggle, onDelete, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(todo.text);
  const inputRef = useRef(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  useEffect(() => {
    if (!editing) setDraft(todo.text);
  }, [todo.text, editing]);

  function saveEdit() {
    const t = draft.trim();
    if (t && t !== todo.text) onUpdate(todo.id, { text: t });
    setEditing(false);
  }

  function onKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      saveEdit();
    }
    if (e.key === "Escape") {
      setDraft(todo.text);
      setEditing(false);
    }
  }

  const dueLabel = formatDue(todo.dueDate);

  return (
    <Draggable draggableId={todo.id} index={index}>
      {(provided, snapshot) => (
        <li
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`todo-item${snapshot.isDragging ? " todo-item--dragging" : ""}${todo.completed ? " todo-item--done" : ""}`}
        >
          <button
            type="button"
            className="todo-item__grip"
            aria-label="Glisser pour réorganiser"
            {...provided.dragHandleProps}
          >
            <GripVertical size={20} />
          </button>

          <label className="todo-item__check-wrap">
            <input
              type="checkbox"
              className="todo-item__check"
              checked={todo.completed}
              onChange={() => onToggle(todo.id)}
              aria-label={todo.completed ? "Marquer non terminée" : "Marquer terminée"}
            />
            <span className="todo-item__check-ui" aria-hidden />
          </label>

          <div className="todo-item__body">
            {editing ? (
              <input
                ref={inputRef}
                className="todo-item__edit-input"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onBlur={saveEdit}
                onKeyDown={onKeyDown}
                maxLength={200}
                aria-label="Modifier le texte"
              />
            ) : (
              <button
                type="button"
                className="todo-item__text"
                onClick={() => setEditing(true)}
              >
                {todo.text}
              </button>
            )}
            <div className="todo-item__meta">
              <span className="tag">{getCategoryLabel(todo.category)}</span>
              {dueLabel && (
                <span className="todo-item__due">
                  <Calendar size={14} aria-hidden />
                  {dueLabel}
                </span>
              )}
            </div>
          </div>

          <div className="todo-item__actions">
            <button
              type="button"
              className="btn-icon"
              onClick={() => setEditing(true)}
              aria-label="Modifier"
              title="Modifier"
            >
              <Pencil size={18} />
            </button>
            <button
              type="button"
              className="btn-icon btn-icon--danger"
              onClick={() => onDelete(todo.id)}
              aria-label="Supprimer"
              title="Supprimer"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </li>
      )}
    </Draggable>
  );
}
