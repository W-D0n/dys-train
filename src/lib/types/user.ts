/**
 * Types pour les utilisateurs et statistiques cognitives
 *
 * @module types/user
 */

/**
 * Scores cognitifs de l'utilisateur
 *
 * @interface CognitiveScore
 * @property {number} workingMemory - Score de mémoire de travail (0-100)
 * @property {number} executive - Score des fonctions exécutives (0-100)
 */
export interface CognitiveScore {
	workingMemory: number;
	executive: number;
}

/**
 * Statistiques utilisateur complètes
 *
 * @interface UserStats
 * @property {CognitiveScore} cognitiveScore - Scores cognitifs
 * @property {number} totalTasksCompleted - Nombre total de tâches complétées
 * @property {number} totalSubtasksCompleted - Nombre total de sous-tâches complétées
 * @property {number} streakDays - Nombre de jours consécutifs d'activité
 * @property {string} lastActiveDate - Dernière date d'activité (ISO 8601)
 *
 * @example
 * ```typescript
 * const stats: UserStats = {
 *   cognitiveScore: { workingMemory: 75, executive: 60 },
 *   totalTasksCompleted: 10,
 *   totalSubtasksCompleted: 45,
 *   streakDays: 5,
 *   lastActiveDate: '2025-01-11T00:00:00.000Z'
 * };
 * ```
 */
export interface UserStats {
	cognitiveScore: CognitiveScore;
	totalTasksCompleted: number;
	totalSubtasksCompleted: number;
	streakDays: number;
	lastActiveDate: string;
}
