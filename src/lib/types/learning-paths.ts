/**
 * Types pour les parcours d'apprentissage
 *
 * @module types/learning-paths
 */

import type { Task } from './tasks';

/**
 * Parcours d'apprentissage personnalisé
 *
 * @interface LearningPath
 * @property {string} id - Identifiant unique du parcours
 * @property {string} title - Titre du parcours
 * @property {string} description - Description détaillée
 * @property {number} estimatedHours - Durée estimée en heures
 * @property {Task[]} tasks - Liste des tâches du parcours
 * @property {string} createdAt - Date de création (ISO 8601)
 * @property {string} updatedAt - Date de dernière modification (ISO 8601)
 * @property {boolean} isActive - Indique si ce parcours est actuellement actif
 */
export interface LearningPath {
	id: string;
	title: string;
	description: string;
	estimatedHours: number;
	tasks: Task[];
	createdAt: string;
	updatedAt: string;
	isActive: boolean;
}

/**
 * Étape du builder de parcours
 *
 * @interface PathBuilderStep
 * @property {number} step - Numéro de l'étape (1, 2, 3...)
 * @property {string} title - Titre de l'étape
 * @property {boolean} isCompleted - Indique si l'étape est terminée
 */
export interface PathBuilderStep {
	step: number;
	title: string;
	isCompleted: boolean;
}

/**
 * Mode de création de parcours
 *
 * @typedef {'wizard' | 'dragdrop'} BuilderMode
 * - wizard: Interface step-by-step guidée
 * - dragdrop: Interface drag & drop avancée
 */
export type BuilderMode = 'wizard' | 'dragdrop';
