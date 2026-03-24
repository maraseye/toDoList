import { useState, useEffect } from "react";

/**
 * Hook pour lire/écrire une valeur dans localStorage de façon synchronisée avec React.
 * @param {string} key - Clé du stockage
 * @param {T} initialValue - Valeur par défaut si rien n'est sauvegardé
 * @returns {[T, function]} Valeur courante et setter (même API que useState)
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key);
      return raw != null ? JSON.parse(raw) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (e) {
      console.warn("localStorage plein ou indisponible", e);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
