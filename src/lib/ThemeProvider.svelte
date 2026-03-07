<script lang="ts" module>
import {type Snippet} from 'svelte';
import type {CreateThemeOptions} from './createTheme.svelte.js';
import {createTheme} from './createTheme.svelte.js';
import {setThemeContext} from './ThemeContext.svelte.js';

export interface ThemeProviderProps extends CreateThemeOptions {
	children?: Snippet;
}
</script>

<script lang="ts">
let {children, ...props}: ThemeProviderProps = $props();

let theme = createTheme(() => props);
let script = createTheme.script(() => props);
let style = createTheme.style(() => props);

setThemeContext(theme);
</script>

<svelte:head>
	{@html style.value}
	{@html script.value}
</svelte:head>

{@render children?.()}
