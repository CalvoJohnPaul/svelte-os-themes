import {parseTheme} from './parseTheme.js';
import type {Theme} from './types.js';

export interface CreateThemeOptions {
	/**
	 * @description The fallback theme to use when no theme is set in localStorage.
	 * @default 'system'
	 */
	fallback?: Theme;
	/**
	 * @description The attribute used to set the theme on the `<html>` element.
	 * @default 'class'
	 */
	attribute?: 'class' | `data-${string}`;
	/**
	 * @description The key used to store the theme in localStorage.
	 * @default 'theme'
	 */
	storageKey?: string;
	/**
	 * @description Whether to listen for changes in the OS theme.
	 * @default false
	 */
	system?: boolean;
	/**
	 * @description Whether to set the `color-scheme` CSS property on the `<html>` element.
	 * @default true
	 */
	colorScheme?: boolean;
	nonce?: string;
}

export interface CreateThemeReturn {
	get current(): Theme;
	set current(value: Theme | null | undefined);
}

const defaultOptions = {
	fallback: 'system',
	attribute: 'class',
	storageKey: 'theme',
	system: false,
	colorScheme: true,
} satisfies CreateThemeOptions;

export function createTheme(
	options: CreateThemeOptions | (() => CreateThemeOptions),
): CreateThemeReturn {
	const options_ = $derived.by(() => {
		const userOptions = typeof options === 'function' ? options() : options;

		return {
			...defaultOptions,
			...userOptions,
		};
	});

	let theme = $state(options_.fallback);

	$effect.pre(() => {
		theme = parseTheme(
			window.localStorage.getItem(options_.storageKey),
			options_.fallback,
		);
	});

	$effect(() => {
		const html = document.documentElement;
		const head = document.head;
		const style = document.createElement('style');

		if (options_.nonce) {
			style.setAttribute('nonce', options_.nonce);
		}

		style.appendChild(
			document.createTextNode(
				`*,*::before,*::after{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}`,
			),
		);

		head.appendChild(style);

		const originalTheme = theme;
		const resolvedTheme =
			originalTheme === 'system'
				? window.matchMedia('(prefers-color-scheme: dark)').matches
					? 'dark'
					: 'light'
				: originalTheme;

		if (options_.attribute === 'class') {
			const removeClass = resolvedTheme === 'dark' ? 'light' : 'dark';

			html.classList.remove(removeClass);
			html.classList.add(resolvedTheme);
		} else {
			html.setAttribute(options_.attribute, resolvedTheme);
		}

		if (options_.colorScheme) {
			html.style.colorScheme = resolvedTheme;
		}

		window.localStorage.setItem(options_.storageKey, originalTheme);

		setTimeout(() => {
			head.removeChild(style);
		}, 1);
	});

	$effect(() => {
		if (!options_.system) return function noop() {};

		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
		const handleChange = (e: MediaQueryListEvent) => {
			theme = e.matches ? 'dark' : 'light';
		};

		mediaQuery.addEventListener('change', handleChange);

		return () => {
			mediaQuery.removeEventListener('change', handleChange);
		};
	});

	$effect(() => {
		const handleChange = (e: StorageEvent) => {
			if (e.key === options_.storageKey) {
				theme = parseTheme(e.newValue, options_.fallback);
			}
		};

		window.addEventListener('storage', handleChange);

		return () => {
			window.removeEventListener('storage', handleChange);
		};
	});

	return {
		get current(): Theme {
			return theme;
		},
		set current(value: Theme | null | undefined) {
			if (value) {
				theme = value;
			} else {
				theme = options_.fallback;
			}
		},
	};
}

createTheme.script = (
	props: CreateThemeOptions | (() => CreateThemeOptions),
) => {
	const options_ = $derived.by(() => {
		const userOptions = typeof props === 'function' ? props() : props;

		return {
			...defaultOptions,
			...userOptions,
		};
	});

	const value = $derived(
		`
  <script ${options_.nonce ? `nonce="${options_.nonce}"` : ''}>(function(k, a, f, c) {
      const h = document.documentElement;
      const q = window.matchMedia('(prefers-color-scheme: dark)');
      const s = window.localStorage.getItem(k)?.toLowerCase().trim();

      const l = [
        'dark',
        'light',
        'system'
      ];

      const v = l.includes(s) ? s : f;
      const t = v === 'system' ? q.matches ? 'dark' : 'light' : v;

      if (a === 'class') {
        h.classList.remove(t === 'dark' ? 'light' : 'dark');
        h.classList.add(t);
      } else {
        h.setAttribute(a, t);
      }

      window.localStorage.setItem(k, v);

      if (c) h.style.colorScheme = t;
    })(
      '${options_.storageKey}',
      '${options_.attribute}',
      '${options_.fallback}',
      ${options_.colorScheme}
    );
  </script>
  `
			.replace(/\n+/g, '')
			.replace(/\s+/g, ' ')
			.trim(),
	);

	return {
		get current() {
			return value;
		},
	};
};
