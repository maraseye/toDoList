/** Catégories : travail et études sont distinctes */
export const CATEGORIES = [
  { id: "travail", label: "Travail", emoji: "💼" },
  { id: "etudes", label: "Études", emoji: "📚" },
  { id: "personnel", label: "Personnel", emoji: "🏠" },
  { id: "courses", label: "Courses", emoji: "🛒" },
  { id: "sante", label: "Santé", emoji: "🏃" },
  { id: "autre", label: "Autre", emoji: "📌" },
];

export function getCategoryLabel(categoryId) {
  const c = CATEGORIES.find((x) => x.id === categoryId);
  return c ? `${c.emoji} ${c.label}` : categoryId;
}
