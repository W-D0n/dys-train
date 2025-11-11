<script lang="ts">
	import { Panel, InfoList } from '$lib/components/ui/primitives';
	import type { StrategyPanel } from '$lib/types/ui';

	const strategies: StrategyPanel[] = [
		{
			variant: 'blue',
			title: '🎯 Stratégies pour la Mémoire de Travail',
			items: [
				{
					label: 'Chunking',
					description:
						"Regroupe l'information par paquets (ex: 06-12-34-56-78 plutôt que 0612345678)"
				},
				{
					label: 'Externalisation',
					description: "Note TOUT immédiatement. Ton cerveau n'est pas fait pour tout retenir."
				},
				{
					label: 'Répétition espacée',
					description:
						"Révise l'info après 1h, 1 jour, 1 semaine pour ancrer dans la mémoire longue"
				},
				{
					label: 'Association visuelle',
					description: 'Crée des images mentales pour les concepts abstraits'
				}
			]
		},
		{
			variant: 'green',
			title: '⚡ Stratégies pour les Fonctions Exécutives',
			items: [
				{
					label: 'Règle des 2 minutes',
					description: 'Si ça prend moins de 2min, fais-le immédiatement'
				},
				{
					label: 'Timeboxing',
					description: 'Fixe une durée précise (25min) puis pause obligatoire'
				},
				{
					label: 'Micro-objectifs',
					description: 'Découpe TOUT en étapes de 5-15min maximum'
				},
				{
					label: 'Environnement contrôlé',
					description: 'Élimine les distractions avant de commencer (téléphone, notifs...)'
				},
				{
					label: 'Routine de démarrage',
					description: 'Crée un rituel pour "lancer" ton cerveau (musique, café, timer...)'
				}
			]
		},
		{
			variant: 'purple',
			title: '🧠 Spécial Développement Frontend',
			items: [
				{
					label: 'Un concept à la fois',
					description: 'Ne mélange pas HTML/CSS/JS dans la même session au début'
				},
				{
					label: 'Projet fil rouge',
					description: 'Construis le même site en ajoutant progressivement des features'
				},
				{
					label: 'Documentation ouverte',
					description: 'Pas de honte à consulter MDN/docs en permanence'
				},
				{
					label: 'Copy-paste intelligent',
					description: 'Copie du code, mais TOUJOURS le retaper à la main après pour comprendre'
				},
				{
					label: 'Célèbre chaque micro-victoire',
					description: 'Un bouton qui fonctionne = VICTOIRE. Reconnais-le.'
				}
			]
		},
		{
			variant: 'orange',
			title: '⏰ Gestion du Temps & Énergie',
			items: [
				{
					label: 'Identifie ton pic d\'énergie',
					description: 'Code pendant tes moments de meilleure concentration'
				},
				{
					label: 'Accepte les jours "off"',
					description: "Certains jours, tu ne coderas que 15min. C'est OK."
				},
				{
					label: 'Système de points',
					description: 'Chaque micro-tâche = points. Gamifie ta progression.'
				},
				{
					label: 'Pause obligatoire',
					description: 'Toutes les 25-30min, lève-toi 5min. Non négociable.'
				}
			]
		}
	];
</script>

<div class="space-y-6">
	{#each strategies as strategy}
		<Panel variant={strategy.variant} title={strategy.title}>
			<InfoList items={strategy.items} />
		</Panel>
	{/each}
</div>
