/**
 * Types pour les tâches d'apprentissage
 *
 * @module types/tasks
 */

/**
 * Tâche d'apprentissage avec sous-tâches et progression
 *
 * @interface Task
 * @property {number} id - Identifiant unique de la tâche
 * @property {string} title - Titre de la tâche
 * @property {TaskCategory} category - Catégorie (html, css, js, react, tools)
 * @property {number} time - Durée estimée en minutes
 * @property {string[]} subtasks - Liste des sous-tâches
 * @property {boolean[]} subtasksCompleted - État de complétion de chaque sous-tâche
 * @property {boolean} completed - Indique si la tâche est complètement terminée
 * @property {string} dateAdded - Date d'ajout (ISO 8601)
 *
 * @example
 * ```typescript
 * const task: Task = {
 *   id: 1,
 *   title: 'Apprendre React',
 *   category: 'react',
 *   time: 60,
 *   subtasks: ['Composants', 'Props', 'State'],
 *   subtasksCompleted: [true, false, false],
 *   completed: false,
 *   dateAdded: '2025-01-01T00:00:00.000Z'
 * };
 * ```
 */
export interface Task {
	id: number;
	title: string;
	category: TaskCategory;
	time: number;
	subtasks: string[];
	subtasksCompleted: boolean[];
	completed: boolean;
	dateAdded: string;
}

/**
 * Catégorie de tâche
 *
 * @typedef {'html' | 'css' | 'js' | 'react' | 'tools'} TaskCategory
 */
export type TaskCategory = 'html' | 'css' | 'js' | 'react' | 'tools';
