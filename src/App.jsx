import { useMemo, useEffect, useCallback } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { applyGroupedDrag } from "./utils/dragGrouped";
import {
  compactByCategory,
  normalizeTask,
  dateKey,
  isEffectivelyCompleted,
} from "./utils/taskHelpers";
import Header from "./components/Header.jsx";
import TodoForm from "./components/TodoForm.jsx";
import TodoFilters from "./components/TodoFilters.jsx";
import TodoListByCategory from "./components/TodoListByCategory.jsx";
import BrainDump from "./components/BrainDump.jsx";
import { CATEGORIES } from "./constants/categories";
import "./App.css";

const STORAGE_TODOS = "todo-app-todos";
const STORAGE_THEME = "todo-app-theme";
const STORAGE_BRAIN = "todo-app-brain-dump";

/** Nouvelle tâche avec priorité, horizon, récurrence */
function createTask({
  text,
  category,
  dueDate,
  priority,
  goalHorizon,
  recurrence,
}) {
  return {
    id: crypto.randomUUID(),
    text,
    completed: false,
    category,
    dueDate: dueDate ?? null,
    priority: priority ?? "normale",
    goalHorizon: goalHorizon ?? "court_terme",
    recurrence: recurrence ?? { type: "none", weekdays: [] },
    lastCompletedDate: null,
    createdAt: new Date().toISOString(),
  };
}

function createBrainNote(text) {
  return {
    id: crypto.randomUUID(),
    text,
    createdAt: new Date().toISOString(),
  };
}

export default function App() {
  const [storedTodos, setStoredTodos] = useLocalStorage(STORAGE_TODOS, []);
  const [theme, setTheme] = useLocalStorage(STORAGE_THEME, "light");
  const [filter, setFilter] = useLocalStorage("todo-app-filter", "all");
  const [brainDump, setBrainDump] = useLocalStorage(STORAGE_BRAIN, []);

  const todos = useMemo(
    () => compactByCategory(storedTodos.map(normalizeTask)),
    [storedTodos]
  );

  const setTodos = useCallback(
    (updater) => {
      setStoredTodos((prev) => {
        const base = compactByCategory(prev.map(normalizeTask));
        const next = typeof updater === "function" ? updater(base) : updater;
        return compactByCategory(next.map(normalizeTask));
      });
    },
    [setStoredTodos]
  );

  const today = dateKey();

  const counts = useMemo(() => {
    const active = todos.filter((t) => !isEffectivelyCompleted(t, today)).length;
    const completed = todos.filter((t) => isEffectivelyCompleted(t, today)).length;
    return { all: todos.length, active, completed };
  }, [todos, today]);

  const filteredTodos = useMemo(() => {
    if (filter === "active") {
      return todos.filter((t) => !isEffectivelyCompleted(t, today));
    }
    if (filter === "completed") {
      return todos.filter((t) => isEffectivelyCompleted(t, today));
    }
    return todos;
  }, [todos, filter, today]);

  /** Tâches visibles, rangées par sections de catégorie */
  const todosByCategory = useMemo(() => {
    const map = Object.fromEntries(CATEGORIES.map((c) => [c.id, []]));
    for (const t of filteredTodos) {
      const key = map[t.category] !== undefined ? t.category : "autre";
      (map[key] ?? map.autre).push(t);
    }
    return map;
  }, [filteredTodos]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  /** Nouveau jour : les récurrences « fait hier » redeviennent à cocher */
  useEffect(() => {
    function sweep() {
      const tk = dateKey();
      setTodos((prev) => {
        let changed = false;
        const next = prev.map((t) => {
          if (
            (t.recurrence?.type === "daily" ||
              t.recurrence?.type === "weekly") &&
            t.lastCompletedDate &&
            t.lastCompletedDate !== tk
          ) {
            changed = true;
            return { ...t, completed: false, lastCompletedDate: null };
          }
          return t;
        });
        return changed ? next : prev;
      });
    }
    sweep();
    function onVis() {
      if (document.visibilityState === "visible") sweep();
    }
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [setTodos]);

  const toggleDark = useCallback(() => {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }, [setTheme]);

  const addTodo = useCallback(
    (payload) => {
      setTodos((prev) => [...prev, createTask(payload)]);
    },
    [setTodos]
  );

  const toggleTodo = useCallback(
    (id) => {
      const tk = dateKey();
      setTodos((prev) =>
        prev.map((t) => {
          if (t.id !== id) return t;
          const eff = isEffectivelyCompleted(t, tk);
          if (!t.recurrence || t.recurrence.type === "none") {
            return { ...t, completed: !t.completed };
          }
          if (eff) {
            return { ...t, completed: false, lastCompletedDate: null };
          }
          return { ...t, completed: true, lastCompletedDate: tk };
        })
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

  const onDragEnd = useCallback(
    (result) => {
      if (!result.destination) return;
      setTodos((prev) => applyGroupedDrag(prev, filter, result, today));
    },
    [filter, setTodos, today]
  );

  const addBrain = useCallback(
    (text) => {
      setBrainDump((prev) => [...prev, createBrainNote(text)]);
    },
    [setBrainDump]
  );

  const deleteBrain = useCallback(
    (id) => {
      setBrainDump((prev) => prev.filter((n) => n.id !== id));
    },
    [setBrainDump]
  );

  const promoteBrain = useCallback(
    (note) => {
      setTodos((prev) => [
        ...prev,
        createTask({
          text: note.text,
          category: "autre",
          dueDate: null,
          priority: "normale",
          goalHorizon: "court_terme",
          recurrence: { type: "none", weekdays: [] },
        }),
      ]);
      setBrainDump((prev) => prev.filter((n) => n.id !== note.id));
    },
    [setTodos, setBrainDump]
  );

  const darkMode = theme === "dark";
  const brainItems = Array.isArray(brainDump) ? brainDump : [];

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
          <TodoListByCategory
            todosByCategory={todosByCategory}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
            onUpdate={updateTodo}
          />
        </DragDropContext>
        <BrainDump
          items={brainItems}
          onAdd={addBrain}
          onDelete={deleteBrain}
          onPromote={promoteBrain}
        />
      </div>
    </div>
  );
}
