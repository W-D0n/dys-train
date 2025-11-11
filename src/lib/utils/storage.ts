import { writable, type Writable } from 'svelte/store';
import { browser } from '$app/environment';

/**
 * Crée un store Svelte synchronisé avec localStorage
 * Gère automatiquement le chargement initial et la sauvegarde
 *
 * @param key - Clé localStorage
 * @param defaultValue - Valeur par défaut si rien dans localStorage
 * @returns Store writable synchronisé
 */
export function createLocalStorageStore<T>(key: string, defaultValue: T): Writable<T> {
	// Chargement initial depuis localStorage (uniquement côté client)
	const initialValue: T = browser ? loadFromStorage(key, defaultValue) : defaultValue;

	// Création du store
	const store = writable<T>(initialValue);

	// Sauvegarde automatique dans localStorage à chaque changement
	if (browser) {
		store.subscribe((value) => {
			try {
				localStorage.setItem(key, JSON.stringify(value));
			} catch (error) {
				console.error(`Erreur lors de la sauvegarde dans localStorage (${key}):`, error);
			}
		});
	}

	return store;
}

/**
 * Charge une valeur depuis localStorage avec gestion d'erreur
 */
function loadFromStorage<T>(key: string, defaultValue: T): T {
	try {
		const item = localStorage.getItem(key);
		return item ? JSON.parse(item) : defaultValue;
	} catch (error) {
		console.error(`Erreur lors du chargement depuis localStorage (${key}):`, error);
		return defaultValue;
	}
}
