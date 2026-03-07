import type {CreateThemeReturn} from './createTheme.svelte.js';
import {getThemeContext} from './ThemeContext.svelte.js';

export interface UseThemeReturn extends CreateThemeReturn {}
export const useTheme = (): UseThemeReturn => getThemeContext();
