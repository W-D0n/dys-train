/**
 * Store de gestion des statistiques utilisateur
 *
 * Gère les scores cognitifs (mémoire de travail, fonctions exécutives),
 * les compteurs de progression et la série de jours consécutifs d'activité.
 *
 * @module stores/user
 */

import { createLocalStorageStore } from '$lib/utils/storage';
import type { UserStats, CognitiveScore } from '$lib/types';

// Valeur par défaut pour un nouvel utilisateur
const defaultUserStats: UserStats = {
	cognitiveScore: { workingMemory: 0, executive: 0 },
	totalTasksCompleted: 0,
	totalSubtasksCompleted: 0,
	streakDays: 0,
	lastActiveDate: new Date().toISOString()
};

// Store principal avec localStorage automatique
const { subscribe, set, update } = createLocalStorageStore<UserStats>(
	'tdah-user-stats',
	defaultUserStats
);

/**
 * Store de gestion des statistiques utilisateur
 *
 * @example
 * ```typescript
 * import { userStore } from '$lib/stores/user';
 *
 * // Augmenter le score de mémoire de travail
 * userStore.incrementWorkingMemory(5);
 *
 * // Mettre à jour la série de jours
 * userStore.updateStreak();
 * ```
 */
export const userStore = {
	subscribe,
	set,
	update,

	/**
	 * Augmente le score de mémoire de travail
	 *
	 * Le score est plafonné à 100. Utilisé après complétion d'exercices
	 * cognitifs comme N-Back.
	 *
	 * @param points - Nombre de points à ajouter (défaut: 1)
	 * @returns void
	 */
	incrementWorkingMemory: (points: number = 1) => {
		update((stats) => ({
			...stats,
			cognitiveScore: {
				...stats.cognitiveScore,
				workingMemory: Math.min(100, stats.cognitiveScore.workingMemory + points)
			}
		}));
	},

	/**
	 * Augmente le score des fonctions exécutives
	 *
	 * Le score est plafonné à 100. Incrémente également le compteur
	 * de sous-tâches complétées. Utilisé lors de la validation de sous-tâches.
	 *
	 * @param points - Nombre de points à ajouter (défaut: 2)
	 * @returns void
	 */
	incrementExecutive: (points: number = 2) => {
		update((stats) => ({
			...stats,
			cognitiveScore: {
				...stats.cognitiveScore,
				executive: Math.min(100, stats.cognitiveScore.executive + points)
			},
			totalSubtasksCompleted: stats.totalSubtasksCompleted + 1
		}));
	},

	/**
	 * Marque une tâche comme complétée
	 *
	 * Incrémente le compteur total de tâches complétées.
	 *
	 * @returns void
	 */
	completeTask: () => {
		update((stats) => ({
			...stats,
			totalTasksCompleted: stats.totalTasksCompleted + 1
		}));
	},

	/**
	 * Met à jour la série de jours consécutifs d'activité
	 *
	 * - Si l'activité date d'hier : incrémente la série
	 * - Si l'activité date d'aujourd'hui : ne change rien
	 * - Sinon : réinitialise la série à 1
	 *
	 * @returns void
	 */
	updateStreak: () => {
		update((stats) => {
			const today = new Date().toDateString();
			const lastActive = new Date(stats.lastActiveDate).toDateString();
			const yesterday = new Date(Date.now() - 86400000).toDateString();

			let newStreak = stats.streakDays;
			if (lastActive === yesterday) {
				newStreak += 1;
			} else if (lastActive !== today) {
				newStreak = 1;
			}

			return {
				...stats,
				streakDays: newStreak,
				lastActiveDate: new Date().toISOString()
			};
		});
	},

	/**
	 * Réinitialise tous les scores cognitifs à zéro
	 *
	 * Conserve les compteurs de progression et la série de jours.
	 * Utile pour recommencer l'évaluation cognitive.
	 *
	 * @returns void
	 */
	resetScores: () => {
		update((stats) => ({
			...stats,
			cognitiveScore: { workingMemory: 0, executive: 0 }
		}));
	}
};
