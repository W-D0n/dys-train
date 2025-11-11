import type { Task, TaskCategory } from '$lib/types';

// Couleurs de catégories pour l'interface
export const CATEGORY_COLORS: Record<TaskCategory, string> = {
	html: 'bg-orange-100 text-orange-700',
	css: 'bg-blue-100 text-blue-700',
	js: 'bg-yellow-100 text-yellow-700',
	react: 'bg-cyan-100 text-cyan-700',
	tools: 'bg-gray-100 text-gray-700'
} as const;

// Parcours d'apprentissage frontend prédéfini
export const FRONTEND_TASKS: Omit<Task, 'id' | 'completed' | 'subtasksCompleted' | 'dateAdded'>[] =
	[
		{
			title: 'HTML de base',
			subtasks: [
				'Réviser les balises sémantiques (15min)',
				'Créer une page simple (20min)',
				'Valider avec W3C (5min)'
			],
			category: 'html',
			time: 40
		},
		{
			title: 'CSS Flexbox',
			subtasks: [
				'Lire doc Flexbox (10min)',
				'Faire 3 exercices (20min)',
				'Créer une navbar (15min)'
			],
			category: 'css',
			time: 45
		},
		{
			title: 'JavaScript bases',
			subtasks: [
				'Variables et types (10min)',
				'Fonctions (15min)',
				'Exercices sur console (15min)'
			],
			category: 'js',
			time: 40
		},
		{
			title: 'DOM Manipulation',
			subtasks: [
				'querySelector (10min)',
				'addEventListener (15min)',
				'Mini-projet click counter (20min)'
			],
			category: 'js',
			time: 45
		},
		{
			title: 'CSS Grid',
			subtasks: [
				'Comprendre Grid (15min)',
				'3 layouts différents (25min)',
				'Responsive avec Grid (15min)'
			],
			category: 'css',
			time: 55
		},
		{
			title: 'Fetch API',
			subtasks: ['Syntaxe fetch (10min)', 'Appel API public (20min)', 'Afficher données (15min)'],
			category: 'js',
			time: 45
		},
		{
			title: 'React Introduction',
			subtasks: ['Composants (15min)', 'Props (15min)', 'Premier composant (20min)'],
			category: 'react',
			time: 50
		},
		{
			title: 'Git basics',
			subtasks: ['Init, add, commit (15min)', 'Branches (10min)', 'Push sur GitHub (10min)'],
			category: 'tools',
			time: 35
		}
	];
