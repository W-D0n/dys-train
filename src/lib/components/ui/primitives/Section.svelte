<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/components/utils';

	/**
	 * Section - Conteneur de section avec titre et description optionnels
	 *
	 * @component
	 * @example
	 * ```svelte
	 * <Section title="Ma section" description="Description ici">
	 *   Contenu de la section
	 * </Section>
	 * ```
	 */

	interface Props {
		/** Classes CSS additionnelles */
		class?: string;
		/** Titre de la section */
		title?: string;
		/** Description optionnelle sous le titre */
		description?: string;
		/** Contenu du composant */
		children: Snippet;
	}

	let { class: className, title, description, children }: Props = $props();
</script>

<section class={cn('space-y-4', className)}>
	{#if title || description}
		<div class="space-y-1">
			{#if title}
				<h2 class="text-xl font-bold text-gray-800 dark:text-gray-100">
					{title}
				</h2>
			{/if}
			{#if description}
				<p class="text-sm text-gray-600 dark:text-gray-400">
					{description}
				</p>
			{/if}
		</div>
	{/if}

	{@render children()}
</section>
