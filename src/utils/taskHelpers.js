import { CATEGORIES } from "../constants/categories.js";

/** Clé date locale YYYY-MM-DD */
export function dateKey(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Tâche « terminée » pour l’affichage (réinitialisation des récurrences au fil du temps) */
export function isEffectivelyCompleted(task, todayKeyStr = dateKey()) {
  if (!task.recurrence || task.recurrence.type === "none") {
    return !!task.completed;
  }
  if (task.recurrence.type === "daily") {
    return !!task.completed && task.lastCompletedDate === todayKeyStr;
  }
  if (task.recurrence.type === "weekly") {
    const todayD = new Date().getDay();
    const days = task.recurrence.weekdays ?? [];
    if (days.length > 0 && !days.includes(todayD)) {
      return false;
    }
    return !!task.completed && task.lastCompletedDate === todayKeyStr;
  }
  return !!task.completed;
}

/** Libellé court pour la récurrence */
export function formatRecurrenceLabel(recurrence) {
  if (!recurrence || recurrence.type === "none") return null;
  if (recurrence.type === "daily") return "Chaque jour";
  if (recurrence.type === "weekly") {
    const days = recurrence.weekdays ?? [];
    if (days.length === 0) return "Semaine (choisir jours)";
    const names = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
    return days
      .slice()
      .sort((a, b) => a - b)
      .map((i) => names[i])
      .join(", ");
  }
  return null;
}

/** Normalise une tâche chargée depuis le stockage (anciennes données) */
export function normalizeTask(raw) {
  const r = raw.recurrence;
  const recurrence =
    r && typeof r === "object"
      ? {
          type: r.type ?? "none",
          weekdays: Array.isArray(r.weekdays) ? r.weekdays : [],
        }
      : { type: "none", weekdays: [] };

  return {
    ...raw,
    category: raw.category || "autre",
    priority: raw.priority ?? "normale",
    goalHorizon: raw.goalHorizon ?? "court_terme",
    recurrence,
    lastCompletedDate: raw.lastCompletedDate ?? null,
  };
}

/**
 * Réordonne le tableau : d’abord catégorie 1, puis 2, etc.
 * Les tâches d’une même catégorie gardent leur ordre relatif.
 */
export function compactByCategory(todos) {
  const buckets = {};
  for (const c of CATEGORIES) buckets[c.id] = [];
  for (const t of todos) {
    const key = buckets[t.category] !== undefined ? t.category : "autre";
    (buckets[key] ?? buckets.autre).push(t);
  }
  return CATEGORIES.flatMap((c) => buckets[c.id] ?? []);
}
