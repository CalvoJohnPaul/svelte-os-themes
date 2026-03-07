import {createContext} from 'svelte';
import type {CreateThemeReturn} from './createTheme.svelte.js';

export const [getThemeContext, setThemeContext] =
	createContext<CreateThemeReturn>();
