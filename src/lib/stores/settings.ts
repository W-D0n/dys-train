/**
 * Store de gestion des paramètres de l'application
 *
 * Gère les préférences utilisateur : objectif quotidien, thème,
 * niveau de difficulté des exercices, sons et notifications.
 *
 * @module stores/settings
 */

import { createLocalStorageStore } from '$lib/utils/storage';
import type { Settings } from '$lib/types';

// Valeur par défaut pour les paramètres
const defaultSettings: Settings = {
	dailyGoal: '',
	theme: 'light',
	nBackLevel: 1,
	soundEnabled: false,
	notificationsEnabled: false
};

// Store principal avec localStorage automatique
const { subscribe, set, update } = createLocalStorageStore<Settings>(
	'tdah-settings',
	defaultSettings
);

/**
 * Store de gestion des paramètres de l'application
 *
 * @example
 * ```typescript
 * import { settingsStore } from '$lib/stores/settings';
 *
 * // Définir l'objectif quotidien
 * settingsStore.setDailyGoal('Terminer 3 tâches');
 *
 * // Changer le niveau N-Back
 * settingsStore.setNBackLevel(2);
 * ```
 */
export const settingsStore = {
	subscribe,
	set,
	update,

	/**
	 * Définit l'objectif quotidien de l'utilisateur
	 *
	 * @param goal - Texte décrivant l'objectif quotidien
	 * @returns void
	 */
	setDailyGoal: (goal: string) => {
		update((settings) => ({ ...settings, dailyGoal: goal }));
	},

	/**
	 * Change le thème de l'application
	 *
	 * @param theme - Thème à appliquer ('light', 'dark' ou 'auto')
	 * @returns void
	 */
	setTheme: (theme: Settings['theme']) => {
		update((settings) => ({ ...settings, theme }));
	},

	/**
	 * Définit le niveau de difficulté du jeu N-Back
	 *
	 * @param level - Niveau de 1 (facile) à 3 (difficile)
	 * @returns void
	 */
	setNBackLevel: (level: Settings['nBackLevel']) => {
		update((settings) => ({ ...settings, nBackLevel: level }));
	},

	/**
	 * Bascule l'activation des sons dans l'application
	 *
	 * @returns void
	 */
	toggleSound: () => {
		update((settings) => ({ ...settings, soundEnabled: !settings.soundEnabled }));
	},

	/**
	 * Bascule l'activation des notifications dans l'application
	 *
	 * @returns void
	 */
	toggleNotifications: () => {
		update((settings) => ({
			...settings,
			notificationsEnabled: !settings.notificationsEnabled
		}));
	}
};
