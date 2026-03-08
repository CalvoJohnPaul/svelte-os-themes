import {getThemeContext} from './ThemeContext.svelte.js';
import type {Theme} from './types.js';

export interface UseThemeReturn {
	get current(): Theme;
	set current(value: Theme | null | undefined);
}

export const useTheme = (): UseThemeReturn => {
	const ctx = getThemeContext();

	return {
		get current() {
			return ctx.current;
		},
		set current(value) {
			ctx.current = value;
		},
	};
};
