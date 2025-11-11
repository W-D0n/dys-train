import { createLocalStorageStore } from '$lib/utils/storage';
import type { LearningPath } from '$lib/types';
import { nanoid } from 'nanoid';

// Store principal avec localStorage automatique
const { subscribe, set, update } = createLocalStorageStore<LearningPath[]>(
	'learning-paths',
	[]
);

export const learningPathsStore = {
	subscribe,
	set,
	update,

	/**
	 * Crée un nouveau parcours d'apprentissage
	 */
	create: (path: Omit<LearningPath, 'id' | 'createdAt' | 'updatedAt' | 'isActive'>) => {
		const newPath: LearningPath = {
			...path,
			id: nanoid(),
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			isActive: false
		};

		update((paths) => [...paths, newPath]);
		return newPath.id;
	},

	/**
	 * Met à jour un parcours existant
	 */
	updatePath: (id: string, updates: Partial<Omit<LearningPath, 'id' | 'createdAt'>>) => {
		update((paths) =>
			paths.map((path) =>
				path.id === id
					? { ...path, ...updates, updatedAt: new Date().toISOString() }
					: path
			)
		);
	},

	/**
	 * Supprime un parcours
	 */
	delete: (id: string) => {
		update((paths) => paths.filter((path) => path.id !== id));
	},

	/**
	 * Active un parcours (et désactive les autres)
	 */
	activate: (id: string) => {
		update((paths) =>
			paths.map((path) => ({ ...path, isActive: path.id === id }))
		);
	},

	/**
	 * Récupère le parcours actif
	 */
	getActive: (paths: LearningPath[]): LearningPath | null => {
		return paths.find((path) => path.isActive) || null;
	}
};
