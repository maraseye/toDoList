import { useMemo, useEffect, useCallback } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { reorderAfterDrag } from "./utils/reorderTodos";
import Header from "./components/Header.jsx";
import TodoForm from "./components/TodoForm.jsx";
import TodoFilters from "./components/TodoFilters.jsx";
import TodoList from "./components/TodoList.jsx";
import "./App.css";

const STORAGE_TODOS = "todo-app-todos";
const STORAGE_THEME = "todo-app-theme";

/** Crée un objet tâche avec un id unique */
function createTask({ text, category, dueDate }) {
  return {
    id: crypto.randomUUID(),
    text,
    completed: false,
    category,
    dueDate,
    createdAt: new Date().toISOString(),
  };
}

export default function App() {
  const [todos, setTodos] = useLocalStorage(STORAGE_TODOS, []);
  const [theme, setTheme] = useLocalStorage(STORAGE_THEME, "light");
  const [filter, setFilter] = useLocalStorage("todo-app-filter", "all");

  const darkMode = theme === "dark";

  // Applique la classe sur <html> pour le thème (utilisé par index.css)
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const toggleDark = useCallback(() => {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }, [setTheme]);

  const filteredTodos = useMemo(() => {
    if (filter === "active") return todos.filter((t) => !t.completed);
    if (filter === "completed") return todos.filter((t) => t.completed);
    return todos;
  }, [todos, filter]);

  const counts = useMemo(
    () => ({
      all: todos.length,
      active: todos.filter((t) => !t.completed).length,
      completed: todos.filter((t) => t.completed).length,
    }),
    [todos]
  );

  const addTodo = useCallback(
    (payload) => {
      setTodos((prev) => [...prev, createTask(payload)]);
    },
    [setTodos]
  );

  const toggleTodo = useCallback(
    (id) => {
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
      );
    },
    [setTodos]
  );

  const deleteTodo = useCallback(
    (id) => {
      setTodos((prev) => prev.filter((t) => t.id !== id));
    },
    [setTodos]
  );

  const updateTodo = useCallback(
    (id, patch) => {
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...patch } : t))
      );
    },
    [setTodos]
  );

  /** Fin du glisser-déposer : recalcule l’ordre des tâches */
  const onDragEnd = useCallback(
    (result) => {
      const { destination, source } = result;
      if (!destination) return;
      setTodos((prev) =>
        reorderAfterDrag(prev, filter, source.index, destination.index)
      );
    },
    [filter, setTodos]
  );

  return (
    <div className="app">
      <div className="app__shell">
        <Header darkMode={darkMode} onToggleDark={toggleDark} />
        <TodoForm onAdd={addTodo} />
        <TodoFilters
          filter={filter}
          onFilterChange={setFilter}
          counts={counts}
        />
        <DragDropContext onDragEnd={onDragEnd}>
          <TodoList
            todos={filteredTodos}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
            onUpdate={updateTodo}
          />
        </DragDropContext>
      </div>
    </div>
  );
}
