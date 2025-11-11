# 🧠 DYS-Train

> Application d'apprentissage et remédiation cognitive pour TDAH

Application web progressive dédiée à l'entraînement cognitif et à l'organisation des apprentissages pour les personnes avec TDAH. Combine gestion de tâches, exercices cognitifs et suivi de progression.

![GitHub repo size](https://img.shields.io/github/repo-size/W-D0n/dys-train)
![GitHub last commit](https://img.shields.io/github/last-commit/W-D0n/dys-train)

---

## ✨ Fonctionnalités

### 📋 Gestion de Tâches
- **Parcours personnalisés** : Créer des parcours d'apprentissage adaptés
- **Suivi de progression** : +1 point par sous-tâche, +10 bonus à 100%
- **Catégorisation** : HTML, CSS, JavaScript, React, Tools
- **Persistance locale** : Sauvegarde automatique via localStorage

### 🎮 Exercices Cognitifs
- **N-Back Test** : Entraînement de la mémoire de travail (niveaux 1-3)
- **Calcul de points** : Basé sur taux de réussite + bonus difficulté
- **Feedback instantané** : Validation en temps réel

### 📊 Suivi Cognitif
- **Scores cognitifs** : Mémoire de travail & fonctions exécutives
- **Série de jours** : Motivation par la régularité
- **Statistiques détaillées** : Total tâches/sous-tâches complétées

### 🎨 Interface
- **Dark mode** : Support thème clair/sombre
- **Responsive** : Adapté mobile/desktop
- **Accessible** : Conformité WCAG en cours

---

## 🚀 Installation

### Prérequis
- [Bun](https://bun.sh/) >= 1.0 (ou Node.js >= 18)
- Git

### Démarrage rapide

```bash
# Cloner le repo
git clone https://github.com/W-D0n/dys-train.git
cd dys-train

# Installer les dépendances
bun install

# Lancer le serveur de développement
bun run dev
```

L'application sera accessible sur **http://localhost:5173**

---

## 🛠️ Commandes

```bash
# Développement
bun run dev              # Démarrer le serveur (port 5173)
bun run dev -- --open    # Ouvrir dans le navigateur

# Build
bun run build            # Build de production
bun run preview          # Preview du build

# Qualité
bun run check            # Vérification TypeScript
bun run lint             # Linter ESLint
bun run format           # Formater avec Prettier

# Tests
bun test                 # Tests unitaires (Vitest)
bun run test:e2e         # Tests E2E (Playwright)
```

---

## 🏗️ Architecture

### Stack Technique
- **Framework** : [SvelteKit 2](https://kit.svelte.dev/) + [Svelte 5](https://svelte.dev/)
- **Language** : TypeScript avec JSDoc complet
- **Styling** : [Tailwind CSS](https://tailwindcss.com/) + [bits-ui](https://www.bits-ui.com/)
- **State** : Svelte stores + localStorage
- **Tests** : Vitest + Playwright
- **Runtime** : Bun

### Pattern : Atomic Design

```
src/lib/components/
├── ui/
│   ├── primitives/      # Atoms (Badge, Button, Panel...)
│   └── composed/        # Molecules (Card...)
├── layout/              # Organisms (AppHeader)
├── tasks/               # Features (TaskCard, TaskList...)
├── activities/          # Exercices (NBackGame...)
└── strategies/          # Stratégies d'apprentissage
```

### Structure des Stores

```typescript
stores/
├── tasks.ts       // Gestion CRUD des tâches
├── user.ts        // Scores cognitifs & stats
├── settings.ts    // Paramètres utilisateur
└── theme.ts       // Dark/light mode
```

---

## 📋 Développement

### Workflow de Session

1. Ouvrir **[ROADMAP.md](./ROADMAP.md)** pour voir les prochaines étapes
2. Choisir une feature du sprint actuel
3. Créer une branche : `git checkout -b feature/nom-feature`
4. Coder et tester
5. Commit : `git commit -m "feat: description"`
6. Push et créer une PR

### Prochaine Session avec Claude

```
"Regarde ROADMAP.md, je veux travailler sur [feature]"
```

Claude lira le fichier et continuera où vous en êtes.

---

## 🐛 Bugs Connus

- [ ] Couleur de police incohérente en light mode
- [ ] "Mon Parcours" - Double bouton "Annuler"
- [ ] Tasks partagées entre parcours (manque isolation)

Voir les **[Issues GitHub](https://github.com/W-D0n/dys-train/issues)** pour plus de détails.

---

## 🗺️ Roadmap

Consulter **[ROADMAP.md](./ROADMAP.md)** pour le plan complet :

### Sprint 1 (Semaines 1-2) - Fondations
- [ ] Page Paramètres complète
- [ ] Dashboard avec graphiques
- [ ] Corrections accessibilité

### Sprint 2 (Semaines 3-4) - Contenu
- [ ] Stroop Test
- [ ] Memory Cards
- [ ] Onboarding utilisateur

### Sprint 3+ - Qualité & Engagement
- [ ] Tests (unitaires + E2E)
- [ ] Système de badges
- [ ] PWA

---

## 🤝 Contribution

Les contributions sont les bienvenues !

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit (`git commit -m 'feat: Add AmazingFeature'`)
4. Push (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

### Conventions de Commit

Format : `type: description`

**Types :**
- `feat`: Nouvelle fonctionnalité
- `fix`: Correction de bug
- `docs`: Documentation
- `style`: Formatage (sans changement de code)
- `refactor`: Refactoring
- `test`: Ajout de tests
- `chore`: Tâches de maintenance

---

## 📄 License

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

## 👤 Auteur

**W-D0n**
- GitHub: [@W-D0n](https://github.com/W-D0n)

---

## 🙏 Remerciements

- [SvelteKit](https://kit.svelte.dev/) - Framework
- [bits-ui](https://www.bits-ui.com/) - Composants UI accessibles
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- Communauté Svelte

---

## 📝 Notes

Projet développé avec l'assistance de **Claude Code** (Anthropic).

**Dernière mise à jour :** 2025-01-11
