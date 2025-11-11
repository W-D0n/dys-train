<script lang="ts">
	/**
	 * AppHeader - En-tête principal de l'application
	 *
	 * Affiche le titre, les scores cognitifs, l'objectif quotidien,
	 * et les boutons d'action (ajouter tâche, changer parcours, toggle thème).
	 *
	 * @component
	 * @example
	 * ```svelte
	 * <AppHeader
	 *   onAddTask={() => showTaskModal()}
	 *   onSelectPath={() => showPathSelector()}
	 * />
	 * ```
	 */

	import { userStore } from '$lib/stores/user';
	import { settingsStore } from '$lib/stores/settings';
	import { themeStore } from '$lib/stores/theme';

	interface Props {
		/** Callback appelé lors du clic sur "Ajouter tâche" */
		onAddTask?: () => void;
		/** Callback appelé lors du clic sur "Changer de parcours" */
		onSelectPath?: () => void;
	}

	let { onAddTask, onSelectPath }: Props = $props();

	const cognitiveScore = $derived($userStore.cognitiveScore);
	const dailyGoal = $derived($settingsStore.dailyGoal);
	const theme = $derived($themeStore);
</script>

<div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6 border dark:border-gray-700">
	<div class="flex items-center justify-between mb-4 flex-wrap gap-4">
		<div class="flex items-center gap-3">
			<svg
				class="w-8 h-8 text-purple-600 dark:text-purple-400"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
				></path>
			</svg>
			<h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100">
				Système TDAH - Apprentissage & Remédiation
			</h1>
		</div>
		<div class="flex gap-4 items-center">
			<div class="text-center">
				<div class="text-sm text-gray-600 dark:text-gray-400">Mémoire de travail</div>
				<div class="text-2xl font-bold text-purple-600 dark:text-purple-400">
					{cognitiveScore.workingMemory}%
				</div>
			</div>
			<div class="text-center">
				<div class="text-sm text-gray-600 dark:text-gray-400">Fonctions exécutives</div>
				<div class="text-2xl font-bold text-blue-600 dark:text-blue-400">
					{cognitiveScore.executive}%
				</div>
			</div>
			<button
				onclick={() => themeStore.toggle()}
				class="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
				aria-label="Toggle theme"
			>
				{#if theme === 'dark'}
					<!-- Icon Soleil -->
					<svg class="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
					</svg>
				{:else}
					<!-- Icon Lune -->
					<svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
					</svg>
				{/if}
			</button>
		</div>
	</div>

	<!-- Objectif quotidien + Bouton tâche rapide -->
	<div class="flex items-center gap-3">
		<svg
			class="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
			></path>
		</svg>
		<input
			type="text"
			placeholder="Mon objectif principal aujourd'hui..."
			value={dailyGoal}
			oninput={(e) => settingsStore.setDailyGoal(e.currentTarget.value)}
			class="flex-1 p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent placeholder:text-gray-500 dark:placeholder:text-gray-400"
		/>
		<div class="flex gap-2">
			<button
				onclick={onSelectPath}
				class="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2 whitespace-nowrap"
			>
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
					></path>
				</svg>
				Mon parcours
			</button>
			<button
				onclick={onAddTask}
				class="px-4 py-2 bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2 whitespace-nowrap"
			>
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 4v16m8-8H4"
					></path>
				</svg>
				Nouvelle tâche
			</button>
		</div>
	</div>
</div>
