/**
 * Réorganise le tableau complet `todos` après un drag & drop sur la liste filtrée.
 * Les tâches non visibles gardent leur place relative ; seules les positions des visibles changent.
 */
export function reorderAfterDrag(todos, filter, sourceIndex, destinationIndex) {
  if (destinationIndex == null || sourceIndex === destinationIndex) {
    return todos;
  }

  const isVisible = (t) => {
    if (filter === "active") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  };

  const visible = todos.filter(isVisible);
  const nextVisible = Array.from(visible);
  const [removed] = nextVisible.splice(sourceIndex, 1);
  nextVisible.splice(destinationIndex, 0, removed);

  let v = 0;
  return todos.map((t) => {
    if (!isVisible(t)) return t;
    const item = nextVisible[v];
    v += 1;
    return item;
  });
}
