/**
 * Types pour les paramètres de l'application
 *
 * @module types/settings
 */

/**
 * Paramètres utilisateur de l'application
 *
 * @interface Settings
 * @property {string} dailyGoal - Objectif quotidien de l'utilisateur
 * @property {Theme} theme - Thème de l'interface (light, dark, auto)
 * @property {1 | 2 | 3} nBackLevel - Niveau de difficulté N-Back (1=facile, 3=difficile)
 * @property {boolean} soundEnabled - Sons activés
 * @property {boolean} notificationsEnabled - Notifications activées
 *
 * @example
 * ```typescript
 * const settings: Settings = {
 *   dailyGoal: 'Terminer le module React',
 *   theme: 'dark',
 *   nBackLevel: 2,
 *   soundEnabled: true,
 *   notificationsEnabled: false
 * };
 * ```
 */
export interface Settings {
	dailyGoal: string;
	theme: Theme;
	nBackLevel: 1 | 2 | 3;
	soundEnabled: boolean;
	notificationsEnabled: boolean;
}

/**
 * Thème de l'interface
 *
 * @typedef {'light' | 'dark' | 'auto'} Theme
 * - light: Mode clair
 * - dark: Mode sombre
 * - auto: Selon les préférences système
 */
export type Theme = 'light' | 'dark' | 'auto';
