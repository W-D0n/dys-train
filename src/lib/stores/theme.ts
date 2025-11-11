/**
 * Store de gestion du thème de l'interface
 *
 * Gère le basculement entre mode clair et mode sombre.
 * Le thème est automatiquement appliqué sur l'élément racine du DOM.
 *
 * @module stores/theme
 */

import { createLocalStorageStore } from '$lib/utils/storage';

type Theme = 'light' | 'dark';

// Store avec localStorage automatique
const { subscribe, set, update } = createLocalStorageStore<Theme>('theme', 'dark');

/**
 * Store de gestion du thème
 *
 * @example
 * ```typescript
 * import { themeStore } from '$lib/stores/theme';
 *
 * // Basculer entre light/dark
 * themeStore.toggle();
 *
 * // Définir un thème spécifique
 * themeStore.set('dark');
 * ```
 */
export const themeStore = {
	subscribe,
	set,
	update,

	/**
	 * Bascule entre les modes clair et sombre
	 *
	 * @returns void
	 */
	toggle: () => {
		update((current) => (current === 'dark' ? 'light' : 'dark'));
	}
};
