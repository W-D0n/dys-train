<script lang="ts">
	import AppHeader from '$lib/components/layout/AppHeader.svelte';
	import TaskList from '$lib/components/tasks/TaskList.svelte';
	import NBackGame from '$lib/components/activities/NBackGame.svelte';
	import StrategiesPanel from '$lib/components/strategies/StrategiesPanel.svelte';
	import TaskModal from '$lib/components/tasks/TaskModal.svelte';
	import PathSelector from '$lib/features/learning-paths/components/PathSelector.svelte';
	import type { Task } from '$lib/types';

	let activeTab = $state<'planning' | 'cognitive' | 'strategies'>('planning');
	let showTaskModal = $state(false);
	let showPathSelector = $state(false);
	let editingTask = $state<Task | null>(null);

	function handleAddTask() {
		editingTask = null;
		showTaskModal = true;
	}

	function handleEditTask(task: Task) {
		editingTask = task;
		showTaskModal = true;
	}

	function handleCloseModal() {
		showTaskModal = false;
		editingTask = null;
	}

	function handleSelectPath() {
		showPathSelector = true;
	}

	function handleClosePathSelector() {
		showPathSelector = false;
	}
</script>

<div class="p-4 max-w-6xl mx-auto">
	<AppHeader onAddTask={handleAddTask} onSelectPath={handleSelectPath} />

	<!-- Tabs -->
	<div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg mb-6">
		<div class="flex border-b border-gray-200 dark:border-gray-700">
			<button
				onclick={() => (activeTab = 'planning')}
				class="flex-1 py-3 px-4 font-medium transition-colors {activeTab === 'planning'
					? 'border-b-2 border-purple-600 text-purple-600 dark:text-purple-400'
					: 'text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'}"
			>
				📅 Planification
			</button>
			<button
				onclick={() => (activeTab = 'cognitive')}
				class="flex-1 py-3 px-4 font-medium transition-colors {activeTab === 'cognitive'
					? 'border-b-2 border-purple-600 text-purple-600 dark:text-purple-400'
					: 'text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'}"
			>
				🧠 Entraînement Cognitif
			</button>
			<button
				onclick={() => (activeTab = 'strategies')}
				class="flex-1 py-3 px-4 font-medium transition-colors {activeTab === 'strategies'
					? 'border-b-2 border-purple-600 text-purple-600 dark:text-purple-400'
					: 'text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'}"
			>
				⚡ Stratégies TDAH
			</button>
		</div>

		<div class="p-6 dark:bg-gray-800">
			{#if activeTab === 'planning'}
				<TaskList {handleEditTask} />
			{:else if activeTab === 'cognitive'}
				<NBackGame />
			{:else}
				<StrategiesPanel />
			{/if}
		</div>
	</div>
</div>

<TaskModal bind:open={showTaskModal} task={editingTask} onClose={handleCloseModal} />
<PathSelector bind:open={showPathSelector} onClose={handleClosePathSelector} />
