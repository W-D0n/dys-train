<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/components/utils';

	/**
	 * Badge - Étiquette colorée pour afficher des statuts, catégories, etc.
	 *
	 * @component
	 * @example
	 * ```svelte
	 * <Badge variant="success">Complété</Badge>
	 * <Badge variant="warning">En cours</Badge>
	 * ```
	 */

	type BadgeVariant =
		| 'default'
		| 'success'
		| 'warning'
		| 'error'
		| 'info'
		| 'blue'
		| 'green'
		| 'purple'
		| 'orange';

	interface Props {
		/** Classes CSS additionnelles */
		class?: string;
		/** Variante de couleur du badge */
		variant?: BadgeVariant;
		/** Contenu du badge */
		children: Snippet;
	}

	let { class: className, variant = 'default', children }: Props = $props();

	const variantClasses: Record<BadgeVariant, string> = {
		default: 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200',
		success: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
		warning: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200',
		error: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200',
		info: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200',
		blue: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200',
		green: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
		purple: 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200',
		orange: 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200'
	};
</script>

<span
	class={cn(
		'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
		variantClasses[variant],
		className
	)}
>
	{@render children()}
</span>
