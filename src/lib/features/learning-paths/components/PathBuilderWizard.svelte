<script lang="ts">
	import { learningPathsStore } from '../stores/learningPaths';
	import { frontendTasks } from '$lib/stores/tasks';
	import type { Task } from '$lib/types';
	import { Button } from '$lib/components/ui/primitives';

	interface Props {
		onClose: () => void;
		onComplete: (pathId: string) => void;
	}

	let { onClose, onComplete }: Props = $props();

	// État du wizard
	let currentStep = $state(1);
	let title = $state('');
	let description = $state('');
	let estimatedHours = $state(10);
	let selectedTasks = $state<Task[]>([]);

	// Validation des étapes
	const isStep1Valid = $derived(title.trim().length > 0);
	const isStep2Valid = $derived(selectedTasks.length > 0);

	function nextStep() {
		if (currentStep < 3) {
			currentStep++;
		}
	}

	function previousStep() {
		if (currentStep > 1) {
			currentStep--;
		}
	}

	function toggleTask(task: (typeof frontendTasks)[0]) {
		const existingIndex = selectedTasks.findIndex((t) => t.title === task.title);

		if (existingIndex >= 0) {
			selectedTasks = selectedTasks.filter((_, i) => i !== existingIndex);
		} else {
			// Convertir la tâche suggérée en tâche complète
			const newTask: Task = {
				id: Date.now() + Math.random(), // Générer un ID numérique unique
				title: task.title,
				category: task.category,
				time: task.time,
				subtasks: task.subtasks,
				subtasksCompleted: new Array(task.subtasks.length).fill(false),
				completed: false,
				dateAdded: new Date().toISOString()
			};
			selectedTasks = [...selectedTasks, newTask];
		}
	}

	function createPath() {
		const pathId = learningPathsStore.create({
			title,
			description,
			estimatedHours,
			tasks: selectedTasks
		});

		onComplete(pathId);
	}
</script>

<div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-3xl mx-auto p-6">
	<!-- Progress bar -->
	<div class="mb-6">
		<div class="flex justify-between mb-2">
			{#each [1, 2, 3] as step}
				<div class="flex-1 mx-1">
					<div
						class="h-2 rounded-full transition-colors {step <= currentStep ? 'bg-purple-600 dark:bg-purple-500' : 'bg-gray-200 dark:bg-gray-700'}"
					></div>
				</div>
			{/each}
		</div>
		<p class="text-sm text-gray-600 dark:text-gray-400 text-center">
			Étape {currentStep} sur 3
		</p>
	</div>

	<!-- Step 1: Informations de base -->
	{#if currentStep === 1}
		<div class="space-y-4">
			<h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
				📚 Informations de base
			</h2>

			<div>
				<label for="title" class="block text-sm font-medium mb-2 dark:text-gray-200">
					Titre du parcours *
				</label>
				<input
					id="title"
					type="text"
					bind:value={title}
					placeholder="Ex: Parcours Frontend Complet"
					class="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400"
					required
				/>
			</div>

			<div>
				<label for="description" class="block text-sm font-medium mb-2 dark:text-gray-200">
					Description
				</label>
				<textarea
					id="description"
					bind:value={description}
					placeholder="Décrivez les objectifs de ce parcours..."
					rows="3"
					class="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400"
				></textarea>
			</div>

			<div>
				<label for="hours" class="block text-sm font-medium mb-2 dark:text-gray-200">
					Durée estimée (heures)
				</label>
				<input
					id="hours"
					type="number"
					bind:value={estimatedHours}
					min="1"
					step="1"
					class="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400"
				/>
			</div>
		</div>
	{/if}

	<!-- Step 2: Sélection des tâches -->
	{#if currentStep === 2}
		<div class="space-y-4">
			<h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
				✅ Ajouter des tâches
			</h2>

			<div class="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg p-4 mb-4">
				<p class="text-sm text-blue-800 dark:text-blue-200">
					💡 Sélectionnez les tâches que vous voulez inclure dans votre parcours. Vous avez sélectionné {selectedTasks.length} tâche{selectedTasks.length > 1 ? 's' : ''}.
				</p>
			</div>

			<div class="space-y-3 max-h-96 overflow-y-auto">
				{#each frontendTasks as task}
					{@const isSelected = selectedTasks.some((t) => t.title === task.title)}
					<button
						onclick={() => toggleTask(task)}
						class="w-full text-left border rounded-lg p-4 transition-all {isSelected
							? 'border-purple-600 bg-purple-50 dark:bg-purple-900 dark:border-purple-500'
							: 'border-gray-200 dark:border-gray-700 hover:border-purple-400 dark:hover:border-purple-600'}"
					>
						<div class="flex items-start justify-between">
							<div class="flex-1">
								<h3 class="font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
									{#if isSelected}
										<span class="text-green-600 dark:text-green-400">✓</span>
									{:else}
										<span class="text-gray-400">○</span>
									{/if}
									{task.title}
								</h3>
								<p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
									{task.category.toUpperCase()} • {task.time}min • {task.subtasks.length} étapes
								</p>
							</div>
						</div>
					</button>
				{/each}
			</div>
		</div>
	{/if}

	<!-- Step 3: Options avancées -->
	{#if currentStep === 3}
		<div class="space-y-4">
			<h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
				⚙️ Récapitulatif
			</h2>

			<div class="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-3">
				<div>
					<p class="text-sm text-gray-600 dark:text-gray-400">Titre</p>
					<p class="font-bold text-gray-800 dark:text-gray-100">{title}</p>
				</div>

				{#if description}
					<div>
						<p class="text-sm text-gray-600 dark:text-gray-400">Description</p>
						<p class="text-gray-800 dark:text-gray-100">{description}</p>
					</div>
				{/if}

				<div>
					<p class="text-sm text-gray-600 dark:text-gray-400">Durée estimée</p>
					<p class="text-gray-800 dark:text-gray-100">{estimatedHours} heures</p>
				</div>

				<div>
					<p class="text-sm text-gray-600 dark:text-gray-400">Nombre de tâches</p>
					<p class="text-gray-800 dark:text-gray-100">{selectedTasks.length} tâches</p>
				</div>
			</div>

			<div class="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg p-4">
				<p class="text-sm text-green-800 dark:text-green-200">
					✨ Votre parcours est prêt ! Cliquez sur "Créer" pour l'enregistrer.
				</p>
			</div>
		</div>
	{/if}

	<!-- Navigation -->
	<div class="flex justify-between mt-8">
		<div>
			{#if currentStep > 1}
				<Button variant="outline" onclick={previousStep}>
					← Retour
				</Button>
			{:else}
				<Button variant="outline" onclick={onClose}>
					Annuler
				</Button>
			{/if}
		</div>

		<div class="flex gap-2">
			<Button variant="outline" onclick={onClose}>Annuler</Button>
			{#if currentStep < 3}
				<Button
					onclick={nextStep}
					disabled={currentStep === 1 ? !isStep1Valid : currentStep === 2 ? !isStep2Valid : false}
					class="bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600"
				>
					Suivant →
				</Button>
			{:else}
				<Button
					onclick={createPath}
					class="bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
				>
					Créer ✓
				</Button>
			{/if}
		</div>
	</div>
</div>
