# 🗺️ Roadmap - Système TDAH

Plan de développement pour les prochaines itérations du projet.

---

## 🎯 **Priorité 1 : Fonctionnalités Essentielles**

### 1. Page de Paramètres Complète
**Fichier :** `src/routes/settings/+page.svelte`

**Status :** ❌ À faire

**Description :**
Le `settingsStore` existe mais aucune UI pour le modifier.

**À implémenter :**
- [ ] Formulaire pour objectif quotidien
- [ ] Sélecteur de thème (light/dark/auto)
- [ ] Slider pour niveau N-Back (1-3)
- [ ] Toggle pour activer/désactiver le son
- [ ] Toggle pour activer/désactiver les notifications
- [ ] Bouton réinitialiser scores cognitifs

---

### 2. Dashboard / Statistiques
**Fichiers :**
```
src/routes/stats/+page.svelte
src/lib/components/stats/
  ├── CognitiveChart.svelte     (graphique évolution)
  ├── StreakDisplay.svelte      (série de jours)
  └── ProgressSummary.svelte    (résumé global)
```

**Status :** ❌ À faire

**Description :**
L'utilisateur accumule des données mais ne peut pas les visualiser.

**À implémenter :**
- [ ] Graphiques d'évolution des scores cognitifs (Chart.js ou Recharts)
- [ ] Calendrier visuel de la série de jours
- [ ] Statistiques détaillées par catégorie de tâche
- [ ] Comparaison progression semaine/mois
- [ ] Export des données (CSV/JSON)

---

### 3. Plus d'Exercices Cognitifs
**Fichiers :**
```
src/lib/components/activities/
  ├── NBackGame.svelte           ✅ (existant)
  ├── StroopTest.svelte          🆕 Attention sélective
  ├── WorkingMemoryCards.svelte  🆕 Memory game
  ├── TrailMaking.svelte         🆕 Flexibilité cognitive
  └── DualTask.svelte            🆕 Double tâche
```

**Status :** ❌ À faire

**Description :**
Diversifier l'entraînement cognitif avec de nouveaux exercices.

**Exercices à créer :**
- [ ] **Stroop Test** : Identifier la couleur du mot (qui peut être différente du texte)
- [ ] **Memory Cards** : Jeu de mémoire avec paires de cartes
- [ ] **Trail Making** : Relier des points dans l'ordre
- [ ] **Dual Task** : Gérer deux tâches simultanément

---

## 🧪 **Priorité 2 : Qualité & Robustesse**

### 4. Tests Unitaires & E2E
**Fichiers :**
```
src/lib/stores/*.test.ts
src/lib/utils/*.test.ts
tests/e2e/
  ├── task-flow.spec.ts
  ├── cognitive-exercises.spec.ts
  └── learning-paths.spec.ts
```

**Status :** ❌ À faire

**Description :**
Aucun test actuellement = code fragile. Ajouter une couverture de tests.

**À tester :**
- [ ] Tests unitaires des stores (Vitest)
- [ ] Tests unitaires des utils (Vitest)
- [ ] Tests des composants (Vitest + Testing Library)
- [ ] Tests E2E des flows utilisateur (Playwright)

**Commandes :**
```bash
bun test                    # tests unitaires
bun run test:e2e           # tests E2E
```

---

### 5. Accessibilité (A11Y)
**Status :** ⚠️ Warnings détectés

**Problèmes actuels :**
- `PathSelector.svelte` : `<div onclick>` sans support clavier
- Manque d'ARIA labels sur plusieurs composants

**À corriger :**
- [ ] Remplacer `<div onclick>` par `<button>` dans PathSelector
- [ ] Ajouter `role`, `aria-label`, `aria-describedby` appropriés
- [ ] Tester navigation au clavier (Tab, Enter, Escape)
- [ ] Tester avec lecteur d'écran (NVDA/JAWS)
- [ ] Contraste des couleurs (WCAG AA minimum)

---

## 🚀 **Priorité 3 : Expérience Utilisateur**

### 6. Onboarding / Tutoriel
**Fichiers :**
```
src/lib/components/onboarding/
  ├── WelcomeDialog.svelte
  ├── StepIndicator.svelte
  └── TutorialOverlay.svelte
```

**Status :** ❌ À faire

**Description :**
Expliquer le système au premier lancement.

**Étapes du tutoriel :**
- [ ] Étape 1 : Bienvenue + explication du système TDAH
- [ ] Étape 2 : Créer son premier parcours d'apprentissage
- [ ] Étape 3 : Faire son premier exercice N-Back
- [ ] Étape 4 : Comprendre les scores cognitifs

---

### 7. Gamification Avancée
**Fichiers :**
```
src/lib/features/achievements/
  ├── types/achievements.ts
  ├── stores/achievements.ts
  └── components/BadgeDisplay.svelte
```

**Status :** ❌ À faire

**Description :**
Ajouter des mécaniques de jeu pour engager l'utilisateur.

**À ajouter :**
- [ ] Système de badges/achievements ("7 jours d'affilée", "100 tâches")
- [ ] Niveaux utilisateur (Débutant → Intermédiaire → Expert)
- [ ] Récompenses visuelles (confettis, animations célébration)
- [ ] Défis quotidiens ("Terminer 3 tâches aujourd'hui")
- [ ] Leaderboard personnel (meilleurs scores)

---

### 8. Notifications & Rappels
**Fichiers :**
```
src/lib/utils/notifications.ts
src/lib/stores/notifications.ts
```

**Status :** ❌ À faire

**Description :**
Le toggle `notificationsEnabled` existe dans settings mais pas implémenté.

**Types de notifications :**
- [ ] Rappel objectif quotidien (matin)
- [ ] Encouragement après 3 jours d'inactivité
- [ ] Félicitations série de jours (1, 7, 30 jours)
- [ ] Notification navigateur (avec permission utilisateur)
- [ ] Rappels personnalisables

---

## 🌐 **Priorité 4 : Persistance & Cloud**

### 9. Supabase / Cloud Sync (optionnel)
**Fichiers :**
```
src/lib/services/supabase.ts
src/lib/services/sync.ts
```

**Status :** ❌ À faire (optionnel)

**Description :**
Sauvegarder les données sur plusieurs appareils.

**À implémenter :**
- [ ] Authentification utilisateur (email/password ou OAuth)
- [ ] Sync tasks/stats/settings vers cloud
- [ ] Mode offline-first (localStorage → Supabase)
- [ ] Gestion des conflits de données
- [ ] Migration données locales → cloud

**Alternative :** Rester localStorage-only (plus simple, pas de backend)

---

### 10. PWA (Progressive Web App)
**Fichiers :**
```
src/service-worker.ts
vite.config.ts (plugin PWA)
manifest.json
```

**Status :** ❌ À faire

**Description :**
Transformer l'app en PWA installable.

**Avantages :**
- [ ] Installation sur téléphone/PC (icône d'app)
- [ ] Mode hors-ligne complet
- [ ] Notifications push natives
- [ ] Meilleure performance (cache)

**Package requis :**
```bash
bun add -D @vite-pwa/sveltekit
```

---

## 🎨 **Priorité 5 : Polish & UX**

### 11. Animations & Transitions
**Fichiers :**
```
src/lib/utils/animations.ts
src/lib/components/ui/primitives/Transition.svelte
```

**Status :** ❌ À faire

**Description :**
Améliorer le feedback visuel et les transitions.

**À ajouter :**
- [ ] Transitions entre pages (fade, slide)
- [ ] Animations de succès (confettis, badges pop)
- [ ] Loading states élégants (skeletons)
- [ ] Micro-interactions (hover, click feedback)
- [ ] Animations d'entrée des composants

**Librairies disponibles :**
- `motion` (déjà installé mais non utilisé)
- `svelte/transition` (built-in)

---

### 12. Responsive Mobile
**Status :** ⚠️ À tester

**À vérifier :**
- [ ] Layout mobile-first sur tous les écrans
- [ ] Touch gestures (swipe, long press)
- [ ] Taille boutons minimum 44x44px
- [ ] Navigation mobile optimisée (bottom nav?)
- [ ] Clavier virtuel ne cache pas le contenu
- [ ] Test sur différentes tailles (iPhone SE, iPad, Android)

---

### 13. Sons & Feedback Audio
**Fichiers :**
```
src/lib/utils/sounds.ts
public/sounds/
  ├── success.mp3
  ├── error.mp3
  ├── notification.mp3
  └── level-up.mp3
```

**Status :** ❌ À faire

**Description :**
Le toggle `soundEnabled` existe dans settings mais pas implémenté.

**Sons à jouer :**
- [ ] Validation tâche (son succès)
- [ ] Bonne réponse N-Back (bip positif)
- [ ] Mauvaise réponse N-Back (bip négatif)
- [ ] Level up / Badge débloqué (fanfare)
- [ ] Notification (ding subtil)

**Librairie :** API Web Audio ou librairie comme `howler.js`

---

## 📋 **Roadmap Recommandée**

### **Sprint 1 (Semaine 1-2)** - Fondations
**Objectif :** Compléter les fonctionnalités de base

- [ ] Page Paramètres complète
- [ ] Dashboard basique avec graphiques
- [ ] Corriger warnings accessibilité

**Estimation :** 10-15h de travail

---

### **Sprint 2 (Semaine 3-4)** - Contenu
**Objectif :** Enrichir le contenu cognitif

- [ ] Stroop Test (exercice attention)
- [ ] Memory Cards (exercice mémoire)
- [ ] Onboarding simple (4 étapes)

**Estimation :** 12-18h de travail

---

### **Sprint 3 (Semaine 5-6)** - Qualité
**Objectif :** Sécuriser le code

- [ ] Tests unitaires (stores + utils)
- [ ] Tests E2E (flows critiques)
- [ ] Coverage > 70%

**Estimation :** 15-20h de travail

---

### **Sprint 4 (Semaine 7-8)** - Engagement
**Objectif :** Augmenter la rétention

- [ ] Système badges/achievements
- [ ] Notifications & rappels
- [ ] Sons & feedback audio

**Estimation :** 10-15h de travail

---

### **Sprint 5+** (Future) - Avancé
**Objectif :** Features avancées

- [ ] PWA (mode offline, installable)
- [ ] Supabase sync (si multi-device souhaité)
- [ ] Animations poussées
- [ ] Plus d'exercices cognitifs

**Estimation :** Variable selon features

---

## 📊 **État Actuel du Projet**

### ✅ **Complété**
- Architecture Atomic Design (Atoms/Molecules/Organisms)
- Store management (tasks, user, settings, theme)
- Types TypeScript complets avec JSDoc
- Composants UI primitives documentés
- Learning paths (wizard + sélecteur)
- Exercice N-Back fonctionnel
- Dark mode
- localStorage persistence

### ⚠️ **En Cours**
- Accessibilité (warnings à corriger)
- Documentation (en cours)

### ❌ **Non Démarré**
- Tests
- Paramètres UI
- Dashboard/Stats
- Autres exercices cognitifs
- Gamification avancée
- PWA
- Cloud sync

---

## 🤝 **Comment Contribuer**

Pour commencer à travailler sur une feature :

1. Créer une branche : `git checkout -b feature/nom-feature`
2. Implémenter la feature
3. Tester localement : `bun run dev`
4. Vérifier les types : `bun run check`
5. Commit : `git commit -m "feat: description"`
6. Merge dans main

---

## 📝 **Notes**

- **Priorité business** : Features engagement (badges, notifs) > Cloud sync
- **Priorité technique** : Tests > Animations
- **Quick wins** : Page paramètres, sons, accessibilité fixes
- **Long terme** : PWA, Supabase, plus d'exercices

**Dernière mise à jour :** 2025-01-11
