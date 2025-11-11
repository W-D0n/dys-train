/**
 * Types pour les composants UI
 *
 * @module types/ui
 */

/**
 * Variantes de couleur pour les panels
 *
 * @typedef {'blue' | 'green' | 'purple' | 'orange' | 'yellow' | 'red' | 'gray'} PanelVariant
 */
export type PanelVariant =
	| 'blue'
	| 'green'
	| 'purple'
	| 'orange'
	| 'yellow'
	| 'red'
	| 'gray';

/**
 * Item d'une liste d'informations
 *
 * @interface InfoListItem
 * @property {string} label - Label/titre de l'item
 * @property {string} description - Description détaillée
 *
 * @example
 * ```typescript
 * const item: InfoListItem = {
 *   label: 'Chunking',
 *   description: 'Regroupe l\'information par paquets'
 * };
 * ```
 */
export interface InfoListItem {
	label: string;
	description: string;
}

/**
 * Panel de stratégies avec items
 *
 * @interface StrategyPanel
 * @property {PanelVariant} variant - Couleur du panel
 * @property {string} title - Titre du panel
 * @property {InfoListItem[]} items - Liste des items à afficher
 *
 * @example
 * ```typescript
 * const panel: StrategyPanel = {
 *   variant: 'blue',
 *   title: 'Stratégies mémoire',
 *   items: [
 *     { label: 'Chunking', description: '...' },
 *     { label: 'Répétition', description: '...' }
 *   ]
 * };
 * ```
 */
export interface StrategyPanel {
	variant: PanelVariant;
	title: string;
	items: InfoListItem[];
}
