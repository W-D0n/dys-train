/**
 * Store de gestion des tâches d'apprentissage
 *
 * Gère la liste des tâches avec persistence automatique dans localStorage.
 * Permet l'ajout, la suppression et le suivi de progression des tâches.
 *
 * @module stores/tasks
 */

import { createLocalStorageStore } from '$lib/utils/storage';
import type { Task } from '$lib/types';

// Ré-exporter les constantes pour la compatibilité
export { CATEGORY_COLORS as categoryColors, FRONTEND_TASKS as frontendTasks } from '$lib/constants/tasks';
export type { Task } from '$lib/types';

// Store principal avec localStorage automatique
const { subscribe, set, update } = createLocalStorageStore<Task[]>('tdah-tasks', []);

/**
 * Store de gestion des tâches d'apprentissage
 *
 * @example
 * ```typescript
 * import { tasksStore } from '$lib/stores/tasks';
 *
 * // Ajouter une tâche
 * tasksStore.addTask({
 *   title: 'Apprendre React',
 *   category: 'react',
 *   time: 60,
 *   subtasks: ['Lire doc', 'Faire exercices']
 * });
 *
 * // Basculer une sous-tâche
 * tasksStore.toggleSubtask(taskId, 0);
 * ```
 */
export const tasksStore = {
	subscribe,
	set,
	update,

	/**
	 * Ajoute une nouvelle tâche à la liste
	 *
	 * @param task - Données de la tâche (sans id, completed, subtasksCompleted, dateAdded)
	 * @returns void
	 *
	 * @example
	 * ```typescript
	 * tasksStore.addTask({
	 *   title: 'CSS Grid',
	 *   category: 'css',
	 *   time: 45,
	 *   subtasks: ['Layout de base', 'Responsive']
	 * });
	 * ```
	 */
	addTask: (task: Omit<Task, 'id' | 'completed' | 'subtasksCompleted' | 'dateAdded'>) => {
		const newTask: Task = {
			...task,
			id: Date.now(),
			completed: false,
			subtasksCompleted: new Array(task.subtasks.length).fill(false),
			dateAdded: new Date().toISOString()
		};
		update((tasks) => [...tasks, newTask]);
	},

	/**
	 * Bascule l'état d'une sous-tâche (complétée/non complétée)
	 *
	 * Si toutes les sous-tâches sont complétées, marque automatiquement
	 * la tâche principale comme complétée.
	 *
	 * @param taskId - ID de la tâche parente
	 * @param subtaskIndex - Index de la sous-tâche à basculer
	 * @returns void
	 */
	toggleSubtask: (taskId: number, subtaskIndex: number) => {
		update((tasks) => {
			const taskIndex = tasks.findIndex((t) => t.id === taskId);
			if (taskIndex === -1) return tasks;

			const originalTask = tasks[taskIndex];
			if (!originalTask) return tasks;

			const subtasksCompleted = [...(originalTask.subtasksCompleted || [])];
			subtasksCompleted[subtaskIndex] = !subtasksCompleted[subtaskIndex];

			const newTasks = [...tasks];
			newTasks[taskIndex] = {
				...originalTask,
				subtasksCompleted,
				completed: subtasksCompleted.every((s) => s)
			};
			return newTasks;
		});
	},

	/**
	 * Supprime une tâche de la liste
	 *
	 * @param taskId - ID de la tâche à supprimer
	 * @returns void
	 */
	removeTask: (taskId: number) => {
		update((tasks) => tasks.filter((t) => t.id !== taskId));
	},

	/**
	 * Supprime toutes les tâches complétées de la liste
	 *
	 * Utile pour nettoyer la liste et garder uniquement les tâches en cours.
	 *
	 * @returns void
	 */
	clearCompleted: () => {
		update((tasks) => tasks.filter((t) => !t.completed));
	}
};
