<script lang="ts">
	import { tasksStore, categoryColors, type Task } from '$lib/stores/tasks';
	import { userStore } from '$lib/stores/user';

	interface Props {
		task: Task;
		onEdit: (task: Task) => void;
	}

	let { task, onEdit }: Props = $props();

	function handleSubtaskToggle(subtaskIndex: number) {
		const wasCompleted = task.subtasksCompleted[subtaskIndex];
		tasksStore.toggleSubtask(task.id, subtaskIndex);

		// Option B - Progressive : +1 point par sous-tâche cochée
		if (!wasCompleted) {
			userStore.incrementExecutive(1);

			// Vérifier si la tâche est maintenant complète à 100%
			const updatedTask = { ...task };
			updatedTask.subtasksCompleted[subtaskIndex] = true;
			const allCompleted = updatedTask.subtasksCompleted.every((completed) => completed);

			// Bonus de +10 points si tâche complète
			if (allCompleted) {
				setTimeout(() => {
					userStore.incrementExecutive(10);
					// Animation de célébration pourrait être ajoutée ici
				}, 300);
			}
		}
	}

	function handleRemove() {
		tasksStore.removeTask(task.id);
	}

	const progressPercentage = $derived(
		(task.subtasksCompleted.filter(Boolean).length / task.subtasks.length) * 100
	);
</script>

<div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800 mb-4 fade-in">
	<div class="flex items-start justify-between mb-3">
		<div class="flex-1">
			<div class="flex items-center gap-2 mb-2">
				<span class="px-2 py-1 rounded text-xs font-medium {categoryColors[task.category]}">
					{task.category.toUpperCase()}
				</span>
				<h3 class="font-bold text-gray-800 dark:text-gray-100">{task.title}</h3>
				<span class="text-sm text-gray-500 dark:text-gray-400">({task.time}min)</span>
			</div>
			<div class="space-y-2">
				{#each task.subtasks as subtask, idx}
					<div class="flex items-center gap-2">
						<button onclick={() => handleSubtaskToggle(idx)} class="focus:outline-none">
							{#if task.subtasksCompleted[idx]}
								<span class="text-green-600 dark:text-green-400 text-xl">✓</span>
							{:else}
								<span class="text-gray-400 dark:text-gray-500 text-xl">○</span>
							{/if}
						</button>
						<span class={task.subtasksCompleted[idx] ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-700 dark:text-gray-300'}>
							{subtask}
						</span>
					</div>
				{/each}
			</div>
		</div>
		<div class="flex flex-col gap-2 ml-4">
			<button
				onclick={() => onEdit(task)}
				class="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 text-sm transition-colors"
			>
				Éditer
			</button>
			<button
				onclick={handleRemove}
				class="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm transition-colors"
			>
				Retirer
			</button>
		</div>
	</div>
	<div class="mt-2">
		<div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
			<div
				class="bg-purple-600 dark:bg-purple-500 h-2 rounded-full transition-all duration-300"
				style="width: {progressPercentage}%"
			></div>
		</div>
	</div>
</div>

<style>
	.fade-in {
		animation: fadeIn 0.3s;
	}
	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
</style>
