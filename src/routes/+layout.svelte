<script lang="ts">
	import '$lib/../app.css';
	import { themeStore } from '$lib/stores/theme';
	import { browser } from '$app/environment';

	let { children } = $props();

	const theme = $derived($themeStore);

	// Appliquer dynamiquement la classe dark sur <html>
	$effect(() => {
		if (browser) {
			if (theme === 'dark') {
				document.documentElement.classList.add('dark');
			} else {
				document.documentElement.classList.remove('dark');
			}
		}
	});
</script>

{@render children()}
