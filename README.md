# @expressive-code/plugin-prompt

## Contents

- [What is this?](#what-is-this)
- [When should I use this?](#when-should-i-use-this)
- [Installation](#installation)
- [Usage in markdown / MDX documents](#usage-in-markdown--mdx-documents)
- [Configuration](#configuration)
  - [Astro configuration example](#astro-configuration-example)
  - [Next.js configuration example using `@next/mdx`](#nextjs-configuration-example-using-nextmdx)
  - [Available plugin options](#available-plugin-options)

## What is this?

A plugin for Expressive Code, an engine for presenting source code on the web. 

It allows the definition os prompts for shell lines

## When should I use this?

It is thought as an optional section for `sh` code blocks, but coud be used for any language to render line prefixes. 

This plugin is **not installed by default** by our higher-level packages like `remark-expressive-code`, so you have to manually enable it before you can use it in markdown / MDX documents. 

## Installation

1. Add the package to your site's dependencies:

    ```bash
    # When using npm
    npm install expressive-code-plugin-prompt

    # When using pnpm
    pnpm install expressive-code-plugin-prompt

    # When using yarn
    yarn add expressive-code-plugin-prompt
    ```

2. Add the integration to your site's configuration by passing it in the `plugins` list.  
   For example, if using our Astro integration [`astro-expressive-code`](https://www.npmjs.com/package/astro-expressive-code):

    ```js
    // astro.config.mjs
    import { defineConfig } from 'astro/config'
    import astroExpressiveCode from 'astro-expressive-code'
    import { pluginPrompt } from 'expressive-code-plugin-prompt'

    export default defineConfig({
      integrations: [
        astroExpressiveCode({
          plugins: [
            pluginPrompt({ /* options */ }),
          ]
        }),
      ],
    })
    ```

## Usage in markdown / MDX documents

To define the prompt of lines you need to add **meta information** to your code blocks. This is done by appending `prompt={X,Y:$}` to your opening code fence, indicating a collapsed section from line `X`  and line `Y` should have prompt `$`.

````md
```js prompt={4,8:$;5-6:>}
//    ^^^^^^^^^^^^^^^^^^^^^^
//    This is the meta information of this code block.
//    It defines lines 4 and 8 with $ prompt and lines 5 to 6 (inclusive) with prompt >.
//    All other lines ex. line 1-3, 7 and 9- will have no prompt.
```
````

## Configuration

You can configure it by passing an options to its initializer function.

Here are configuration examples for some popular site generators:

### Astro configuration example

We assume that you're using our Astro integration [`astro-expressive-code`](https://www.npmjs.com/package/astro-expressive-code).

In your Astro config file, you can pass options to the prompt plugin like this:

```js
// astro.config.mjs
import { defineConfig } from 'astro/config'
import astroExpressiveCode from 'astro-expressive-code'
import { pluginPrompt } from 'expressive-code-plugin-prompt'

/** @type {import('astro-expressive-code').AstroExpressiveCodeOptions} */
const astroExpressiveCodeOptions = {
  plugins: [
    pluginPrompt({
      // This is where you can pass your plugin options
      styleOverrides: {
        promptColor: 'red',
        secondPromptColor: 'green',
      },
    }),
  ]
}

export default defineConfig({
  integrations: [
    astroExpressiveCode(astroExpressiveCodeOptions),
  ],
})
```

### Next.js configuration example using `@next/mdx`

```js
// next.config.mjs
import createMDX from '@next/mdx'
import remarkExpressiveCode from 'remark-expressive-code'
import { pluginPrompt } from 'expressive-code-plugin-prompt'

/** @type {import('remark-expressive-code').RemarkExpressiveCodeOptions} */
const remarkExpressiveCodeOptions = {
  plugins: [
    pluginPrompt({
      // This is where you can pass your plugin options
      styleOverrides: {
        promptColor: 'red',
        secondPromptColor: 'green',
      },
    }),
  ]
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
}

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [
      // The nested array structure is required to pass options
      // to a remark plugin
      [remarkExpressiveCode, remarkExpressiveCodeOptions],
    ],
    rehypePlugins: [],
  },
})

export default withMDX(nextConfig)
```

### Available plugin options

You can pass the following options to the plugin:

- `styleOverrides`

  Allows overriding the plugin's default styles using an object with named properties.

  The property values can either be a string, or a function that returns a string. If a function is used, it will be called with the following arguments:

  - `theme`: An ExpressiveCodeTheme object containing the current theme's colors and other properties.
  - `coreStyles`: An object containing the ExpressiveCodeEngine core styles.
  - `resolveSetting`: A function that can be used to resolve another style setting. It takes a style property name, and returns its resolved value.

  The following properties are available:

  - Styles applying to the prompt section:
    `promptBackgroundColor`, `promptColor`, `secondPromptBackgroundColor`, `secondPromptColor`

