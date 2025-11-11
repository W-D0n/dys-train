// Point d'entrée central pour tous les types
// Permet des imports simples: import type { Task, UserStats } from '$lib/types';

// Tasks
export type { Task, TaskCategory } from './tasks';

// User & Stats
export type { CognitiveScore, UserStats } from './user';

// Settings
export type { Settings, Theme } from './settings';

// Learning Paths
export type { LearningPath, PathBuilderStep, BuilderMode } from './learning-paths';

// UI Components
export type { PanelVariant, InfoListItem, StrategyPanel } from './ui';
