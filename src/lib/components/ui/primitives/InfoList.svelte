<script lang="ts">
	import type { InfoListItem } from '$lib/types/ui';

	/**
	 * InfoList - Liste d'informations avec label et description
	 *
	 * @component
	 * @example
	 * ```svelte
	 * <InfoList items={[
	 *   { label: 'Astuce 1', description: 'Description...' },
	 *   { label: 'Astuce 2', description: 'Description...' }
	 * ]} />
	 * ```
	 */

	interface Props {
		/** Liste des items à afficher */
		items: InfoListItem[];
	}

	let { items }: Props = $props();
</script>

<ul class="space-y-2 text-sm">
	{#each items as item}
		<li>
			<strong>{item.label}:</strong>
			{item.description}
		</li>
	{/each}
</ul>
