<script lang="ts">
	import { tasksStore, frontendTasks, categoryColors } from '$lib/stores/tasks';
	import TaskCard from './TaskCard.svelte';
	import type { Task } from '$lib/types';

	interface Props {
		handleEditTask: (task: Task) => void;
	}

	let { handleEditTask }: Props = $props();

	const tasks = $derived($tasksStore);

	function addTask(task: (typeof frontendTasks)[0]) {
		tasksStore.addTask(task);
	}
</script>

<div>
	<h2 class="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3">Mes Tâches Actives</h2>
	{#if tasks.length === 0}
		<div class="text-center py-8 text-gray-500 dark:text-gray-400">
			<p>Aucune tâche active. Ajoute-en une ci-dessous !</p>
		</div>
	{:else}
		{#each tasks as task (task.id)}
			<TaskCard {task} onEdit={handleEditTask} />
		{/each}
	{/if}

	<h2 class="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3 mt-6">Parcours Frontend Suggéré</h2>
	<p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
		Tâches découpées en micro-étapes. Ajoute-les une par une pour éviter la surcharge cognitive.
	</p>
	<div class="grid md:grid-cols-2 gap-3">
		{#each frontendTasks as task}
			<div
				class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow bg-white dark:bg-gray-800"
			>
				<div class="flex items-start justify-between mb-2">
					<div class="flex-1">
						<span class="px-2 py-1 rounded text-xs font-medium {categoryColors[task.category]} mb-2 inline-block">
							{task.category.toUpperCase()}
						</span>
						<h3 class="font-bold text-gray-800 dark:text-gray-100">{task.title}</h3>
						<p class="text-sm text-gray-600 dark:text-gray-400">Durée: {task.time}min</p>
					</div>
					<button
						onclick={() => addTask(task)}
						class="bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white px-3 py-1 rounded-lg text-sm transition-colors"
					>
						Ajouter
					</button>
				</div>
				<div class="text-xs text-gray-500 dark:text-gray-400 mt-2">{task.subtasks.length} étapes</div>
			</div>
		{/each}
	</div>
</div>
