<script lang="ts">
	import type { PanelVariant } from '$lib/types/ui';
	import type { Snippet } from 'svelte';

	/**
	 * Panel - Composant conteneur avec variants de couleur et animation
	 *
	 * @component
	 * @example
	 * ```svelte
	 * <Panel variant="blue" title="Mon titre" animate>
	 *   Contenu ici
	 * </Panel>
	 * ```
	 */

	interface Props {
		/** Variante de couleur du panel */
		variant?: PanelVariant;
		/** Titre optionnel du panel */
		title?: string;
		/** Activer l'animation fade-in */
		animate?: boolean;
		/** Contenu du composant */
		children: Snippet;
	}

	let { variant = 'gray', title, animate = true, children }: Props = $props();

	const variantClasses: Record<PanelVariant, string> = {
		blue: 'bg-blue-50 dark:bg-blue-900 border-blue-200 dark:border-blue-700 text-blue-900 dark:text-blue-100',
		green:
			'bg-green-50 dark:bg-green-900 border-green-200 dark:border-green-700 text-green-900 dark:text-green-100',
		purple:
			'bg-purple-50 dark:bg-purple-900 border-purple-200 dark:border-purple-700 text-purple-900 dark:text-purple-100',
		orange:
			'bg-orange-50 dark:bg-orange-900 border-orange-200 dark:border-orange-700 text-orange-900 dark:text-orange-100',
		yellow:
			'bg-yellow-50 dark:bg-yellow-900 border-yellow-200 dark:border-yellow-700 text-yellow-900 dark:text-yellow-100',
		red: 'bg-red-50 dark:bg-red-900 border-red-200 dark:border-red-700 text-red-900 dark:text-red-100',
		gray: 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100'
	};

	const titleColorClasses: Record<PanelVariant, string> = {
		blue: 'text-blue-800 dark:text-blue-200',
		green: 'text-green-800 dark:text-green-200',
		purple: 'text-purple-800 dark:text-purple-200',
		orange: 'text-orange-800 dark:text-orange-200',
		yellow: 'text-yellow-800 dark:text-yellow-200',
		red: 'text-red-800 dark:text-red-200',
		gray: 'text-gray-800 dark:text-gray-200'
	};
</script>

<div class="border rounded-lg p-6 {variantClasses[variant]} {animate ? 'fade-in' : ''}">
	{#if title}
		<h3 class="font-bold text-lg mb-3 {titleColorClasses[variant]}">
			{title}
		</h3>
	{/if}
	{@render children()}
</div>

<style>
	.fade-in {
		animation: fadeIn 0.3s ease-in;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(8px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
