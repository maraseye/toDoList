import { Moon, Sun, ListTodo } from "lucide-react";

/**
 * En-tête de l'app : titre + bascule thème clair/sombre.
 */
export default function Header({ darkMode, onToggleDark }) {
  return (
    <header className="app-header">
      <div className="app-header__brand">
        <span className="app-header__icon" aria-hidden>
          <ListTodo size={28} strokeWidth={2} />
        </span>
        <div>
          <h1 className="app-header__title">Mes tâches</h1>
          <p className="app-header__subtitle">Organisez votre journée</p>
        </div>
      </div>
      <button
        type="button"
        className="btn-icon theme-toggle"
        onClick={onToggleDark}
        aria-label={darkMode ? "Passer en mode clair" : "Passer en mode sombre"}
        title={darkMode ? "Mode clair" : "Mode sombre"}
      >
        {darkMode ? <Sun size={22} /> : <Moon size={22} />}
      </button>
    </header>
  );
}
