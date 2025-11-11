<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/components/utils';

	/**
	 * Box - Conteneur de base avec padding et border optionnels
	 *
	 * @component
	 * @example
	 * ```svelte
	 * <Box padding="lg" border rounded>
	 *   Contenu
	 * </Box>
	 * ```
	 */

	interface Props {
		/** Classes CSS additionnelles */
		class?: string;
		/** Taille du padding */
		padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
		/** Afficher une bordure */
		border?: boolean;
		/** Coins arrondis */
		rounded?: boolean;
		/** Ombre portée */
		shadow?: boolean;
		/** Contenu du composant */
		children: Snippet;
	}

	let {
		class: className,
		padding = 'md',
		border = false,
		rounded = false,
		shadow = false,
		children
	}: Props = $props();

	const paddingClasses = {
		none: '',
		sm: 'p-2',
		md: 'p-4',
		lg: 'p-6',
		xl: 'p-8'
	};
</script>

<div
	class={cn(
		paddingClasses[padding],
		border && 'border border-gray-200 dark:border-gray-700',
		rounded && 'rounded-lg',
		shadow && 'shadow-sm',
		className
	)}
>
	{@render children()}
</div>
