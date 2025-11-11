<script lang="ts">
	import { tasksStore } from '$lib/stores/tasks';
	import type { Task, TaskCategory } from '$lib/types';
	import { Dialog, Button } from '$lib/components/ui/primitives';

	interface Props {
		open: boolean;
		task?: Task | null;
		onClose: () => void;
	}

	let { open = $bindable(), task = null, onClose }: Props = $props();

	// Form state
	let title = $state(task?.title || '');
	let category = $state<TaskCategory>(task?.category || 'js');
	let time = $state(task?.time || 30);
	let subtasks = $state<string[]>(task?.subtasks || ['Première étape (10min)']);

	// Réinitialiser le formulaire quand la modal s'ouvre avec une nouvelle tâche
	$effect(() => {
		if (open) {
			title = task?.title || '';
			category = task?.category || 'js';
			time = task?.time || 30;
			subtasks = task?.subtasks || ['Première étape (10min)'];
		}
	});

	function addSubtask() {
		subtasks = [...subtasks, `Nouvelle étape (10min)`];
	}

	function removeSubtask(index: number) {
		subtasks = subtasks.filter((_, i) => i !== index);
	}

	function updateSubtask(index: number, value: string) {
		subtasks[index] = value;
	}

	function handleSubmit() {
		if (!title.trim()) return;

		if (task) {
			// Édition de tâche existante
			tasksStore.update((tasks) => {
				const index = tasks.findIndex((t) => t.id === task.id);
				if (index !== -1) {
					tasks[index] = {
						...task,
						title: title.trim(),
						category,
						time,
						subtasks: subtasks.filter((s) => s.trim())
					};
				}
				return tasks;
			});
		} else {
			// Nouvelle tâche
			tasksStore.addTask({
				title: title.trim(),
				category,
				time,
				subtasks: subtasks.filter((s) => s.trim())
			});
		}

		onClose();
	}

	const categoryOptions: { value: TaskCategory; label: string }[] = [
		{ value: 'html', label: 'HTML' },
		{ value: 'css', label: 'CSS' },
		{ value: 'js', label: 'JavaScript' },
		{ value: 'react', label: 'React' },
		{ value: 'tools', label: 'Outils' }
	];
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="sm:max-w-[600px] bg-white dark:bg-gray-800">
		<Dialog.Header>
			<Dialog.Title class="dark:text-gray-100">
				{task ? 'Éditer la tâche' : 'Nouvelle tâche'}
			</Dialog.Title>
			<Dialog.Description class="dark:text-gray-400">
				Créez une tâche détaillée avec des sous-étapes pour mieux organiser votre travail
			</Dialog.Description>
		</Dialog.Header>

		<form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }} class="space-y-4 py-4">
			<!-- Titre -->
			<div>
				<label for="title" class="block text-sm font-medium mb-2 dark:text-gray-200">
					Titre de la tâche *
				</label>
				<input
					id="title"
					type="text"
					bind:value={title}
					placeholder="Ex: Apprendre les bases de React"
					class="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400"
					required
				/>
			</div>

			<!-- Catégorie et Temps -->
			<div class="grid grid-cols-2 gap-4">
					<div>
						<label for="category" class="block text-sm font-medium mb-2 dark:text-gray-200">
							Catégorie
						</label>
						<select
							id="category"
							bind:value={category}
							class="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg"
						>
							{#each categoryOptions as option}
								<option value={option.value}>{option.label}</option>
							{/each}
						</select>
					</div>

					<div>
						<label for="time" class="block text-sm font-medium mb-2 dark:text-gray-200">
							Durée (min)
						</label>
						<input
							id="time"
							type="number"
							bind:value={time}
							min="5"
							step="5"
							class="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg"
						/>
					</div>
				</div>

				<!-- Sous-tâches -->
				<div>
					<div class="flex items-center justify-between mb-2">
						<span class="block text-sm font-medium dark:text-gray-200">Sous-tâches</span>
						<button
							type="button"
							onclick={addSubtask}
							class="text-sm text-purple-600 dark:text-purple-400 hover:underline"
						>
							+ Ajouter
						</button>
					</div>

					<div class="space-y-2">
						{#each subtasks as subtask, idx}
							<div class="flex gap-2">
								<input
									type="text"
									value={subtask}
									oninput={(e) => updateSubtask(idx, e.currentTarget.value)}
									placeholder="Description de l'étape..."
									class="flex-1 p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg"
								/>
								<button
									type="button"
									onclick={() => removeSubtask(idx)}
									aria-label="Supprimer la sous-tâche"
									class="p-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
								>
									<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M6 18L18 6M6 6l12 12"
										></path>
									</svg>
								</button>
							</div>
						{/each}
					</div>
				</div>

			<!-- Actions -->
			<Dialog.Footer>
				<Button type="button" variant="outline" onclick={onClose}>Annuler</Button>
				<Button type="submit" class="bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600">
					{task ? 'Enregistrer' : 'Créer'}
				</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
