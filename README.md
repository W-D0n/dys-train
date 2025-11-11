# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```sh
# create a new project in the current directory
npx sv create

# create a new project in my-app
npx sv create my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```sh
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

## 📋 Développement

Chaque session de travail :

1. Ouvrir ROADMAP.md
2. Choisir une feature du sprint actuel
3. Cocher les sous-tâches au fur et à mesure
4. Commit les changements :
   git add ROADMAP.md
   git commit -m "docs: update roadmap - completed settings page"

Prochaine session avec moi :

- Dites-moi "Regarde ROADMAP.md, je veux travailler sur..."
- Je lirai le fichier et nous continuerons où vous en êtes

### Roadmap

Voir **[ROADMAP.md](./ROADMAP.md)** pour le plan complet de développement.

### Bugs Connus (Priority Fix)

- [ ] **TOFIX** : La couleur de la police n'est pas cohérente en light mode (conserve celle du dark mode)
- [ ] **TOFIX** : "Mon Parcours" - Le formulaire comporte 2 boutons "Annuler"
- [ ] **TOFIX** : Création de parcours - Utilise les tasks déjà créées d'autres parcours

### TODOs Techniques

- [ ] Lier les tasks à leur parcours (isolation des données)
- [ ] Permettre d'ajouter des tasks depuis le formulaire de création de parcours

### Architecture

- **UI Framework:** SvelteKit 2 + Svelte 5
- **Styling:** Tailwind CSS + bits-ui
- **State:** Svelte stores + localStorage
- **Types:** TypeScript avec JSDoc complet
- **Pattern:** Atomic Design (Atoms → Molecules → Organisms)
