/** Niveaux de priorité affichés sur les cartes */
export const PRIORITIES = [
  { id: "basse", label: "Basse", short: "B", color: "var(--prio-low)" },
  { id: "normale", label: "Normale", short: "N", color: "var(--prio-mid)" },
  { id: "haute", label: "Haute", short: "H", color: "var(--prio-high)" },
  { id: "urgente", label: "Urgente", short: "!", color: "var(--prio-urgent)" },
];

/** Court terme vs objectif long terme */
export const GOAL_HORIZONS = [
  { id: "court_terme", label: "Court terme", hint: "Actions du moment" },
  { id: "long_terme", label: "Long terme", hint: "Objectif à construire dans le temps" },
];

/** Récurrence : chaque jour ou certains jours */
export const RECURRENCE_TYPES = [
  { id: "none", label: "Aucune" },
  { id: "daily", label: "Chaque jour" },
  { id: "weekly", label: "Certains jours" },
];

/** Jours de la semaine (0 = dimanche, comme Date.getDay()) */
export const WEEKDAYS = [
  { id: 0, label: "Dim" },
  { id: 1, label: "Lun" },
  { id: 2, label: "Mar" },
  { id: 3, label: "Mer" },
  { id: 4, label: "Jeu" },
  { id: 5, label: "Ven" },
  { id: 6, label: "Sam" },
];

export function getPriorityMeta(id) {
  return PRIORITIES.find((p) => p.id === id) ?? PRIORITIES[1];
}
