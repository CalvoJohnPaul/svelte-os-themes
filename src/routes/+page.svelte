<script lang="ts">
import {useTheme, type Theme} from '$lib/index.js';
import type {Component} from 'svelte';
import Button from './Button.svelte';
import LaptopIcon from './LaptopIcon.svelte';
import MoonIcon from './MoonIcon.svelte';
import SunIcon from './SunIcon.svelte';

let theme = useTheme();
let themes: {
	Icon: Component;
	label: string;
	value: Theme;
	active: boolean;
}[] = $derived([
	{
		Icon: SunIcon,
		label: 'Light',
		value: 'light',
		active: theme.current === 'light',
	},
	{
		Icon: MoonIcon,
		label: 'Dark',
		value: 'dark',
		active: theme.current === 'dark',
	},
	{
		Icon: LaptopIcon,
		label: 'System',
		value: 'system',
		active: theme.current === 'system',
	},
]);
</script>

<svelte:head><title>Svelte OS Themes</title></svelte:head>

<div class="min-h-dvh px-5 py-8 lg:py-12 xl:py-16">
	<div class="max-w-sm mx-auto">
		<code
			class="block w-full p-4 rounded-lg text-gray-600 font-mono bg-gray-50 dark:bg-gray-800/25 dark:text-gray-400"
		>
			<pre>{JSON.stringify(theme, null, 2)}</pre>
		</code>
		<div class="mt-6 w-full space-y-4 lg:flex lg:max-w-lg lg:space-y-0 lg:gap-3">
			{#each themes as { Icon, label, value, active }}
				<Button
					onclick={() => {
						theme.current = value;
					}}
					data-selected={active ? '' : undefined}
				>
					<Icon class="stroke-[1.33333] size-5" />
					<span>{label}</span>
				</Button>
			{/each}
		</div>
	</div>
</div>
