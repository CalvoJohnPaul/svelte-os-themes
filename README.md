# Svelte OS Themes

Light-weight dark mode helper for [Svelte](https://svelte.dev/).

## Installation

```bash
npm install svelte-os-themes
```

## Usage

```svelte
<!-- +layout.svelte -->
<script>
  import { ThemeProvider } from 'svelte-os-themes';

  let { children } = $props();
</script>

<ThemeProvider
  fallback="system"
  attribute="class"
  storageKey="theme"
  colorScheme={true}
  system={true}
  styleNonce=""
  scriptNonce=""
>
  {@render children()}
</ThemeProvider>
```

```svelte
<!-- +page.svelte -->
<script>
  import { useTheme } from 'svelte-os-themes';

  let theme = useTheme();

  $inspect(theme.current);
</script>

<button
  type="button"
  onclick={() => {
    theme.current = 'light';
  }}
>
  Light
</button>
<button
  type="button"
  onclick={() => {
    theme.current = 'dark';
  }}
>
  Dark
</button>
<button
  type="button"
  onclick={() => {
    theme.current = 'system';
  }}
>
  System
</button>
```

## API

### ThemeProvider

`ThemeProvider` accepts the following props:

- `fallback`

  The default theme to use when no theme is set in storage.

  accepted values: `'light'`, `'dark'`, `'system'`<br/>
  default value: `'system'`

- `attribute`

  The attribute to set on the `html` element.

  accepted values: `'class'`, `data-${string}`<br/>
  default value: `'class'`

- `storageKey`

  The key to use when storing the theme in `localStorage`.

  accepted values: `<string>`<br/>
  default value: `'theme'`

- `system`

  Whether to change theme when the OS theme changes.

  accepted values: `true`, `false`<br/>
  default value: `false`

- `colorScheme`

  Whether to add/update the `html`'s `color-scheme`.

  accepted values: `true`, `false`<br/>
  default value: `true`

- `scriptNonce`

  The nonce to use for the injected script.

  accepted values: `<string>`<br/>
  default value: `undefined`

- `styleNonce`

  The nonce to use for the injected style.

  accepted values: `<string>`<br/>
  default value: `undefined`

### useTheme

`useTheme` does not accept any arguments and returns an object with the following properties.

`useTheme` must be called in a descendant of `ThemeProvider`.

- `current`

  Returns the current theme when used as a getter and sets the theme when used as a setter.

### parseTheme

`parseTheme` is a helper function that parses any value into a valid theme.

```js
import { parseTheme } from 'svelte-os-themes';

console.log(parseTheme('LIGHT')); // 'light'
console.log(parseTheme('invalid')); // undefined
console.log(parseTheme('invalid', 'dark')); // 'dark'
```
