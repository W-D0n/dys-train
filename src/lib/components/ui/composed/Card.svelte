<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Box, Section } from '$lib/components/ui/primitives';

	/**
	 * Card - Composant composé utilisant Box et Section
	 *
	 * @component
	 * @example
	 * ```svelte
	 * <Card class="max-w-md">
	 *   {#snippet header()}
	 *     <h2>Titre</h2>
	 *   {/snippet}
	 *
	 *   Contenu principal
	 *
	 *   {#snippet footer()}
	 *     <button>Action</button>
	 *   {/snippet}
	 * </Card>
	 * ```
	 */

	interface Props {
		/** Classes CSS additionnelles */
		class?: string;
		/** Snippet pour l'en-tête */
		header?: Snippet;
		/** Snippet pour le pied de page */
		footer?: Snippet;
		/** Contenu principal */
		children: Snippet;
	}

	let { class: className, header, footer, children }: Props = $props();
</script>

<Box class="shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 {className}">
	{#if header}
		<Box class="border-b border-gray-200 dark:border-gray-700 p-6">
			{@render header()}
		</Box>
	{/if}

	<Box class="p-6">
		{@render children()}
	</Box>

	{#if footer}
		<Box class="border-t border-gray-200 dark:border-gray-700 p-6">
			{@render footer()}
		</Box>
	{/if}
</Box>
