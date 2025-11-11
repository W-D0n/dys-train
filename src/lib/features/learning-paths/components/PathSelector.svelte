<script lang="ts">
	import { learningPathsStore } from '../stores/learningPaths';
	import { Dialog, Button } from '$lib/components/ui/primitives';
	import PathBuilderWizard from './PathBuilderWizard.svelte';

	interface Props {
		open: boolean;
		onClose: () => void;
	}

	let { open = $bindable(), onClose }: Props = $props();

	const paths = $derived($learningPathsStore);
	const activePath = $derived(learningPathsStore.getActive(paths));

	let showBuilder = $state(false);

	function handleSelectPath(pathId: string) {
		learningPathsStore.activate(pathId);
		onClose();
	}

	function handleCreateNew() {
		showBuilder = true;
	}

	function handleBuilderClose() {
		showBuilder = false;
	}

	function handlePathCreated(pathId: string) {
		showBuilder = false;
		learningPathsStore.activate(pathId);
		onClose();
	}

	function handleDeletePath(pathId: string, event: MouseEvent) {
		event.stopPropagation();
		if (confirm('Êtes-vous sûr de vouloir supprimer ce parcours ?')) {
			learningPathsStore.delete(pathId);
		}
	}
</script>

{#if showBuilder}
	<Dialog.Root bind:open={showBuilder}>
		<Dialog.Content class="sm:max-w-[800px] max-h-[90vh] overflow-y-auto bg-transparent border-0 shadow-none">
			<PathBuilderWizard onClose={handleBuilderClose} onComplete={handlePathCreated} />
		</Dialog.Content>
	</Dialog.Root>
{:else}
	<Dialog.Root bind:open>
		<Dialog.Content class="sm:max-w-[700px] bg-white dark:bg-gray-800">
			<Dialog.Header>
				<Dialog.Title class="dark:text-gray-100">
					📚 Choisir mon parcours d'apprentissage
				</Dialog.Title>
				<Dialog.Description class="dark:text-gray-400">
					Sélectionnez un parcours existant ou créez-en un nouveau
				</Dialog.Description>
			</Dialog.Header>

			<div class="py-4 space-y-4">
				{#if paths.length === 0}
					<div class="text-center py-8">
						<p class="text-gray-500 dark:text-gray-400 mb-4">
							Vous n'avez pas encore de parcours d'apprentissage
						</p>
						<Button
							onclick={handleCreateNew}
							class="bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600"
						>
							Créer mon premier parcours
						</Button>
					</div>
				{:else}
					<div class="space-y-3 max-h-96 overflow-y-auto">
						{#each paths as path}
							<div
								class="w-full text-left border rounded-lg p-4 transition-all cursor-pointer {path.isActive
									? 'border-purple-600 bg-purple-50 dark:bg-purple-900 dark:border-purple-500'
									: 'border-gray-200 dark:border-gray-700 hover:border-purple-400 dark:hover:border-purple-600'}"
							>
								<div class="flex items-start justify-between" onclick={() => handleSelectPath(path.id)}>
									<div class="flex-1">
										<div class="flex items-center gap-2 mb-1">
											{#if path.isActive}
												<span class="text-green-600 dark:text-green-400 text-xl">●</span>
											{/if}
											<h3 class="font-bold text-gray-800 dark:text-gray-100">
												{path.title}
											</h3>
										</div>

										{#if path.description}
											<p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
												{path.description}
											</p>
										{/if}

										<div class="flex gap-4 text-xs text-gray-500 dark:text-gray-400">
											<span>⏱️ {path.estimatedHours}h</span>
											<span>📋 {path.tasks.length} tâches</span>
										</div>
									</div>

									<button
										onclick={(e) => handleDeletePath(path.id, e)}
										class="ml-4 p-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
										aria-label="Supprimer le parcours"
									>
										<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
											></path>
										</svg>
									</button>
								</div>
							</div>
						{/each}
					</div>

					<div class="pt-4 border-t border-gray-200 dark:border-gray-700">
						<Button
							onclick={handleCreateNew}
							variant="outline"
							class="w-full"
						>
							+ Créer un nouveau parcours
						</Button>
					</div>
				{/if}
			</div>

			<Dialog.Footer>
				<Button variant="outline" onclick={onClose}>Fermer</Button>
			</Dialog.Footer>
		</Dialog.Content>
	</Dialog.Root>
{/if}
