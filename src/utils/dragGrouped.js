/**
 * Drag & drop quand les tâches sont groupées par catégorie (plusieurs Droppable).
 */

import { compactByCategory, isEffectivelyCompleted } from "./taskHelpers.js";

function matchFilter(task, filter) {
  if (filter === "active") return !task._effectiveCompleted;
  if (filter === "completed") return !!task._effectiveCompleted;
  return true;
}

function attachEffectiveCompleted(todos, todayKeyStr) {
  return todos.map((t) => ({
    ...t,
    _effectiveCompleted: isEffectivelyCompleted(t, todayKeyStr),
  }));
}

function stripEffective(todos) {
  return todos.map(({ _effectiveCompleted, ...rest }) => rest);
}

function reorderWithinCategory(todos, categoryId, filter, fromIndex, toIndex) {
  if (fromIndex === toIndex) return todos;

  const catTasks = todos.filter(
    (t) => t.category === categoryId && matchFilter(t, filter)
  );
  const next = [...catTasks];
  const [moved] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, moved);

  let i = 0;
  return todos.map((t) => {
    if (t.category !== categoryId || !matchFilter(t, filter)) return t;
    const item = next[i];
    i += 1;
    return item;
  });
}

function moveBetweenCategories(todos, taskId, destCategoryId, filter, destIndex) {
  const task = todos.find((t) => t.id === taskId);
  if (!task) return todos;

  const withoutTask = todos.filter((t) => t.id !== taskId);
  const moved = { ...task, category: destCategoryId };

  const isDestVis = (t) =>
    t.category === destCategoryId && matchFilter(t, filter);
  const destVisible = withoutTask.filter(isDestVis);
  const newDestVisible = [...destVisible];
  newDestVisible.splice(
    Math.min(destIndex, newDestVisible.length),
    0,
    moved
  );

  const nonDest = withoutTask.filter((t) => !isDestVis(t));
  const merged = [...nonDest, ...newDestVisible];
  return compactByCategory(merged);
}

/**
 * Applique le résultat du drag (@hello-pangea) sur la liste complète.
 * droppableId = identifiant de catégorie (ex: "travail").
 */
export function applyGroupedDrag(todos, filter, result, todayKeyStr) {
  const { destination, source, draggableId } = result;
  if (!destination) return todos;

  const withEff = attachEffectiveCompleted(todos, todayKeyStr);
  const sourceCat = source.droppableId;
  const destCat = destination.droppableId;
  const fromIndex = source.index;
  const toIndex = destination.index;

  if (sourceCat === destCat) {
    const next = reorderWithinCategory(
      withEff,
      sourceCat,
      filter,
      fromIndex,
      toIndex
    );
    return stripEffective(next);
  }

  const next = moveBetweenCategories(
    withEff,
    draggableId,
    destCat,
    filter,
    toIndex
  );
  return stripEffective(next);
}
