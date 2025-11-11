<script lang="ts">
	/**
	 * NBackGame - Exercice cognitif N-Back
	 *
	 * Jeu de mémoire de travail où l'utilisateur doit identifier si la lettre
	 * affichée correspond à celle affichée N positions avant (N = niveau).
	 *
	 * Calcul des points :
	 * - Points de base : (taux de réussite / 100) * 10
	 * - Bonus de difficulté : niveau * 5
	 * - Les points ne sont attribués qu'à 100% de complétion
	 *
	 * @component
	 * @example
	 * ```svelte
	 * <NBackGame />
	 * ```
	 */

	import { settingsStore } from '$lib/stores/settings';
	import { userStore } from '$lib/stores/user';

	let nBackLevel = $derived($settingsStore.nBackLevel);
	let sequence: string[] = $state([]);
	let currentIndex = $state(0);
	let score = $state(0);
	let gameActive = $state(false);
	let feedback = $state('');

	const letters: string[] = ['A', 'B', 'C', 'D', 'E', 'F'];

	/**
	 * Démarre une nouvelle partie
	 * Génère une séquence aléatoire de 20 lettres
	 */
	function startGame() {
		sequence = Array.from({ length: 20 }, () => letters[Math.floor(Math.random() * letters.length)]!);
		currentIndex = 0;
		score = 0;
		gameActive = true;
		feedback = '';
	}

	/**
	 * Vérifie la réponse de l'utilisateur
	 *
	 * Compare la lettre actuelle avec celle N positions avant.
	 * Si toute la séquence est terminée, calcule et attribue les points.
	 *
	 * @param isMatch - true si l'utilisateur pense qu'il y a correspondance
	 */
	function checkAnswer(isMatch: boolean) {
		if (currentIndex < nBackLevel) {
			feedback = 'Trop tôt pour répondre !';
			setTimeout(() => {
				feedback = '';
			}, 1000);
			return;
		}

		const correctAnswer = sequence[currentIndex] === sequence[currentIndex - nBackLevel];
		const correct = isMatch === correctAnswer;

		feedback = correct ? '✓ Correct !' : '✗ Incorrect';

		if (correct) {
			score++;
		}

		setTimeout(() => {
			if (currentIndex < sequence.length - 1) {
				currentIndex++;
				feedback = '';
			} else {
				gameActive = false;
				// Exercice terminé à 100% : calculer et attribuer les points
				const totalQuestions = sequence.length - nBackLevel;
				const successRate = (score / totalQuestions) * 100;

				// Points basés sur le taux de réussite et le niveau de difficulté
				const basePoints = Math.round((successRate / 100) * 10); // 0-10 points
				const difficultyBonus = nBackLevel * 5; // Bonus selon difficulté
				const totalPoints = basePoints + difficultyBonus;

				userStore.incrementWorkingMemory(totalPoints);
				feedback = `Terminé ! Score: ${score}/${totalQuestions} (${Math.round(successRate)}%) - +${totalPoints} points 🎉`;
			}
		}, 1000);
	}

	function resetGame() {
		sequence = [];
		currentIndex = 0;
		score = 0;
		gameActive = false;
		feedback = '';
	}

	function setLevel(level: 1 | 2 | 3) {
		settingsStore.setNBackLevel(level);
	}
</script>

<div>
	<h2 class="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Exercices de Mémoire de Travail</h2>

	<div class="bg-gradient-to-r from-purple-100 dark:from-purple-900 to-blue-100 dark:to-blue-900 rounded-lg p-6 mb-6">
		<h3 class="font-bold text-lg mb-2 dark:text-gray-100">N-Back Task (Niveau {nBackLevel})</h3>
		<p class="text-sm text-gray-700 dark:text-gray-300 mb-4">
			Appuie sur "Oui" si la lettre actuelle est identique à celle d'il y a {nBackLevel}
			position{nBackLevel > 1 ? 's' : ''}.
		</p>

		{#if !gameActive && sequence.length === 0}
			<div class="text-center">
				<div class="mb-4">
					<label for="nback-level" class="block text-sm font-medium mb-2 dark:text-gray-100">Choisis le niveau:</label>
					<select
						id="nback-level"
						value={nBackLevel}
						onchange={(e) => setLevel(parseInt(e.currentTarget.value) as 1 | 2 | 3)}
						class="p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
					>
						<option value="1">1-Back (Facile)</option>
						<option value="2">2-Back (Moyen)</option>
						<option value="3">3-Back (Difficile)</option>
					</select>
				</div>
				<button
					onclick={startGame}
					class="bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
				>
					▶ Commencer l'exercice
				</button>
			</div>
		{/if}

		{#if gameActive}
			<div class="text-center">
				<div class="text-6xl font-bold text-purple-700 dark:text-purple-400 mb-6 h-20 flex items-center justify-center">
					{sequence[currentIndex]}
				</div>
				<div class="text-sm text-gray-600 dark:text-gray-400 mb-4">
					Position: {currentIndex + 1} / {sequence.length}
				</div>
				<div class="flex gap-4 justify-center mb-4">
					<button
						onclick={() => checkAnswer(true)}
						class="bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white px-8 py-3 rounded-lg font-medium transition-colors"
					>
						OUI - Identique
					</button>
					<button
						onclick={() => checkAnswer(false)}
						class="bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white px-8 py-3 rounded-lg font-medium transition-colors"
					>
						NON - Différent
					</button>
				</div>
				{#if feedback}
					<div class="text-lg font-bold {feedback.includes('✓') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}">
						{feedback}
					</div>
				{/if}
				<div class="text-sm text-gray-600 dark:text-gray-400 mt-4">Score: {score}</div>
			</div>
		{/if}

		{#if !gameActive && sequence.length > 0}
			<div class="text-center">
				<div class="text-lg mb-4 dark:text-gray-100">{feedback}</div>
				<button
					onclick={resetGame}
					class="bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
				>
					🔄 Recommencer
				</button>
			</div>
		{/if}
	</div>

	<div class="bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
		<h4 class="font-bold text-yellow-800 dark:text-yellow-200 mb-2">💡 Conseil</h4>
		<p class="text-sm text-yellow-700 dark:text-yellow-300">
			Pratique 10-15 minutes par jour pour de meilleurs résultats. L'entraînement régulier améliore
			la neuroplasticité !
		</p>
	</div>
</div>
