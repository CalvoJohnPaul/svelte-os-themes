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

setThemeContext(theme);
</script>

<svelte:head>{@html script.current}</svelte:head>

{@render children?.()}
