/**
 * Primitives UI - Composants de base réutilisables
 *
 * @module primitives
 */

export { default as Panel } from './Panel.svelte';
export { default as InfoList } from './InfoList.svelte';
export { default as Box } from './Box.svelte';
export { default as Section } from './Section.svelte';
export { default as Badge } from './Badge.svelte';

// Composants avec variants et types
export { default as Button, buttonVariants, type ButtonProps, type ButtonSize, type ButtonVariant } from './Button.svelte';
export { default as Progress } from './Progress.svelte';
export { default as Switch } from './Switch.svelte';

// Dialog (wrapper bits-ui)
export * as Dialog from './Dialog';
